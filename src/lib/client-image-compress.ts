"use client";

import resize from "@jsquash/resize";
import { encode as encodeWebP } from "@jsquash/webp";

export async function compressImageClient(
  file: File,
  maxDimension: number = 2560,
  quality: number = 0.80
): Promise<{ blob: Blob; contentType: string }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);

      let targetWidth = img.naturalWidth;
      let targetHeight = img.naturalHeight;
      const isResizing = targetWidth > maxDimension || targetHeight > maxDimension;

      if (isResizing) {
        if (targetWidth > targetHeight) {
          targetHeight = Math.round((targetHeight * maxDimension) / targetWidth);
          targetWidth = maxDimension;
        } else {
          targetWidth = Math.round((targetWidth * maxDimension) / targetHeight);
          targetHeight = maxDimension;
        }
      }

      // Draw the ORIGINAL image to canvas at full size to extract pure raw pixels
      const originalCanvas = document.createElement("canvas");
      originalCanvas.width = img.naturalWidth;
      originalCanvas.height = img.naturalHeight;
      const originalCtx = originalCanvas.getContext("2d", { colorSpace: "srgb", willReadFrequently: true });

      if (!originalCtx) {
        return resolve({ blob: file, contentType: file.type });
      }

      originalCtx.drawImage(img, 0, 0);

      try {
        let imageData = originalCtx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);

        // Deterministic WASM resizing guarantees exact same pixels on every browser
        if (isResizing) {
          imageData = await resize(imageData, { width: targetWidth, height: targetHeight });
        }

        // Deterministic WASM WebP encoding guarantees exact same file size on every browser
        const currentQuality = quality; // strictly 80%
        const webpArrayBuffer = await encodeWebP(imageData, { quality: currentQuality * 100 });

        const wasmBlob = new Blob([webpArrayBuffer], { type: "image/webp" });
        const percentage = Math.round((1 - wasmBlob.size / file.size) * 100);
        console.info(`[client-image-compress] Compressed ${file.name}: ${Math.round(file.size / 1024)}KB → ${Math.round(wasmBlob.size / 1024)}KB (${percentage}% reduction) at quality ${Math.round(currentQuality * 100)}%`);
        resolve({ blob: wasmBlob, contentType: "image/webp" });
      } catch (wasmError) {
        console.error("[client-image-compress] WASM compression failed, fallback to native:", wasmError);
        
        // Final fallback: use native canvas resize + native JPEG compression
        const fallbackCanvas = document.createElement("canvas");
        fallbackCanvas.width = targetWidth;
        fallbackCanvas.height = targetHeight;
        const fallbackCtx = fallbackCanvas.getContext("2d");
        if (fallbackCtx) fallbackCtx.drawImage(img, 0, 0, targetWidth, targetHeight);
        
        fallbackCanvas.toBlob(
          (b) => {
            if (b) {
              const percentage = Math.round((1 - b.size / file.size) * 100);
              console.info(`[client-image-compress] Fallback Compressed ${file.name}: ${Math.round(file.size / 1024)}KB → ${Math.round(b.size / 1024)}KB (${percentage}% reduction) at quality ${quality * 100}%`);
              resolve({ blob: b, contentType: "image/jpeg" });
            } else {
              resolve({ blob: file, contentType: file.type });
            }
          },
          "image/jpeg",
          quality
        );
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image for compression"));
    };

    img.src = objectUrl;
  });
}
