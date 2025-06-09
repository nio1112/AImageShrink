import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-4">
          AI图片压缩工具
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          使用AI技术智能压缩图片，保持画质同时显著减小文件体积
        </p>
        
        <div className="flex justify-center gap-4 mb-16">
          <Link to="/image-compressor">
            <Button className="px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
              开始压缩图片
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="bg-blue-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <CardTitle>AI智能识别</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              智能分析图片内容，自动选择最佳压缩算法，保留重要细节
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="bg-green-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <CardTitle>智能压缩</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              基于AI算法优化压缩过程，在保持质量的同时最大化减小文件
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="bg-purple-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <CardTitle>智能优化</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              自动优化图片元数据，移除冗余信息，进一步提升压缩效果
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-16 text-center max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">AI压缩的优势</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="font-medium text-lg mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              智能识别内容
              </h3>
            <p className="text-gray-600">
              AI算法自动识别图片中的重要区域，优先保留细节同时压缩背景
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="font-medium text-lg mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
              自适应压缩
            </h3>
            <p className="text-gray-600">
              根据不同图片类型自动调整压缩参数，获得最佳压缩效果
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
