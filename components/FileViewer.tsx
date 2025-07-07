'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Eye, FileText, Image, FileSpreadsheet, File, Copy, Download, Maximize2 } from 'lucide-react';

interface FileViewerProps {
  file: any;
}

export function FileViewer({ file }: FileViewerProps) {
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-5 w-5 text-green-600" />;
      case 'spreadsheet':
        return <FileSpreadsheet className="h-5 w-5 text-blue-600" />;
      case 'text':
        return <FileText className="h-5 w-5 text-slate-600" />;
      default:
        return <File className="h-5 w-5 text-slate-500" />;
    }
  };

  const copyToClipboard = async () => {
    if (file.content) {
      await navigator.clipboard.writeText(file.content);
    }
  };

  const renderContent = () => {
    if (file.type === 'text' || file.name.match(/\.(txt|md|js|ts|jsx|tsx|html|css|json)$/i)) {
      return (
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between mb-4 p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-600" />
              <span className="text-sm font-medium">Text Content</span>
              <Badge variant="outline" className="text-xs">
                {file.content?.split('\n').length || 0} lines
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
          <ScrollArea className="flex-1 custom-scrollbar">
            <pre className="whitespace-pre-wrap text-sm font-mono p-6 bg-white rounded-lg border border-slate-200 leading-relaxed">
              {file.content}
            </pre>
          </ScrollArea>
        </div>
      );
    }

    if (file.type === 'image') {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-24 h-24 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Image className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Image Preview</h3>
            <p className="text-slate-500 mb-4">Image viewing will be available in a future update</p>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Image
            </Button>
          </div>
        </div>
      );
    }

    if (file.type === 'spreadsheet') {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileSpreadsheet className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Spreadsheet Preview</h3>
            <p className="text-slate-500 mb-4">Spreadsheet viewing will be available in a future update</p>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download File
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <File className="h-12 w-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">Preview Not Available</h3>
          <p className="text-slate-500 mb-4">This file type cannot be previewed in the browser</p>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download File
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card className="h-full flex flex-col glass-effect border-slate-200/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            File Preview
          </CardTitle>
          <div className="flex items-center gap-2">
            {getFileIcon(file.type)}
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {file.type}
            </Badge>
            <Button variant="ghost" size="sm">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-6">
        {renderContent()}
      </CardContent>
    </Card>
  );
}