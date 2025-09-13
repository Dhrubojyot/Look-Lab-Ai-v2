import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';

interface TryOnResultProps {
  originalImage: string;
  generatedImage: string;
}

export const TryOnResult: React.FC<TryOnResultProps> = ({ originalImage, generatedImage }) => {
  return (
    <div className="w-full animate-fade-in space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h3 className="text-center font-semibold text-gray-600 mb-2">Before</h3>
          <img src={originalImage} alt="Original photo" className="w-full rounded-lg border border-border-color" />
        </div>
        <div>
          <h3 className="text-center font-semibold text-gray-600 mb-2">After</h3>
          <img src={generatedImage} alt="Generated Try-On" className="w-full rounded-lg border border-border-color" />
        </div>
      </div>
      <div className="mt-6 text-center">
        <a
          href={generatedImage}
          download="looklab-ai-result.png"
          className="inline-flex items-center font-medium text-primary hover:underline"
        >
          <DownloadIcon className="w-4 h-4 mr-2" />
          Download Result
        </a>
      </div>
    </div>
  );
};