// Component Types
export interface ComponentNode {
  id: string;
  type: 'card' | 'text' | 'image' | 'button' | 'container' | 'stack';
  props: ComponentProps;
  children?: ComponentNode[];
}

export interface ComponentProps {
  // Content
  text?: string;
  src?: string;
  alt?: string;

  // Typography
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';

  // Spacing
  padding?: number | string;
  margin?: number | string;
  gap?: number;

  // Layout
  width?: number | string;
  height?: number | string;
  display?: string;
  flexDirection?: 'row' | 'column';
  alignItems?: string;
  justifyContent?: string;

  // Appearance
  backgroundColor?: string;
  borderRadius?: number;
  border?: string;
  boxShadow?: string;
}

export interface ComponentDesign {
  id: string;
  name: string;
  description?: string;
  root: ComponentNode;
  createdAt: Date;
  updatedAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
