import React from 'react';
import { ContentItem } from '@/lib/types/database.types';

interface ContentWorkspaceProps<T extends ContentItem> {
  item: T | null;
  onSave: (item: T) => void;
  children: React.ReactNode;
}

/**
 * Generic Content Editor Shell
 * Reusable across Pages, News, Events, etc.
 */
export function ContentWorkspace<T extends ContentItem>({ item, onSave, children }: ContentWorkspaceProps<T>) {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6 h-full">
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{item ? \`Editing: \${item.title}\` : 'New Item'}</h2>
        {children}
      </div>
      <div className="w-full md:w-80 flex flex-col space-y-4">
        {/* Sidebar panels can go here */}
        <button onClick={() => item && onSave(item)} className="bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>
      </div>
    </div>
  );
}
