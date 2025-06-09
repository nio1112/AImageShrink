import { HomeIcon, ImageIcon } from "lucide-react";
import Index from "./pages/Index.jsx";
import ImageCompressor from "./pages/ImageCompressor.jsx";

/**
* Central place for defining the navigation items. Used for navigation components and routing.
*/
export const navItems = [
  {
    title: "首页",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "图片压缩",
    to: "/image-compressor",
    icon: <ImageIcon className="h-4 w-4" />,
    page: <ImageCompressor />,
  },
];
