import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { DownloadIcon, Trash2Icon, Loader2Icon, ImageIcon, SettingsIcon, HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Link } from "react-router-dom";

// Define types for our file objects
interface FileObject {
  file: File;
  preview: string;
  name: string;
  size: number;
  compressed: File | null;
  compressedSize: number;
  compressionRatio: number;
}

interface CompressedFileObject extends FileObject {
  compressed: File;
  compressedPreview: string;
}

interface CompressionResult {
  file: File;
  preview: string;
  size: number;
  compressionRatio: number;
}

const ImageCompressor: React.FC = () => {
  const [files, setFiles] = useState<FileObject[]>([]);
  const [compressedFiles, setCompressedFiles] = useState<CompressedFileObject[]>([]);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [compressionLevel, setCompressionLevel] = useState<number>(70);
  const [showSettings, setShowSettings] = useState<boolean>(true);
  const [autoCompress, setAutoCompress] = useState<boolean>(true);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/')
    );
    
    const newFiles: FileObject[] = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      compressed: null,
      compressedSize: 0,
      compressionRatio: 0
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: true
  });

  const compressImage = (file: File): Promise<CompressionResult> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            throw new Error('Could not get 2D context from canvas');
          }
          
          const quality = compressionLevel / 100;
          const maxWidth = 1200;
          const maxHeight = 1200;
          
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = width * ratio;
            height = height * ratio;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (!blob) {
              throw new Error('Failed to create blob from canvas');
            }
            
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            
            resolve({
              file: compressedFile,
              preview: URL.createObjectURL(compressedFile),
              size: compressedFile.size,
              compressionRatio: Math.round((1 - compressedFile.size / file.size) * 100)
            });
          }, 'image/jpeg', quality);
        };
        
        if (event.target?.result) {
          img.src = event.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const compressAllImages = async (): Promise<void> => {
    if (files.length === 0 || isCompressing) return;
    
    setIsCompressing(true);
    setProgress(0);
    
    const compressedResults: CompressedFileObject[] = [];
    for (let i = 0; i < files.length; i++) {
      const result = await compressImage(files[i].file);
      compressedResults.push({
        ...files[i],
        compressed: result.file,
        compressedPreview: result.preview,
        compressedSize: result.size,
        compressionRatio: result.compressionRatio
      });
      setProgress(Math.round(((i + 1) / files.length) * 100));
    }
    
    setCompressedFiles(compressedResults);
    setIsCompressing(false);
  };

  useEffect(() => {
    if (autoCompress && files.length > 0 && compressedFiles.length > 0) {
      compressAllImages();
    }
  }, [compressionLevel]);

  const handleDownload = (file: File, index: number): void => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = `compressed-${index + 1}-${file.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = (): void => {
    compressedFiles.forEach((file, index) => {
      handleDownload(file.compressed, index);
    });
  };

  const removeFile = (index: number): void => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    
    if (compressedFiles[index]) {
      const newCompressed = [...compressedFiles];
      newCompressed.splice(index, 1);
      setCompressedFiles(newCompressed);
    }
  };

  const removeAllFiles = (): void => {
    setFiles([]);
    setCompressedFiles([]);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <Link to="/">
          <Button variant="outline" className="flex items-center gap-2">
            <HomeIcon className="h-4 w-4" />
            返回主页
          </Button>
        </Link>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          AI图片压缩工具
        </h1>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
          使用AI技术智能压缩图片，减少文件大小同时保持良好视觉质量
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 上传区域 */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>上传图片</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
                ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center gap-3">
                <ImageIcon className="h-12 w-12 text-blue-500" />
                <p className="text-gray-700">
                  {isDragActive 
                    ? "拖放图片到这里" 
                    : "点击或拖放图片到这里上传"}
                </p>
                <p className="text-sm text-gray-500">
                  支持 JPG, PNG, GIF, WEBP 格式
                </p>
              </div>
            </div>

            {/* 文件列表 */}
            {files.length > 0 && (
              <div className="mt-6">
                <div className="flex justify-between mb-3">
                  <h3 className="font-medium">上传的文件</h3>
                  <div className="space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={removeAllFiles}
                      className="text-gray-500 hover:text-red-500"
                    >
                      清除全部
                    </Button>
                    <Button
                      size="sm" 
                      onClick={compressAllImages}
                      disabled={isCompressing || files.length === 0}
                      className="flex items-center gap-1"
                    >
                      {isCompressing ? (
                        <>
                          <Loader2Icon className="h-4 w-4 animate-spin" />
                          压缩中...{progress}%
                        </>
                      ) : '压缩图片'}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {files.map((file, index) => (
                    <div 
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded bg-gray-200 overflow-hidden flex-shrink-0">
                          {file.preview && (
                            <img 
                              src={file.preview} 
                              alt={file.name} 
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <p className="truncate text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {Math.round(file.size / 1024)} KB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 压缩设置与结果 */}
        <div className="space-y-8">
          {/* 压缩设置 */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">压缩设置</CardTitle>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowSettings(!showSettings)}
              >
                <SettingsIcon className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {showSettings && (
                <>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium">压缩级别: {compressionLevel}%</label>
                        <span className="text-sm text-gray-500">
                          {compressionLevel < 30 ? '高压缩' : compressionLevel < 70 ? '均衡' : '高画质'}
                        </span>
                      </div>
                      <Slider 
                        value={[compressionLevel]} 
                        min={10} 
                        max={90} 
                        step={5}
                        onValueChange={(value) => setCompressionLevel(value[0])}
                        className="py-4"
                      />
                      <div className="flex text-xs justify-between text-gray-500">
                        <span>最小体积</span>
                        <span>平衡</span>
                        <span>最高画质</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          {/* 压缩结果 */}
          {compressedFiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">压缩结果</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-500">共 {compressedFiles.length} 个文件</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={handleDownloadAll}
                    >
                      <DownloadIcon className="h-4 w-4" />
                      全部下载
                    </Button>
                  </div>
                  
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                    {compressedFiles.map((file, index) => (
                      <div 
                        key={`compressed-${index}`}
                        className="bg-white border rounded-lg overflow-hidden"
                      >
                        <div className="flex items-center p-3 border-b">
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-medium">{file.name}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(file.compressed, index)}
                            className="flex items-center gap-1 ml-2 text-blue-600"
                          >
                            <DownloadIcon className="h-4 w-4" />
                            下载
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2">
                          <div className="p-3 border-r text-center">
                            <div className="text-xs text-gray-500 mb-1">原始</div>
                            <div className="h-24 bg-gray-50 mb-2 flex items-center justify-center overflow-hidden">
                              <img 
                                src={file.preview} 
                                alt="Original" 
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                            <div className="text-xs text-gray-700">
                              {Math.round(file.size / 1024)} KB
                            </div>
                          </div>
                          
                          <div className="p-3 text-center">
                            <div className="text-xs text-gray-500 mb-1">压缩后</div>
                            <div className="h-24 bg-gray-50 mb-2 flex items-center justify-center overflow-hidden">
                              <img 
                                src={file.compressedPreview} 
                                alt="Compressed" 
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                            <div className="text-xs text-gray-700 flex justify-center items-center">
                              {Math.round(file.compressedSize / 1024)} KB
                              <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                                -{file.compressionRatio}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageCompressor; 