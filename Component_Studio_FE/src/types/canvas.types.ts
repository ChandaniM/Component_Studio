// Types for the drag-and-drop canvas system

export type ElementType = 
  | 'div' 
  | 'input' 
  | 'button' 
  | 'text' 
  | 'image' 
  | 'container' 
  | 'stack';

export interface ElementStyles {
  // Spacing
  padding: string;
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;
  margin: string;
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
  gap: string;
  
  // Layout
  display: 'block' | 'flex' | 'grid' | 'inline' | 'inline-block';
  flexDirection: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  flexWrap: 'nowrap' | 'wrap' | 'wrap-reverse';
  
  // Grid specific
  gridTemplateColumns: string;
  gridTemplateRows: string;
  gridGap: string;
  gridColumnGap: string;
  gridRowGap: string;
  justifyItems: 'start' | 'end' | 'center' | 'stretch';
  alignContent: 'start' | 'end' | 'center' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly';
  
  // Sizing
  width: string;
  height: string;
  minWidth: string;
  minHeight: string;
  maxWidth: string;
  maxHeight: string;
  
  // Colors
  backgroundColor: string;
  color: string;
  borderColor: string;
  
  // Border
  borderWidth: string;
  borderStyle: 'none' | 'solid' | 'dashed' | 'dotted';
  borderRadius: string;
  
  // Typography
  fontSize: string;
  fontWeight: string;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  lineHeight: string;
  
  // Position
  position: 'static' | 'relative' | 'absolute';
  top: string;
  left: string;
}

export interface ElementProps {
  // Input specific
  placeholder?: string;
  inputType?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  
  // Button specific
  buttonText?: string;
  
  // Text specific
  textContent?: string;
  
  // Image specific
  src?: string;
  alt?: string;
}

export interface CanvasElement {
  id: string;
  type: ElementType;
  name: string;
  styles: Partial<ElementStyles>;
  props: ElementProps;
  children: CanvasElement[];
  parentId: string | null;
}

export interface DragItem {
  type: ElementType;
  isNew: boolean;
  elementId?: string; // For reordering existing elements
}

export interface CanvasState {
  elements: CanvasElement[];
  selectedElementId: string | null;
  hoveredElementId: string | null;
  dragOverElementId: string | null;
  clipboard: CanvasElement | null;
}

// Default styles for new elements
export const DEFAULT_STYLES: Partial<ElementStyles> = {
  padding: '0px',
  margin: '0px',
  display: 'block',
  backgroundColor: 'transparent',
  color: '#1f2937',
  borderWidth: '0px',
  borderStyle: 'none',
  borderRadius: '0px',
  position: 'relative',
  top: '0px',
  left: '0px',
};

export const ELEMENT_DEFAULTS: Record<ElementType, { styles: Partial<ElementStyles>; props: ElementProps }> = {
  div: {
    styles: {
      ...DEFAULT_STYLES,
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '16px',
      minHeight: '100px',
      backgroundColor: '#f9fafb',
      borderWidth: '1px',
      borderStyle: 'dashed',
      borderColor: '#d1d5db',
      borderRadius: '8px',
    },
    props: {},
  },
  container: {
    styles: {
      ...DEFAULT_STYLES,
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '20px',
      minHeight: '120px',
      backgroundColor: '#ffffff',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#e5e7eb',
      borderRadius: '12px',
    },
    props: {},
  },
  stack: {
    styles: {
      ...DEFAULT_STYLES,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      padding: '0px',
    },
    props: {},
  },
  input: {
    styles: {
      ...DEFAULT_STYLES,
      width: '100%',
      height: '40px',
      padding: '8px 12px',
      fontSize: '14px',
      backgroundColor: '#ffffff',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#d1d5db',
      borderRadius: '6px',
      color: '#1f2937',
    },
    props: {
      placeholder: 'Enter text...',
      inputType: 'text',
    },
  },
  button: {
    styles: {
      ...DEFAULT_STYLES,
      display: 'inline-block',
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: '500',
      backgroundColor: '#3b82f6',
      color: '#ffffff',
      borderWidth: '0px',
      borderStyle: 'none',
      borderRadius: '8px',
      textAlign: 'center',
    },
    props: {
      buttonText: 'Button',
    },
  },
  text: {
    styles: {
      ...DEFAULT_STYLES,
      fontSize: '14px',
      lineHeight: '1.5',
      color: '#374151',
    },
    props: {
      textContent: 'Text content',
    },
  },
  image: {
    styles: {
      ...DEFAULT_STYLES,
      width: '100%',
      height: '150px',
      backgroundColor: '#e5e7eb',
      borderRadius: '8px',
    },
    props: {
      src: '',
      alt: 'Image',
    },
  },
};
