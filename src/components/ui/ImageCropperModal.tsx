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
  initialCropData?: any;
  onSave: (cropData: any) => void;
  onCancel: () => void;
  title?: string;
}

export default function ImageCropperModal({
  imageSrc,
  type,
  initialCropData,
  onSave,
  onCancel,
  title = "Crop Image",
}: ImageCropperModalProps) {
  const [activeTab, setActiveTab] = useState<"Classic" | "Minimal" | "Adventure">("Classic");
  
  const defaultCrops = {
    Classic: { crop: { x: 0, y: 0 }, zoom: 1, aspectRatio: 344 / 226, pixels: null },
    Minimal: { crop: { x: 0, y: 0 }, zoom: 1, aspectRatio: 180 / 224, pixels: null },
    Adventure: { crop: { x: 0, y: 0 }, zoom: 1, aspectRatio: 360 / 528, pixels: null },
    profile: { crop: { x: 0, y: 0 }, zoom: 1, aspectRatio: 1, pixels: null }
  };

  const [crops, setCrops] = useState<any>(() => {
    if (type === "profileImage") {
      return { profile: { ...defaultCrops.profile, ...initialCropData } };
    }
    
    const isOldFormat = initialCropData && initialCropData.crop !== undefined && !initialCropData.Classic;
    
    return {
      Classic: { ...defaultCrops.Classic, ...(isOldFormat ? initialCropData : initialCropData?.Classic || {}) },
      Minimal: { ...defaultCrops.Minimal, ...(initialCropData?.Minimal || {}) },
      Adventure: { ...defaultCrops.Adventure, ...(initialCropData?.Adventure || {}) }
    };
  });

  const activeTabRef = React.useRef(activeTab);
  React.useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  const activeCropState = type === "profileImage" ? crops.profile : crops[activeTab];

  const setCrop = (c: any) => {
    if (!mediaSize) return; // Prevent react-easy-crop from resetting crop before image loads
    const currentTab = type === "profileImage" ? "profile" : activeTabRef.current;
    setCrops((s: any) => ({
      ...s,
      [currentTab]: { ...s[currentTab], crop: c }
    }));
  };

  const setZoom = (z: any) => {
    if (!mediaSize) return; // Prevent react-easy-crop from resetting zoom before image loads
    const currentTab = type === "profileImage" ? "profile" : activeTabRef.current;
    setCrops((s: any) => ({
      ...s,
      [currentTab]: { ...s[currentTab], zoom: z }
    }));
  };

  const setCroppedAreaPixels = (p: any) => {
    const currentTab = type === "profileImage" ? "profile" : activeTabRef.current;
    setCrops((s: any) => ({
      ...s,
      [currentTab]: { ...s[currentTab], pixels: p }
    }));
  };

  const [isSaving, setIsSaving] = useState(false);
  const [mediaSize, setMediaSize] = useState<{width: number, height: number} | null>(null);
  const [naturalMediaSize, setNaturalMediaSize] = useState<{width: number, height: number} | null>(null);
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
    if (activeCropState.zoom < calculatedMinZoom) {
      setZoom(calculatedMinZoom);
    }
  }, [calculatedMinZoom, activeCropState.zoom, activeTab]);

  const maxZoomValue = Math.max(3, calculatedMinZoom + 2);
  const zoomPercentage = ((activeCropState.zoom - calculatedMinZoom) / (maxZoomValue - calculatedMinZoom)) * 100 || 0;

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const finalData = type === "profileImage" 
        ? { ...crops.profile, mediaSize: naturalMediaSize } 
        : {
            Classic: { ...crops.Classic, mediaSize: naturalMediaSize },
            Minimal: { ...crops.Minimal, mediaSize: naturalMediaSize },
            Adventure: { ...crops.Adventure, mediaSize: naturalMediaSize }
          };
      onSave(finalData);
    } catch (e) {
      console.error(e);
      alert("Failed to save crop.");
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
            {(["Classic", "Minimal", "Adventure"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-1.5 text-[14px] font-medium transition-colors ${activeTab === tab ? "bg-white text-black" : "bg-[#252525] text-[#999] hover:bg-[#333]"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* Cropper Container */}
        <div className="relative h-[400px] w-full overflow-hidden rounded-[16px] bg-[#1a1a1a]">
          <Cropper
            key={type === "profileImage" ? "profile" : activeTab}
            image={imageSrc}
            crop={activeCropState.crop}
            zoom={activeCropState.zoom}
            aspect={activeCropState.aspectRatio}
            minZoom={calculatedMinZoom}
            maxZoom={maxZoomValue}
            showGrid={false}
            style={{
              cropAreaStyle: { border: '1.5px dashed rgba(255, 255, 255, 0.8)' }
            }}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            onMediaLoaded={(size) => {
              setMediaSize({ width: size.width, height: size.height });
              setNaturalMediaSize({ width: size.naturalWidth, height: size.naturalHeight });
            }}
            onCropSizeChange={(size) => setCropSize({ width: size.width, height: size.height })}
          />
        </div>

        {/* Controls */}
        <style>{`
          .custom-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 24px;
            width: 24px;
            border-radius: 50%;
            background: #5a45f9;
            border: 2px solid white;
            cursor: pointer;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
          }
          .custom-slider::-moz-range-thumb {
            height: 24px;
            width: 24px;
            border-radius: 50%;
            background: #5a45f9;
            border: 2px solid white;
            cursor: pointer;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
          }
        `}</style>
        <div className="mt-6 flex items-center gap-[12px] px-2 w-full justify-center">
          <button type="button" onClick={() => setZoom(Math.max(calculatedMinZoom, activeCropState.zoom - 0.1))} className="flex items-center justify-center p-[6px] shrink-0 text-[#999] hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </button>
          
          <input
            type="range"
            value={activeCropState.zoom}
            min={calculatedMinZoom}
            max={maxZoomValue}
            step={0.01}
            aria-label="Zoom"
            onChange={(e) => setZoom(Number(e.target.value))}
            className="custom-slider h-[6px] w-[350px] cursor-pointer appearance-none rounded-[30px]"
            style={{
              background: `linear-gradient(to right, #5a45f9 0%, #5a45f9 ${zoomPercentage}%, #404040 ${zoomPercentage}%, #404040 100%)`
            }}
          />

          <button type="button" onClick={() => setZoom(Math.min(maxZoomValue, activeCropState.zoom + 0.1))} className="flex items-center justify-center p-[6px] shrink-0 text-[#999] hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </button>
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
