"use client";

import { useState, useRef, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Upload, X, Check, Loader2 } from "lucide-react";
import getCroppedImg from "@/lib/cropImage";

export default function ImageUpload({
  value,
  onChange,
  aspectRatio = 1,
  folder = "users",
}: {
  value: string;
  onChange: (url: string) => void;
  aspectRatio?: number;
  folder?: "users" | "themes";
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result?.toString() || null);
      });
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    
    try {
      setIsUploading(true);
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (!croppedBlob) throw new Error("Crop failed");

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error("Cloudinary config missing in .env.local (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME or NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)");
      }

      const formData = new FormData();
      formData.append("file", croppedBlob);
      formData.append("upload_preset", uploadPreset);
      if (folder) {
        formData.append("folder", folder);
      }

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Cloudinary upload failed");
      }

      onChange(data.secure_url);
      setImageSrc(null);
      setIsUploading(false);
    } catch (e: any) {
      console.error("Upload error:", e);
      alert(`Upload failed: ${e.message}`);
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        accept="image/*"
        className="hidden"
      />

      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="flex-1 bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder:text-muted/60 outline-none focus:border-accent transition-colors"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-surface border border-border rounded-lg px-3 py-2.5 text-muted hover:text-text hover:border-muted transition-colors flex items-center justify-center"
          title="Upload image"
        >
          <Upload size={16} />
        </button>
      </div>

      {imageSrc && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-canvas w-full max-w-lg rounded-xl overflow-hidden flex flex-col h-[80vh] shadow-2xl border border-border">
            <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
              <h3 className="font-semibold text-text font-display">Crop Image</h3>
              <button
                type="button"
                onClick={() => setImageSrc(null)}
                className="text-muted hover:text-text transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="relative flex-1 bg-black/50">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            
            <div className="p-4 border-t border-border shrink-0 flex items-center justify-between gap-4">
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-label="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-1/2 accent-accent"
              />
              <button
                onClick={handleSave}
                disabled={isUploading}
                className="bg-accent text-canvas font-medium px-5 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Check size={16} /> Confirm
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
