'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  FileText, 
  Folder, 
  Upload, 
  Search, 
  Plus, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Download, 
  Eye,
  Brain,
  FileType,
  Calendar,
  Hash,
  Languages,
  Users,
  Sparkles,
  FolderOpen,
  Settings,
  Star,
  Clock,
  Zap,
  Shield,
  Layers
} from 'lucide-react';
import { FileTree } from '@/components/FileTree';
import { FileUpload } from '@/components/FileUpload';
import { FileEditor } from '@/components/FileEditor';
import { FileViewer } from '@/components/FileViewer';
import { CreateFolderDialog } from '@/components/CreateFolderDialog';
import { useFileStore } from '@/store/fileStore';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('browse');
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const { files, folders, loadData, createFolder, deleteFile, processFile } = useFileStore();

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileSelect = (file: any) => {
    setSelectedFile(file);
    setActiveTab('view');
  };

  const handleProcessFile = async (file: any) => {
    await processFile(file.id);
  };

  const getFileStats = () => {
    const totalFiles = files.length;
    const processedFiles = files.filter(f => f.metadata).length;
    const totalFolders = folders.length;
    return { totalFiles, processedFiles, totalFolders };
  };

  const stats = getFileStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="flex h-screen">
        {/* Enhanced Sidebar */}
        <div className="w-80 glass-effect border-r border-slate-200/50 flex flex-col">
          {/* Header with gradient */}
          <div className="p-6 border-b border-slate-200/50 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Layers className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">File Manager</h1>
                <p className="text-xs text-blue-100">AI-powered workspace</p>
              </div>
            </div>
            
            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/10 rounded-lg p-2 text-center backdrop-blur-sm">
                <div className="text-lg font-bold text-white">{stats.totalFiles}</div>
                <div className="text-xs text-blue-100">Files</div>
              </div>
              <div className="bg-white/10 rounded-lg p-2 text-center backdrop-blur-sm">
                <div className="text-lg font-bold text-white">{stats.processedFiles}</div>
                <div className="text-xs text-blue-100">Processed</div>
              </div>
              <div className="bg-white/10 rounded-lg p-2 text-center backdrop-blur-sm">
                <div className="text-lg font-bold text-white">{stats.totalFolders}</div>
                <div className="text-xs text-blue-100">Folders</div>
              </div>
            </div>
          </div>
          
          {/* Search and Actions */}
          <div className="p-4 border-b border-slate-200/50 bg-white/50">
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/80 border-slate-200/50 focus:bg-white transition-all"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateFolder(true)}
                className="bg-white/80 border-slate-200/50 hover:bg-white"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <FileUpload onUpload={(files) => console.log('Files uploaded:', files)} />
          </div>

          {/* File Tree */}
          <ScrollArea className="flex-1 p-4 custom-scrollbar">
            <FileTree
              files={filteredFiles}
              folders={folders}
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
            />
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200/50 bg-white/30">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                <span>AI-Powered</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header with improved design */}
          <div className="p-6 border-b border-slate-200/50 glass-effect">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  {selectedFile ? (
                    <>
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-slate-900">{selectedFile.name}</h2>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200">
                            <FileType className="h-3 w-3" />
                            {selectedFile.type}
                          </Badge>
                          {selectedFile.metadata && (
                            <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
                              <Sparkles className="h-3 w-3" />
                              AI Processed
                            </Badge>
                          )}
                          {selectedFile.processing && (
                            <Badge variant="outline" className="flex items-center gap-1 bg-orange-50 text-orange-700 border-orange-200 processing-pulse">
                              <Brain className="h-3 w-3" />
                              Processing...
                            </Badge>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 bg-gradient-to-br from-slate-400 to-slate-600 rounded-xl flex items-center justify-center">
                        <FolderOpen className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-slate-900">Welcome to File Manager</h2>
                        <p className="text-sm text-slate-600">Select a file to get started</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {selectedFile && (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="hover:bg-blue-50">
                    <Star className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="hover:bg-slate-50">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => setActiveTab('edit')} className="flex items-center gap-2">
                        <Edit3 className="h-4 w-4" />
                        Edit File
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleProcessFile(selectedFile)} className="flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        Process with AI
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <Separator className="my-1" />
                      <DropdownMenuItem 
                        onClick={() => deleteFile(selectedFile.id)}
                        className="text-red-600 focus:text-red-600 flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete File
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6">
            {selectedFile ? (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
                  <TabsTrigger value="browse" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="view" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="edit" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Editor
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="browse" className="h-full mt-6 animate-fade-in">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                    {/* File Details */}
                    <div className="lg:col-span-2">
                      <Card className="h-full glass-effect border-slate-200/50">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-600" />
                            File Details
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 rounded-lg p-4">
                              <p className="text-sm font-medium text-slate-600 mb-1">File Size</p>
                              <p className="text-2xl font-bold text-slate-900">{selectedFile.size}</p>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-4">
                              <p className="text-sm font-medium text-slate-600 mb-1">Last Modified</p>
                              <p className="text-lg font-semibold text-slate-900">{selectedFile.modified}</p>
                            </div>
                          </div>
                          
                          {selectedFile.metadata && (
                            <div className="space-y-4">
                              <Separator />
                              <div>
                                <h3 className="font-semibold flex items-center gap-2 mb-4">
                                  <Sparkles className="h-5 w-5 text-purple-600" />
                                  AI Analysis Results
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                  {selectedFile.metadata.language && (
                                    <div className="bg-blue-50 rounded-lg p-4">
                                      <p className="text-sm font-medium text-blue-600 flex items-center gap-1 mb-1">
                                        <Languages className="h-4 w-4" />
                                        Language
                                      </p>
                                      <p className="font-semibold text-blue-900">{selectedFile.metadata.language}</p>
                                    </div>
                                  )}
                                  {selectedFile.metadata.lineCount && (
                                    <div className="bg-green-50 rounded-lg p-4">
                                      <p className="text-sm font-medium text-green-600 flex items-center gap-1 mb-1">
                                        <Hash className="h-4 w-4" />
                                        Lines of Code
                                      </p>
                                      <p className="font-semibold text-green-900">{selectedFile.metadata.lineCount}</p>
                                    </div>
                                  )}
                                </div>
                                {selectedFile.metadata.summary && (
                                  <div className="bg-purple-50 rounded-lg p-4 mt-4">
                                    <p className="text-sm font-medium text-purple-600 mb-2">Summary</p>
                                    <p className="text-purple-900">{selectedFile.metadata.summary}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Metadata Sidebar */}
                    <div className="space-y-4">
                      {selectedFile.metadata?.entities && (
                        <Card className="glass-effect border-slate-200/50">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Users className="h-4 w-4 text-orange-600" />
                              Named Entities
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              {selectedFile.metadata.entities.map((entity: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                                  {entity}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {selectedFile.metadata?.themes && (
                        <Card className="glass-effect border-slate-200/50">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Layers className="h-4 w-4 text-indigo-600" />
                              Key Themes
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {selectedFile.metadata.themes.map((theme: string, index: number) => (
                                <div key={index} className="bg-indigo-50 rounded-md p-2">
                                  <span className="text-sm text-indigo-900">{theme}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      <Card className="glass-effect border-slate-200/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-600" />
                            Quick Actions
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => setActiveTab('edit')}>
                            <Edit3 className="h-4 w-4 mr-2" />
                            Edit File
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => handleProcessFile(selectedFile)}>
                            <Brain className="h-4 w-4 mr-2" />
                            Reprocess
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="view" className="h-full mt-6 animate-fade-in">
                  <FileViewer file={selectedFile} />
                </TabsContent>
                
                <TabsContent value="edit" className="h-full mt-6 animate-fade-in">
                  <FileEditor file={selectedFile} />
                </TabsContent>
              </Tabs>
            ) : (
              <div className="h-full flex items-center justify-center animate-fade-in">
                <Card className="w-full max-w-4xl glass-effect border-slate-200/50">
                  <CardHeader className="text-center pb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Folder className="h-10 w-10 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-gradient">
                      Welcome to File Manager
                    </CardTitle>
                    <p className="text-slate-600 text-lg">
                      Your AI-powered workspace for intelligent file management
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center group">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                          <Upload className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Smart Upload</h3>
                        <p className="text-sm text-slate-600">Drag & drop files with automatic type detection and organization</p>
                      </div>
                      <div className="text-center group">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                          <Edit3 className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Inline Editor</h3>
                        <p className="text-sm text-slate-600">Edit text and code files directly in your browser with syntax highlighting</p>
                      </div>
                      <div className="text-center group">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                          <Brain className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">AI Processing</h3>
                        <p className="text-sm text-slate-600">Extract insights, entities, and metadata using Google Gemini AI</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="text-center">
                      <p className="text-slate-600 mb-4">Get started by uploading your first file or selecting one from the sidebar</p>
                      <div className="flex justify-center gap-4">
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Files
                        </Button>
                        <Button variant="outline">
                          <FolderOpen className="h-4 w-4 mr-2" />
                          Browse Files
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateFolderDialog 
        open={showCreateFolder}
        onOpenChange={setShowCreateFolder}
        onCreateFolder={createFolder}
      />
    </div>
  );
}