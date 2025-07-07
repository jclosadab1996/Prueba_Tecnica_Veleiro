'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Save, Undo2, Redo2, Type, Code, FileText, AlertCircle } from 'lucide-react';
import { useFileStore } from '@/store/fileStore';

interface FileEditorProps {
  file: any;
}

export function FileEditor({ file }: FileEditorProps) {
  const [content, setContent] = useState(file?.content || '');
  const [hasChanges, setHasChanges] = useState(false);
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [lineCount, setLineCount] = useState(0);
  const { updateFile } = useFileStore();

  useEffect(() => {
    setContent(file?.content || '');
    setHasChanges(false);
    setLineCount(file?.content?.split('\n').length || 0);
  }, [file]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setHasChanges(newContent !== file?.content);
    setLineCount(newContent.split('\n').length);
  };

  const handleSave = () => {
    updateFile(file.id, { content });
    setHasChanges(false);
  };

  const handleUndo = () => {
    setContent(file?.content || '');
    setHasChanges(false);
    setLineCount(file?.content?.split('\n').length || 0);
  };

  const isTextFile = file?.type === 'text' || file?.name.match(/\.(txt|md|js|ts|jsx|tsx|html|css|json)$/i);

  if (!isTextFile) {
    return (
      <Card className="h-full glass-effect border-slate-200/50">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-24 h-24 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-12 w-12 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Cannot Edit This File</h3>
            <p className="text-slate-500 mb-4">Only text and code files can be edited inline</p>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              {file?.type} file
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col glass-effect border-slate-200/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Code Editor
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-slate-50 text-slate-700">
              {lineCount} lines
            </Badge>
            {hasChanges && (
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                Unsaved changes
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCodeMode(!isCodeMode)}
              className="hover:bg-blue-50"
            >
              {isCodeMode ? <Type className="h-4 w-4 mr-2" /> : <Code className="h-4 w-4 mr-2" />}
              {isCodeMode ? 'Text Mode' : 'Code Mode'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleUndo}
              disabled={!hasChanges}
              className="hover:bg-slate-50"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges}
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <div className="h-full relative">
          <Textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            className={cn(
              "h-full resize-none border-0 focus:ring-0 rounded-none",
              isCodeMode 
                ? "font-mono text-sm leading-relaxed bg-slate-50" 
                : "font-sans leading-relaxed bg-white"
            )}
            placeholder="Start typing your content here..."
          />
          {isCodeMode && (
            <div className="absolute top-4 right-4">
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                <Code className="h-3 w-3 mr-1" />
                Code Mode
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}