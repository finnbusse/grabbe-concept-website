import React from 'react';
import { SeoEntity } from '@/lib/types/database.types';

interface SeoPanelProps {
  entity: SeoEntity;
  onChange: (updates: Partial<SeoEntity>) => void;
}

/**
 * Shared SEO configuration panel
 */
export function SeoPanel({ entity, onChange }: SeoPanelProps) {
  return (
    <div className="border rounded p-4 shadow-sm bg-white mt-4">
      <h3 className="font-semibold mb-3">SEO Configuration</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">SEO Title</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={entity.seo_title || ''}
            onChange={(e) => onChange({ seo_title: e.target.value })}
            placeholder="Override default title"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Meta Description</label>
          <textarea
            className="w-full border rounded p-2"
            value={entity.meta_description || ''}
            onChange={(e) => onChange({ meta_description: e.target.value })}
            rows={3}
          />
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <input
            type="checkbox"
            id="no_index"
            checked={entity.no_index || false}
            onChange={(e) => onChange({ no_index: e.target.checked })}
          />
          <label htmlFor="no_index" className="text-sm">Hide from Search Engines (noindex)</label>
        </div>
      </div>
    </div>
  );
}
