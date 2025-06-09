# AImageShrink

智能图片压缩工具，使用 AI 技术减小文件体积，同时保持良好的视觉质量。

## 功能特点

- 🖼️ 批量图片压缩
- 📊 实时压缩比例显示
- 🎛️ 可调节压缩质量级别
- 🚀 快速处理多张图片
- 💾 一键下载所有压缩后的图片
- 🌐 本地处理，无需上传至云端
- 📱 响应式设计，适配各种设备

![image](https://github.com/user-attachments/assets/9123b041-a8a1-46c0-8c33-b9b269b4ecad)
![image](https://github.com/user-attachments/assets/aad7623d-9189-4d32-a282-2cbfc207bcc2)

## 技术栈

- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router DOM
- React Dropzone
- Lucide React (图标)
- shadcn/ui 组件库

## 安装和使用

1. 克隆仓库

```bash
git clone https://github.com/your-username/aimageShrink.git
cd aimageShrink
```

2. 安装依赖

```bash
npm install
```

3. 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:8080` 运行

## 构建生产版本

```bash
npm run build
```

构建后的文件将位于 `build` 目录中

## 使用说明

1. 点击上传区域或将图片拖放到指定区域
2. 调整压缩设置（压缩级别）
3. 点击压缩按钮处理图片
4. 查看压缩效果
5. 下载单个或全部压缩后的图片

## 项目结构

```
src/
│
├── components/      # UI 组件
│   └── ui/          # shadcn/ui 组件
│
├── lib/            # 工具函数和 hooks
│
├── pages/          # 页面组件
│   ├── Index.tsx    # 首页
│   └── ImageCompressor.tsx  # 图片压缩页面
│
├── App.tsx         # 根组件
├── main.tsx        # 应用入口
└── nav-items.tsx   # 导航配置
```

## 贡献指南

欢迎提交问题和功能请求！

1. Fork 仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

## 许可证

MIT
