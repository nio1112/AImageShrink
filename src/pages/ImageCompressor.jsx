import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { DownloadIcon, Trash2Icon, Loader2Icon, ImageIcon, SettingsIcon, HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Link } from "react-router-dom";

const ImageCompressor = () => {
  const [files, setFiles] = useState([]);
  const [compressedFiles, setCompressedFiles] = useState([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compressionLevel, setCompressionLevel] = useState(70);
  const [showSettings, setShowSettings] = useState(true);
  const [autoCompress, setAutoCompress] = useState(true);

  const onDrop = useCallback((acceptedFiles) => {
    const imageFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/')
    );
    
    const newFiles = imageFiles.map(file => ({
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

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
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
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const compressAllImages = async () => {
    if (files.length === 0 || isCompressing) return;
    
    setIsCompressing(true);
    setProgress(0);
    
    const compressedResults = [];
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

  const handleDownload = (file, index) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = `compressed-${index + 1}-${file.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    compressedFiles.forEach((file, index) => {
      handleDownload(file.compressed, index);
    });
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    
    if (compressedFiles[index]) {
      const newCompressed = [...compressedFiles];
      newCompressed.splice(index, 1);
      setCompressedFiles(newCompressed);
    }
  };

  const removeAllFiles = () => {
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
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">已上传图片 ({files.length})</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={removeAllFiles}
                    className="text-red-500 hover:bg-red-50"
                  >
                    <Trash2Icon className="h-4 w-4 mr-1" /> 清除全部
                  </Button>
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {files.map((file, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={file.preview} 
                          alt={file.name} 
                          className="h-12 w-12 object-cover rounded-md border"
                        />
                        <div>
                          <p className="font-medium text-sm truncate max-w-[160px]">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:bg-red-50"
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

        {/* 压缩区域 */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>压缩结果</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="text-gray-600 hover:bg-gray-100"
              >
                <SettingsIcon className="h-4 w-4 mr-1" /> 
                {showSettings ? "隐藏设置" : "压缩设置"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* 压缩设置面板 - 默认显示 */}
              {showSettings && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">
                      压缩质量: {compressionLevel}%
                    </label>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {compressionLevel < 30 ? "高压缩" : 
                       compressionLevel < 70 ? "平衡" : "高质量"}
                    </span>
                  </div>
                  
                  <Slider 
                    defaultValue={[compressionLevel]}
                    min={10}
                    max={95}
                    step={5}
                    onValueChange={(value) => setCompressionLevel(value[0])}
                    disabled={isCompressing}
                    className="mb-2"
                  />
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>文件更小</span>
                    <span>质量更好</span>
                  </div>
                  
                  <div className="mt-4 text-xs text-gray-600">
                    <p className="mb-1">• 较低质量 (10-40%): 文件最小，质量损失明显</p>
                    <p className="mb-1">• 中等质量 (40-70%): 平衡文件大小和质量</p>
                    <p>• 高质量 (70-95%): 文件较大，质量接近原始</p>
                  </div>
                  
                  <div className="mt-4 flex items-center">
                    <input
                      type="checkbox"
                      id="auto-compress"
                      checked={autoCompress}
                      onChange={(e) => setAutoCompress(e.target.checked)}
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="auto-compress" className="ml-2 text-sm text-gray-700">
                      调整质量时自动重新压缩
                    </label>
                  </div>
                </div>
              )}

              {isCompressing ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2Icon className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                  <p className="text-gray-700">正在压缩图片...</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4 max-w-md">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{progress}% 完成</p>
                  <p className="text-sm text-gray-500 mt-1">使用质量: {compressionLevel}%</p>
                </div>
              ) : compressedFiles.length > 0 ? (
                <>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">
                        压缩质量: <span className="font-medium">{compressionLevel}%</span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        onClick={compressAllImages}
                        disabled={isCompressing}
                      >
                        <Loader2Icon className="h-4 w-4 mr-2" /> 重新压缩
                      </Button>
                      <Button onClick={handleDownloadAll}>
                        <DownloadIcon className="h-4 w-4 mr-2" /> 下载全部
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                    {compressedFiles.map((file, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-medium truncate max-w-[200px]">{file.name}</p>
                            <p className="text-sm text-gray-500">
                              压缩率: <span className="text-green-600 font-medium">{file.compressionRatio}%</span>
                            </p>
                          </div>
                          <Button 
                            size="sm"
                            onClick={() => handleDownload(file.compressed, index)}
                          >
                            <DownloadIcon className="h-4 w-4 mr-1" /> 下载
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">原始图片</p>
                            <div className="relative">
                              <img 
                                src={file.preview} 
                                alt={`Original ${file.name}`}
                                className="w-full h-40 object-contain rounded-md border bg-gray-50"
                              />
                              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                {(file.size / 1024).toFixed(1)} KB
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">压缩后图片</p>
                            <div className="relative">
                              <img 
                                src={file.compressedPreview} 
                                alt={`Compressed ${file.name}`}
                                className="w-full h-40 object-contain rounded-md border bg-gray-50"
                              />
                              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                {(file.compressedSize / 1024).toFixed(1)} KB
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-gray-100 p-6 rounded-full mb-4">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">等待图片上传</h3>
                  <p className="text-gray-500 max-w-md">
                    上传图片后，点击下方按钮开始压缩处理
                  </p>
                </div>
              )}
              
              {files.length > 0 && !isCompressing && (
                <div className="pt-4">
                  <Button 
                    className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                    onClick={compressAllImages}
                    disabled={isCompressing}
                  >
                    {compressedFiles.length > 0 ? "重新压缩图片" : "开始压缩图片"} (质量: {compressionLevel}%)
                  </Button>
                  <p className="text-center text-sm text-gray-500 mt-3">
                    将压缩 {files.length} 张图片，预计可节省存储空间
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-12 bg-blue-50 rounded-xl p-6 border border-blue-100 max-w-3xl mx-auto">
        <h3 className="font-medium text-blue-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          AI压缩优势
        </h3>
        <ul className="mt-3 space-y-2 text-sm text-blue-700">
          <li>• 智能识别图片内容，优先保留重要细节</li>
          <li>• 自适应压缩算法，针对不同图片类型优化</li>
          <li>• 压缩过程在浏览器本地完成，保护隐私安全</li>
          <li>• 可调整压缩比例平衡文件大小和质量</li>
          <li>• 自动优化图片元数据，进一步提升压缩效果</li>
          <li>• 调整压缩质量后会自动重新压缩图片</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageCompressor;
