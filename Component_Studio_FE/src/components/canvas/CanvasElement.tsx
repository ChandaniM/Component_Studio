import { DragEvent, MouseEvent, CSSProperties } from 'react';
import type { CanvasElement as CanvasElementType, ElementType } from '../../types/canvas.types';
import { useCanvas } from '../../store/canvasStore';
import './CanvasElement.scss';

interface CanvasElementProps {
  element: CanvasElementType;
  depth?: number;
}

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
  } = useCanvas();

  const isSelected = selectedElementId === element.id;
  const isHovered = hoveredElementId === element.id;
  const isDragOver = dragOverElementId === element.id;

  // Build inline styles from element.styles
  const buildStyles = (): CSSProperties => {
    const s = element.styles;
    const styles: CSSProperties = {};

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
    if (s.flexDirection) styles.flexDirection = s.flexDirection;
    if (s.justifyContent) styles.justifyContent = s.justifyContent;
    if (s.alignItems) styles.alignItems = s.alignItems;
    if (s.flexWrap) styles.flexWrap = s.flexWrap;

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

    return styles;
  };

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

  // Drag and drop handlers
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only allow dropping into container-like elements
    if (isContainerElement(element.type)) {
      setDragOverElement(element.id);
    }
  };

  const handleDragLeave = (e: DragEvent) => {
    e.stopPropagation();
    setDragOverElement(null);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverElement(null);

    const data = e.dataTransfer.getData('application/json');
    if (!data) return;

    try {
      const dragData = JSON.parse(data);
      
      if (dragData.isNew) {
        // Adding new element from sidebar
        addElement(dragData.type as ElementType, element.id);
      } else if (dragData.elementId) {
        // Moving existing element
        moveElement(dragData.elementId, element.id);
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
    switch (element.type) {
      case 'input':
        return (
          <input
            type={element.props.inputType || 'text'}
            placeholder={element.props.placeholder || 'Enter text...'}
            className="canvas-element__input"
            style={buildStyles()}
            onClick={(e) => e.stopPropagation()}
            readOnly
          />
        );

      case 'button':
        return (
          <button
            className="canvas-element__button"
            style={buildStyles()}
            onClick={(e) => e.stopPropagation()}
          >
            {element.props.buttonText || 'Button'}
          </button>
        );

      case 'text':
        return (
          <p className="canvas-element__text" style={buildStyles()}>
            {element.props.textContent || 'Text content'}
          </p>
        );

      case 'image':
        return (
          <div className="canvas-element__image" style={buildStyles()}>
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

  // For container elements, apply styles to the wrapper
  // For non-container elements, styles are applied directly to the content
  const isContainer = isContainerElement(element.type);
  const wrapperStyles = isContainer ? buildStyles() : {};

  return (
    <div
      className={`canvas-element canvas-element--${element.type} ${isSelected ? 'canvas-element--selected' : ''} ${isHovered && !isSelected ? 'canvas-element--hovered' : ''} ${isDragOver ? 'canvas-element--drag-over' : ''}`}
      style={wrapperStyles}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
    </div>
  );
};

export default CanvasElement;
