import { HomeIcon, ImageIcon } from "lucide-react";
import React, { ReactElement } from "react";
import Index from "./pages/Index";
import ImageCompressor from "./pages/ImageCompressor";

/**
 * Interface for navigation items
 */
export interface NavItem {
  title: string;
  to: string;
  icon: ReactElement;
  page: ReactElement;
}

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems: NavItem[] = [
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