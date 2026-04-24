import type { CanvasElement, ElementStyles, ElementType } from '../types/canvas.types';

/**
 * Convert canvas elements to HTML string with inline styles
 * Returns only the main content without HTML wrapper
 */
export const exportToHTML = (elements: CanvasElement[]): string => {
  const htmlContent = elements.map(el => generateHTMLElement(el)).join('\n');
  return htmlContent;
};

/**
 * Generate HTML for a single element with inline styles
 */
const generateHTMLElement = (element: CanvasElement, indent: number = 0): string => {
  const indentation = ' '.repeat(indent);
  const childIndent = indent + 2;
  
  // Convert styles to inline CSS
  const inlineStyles = generateInlineStyles(element.styles, element.type);
  
  // Generate element based on type
  switch (element.type) {
    case 'text':
      return `${indentation}<p style="${inlineStyles}">${element.props.textContent || 'Text content'}</p>`;
    
    case 'button':
      return `${indentation}<button style="${inlineStyles}">${element.props.buttonText || 'Button'}</button>`;
    
    case 'input':
      return `${indentation}<input type="${element.props.inputType || 'text'}" placeholder="${element.props.placeholder || ''}" style="${inlineStyles}" />`;
    
    case 'image':
      return `${indentation}<img src="${element.props.src || 'https://via.placeholder.com/150'}" alt="${element.props.alt || 'Image'}" style="${inlineStyles}" />`;
    
    case 'div':
    case 'container':
    case 'stack':
      const hasChildren = element.children.length > 0;
      const childrenHTML = hasChildren 
        ? '\n' + element.children.map(child => generateHTMLElement(child, childIndent)).join('\n') + '\n' + indentation
        : '';
      
      return `${indentation}<div style="${inlineStyles}">${childrenHTML}</div>`;
    
    default:
      return `${indentation}<div style="${inlineStyles}"></div>`;
  }
};

/**
 * Convert ElementStyles object to inline CSS string
 */
const generateInlineStyles = (styles: Partial<ElementStyles>, elementType: ElementType): string => {
  const cssProperties: string[] = [];
  
  // Always add box-sizing to prevent overflow issues
  cssProperties.push('box-sizing: border-box');
  
  // Add overflow hidden for container elements to prevent children from going outside
  if (elementType === 'div' || elementType === 'container' || elementType === 'stack') {
    cssProperties.push('overflow: auto');
  }
  
  // Helper to add CSS property if value exists
  const addProperty = (cssName: string, value: string | undefined) => {
    if (value && value !== '0px' && value !== 'transparent' && value !== '') {
      cssProperties.push(`${cssName}: ${value}`);
    }
  };
  
  // Layout
  if (styles.display) cssProperties.push(`display: ${styles.display}`);
  if (styles.flexDirection && styles.display === 'flex') {
    cssProperties.push(`flex-direction: ${styles.flexDirection}`);
  }
  if (styles.justifyContent && styles.display === 'flex') {
    cssProperties.push(`justify-content: ${styles.justifyContent}`);
  }
  if (styles.alignItems && styles.display === 'flex') {
    cssProperties.push(`align-items: ${styles.alignItems}`);
  }
  if (styles.flexWrap && styles.display === 'flex') {
    cssProperties.push(`flex-wrap: ${styles.flexWrap}`);
  }
  if (styles.gap) addProperty('gap', styles.gap);
  
  // Sizing
  addProperty('width', styles.width);
  addProperty('height', styles.height);
  addProperty('min-width', styles.minWidth);
  addProperty('min-height', styles.minHeight);
  addProperty('max-width', styles.maxWidth);
  addProperty('max-height', styles.maxHeight);
  
  // Spacing - Handle shorthand and individual values
  if (styles.padding) {
    addProperty('padding', styles.padding);
  } else {
    addProperty('padding-top', styles.paddingTop);
    addProperty('padding-right', styles.paddingRight);
    addProperty('padding-bottom', styles.paddingBottom);
    addProperty('padding-left', styles.paddingLeft);
  }
  
  if (styles.margin) {
    addProperty('margin', styles.margin);
  } else {
    addProperty('margin-top', styles.marginTop);
    addProperty('margin-right', styles.marginRight);
    addProperty('margin-bottom', styles.marginBottom);
    addProperty('margin-left', styles.marginLeft);
  }
  
  // Colors
  if (styles.backgroundColor && styles.backgroundColor !== 'transparent') {
    cssProperties.push(`background-color: ${styles.backgroundColor}`);
  }
  if (styles.color) cssProperties.push(`color: ${styles.color}`);
  
  // Border
  if (styles.borderWidth && styles.borderWidth !== '0px') {
    addProperty('border-width', styles.borderWidth);
    if (styles.borderStyle) cssProperties.push(`border-style: ${styles.borderStyle}`);
    if (styles.borderColor) cssProperties.push(`border-color: ${styles.borderColor}`);
  }
  if (styles.borderRadius) addProperty('border-radius', styles.borderRadius);
  
  // Typography
  addProperty('font-size', styles.fontSize);
  addProperty('font-weight', styles.fontWeight);
  if (styles.textAlign) cssProperties.push(`text-align: ${styles.textAlign}`);
  addProperty('line-height', styles.lineHeight);
  
  // Position
  if (styles.position && styles.position !== 'static') {
    cssProperties.push(`position: ${styles.position}`);
    addProperty('top', styles.top);
    addProperty('left', styles.left);
  }
  
  return cssProperties.join('; ');
};

/**
 * Copy HTML to clipboard
 */
export const copyHTMLToClipboard = async (html: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(html);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Download HTML as file
 */
export const downloadHTML = (html: string, filename: string = 'component.html'): void => {
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
