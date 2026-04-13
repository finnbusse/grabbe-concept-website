import React from 'react';
import { PublishableEntity, OwnedEntity } from '@/lib/types/database.types';

interface MetadataPanelProps {
  entity: PublishableEntity & OwnedEntity;
  onChange: (updates: Partial<PublishableEntity & OwnedEntity>) => void;
}

/**
 * Shared metadata panel for status, visibility, and ownership
 */
export function MetadataPanel({ entity, onChange }: MetadataPanelProps) {
  return (
    <div className="border rounded p-4 shadow-sm bg-white">
      <h3 className="font-semibold mb-3">Metadata</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Status</label>
          <select
            className="w-full border rounded p-2"
            value={entity.status}
            onChange={(e) => onChange({ status: e.target.value as any })}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Visibility</label>
          <select
            className="w-full border rounded p-2"
            value={entity.visibility || 'public'}
            onChange={(e) => onChange({ visibility: e.target.value as any })}
          >
            <option value="public">Public</option>
            <option value="internal">Internal Only</option>
            <option value="private">Private</option>
          </select>
        </div>
      </div>
    </div>
  );
}
