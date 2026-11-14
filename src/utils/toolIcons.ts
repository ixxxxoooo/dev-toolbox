import {
  Braces,
  FileDiff,
  Database,
  Clock,
  Link,
  Binary,
  Fingerprint,
  FileText,
  Hash,
  Key,
  Calculator,
  Globe,
  Monitor,
  Regex,
  QrCode,
  NotebookText,
  Image,
  Eraser,
  Languages,
  Share2,
  PenTool
} from 'lucide-vue-next'
import type { Component } from 'vue'

/**
 * 工具图标映射（侧边栏与命令面板共用）。
 * 路由 meta.icon 填写这里的键名；新增工具时只需在此登记一次，
 * 避免之前两处各维护一份导致命令面板缺失 Markdown/Mermaid/Excalidraw 图标。
 */
export const toolIcons: Record<string, Component> = {
  Braces,
  FileDiff,
  Database,
  Clock,
  Link,
  Binary,
  Fingerprint,
  FileText,
  Hash,
  Key,
  Calculator,
  Globe,
  Monitor,
  Regex,
  QrCode,
  NotebookText,
  Image,
  Eraser,
  Languages,
  Share2,
  PenTool
}

export const getToolIcon = (name?: string): Component => (name && toolIcons[name]) || FileText
