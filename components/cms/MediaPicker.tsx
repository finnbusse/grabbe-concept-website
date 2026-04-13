import React from 'react';
import { MediaAsset } from '@/lib/types/database.types';

interface MediaPickerProps {
  label: string;
  selectedAssetId: string | null;
  onSelect: (assetId: string | null) => void;
  // In a real app we'd pass an openModal function or similar
}

/**
 * Shared media selection component for hero, teaser, and inline media
 */
export function MediaPicker({ label, selectedAssetId, onSelect }: MediaPickerProps) {
  return (
    <div className="border rounded p-4 shadow-sm bg-white mt-4">
      <h3 className="font-semibold mb-2">{label}</h3>
      {selectedAssetId ? (
        <div className="flex flex-col space-y-2">
          <div className="bg-gray-100 p-4 flex items-center justify-center rounded">
            <span className="text-gray-500 italic">Media Asset: {selectedAssetId}</span>
          </div>
          <button
            onClick={() => onSelect(null)}
            className="text-red-500 text-sm hover:underline self-start"
          >
            Remove Media
          </button>
        </div>
      ) : (
        <button
          className="w-full border-2 border-dashed border-gray-300 rounded p-6 text-gray-500 hover:bg-gray-50 hover:border-blue-300 transition-colors"
          onClick={() => alert('Open media gallery modal')}
        >
          Click to select media
        </button>
      )}
    </div>
  );
}
