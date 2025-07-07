'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Folder, 
  FolderOpen, 
  FileText, 
  Image, 
  FileSpreadsheet, 
  File,
  ChevronRight,
  ChevronDown,
  Code,
  FileImage,
  FileCode,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileTreeProps {
  files: any[];
  folders: any[];
  onFileSelect: (file: any) => void;
  selectedFile: any;
}

export function FileTree({ files, folders, onFileSelect, selectedFile }: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const getFileIcon = (type: string, fileName: string) => {
    // Check file extension for more specific icons
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (extension && ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'html', 'css'].includes(extension)) {
      return <FileCode className="h-4 w-4 text-purple-600" />;
    }
    
    switch (type) {
      case 'image':
        return <FileImage className="h-4 w-4 text-green-600" />;
      case 'spreadsheet':
        return <FileSpreadsheet className="h-4 w-4 text-emerald-600" />;
      case 'text':
        return <FileText className="h-4 w-4 text-blue-600" />;
      default:
        return <File className="h-4 w-4 text-slate-500" />;
    }
  };

  const getFileTypeClass = (type: string, fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (extension && ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'html', 'css'].includes(extension)) {
      return 'file-code';
    }
    
    switch (type) {
      case 'image':
        return 'file-image';
      case 'spreadsheet':
        return 'file-spreadsheet';
      case 'text':
        return 'file-text';
      default:
        return '';
    }
  };

  const renderFileTree = (items: any[], level = 0) => {
    return items.map((item) => (
      <div key={item.id} className="select-none animate-fade-in">
        {item.type === 'folder' ? (
          <div>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-start h-9 px-3 mb-1 rounded-lg transition-all hover:bg-white/80",
                `pl-${3 + level * 4}`
              )}
              onClick={() => toggleFolder(item.id)}
            >
              {expandedFolders.has(item.id) ? (
                <ChevronDown className="h-3 w-3 mr-2 text-slate-500" />
              ) : (
                <ChevronRight className="h-3 w-3 mr-2 text-slate-500" />
              )}
              {expandedFolders.has(item.id) ? (
                <FolderOpen className="h-4 w-4 mr-3 text-blue-600" />
              ) : (
                <Folder className="h-4 w-4 mr-3 text-blue-600" />
              )}
              <span className="text-sm font-medium">{item.name}</span>
            </Button>
            {expandedFolders.has(item.id) && item.children && (
              <div className="ml-2">
                {renderFileTree(item.children, level + 1)}
              </div>
            )}
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start h-9 px-3 mb-1 rounded-lg transition-all hover:bg-white/80 file-card-hover",
              `pl-${3 + level * 4}`,
              selectedFile?.id === item.id && "bg-blue-50 text-blue-700 border border-blue-200"
            )}
            onClick={() => onFileSelect(item)}
          >
            <div className={cn("w-6 h-6 rounded-md flex items-center justify-center mr-3", getFileTypeClass(item.type, item.name))}>
              {getFileIcon(item.type, item.name)}
            </div>
            <div className="flex-1 text-left">
              <span className="text-sm font-medium truncate block">{item.name}</span>
              <span className="text-xs text-slate-500">{item.size}</span>
            </div>
            <div className="flex items-center gap-1 ml-2">
              {item.metadata && (
                <div className="w-2 h-2 bg-green-500 rounded-full" title="AI Processed" />
              )}
              {item.processing && (
                <Badge variant="outline" className="text-xs px-1 py-0 h-5 processing-pulse">
                  <Sparkles className="h-2 w-2" />
                </Badge>
              )}
            </div>
          </Button>
        )}
      </div>
    ));
  };

  // Combine folders and files for rendering
  const allItems = [...folders, ...files];

  return (
    <div className="space-y-1">
      {allItems.length === 0 ? (
        <div className="text-center py-12 text-slate-500 animate-fade-in">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Folder className="h-8 w-8 opacity-50" />
          </div>
          <p className="text-sm font-medium mb-1">No files or folders yet</p>
          <p className="text-xs">Upload files to get started</p>
        </div>
      ) : (
        <div className="space-y-1">
          {renderFileTree(allItems)}
        </div>
      )}
    </div>
  );
}