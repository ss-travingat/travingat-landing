"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/cropImage";

export interface CropData {
  crop: { x: number; y: number };
  zoom: number;
  aspectRatio: number;
}

interface ImageCropperModalProps {
  imageSrc: string;
  type: "coverImage" | "profileImage";
  initialCrop?: { x: number; y: number };
  initialZoom?: number;
  initialAspectRatio?: number;
  onSave: (croppedFile: File, cropData: CropData) => void;
  onCancel: () => void;
  title?: string;
}

export default function ImageCropperModal({
  imageSrc,
  type,
  initialCrop = { x: 0, y: 0 },
  initialZoom = 1,
  initialAspectRatio,
  onSave,
  onCancel,
  title = "Crop Image",
}: ImageCropperModalProps) {
  const defaultCoverRatio = 3 / 2;
  const [crop, setCrop] = useState(initialCrop);
  const [zoom, setZoom] = useState(initialZoom);
  const [aspectRatio, setAspectRatio] = useState(
    initialAspectRatio || (type === "profileImage" ? 1 : defaultCoverRatio)
  );
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [mediaSize, setMediaSize] = useState<{width: number, height: number} | null>(null);
  const [cropSize, setCropSize] = useState<{width: number, height: number} | null>(null);

  const calculatedMinZoom = React.useMemo(() => {
    if (!mediaSize || !cropSize) return 1;
    return Math.max(
      cropSize.width / mediaSize.width,
      cropSize.height / mediaSize.height,
      1
    );
  }, [mediaSize, cropSize]);

  React.useEffect(() => {
    if (zoom < calculatedMinZoom) {
      setZoom(calculatedMinZoom);
    }
  }, [calculatedMinZoom, zoom]);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, 0);
      if (croppedImage) {
        onSave(croppedImage, { crop, zoom, aspectRatio });
      }
    } catch (e) {
      console.error(e);
      alert("Failed to crop image.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
      <div className="relative flex w-full max-w-[600px] flex-col rounded-[24px] border border-[#252525] bg-[#161616] p-6 shadow-2xl">
        <h3 className="mb-4 text-center text-[20px] font-semibold text-white">
          {title}
        </h3>

        {type === "coverImage" && (
          <div className="mb-6 flex w-full justify-center gap-2">
            <button
              type="button"
              onClick={() => setAspectRatio(344 / 226)} // Classic
              className={`rounded-full px-4 py-1.5 text-[14px] font-medium transition-colors ${aspectRatio === 344 / 226 ? "bg-white text-black" : "bg-[#252525] text-[#999] hover:bg-[#333]"}`}
            >
              Classic
            </button>
            <button
              type="button"
              onClick={() => setAspectRatio(180 / 224)} // Minimal
              className={`rounded-full px-4 py-1.5 text-[14px] font-medium transition-colors ${aspectRatio === 180 / 224 ? "bg-white text-black" : "bg-[#252525] text-[#999] hover:bg-[#333]"}`}
            >
              Minimal
            </button>
            <button
              type="button"
              onClick={() => setAspectRatio(360 / 528)} // Adventure
              className={`rounded-full px-4 py-1.5 text-[14px] font-medium transition-colors ${aspectRatio === 360 / 528 ? "bg-white text-black" : "bg-[#252525] text-[#999] hover:bg-[#333]"}`}
            >
              Adventure
            </button>
          </div>
        )}

        {/* Cropper Container */}
        <div className="relative h-[400px] w-full overflow-hidden rounded-[16px] bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            minZoom={calculatedMinZoom}
            maxZoom={Math.max(3, calculatedMinZoom + 2)}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            onMediaLoaded={(size) => setMediaSize({ width: size.width, height: size.height })}
            onCropSizeChange={(size) => setCropSize({ width: size.width, height: size.height })}
          />
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center gap-4 px-2">
          <span className="material-symbols-rounded text-white-400 text-[20px]">zoom_out</span>
          <input
            type="range"
            value={zoom}
            min={calculatedMinZoom}
            max={Math.max(3, calculatedMinZoom + 2)}
            step={0.01}
            aria-label="Zoom"
            onChange={(e) => setZoom(Number(e.target.value))}
            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white-200 accent-[#533df6]"
          />
          <span className="material-symbols-rounded text-white-400 text-[20px]">zoom_in</span>
        </div>

        {/* Actions */}
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="flex h-[44px] items-center justify-center rounded-full border border-[#353535] bg-[#1a1a1a] px-6 text-[14px] font-medium text-white transition-colors hover:bg-[#252525] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex h-[44px] items-center justify-center rounded-full bg-white px-8 text-[14px] font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
