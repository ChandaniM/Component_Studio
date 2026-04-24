import { DragEvent, MouseEvent, CSSProperties, useRef, useState, useEffect, useCallback } from 'react';
import type { CanvasElement as CanvasElementType, ElementType } from '../../types/canvas.types';
import { useCanvas } from '../../store/canvasStore';
import './CanvasElement.scss';

interface CanvasElementProps {
  element: CanvasElementType;
  depth?: number;
}

type ResizeHandle = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const CanvasElement = ({ element, depth = 0 }: CanvasElementProps) => {
  const {
    selectedElementId,
    hoveredElementId,
    dragOverElementId,
    selectElement,
    setHoveredElement,
    setDragOverElement,
    addElement,
    moveElement,
    updateElementStyles,
    getElementById,
    getRootElementId,
  } = useCanvas();

  const elementRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
  const [initialPos, setInitialPos] = useState({ top: 0, left: 0 });
  const [dropPosition, setDropPosition] = useState<'before' | 'after' | null>(null);

  const isSelected = selectedElementId === element.id;
  const isHovered = hoveredElementId === element.id;
  const isDragOver = dragOverElementId === element.id;

  // Parse pixel value to number
  const parsePixelValue = (value: string | undefined): number => {
    if (!value) return 0;
    return parseInt(value.replace('px', ''), 10) || 0;
  };

  // Build inline styles from element.styles
  const buildStyles = (): CSSProperties => {
    const s = element.styles;
    const styles: CSSProperties = {};

    // Always add box-sizing to prevent overflow
    styles.boxSizing = 'border-box';

    // Spacing
    if (s.padding) styles.padding = s.padding;
    if (s.paddingTop) styles.paddingTop = s.paddingTop;
    if (s.paddingRight) styles.paddingRight = s.paddingRight;
    if (s.paddingBottom) styles.paddingBottom = s.paddingBottom;
    if (s.paddingLeft) styles.paddingLeft = s.paddingLeft;
    if (s.margin) styles.margin = s.margin;
    if (s.marginTop) styles.marginTop = s.marginTop;
    if (s.marginRight) styles.marginRight = s.marginRight;
    if (s.marginBottom) styles.marginBottom = s.marginBottom;
    if (s.marginLeft) styles.marginLeft = s.marginLeft;
    if (s.gap) styles.gap = s.gap;

    // Layout
    if (s.display) styles.display = s.display;
    
    // Flexbox
    if (s.flexDirection) styles.flexDirection = s.flexDirection;
    if (s.justifyContent) styles.justifyContent = s.justifyContent;
    if (s.alignItems) styles.alignItems = s.alignItems;
    if (s.flexWrap) styles.flexWrap = s.flexWrap;
    
    // Grid
    if (s.gridTemplateColumns) styles.gridTemplateColumns = s.gridTemplateColumns;
    if (s.gridTemplateRows) styles.gridTemplateRows = s.gridTemplateRows;
    if (s.gridColumnGap) styles.columnGap = s.gridColumnGap;
    if (s.gridRowGap) styles.rowGap = s.gridRowGap;
    if (s.justifyItems) styles.justifyItems = s.justifyItems;
    if (s.alignContent) styles.alignContent = s.alignContent;

    // Sizing
    if (s.width) styles.width = s.width;
    if (s.height) styles.height = s.height;
    if (s.minWidth) styles.minWidth = s.minWidth;
    if (s.minHeight) styles.minHeight = s.minHeight;
    if (s.maxWidth) styles.maxWidth = s.maxWidth;
    if (s.maxHeight) styles.maxHeight = s.maxHeight;

    // Colors
    if (s.backgroundColor) styles.backgroundColor = s.backgroundColor;
    if (s.color) styles.color = s.color;

    // Border
    if (s.borderWidth && s.borderStyle && s.borderStyle !== 'none') {
      styles.borderWidth = s.borderWidth;
      styles.borderStyle = s.borderStyle;
      styles.borderColor = s.borderColor || '#e5e7eb';
    }
    if (s.borderRadius) styles.borderRadius = s.borderRadius;

    // Typography
    if (s.fontSize) styles.fontSize = s.fontSize;
    if (s.fontWeight) styles.fontWeight = s.fontWeight;
    if (s.textAlign) styles.textAlign = s.textAlign;
    if (s.lineHeight) styles.lineHeight = s.lineHeight;

    // Position
    if (s.position) styles.position = s.position;
    if (s.top && s.top !== '0px') styles.top = s.top;
    if (s.left && s.left !== '0px') styles.left = s.left;

    return styles;
  };

  // Handle resize start
  const handleResizeStart = (e: MouseEvent, handle: ResizeHandle) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!elementRef.current) return;
    
    const rect = elementRef.current.getBoundingClientRect();
    setIsResizing(true);
    setResizeHandle(handle);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialSize({ width: rect.width, height: rect.height });
    setInitialPos({ 
      top: parsePixelValue(element.styles.top), 
      left: parsePixelValue(element.styles.left) 
    });
  };

  // Handle drag/move start - when moving a child, move the root parent instead
  const handleMoveStart = (e: MouseEvent) => {
    if (!isSelected || isResizing) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    // Get the root element to move
    const rootId = getRootElementId(element.id);
    const rootElement = getElementById(rootId);
    
    if (!rootElement) return;
    
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialPos({ 
      top: parsePixelValue(rootElement.styles.top), 
      left: parsePixelValue(rootElement.styles.left) 
    });
  };

  // Get parent container boundaries
  const getParentBounds = (): { width: number; height: number } | null => {
    if (!elementRef.current?.parentElement) return null;
    
    const parent = elementRef.current.parentElement;
    const parentStyles = window.getComputedStyle(parent);
    const parentPaddingLeft = parseFloat(parentStyles.paddingLeft);
    const parentPaddingRight = parseFloat(parentStyles.paddingRight);
    const parentPaddingTop = parseFloat(parentStyles.paddingTop);
    const parentPaddingBottom = parseFloat(parentStyles.paddingBottom);
    
    return {
      width: parent.clientWidth - parentPaddingLeft - parentPaddingRight,
      height: parent.clientHeight - parentPaddingTop - parentPaddingBottom,
    };
  };

  // Handle mouse move for resize/drag
  const handleMouseMove = useCallback((e: globalThis.MouseEvent) => {
    if (!isResizing && !isDragging) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    const parentBounds = getParentBounds();

    if (isResizing && resizeHandle) {
      let newWidth = initialSize.width;
      let newHeight = initialSize.height;
      let newTop = initialPos.top;
      let newLeft = initialPos.left;

      // Handle horizontal resize
      if (resizeHandle.includes('e')) {
        newWidth = Math.max(50, initialSize.width + deltaX);
        // Constrain width to parent bounds
        if (parentBounds) {
          newWidth = Math.min(newWidth, parentBounds.width - newLeft);
        }
      }
      if (resizeHandle.includes('w')) {
        const widthChange = initialSize.width - deltaX;
        newWidth = Math.max(50, widthChange);
        newLeft = initialPos.left + (initialSize.width - newWidth);
        // Prevent going outside left boundary
        if (newLeft < 0) {
          newWidth = newWidth + newLeft;
          newLeft = 0;
        }
      }

      // Handle vertical resize
      if (resizeHandle.includes('s')) {
        newHeight = Math.max(30, initialSize.height + deltaY);
        // Constrain height to parent bounds
        if (parentBounds) {
          newHeight = Math.min(newHeight, parentBounds.height - newTop);
        }
      }
      if (resizeHandle.includes('n')) {
        const heightChange = initialSize.height - deltaY;
        newHeight = Math.max(30, heightChange);
        newTop = initialPos.top + (initialSize.height - newHeight);
        // Prevent going outside top boundary
        if (newTop < 0) {
          newHeight = newHeight + newTop;
          newTop = 0;
        }
      }

      updateElementStyles(element.id, {
        width: `${newWidth}px`,
        height: `${newHeight}px`,
        top: `${newTop}px`,
        left: `${newLeft}px`,
      });
    }

    if (isDragging) {
      const newTop = initialPos.top + deltaY;
      const newLeft = initialPos.left + deltaX;

      // Move the root element (entire component with its children)
      const rootId = getRootElementId(element.id);

      updateElementStyles(rootId, {
        top: `${newTop}px`,
        left: `${newLeft}px`,
        position: 'relative',
      });
    }
  }, [isResizing, isDragging, resizeHandle, dragStart, initialSize, initialPos, element.id, updateElementStyles, getRootElementId]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    setIsDragging(false);
    setResizeHandle(null);
  }, []);

  // Add/remove global mouse listeners
  useEffect(() => {
    if (isResizing || isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = isResizing 
        ? (resizeHandle?.includes('e') || resizeHandle?.includes('w') ? 'ew-resize' : 'ns-resize')
        : 'move';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, isDragging, handleMouseMove, handleMouseUp, resizeHandle]);

  // Handle click to select
  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    selectElement(element.id);
  };

  // Handle mouse enter/leave for hover
  const handleMouseEnter = (e: MouseEvent) => {
    e.stopPropagation();
    setHoveredElement(element.id);
  };

  const handleMouseLeave = () => {
    setHoveredElement(null);
  };

  // Handle drag start for reordering
  const handleDragStart = (e: DragEvent) => {
    e.stopPropagation();
    
    const dragData = {
      isNew: false,
      elementId: element.id,
      parentId: element.parentId,
      type: element.type,
    };
    
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
  };

  // Drag and drop handlers
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const data = e.dataTransfer.types.includes('application/json');
    if (!data) return;
    
    // For container elements, allow dropping inside
    if (isContainerElement(element.type)) {
      setDragOverElement(element.id);
      setDropPosition(null);
      return;
    }
    
    // For non-container elements, determine drop position (before/after)
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      
      if (e.clientY < midY) {
        setDropPosition('before');
      } else {
        setDropPosition('after');
      }
      setDragOverElement(element.id);
    }
  };

  const handleDragLeave = (e: DragEvent) => {
    e.stopPropagation();
    setDragOverElement(null);
    setDropPosition(null);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const currentDropPosition = dropPosition;
    setDragOverElement(null);
    setDropPosition(null);

    const data = e.dataTransfer.getData('application/json');
    if (!data) return;

    try {
      const dragData = JSON.parse(data);
      
      if (dragData.isNew) {
        // Adding new element from sidebar
        if (isContainerElement(element.type)) {
          addElement(dragData.type as ElementType, element.id);
        } else if (element.parentId) {
          // Add to same parent, at position relative to this element
          const parent = getElementById(element.parentId);
          if (parent) {
            const siblingIndex = parent.children.findIndex(c => c.id === element.id);
            const insertIndex = currentDropPosition === 'after' ? siblingIndex + 1 : siblingIndex;
            addElement(dragData.type as ElementType, element.parentId, insertIndex);
          }
        }
      } else if (dragData.elementId && dragData.elementId !== element.id) {
        // Reordering existing element
        if (isContainerElement(element.type)) {
          // Drop into container
          moveElement(dragData.elementId, element.id);
        } else if (element.parentId) {
          // Reorder within same parent or move to new parent
          const parent = getElementById(element.parentId);
          if (parent) {
            const siblingIndex = parent.children.findIndex(c => c.id === element.id);
            const insertIndex = currentDropPosition === 'after' ? siblingIndex + 1 : siblingIndex;
            moveElement(dragData.elementId, element.parentId, insertIndex);
          }
        } else {
          // Root level reordering - just move to same parent (null)
          moveElement(dragData.elementId, element.parentId);
        }
      }
    } catch (err) {
      console.error('Drop error:', err);
    }
  };

  // Check if element can contain children
  const isContainerElement = (type: ElementType): boolean => {
    return ['div', 'container', 'stack'].includes(type);
  };

  // Render element content based on type
  const renderContent = () => {
    const contentStyles = buildContentStyles();
    
    switch (element.type) {
      case 'input':
        return (
          <input
            type={element.props.inputType || 'text'}
            placeholder={element.props.placeholder || 'Enter text...'}
            className="canvas-element__input"
            style={contentStyles}
            onClick={(e) => e.stopPropagation()}
            readOnly
          />
        );

      case 'button':
        return (
          <button
            className="canvas-element__button"
            style={contentStyles}
            onClick={(e) => e.stopPropagation()}
          >
            {element.props.buttonText || 'Button'}
          </button>
        );

      case 'text':
        return (
          <p className="canvas-element__text" style={contentStyles}>
            {element.props.textContent || 'Text content'}
          </p>
        );

      case 'image':
        return (
          <div className="canvas-element__image" style={contentStyles}>
            {element.props.src ? (
              <img src={element.props.src} alt={element.props.alt || 'Image'} />
            ) : (
              <span className="canvas-element__image-placeholder">
                🖼 Image
              </span>
            )}
          </div>
        );

      case 'div':
      case 'container':
      case 'stack':
        return (
          <>
            {element.children.length === 0 && (
              <div className="canvas-element__drop-hint">
                Drop elements here
              </div>
            )}
            {element.children.map((child) => (
              <CanvasElement key={child.id} element={child} depth={depth + 1} />
            ))}
          </>
        );

      default:
        return null;
    }
  };

  // For container elements, apply all styles to the wrapper
  // For non-container elements, apply sizing/position to wrapper, appearance to content
  const isContainer = isContainerElement(element.type);
  
  // Build styles for inner content (without sizing for non-containers)
  const buildContentStyles = (): CSSProperties => {
    if (isContainer) {
      return {}; // Container children render separately
    }
    const s = element.styles;
    const styles: CSSProperties = {
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
    };
    
    // Only appearance styles, not sizing/position (those go on wrapper)
    if (s.padding) styles.padding = s.padding;
    if (s.paddingTop) styles.paddingTop = s.paddingTop;
    if (s.paddingRight) styles.paddingRight = s.paddingRight;
    if (s.paddingBottom) styles.paddingBottom = s.paddingBottom;
    if (s.paddingLeft) styles.paddingLeft = s.paddingLeft;
    if (s.backgroundColor) styles.backgroundColor = s.backgroundColor;
    if (s.color) styles.color = s.color;
    if (s.borderWidth && s.borderStyle && s.borderStyle !== 'none') {
      styles.borderWidth = s.borderWidth;
      styles.borderStyle = s.borderStyle;
      styles.borderColor = s.borderColor || '#e5e7eb';
    }
    if (s.borderRadius) styles.borderRadius = s.borderRadius;
    if (s.fontSize) styles.fontSize = s.fontSize;
    if (s.fontWeight) styles.fontWeight = s.fontWeight;
    if (s.textAlign) styles.textAlign = s.textAlign;
    if (s.lineHeight) styles.lineHeight = s.lineHeight;
    
    return styles;
  };
  
  const buildWrapperStyles = (): CSSProperties => {
    if (isContainer) {
      return buildStyles();
    }
    // For non-containers, wrapper needs sizing and position for selection border to work
    const s = element.styles;
    const styles: CSSProperties = {};
    if (s.width) styles.width = s.width;
    if (s.height) styles.height = s.height;
    if (s.minWidth) styles.minWidth = s.minWidth;
    if (s.minHeight) styles.minHeight = s.minHeight;
    if (s.maxWidth) styles.maxWidth = s.maxWidth;
    if (s.maxHeight) styles.maxHeight = s.maxHeight;
    if (s.position) styles.position = s.position;
    if (s.top && s.top !== '0px') styles.top = s.top;
    if (s.left && s.left !== '0px') styles.left = s.left;
    if (s.margin) styles.margin = s.margin;
    if (s.marginTop) styles.marginTop = s.marginTop;
    if (s.marginRight) styles.marginRight = s.marginRight;
    if (s.marginBottom) styles.marginBottom = s.marginBottom;
    if (s.marginLeft) styles.marginLeft = s.marginLeft;
    return styles;
  };
  
  const wrapperStyles = buildWrapperStyles();

  // Resize handles for selected elements
  const renderResizeHandles = () => {
    if (!isSelected) return null;
    
    const handles: ResizeHandle[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];
    
    return (
      <div className="canvas-element__resize-handles">
        {handles.map((handle) => (
          <div
            key={handle}
            className={`canvas-element__resize-handle canvas-element__resize-handle--${handle}`}
            onMouseDown={(e) => handleResizeStart(e, handle)}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      ref={elementRef}
      className={`canvas-element canvas-element--${element.type} ${isSelected ? 'canvas-element--selected' : ''} ${isHovered && !isSelected ? 'canvas-element--hovered' : ''} ${isDragOver ? 'canvas-element--drag-over' : ''} ${isDragging ? 'canvas-element--dragging' : ''} ${isResizing ? 'canvas-element--resizing' : ''} ${dropPosition === 'before' ? 'canvas-element--drop-before' : ''} ${dropPosition === 'after' ? 'canvas-element--drop-after' : ''}`}
      style={wrapperStyles}
      draggable={!isResizing}
      onClick={handleClick}
      onMouseDown={handleMoveStart}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-element-id={element.id}
      data-element-type={element.type}
      data-depth={depth}
    >
      {/* Element label */}
      {(isSelected || isHovered) && (
        <div className="canvas-element__label">
          {element.name}
        </div>
      )}
      
      {renderContent()}
      
      {/* Resize handles */}
      {renderResizeHandles()}
    </div>
  );
};

export default CanvasElement;
