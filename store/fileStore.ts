'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  modified: string;
  content?: string;
  metadata?: any;
  processing?: boolean;
}

interface FolderItem {
  id: string;
  name: string;
  type: 'folder';
  children?: (FileItem | FolderItem)[];
}

interface FileStore {
  files: FileItem[];
  folders: FolderItem[];
  addFile: (file: FileItem) => void;
  updateFile: (id: string, updates: Partial<FileItem>) => void;
  deleteFile: (id: string) => void;
  createFolder: (name: string) => void;
  deleteFolder: (id: string) => void;
  processFile: (id: string) => Promise<void>;
  loadData: () => void;
}

export const useFileStore = create<FileStore>()(
  persist(
    (set, get) => ({
      files: [],
      folders: [],
      
      addFile: (file) => {
        set((state) => ({
          files: [...state.files, file]
        }));
      },
      
      updateFile: (id, updates) => {
        set((state) => ({
          files: state.files.map(file =>
            file.id === id ? { ...file, ...updates } : file
          )
        }));
      },
      
      deleteFile: (id) => {
        set((state) => ({
          files: state.files.filter(file => file.id !== id)
        }));
      },
      
      createFolder: (name) => {
        const folder: FolderItem = {
          id: `folder-${Date.now()}`,
          name,
          type: 'folder',
          children: []
        };
        set((state) => ({
          folders: [...state.folders, folder]
        }));
      },
      
      deleteFolder: (id) => {
        set((state) => ({
          folders: state.folders.filter(folder => folder.id !== id)
        }));
      },
      
      processFile: async (id) => {
        // Set processing status
        set((state) => ({
          files: state.files.map(file =>
            file.id === id ? { ...file, processing: true } : file
          )
        }));

        try {
          const file = get().files.find(f => f.id === id);
          if (!file) return;

          // Call Google Gemini API
          const response = await fetch('/api/process-file', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              content: file.content,
              fileName: file.name,
              fileType: file.type
            })
          });

          if (response.ok) {
            const metadata = await response.json();
            
            // Update file with metadata
            set((state) => ({
              files: state.files.map(file =>
                file.id === id 
                  ? { ...file, metadata, processing: false }
                  : file
              )
            }));
          }
        } catch (error) {
          console.error('Error processing file:', error);
        } finally {
          // Remove processing status
          set((state) => ({
            files: state.files.map(file =>
              file.id === id ? { ...file, processing: false } : file
            )
          }));
        }
      },
      
      loadData: () => {
        // Initialize with sample data if empty
        const { files, folders } = get();
        if (files.length === 0 && folders.length === 0) {
          set({
            files: [
              {
                id: 'sample-1',
                name: 'README.md',
                type: 'text',
                size: '2.1 KB',
                modified: new Date().toLocaleDateString(),
                content: '# Welcome to File Manager\n\nThis is a sample README file to demonstrate the file management system.\n\n## Features\n\n- Upload files\n- Edit text files\n- AI processing\n- Folder organization',
                metadata: {
                  language: 'Markdown',
                  lineCount: 9,
                  entities: ['File Manager', 'README', 'AI processing']
                }
              },
              {
                id: 'sample-2',
                name: 'sample.txt',
                type: 'text',
                size: '856 B',
                modified: new Date().toLocaleDateString(),
                content: 'This is a sample text file.\n\nIt contains some example content to demonstrate the file viewer and editor capabilities.',
                metadata: {
                  language: 'Plain Text',
                  lineCount: 3,
                  entities: ['sample', 'text file', 'content']
                }
              }
            ],
            folders: [
              {
                id: 'folder-1',
                name: 'Documents',
                type: 'folder',
                children: []
              }
            ]
          });
        }
      }
    }),
    {
      name: 'file-store',
      skipHydration: true
    }
  )
);