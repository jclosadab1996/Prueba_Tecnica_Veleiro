'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Check, FileText, Sparkles } from 'lucide-react';
import { useFileStore } from '@/store/fileStore';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onUpload?: (files: File[]) => void;
}

export function FileUpload({ onUpload }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addFile } = useFileStore();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    const supportedTypes = [
      'text/plain',
      'text/csv',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/javascript',
      'text/typescript',
      'application/json',
      'text/html',
      'text/css',
      'text/markdown'
    ];

    const validFiles = files.filter(file => 
      supportedTypes.includes(file.type) || 
      file.name.match(/\.(txt|md|js|ts|jsx|tsx|html|css|json|csv|pdf|xlsx|xls)$/i)
    );

    if (validFiles.length === 0) {
      alert('Please upload supported file types: .txt, .pdf, .csv, .xlsx, .js, .ts, .html, .css, .json, .md');
      return;
    }

    // Simulate upload progress
    for (const file of validFiles) {
      const fileId = `${file.name}-${Date.now()}`;
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
      }

      // Add to store
      const fileData = {
        id: fileId,
        name: file.name,
        type: getFileType(file),
        size: formatFileSize(file.size),
        modified: new Date().toLocaleDateString(),
        content: await readFileContent(file),
        metadata: null
      };

      addFile(fileData);
      setUploadedFiles(prev => new Set(prev).add(fileId));

      // Clean up progress after 2 seconds
      setTimeout(() => {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[fileId];
          return newProgress;
        });
        setUploadedFiles(prev => {
          const newSet = new Set(prev);
          newSet.delete(fileId);
          return newSet;
        });
      }, 2000);
    }

    onUpload?.(validFiles);
  };

  const getFileType = (file: File) => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.includes('spreadsheet') || file.name.match(/\.(xlsx|xls|csv)$/i)) return 'spreadsheet';
    if (file.type.includes('pdf')) return 'pdf';
    return 'text';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const readFileContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const hasActiveUploads = Object.keys(uploadProgress).length > 0;

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300",
          isDragging 
            ? "border-blue-500 bg-blue-50 scale-105 shadow-lg" 
            : "border-slate-300 hover:border-blue-400 hover:bg-blue-50/50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className={cn(
          "w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center transition-all",
          isDragging ? "bg-blue-500 text-white scale-110" : "bg-blue-100 text-blue-600"
        )}>
          <Upload className="h-6 w-6" />
        </div>
        <p className="text-sm font-semibold text-slate-700 mb-1">
          {isDragging ? "Drop files here" : "Drop files here or click to upload"}
        </p>
        <p className="text-xs text-slate-500">
          Supports .txt, .pdf, .csv, .xlsx, .js, .ts, .html, .css, .json, .md
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".txt,.pdf,.csv,.xlsx,.xls,.js,.ts,.jsx,.tsx,.html,.css,.json,.md"
        onChange={handleFileSelect}
        className="hidden"
      />

      {hasActiveUploads && (
        <div className="space-y-3 animate-slide-up">
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <Card key={fileId} className="glass-effect border-slate-200/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <span className="text-sm font-medium truncate block max-w-48">
                        {fileId.split('-')[0]}
                      </span>
                      <span className="text-xs text-slate-500">Uploading...</span>
                    </div>
                  </div>
                  {uploadedFiles.has(fileId) ? (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-blue-600">{progress}%</span>
                  )}
                </div>
                <Progress 
                  value={progress} 
                  className="h-2 bg-slate-200" 
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}