import React from 'react';
import { TopicTag, EntityTagAssignment, EntityType } from '@/lib/types/database.types';

interface TagSelectorProps {
  entityId: string;
  entityType: EntityType;
  assignedTags: EntityTagAssignment[];
  availableTags: TopicTag[];
  onAssign: (tagId: string, role: 'primary' | 'secondary' | 'contextual') => void;
  onRemove: (assignmentId: string) => void;
}

/**
 * Shared central tagging UI component
 */
export function TagSelector({ entityType, assignedTags, availableTags, onAssign, onRemove }: TagSelectorProps) {
  return (
    <div className="border rounded p-4 shadow-sm bg-white mt-4">
      <h3 className="font-semibold mb-3">Topics & Tags</h3>
      <div className="mb-4 flex flex-wrap gap-2">
        {assignedTags.map(assignment => {
          const tag = availableTags.find(t => t.id === assignment.tag_id);
          if (!tag) return null;

          return (
            <span key={assignment.id} className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {tag.name}
              <button
                onClick={() => onRemove(assignment.id)}
                className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none"
              >
                &times;
              </button>
            </span>
          );
        })}
      </div>

      <div>
        <select
          className="w-full border rounded p-2"
          onChange={(e) => {
            if (e.target.value) {
              onAssign(e.target.value, 'secondary');
              e.target.value = ''; // Reset after selection
            }
          }}
        >
          <option value="">Add a tag...</option>
          {availableTags
            .filter(t => !assignedTags.some(a => a.tag_id === t.id))
            .map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))
          }
        </select>
      </div>
    </div>
  );
}
