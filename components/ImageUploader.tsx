import React, { useState, useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  label: string;
  description: string;
  onImageUpload: (base64: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ label, description, onImageUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        onImageUpload(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="flex flex-col items-center">
        <h4 className="text-lg font-semibold text-primary">{label}</h4>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{description}</p>
        <div
            onClick={handleClick}
            className="w-full h-48 border border-border-color bg-gray-50/50 rounded-lg flex justify-center items-center cursor-pointer hover:border-primary/50 hover:bg-gray-50 transition-all duration-300"
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
            />
            {preview ? (
                <img src={preview} alt={`${label} preview`} className="w-full h-full object-contain rounded-md p-1" />
            ) : (
                <div className="text-center text-gray-400">
                    <UploadIcon className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Click to upload</p>
                </div>
            )}
        </div>
    </div>
  );
};