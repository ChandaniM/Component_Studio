import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { 
  CanvasElement, 
  CanvasState, 
  ElementType, 
  ElementStyles,
  ElementProps 
} from '../types/canvas.types';
import { ELEMENT_DEFAULTS } from '../types/canvas.types';

// Generate unique IDs
const generateId = () => `el_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

interface CanvasContextType extends CanvasState {
  // Element operations
  addElement: (type: ElementType, parentId?: string | null, index?: number) => CanvasElement;
  removeElement: (elementId: string) => void;
  moveElement: (elementId: string, newParentId: string | null, index?: number) => void;
  duplicateElement: (elementId: string) => void;
  
  // Selection
  selectElement: (elementId: string | null) => void;
  setHoveredElement: (elementId: string | null) => void;
  setDragOverElement: (elementId: string | null) => void;
  
  // Style updates
  updateElementStyles: (elementId: string, styles: Partial<ElementStyles>) => void;
  updateElementProps: (elementId: string, props: Partial<ElementProps>) => void;
  updateElementName: (elementId: string, name: string) => void;
  
  // Clipboard
  copyElement: (elementId: string) => void;
  pasteElement: (parentId?: string | null) => void;
  
  // Utility
  getElementById: (elementId: string) => CanvasElement | null;
  getSelectedElement: () => CanvasElement | null;
  clearCanvas: () => void;
}

const CanvasContext = createContext<CanvasContextType | null>(null);

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return context;
};

interface CanvasProviderProps {
  children: ReactNode;
}

export const CanvasProvider = ({ children }: CanvasProviderProps) => {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
  const [dragOverElementId, setDragOverElementId] = useState<string | null>(null);
  const [clipboard, setClipboard] = useState<CanvasElement | null>(null);

  // Helper: Find element by ID recursively
  const findElement = useCallback((elements: CanvasElement[], id: string): CanvasElement | null => {
    for (const element of elements) {
      if (element.id === id) return element;
      const found = findElement(element.children, id);
      if (found) return found;
    }
    return null;
  }, []);

  // Helper: Update element recursively
  const updateElementInTree = useCallback((
    elements: CanvasElement[], 
    id: string, 
    updater: (el: CanvasElement) => CanvasElement
  ): CanvasElement[] => {
    return elements.map(element => {
      if (element.id === id) {
        return updater(element);
      }
      if (element.children.length > 0) {
        return {
          ...element,
          children: updateElementInTree(element.children, id, updater)
        };
      }
      return element;
    });
  }, []);

  // Helper: Remove element recursively
  const removeElementFromTree = useCallback((
    elements: CanvasElement[], 
    id: string
  ): CanvasElement[] => {
    return elements
      .filter(element => element.id !== id)
      .map(element => ({
        ...element,
        children: removeElementFromTree(element.children, id)
      }));
  }, []);

  // Helper: Add element to parent
  const addElementToParent = useCallback((
    elements: CanvasElement[],
    parentId: string | null,
    newElement: CanvasElement,
    index?: number
  ): CanvasElement[] => {
    if (parentId === null) {
      if (index !== undefined) {
        const newElements = [...elements];
        newElements.splice(index, 0, newElement);
        return newElements;
      }
      return [...elements, newElement];
    }

    return elements.map(element => {
      if (element.id === parentId) {
        const newChildren = [...element.children];
        if (index !== undefined) {
          newChildren.splice(index, 0, newElement);
        } else {
          newChildren.push(newElement);
        }
        return { ...element, children: newChildren };
      }
      if (element.children.length > 0) {
        return {
          ...element,
          children: addElementToParent(element.children, parentId, newElement, index)
        };
      }
      return element;
    });
  }, []);

  // Add a new element
  const addElement = useCallback((type: ElementType, parentId: string | null = null, index?: number): CanvasElement => {
    const defaults = ELEMENT_DEFAULTS[type];
    const newElement: CanvasElement = {
      id: generateId(),
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
      styles: { ...defaults.styles },
      props: { ...defaults.props },
      children: [],
      parentId,
    };

    setElements(prev => addElementToParent(prev, parentId, newElement, index));
    setSelectedElementId(newElement.id);
    
    return newElement;
  }, [addElementToParent]);

  // Remove element
  const removeElement = useCallback((elementId: string) => {
    setElements(prev => removeElementFromTree(prev, elementId));
    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }
  }, [removeElementFromTree, selectedElementId]);

  // Move element to new parent
  const moveElement = useCallback((elementId: string, newParentId: string | null, index?: number) => {
    setElements(prev => {
      const element = findElement(prev, elementId);
      if (!element) return prev;

      // Prevent moving element into itself or its descendants
      if (newParentId) {
        let parent = findElement(prev, newParentId);
        while (parent) {
          if (parent.id === elementId) return prev;
          parent = parent.parentId ? findElement(prev, parent.parentId) : null;
        }
      }

      // Remove from current position
      const withoutElement = removeElementFromTree(prev, elementId);
      
      // Add to new position
      const movedElement = { ...element, parentId: newParentId };
      return addElementToParent(withoutElement, newParentId, movedElement, index);
    });
  }, [findElement, removeElementFromTree, addElementToParent]);

  // Duplicate element
  const duplicateElement = useCallback((elementId: string) => {
    const element = findElement(elements, elementId);
    if (!element) return;

    const duplicateWithNewIds = (el: CanvasElement, parentId: string | null): CanvasElement => {
      const newId = generateId();
      return {
        ...el,
        id: newId,
        name: `${el.name} (copy)`,
        parentId,
        children: el.children.map(child => duplicateWithNewIds(child, newId))
      };
    };

    const duplicated = duplicateWithNewIds(element, element.parentId);
    setElements(prev => addElementToParent(prev, element.parentId, duplicated));
    setSelectedElementId(duplicated.id);
  }, [elements, findElement, addElementToParent]);

  // Select element
  const selectElement = useCallback((elementId: string | null) => {
    setSelectedElementId(elementId);
  }, []);

  // Set hovered element
  const setHoveredElement = useCallback((elementId: string | null) => {
    setHoveredElementId(elementId);
  }, []);

  // Set drag over element
  const setDragOverElement = useCallback((elementId: string | null) => {
    setDragOverElementId(elementId);
  }, []);

  // Update element styles
  const updateElementStyles = useCallback((elementId: string, styles: Partial<ElementStyles>) => {
    setElements(prev => updateElementInTree(prev, elementId, (el) => ({
      ...el,
      styles: { ...el.styles, ...styles }
    })));
  }, [updateElementInTree]);

  // Update element props
  const updateElementProps = useCallback((elementId: string, props: Partial<ElementProps>) => {
    setElements(prev => updateElementInTree(prev, elementId, (el) => ({
      ...el,
      props: { ...el.props, ...props }
    })));
  }, [updateElementInTree]);

  // Update element name
  const updateElementName = useCallback((elementId: string, name: string) => {
    setElements(prev => updateElementInTree(prev, elementId, (el) => ({
      ...el,
      name
    })));
  }, [updateElementInTree]);

  // Copy element
  const copyElement = useCallback((elementId: string) => {
    const element = findElement(elements, elementId);
    if (element) {
      setClipboard(element);
    }
  }, [elements, findElement]);

  // Paste element
  const pasteElement = useCallback((parentId: string | null = null) => {
    if (!clipboard) return;

    const pasteWithNewIds = (el: CanvasElement, newParentId: string | null): CanvasElement => {
      const newId = generateId();
      return {
        ...el,
        id: newId,
        parentId: newParentId,
        children: el.children.map(child => pasteWithNewIds(child, newId))
      };
    };

    const pasted = pasteWithNewIds(clipboard, parentId);
    setElements(prev => addElementToParent(prev, parentId, pasted));
    setSelectedElementId(pasted.id);
  }, [clipboard, addElementToParent]);

  // Get element by ID
  const getElementById = useCallback((elementId: string): CanvasElement | null => {
    return findElement(elements, elementId);
  }, [elements, findElement]);

  // Get selected element
  const getSelectedElement = useCallback((): CanvasElement | null => {
    if (!selectedElementId) return null;
    return findElement(elements, selectedElementId);
  }, [elements, selectedElementId, findElement]);

  // Clear canvas
  const clearCanvas = useCallback(() => {
    setElements([]);
    setSelectedElementId(null);
    setClipboard(null);
  }, []);

  const value: CanvasContextType = {
    elements,
    selectedElementId,
    hoveredElementId,
    dragOverElementId,
    clipboard,
    addElement,
    removeElement,
    moveElement,
    duplicateElement,
    selectElement,
    setHoveredElement,
    setDragOverElement,
    updateElementStyles,
    updateElementProps,
    updateElementName,
    copyElement,
    pasteElement,
    getElementById,
    getSelectedElement,
    clearCanvas,
  };

  return (
    <CanvasContext.Provider value={value}>
      {children}
    </CanvasContext.Provider>
  );
};

export default CanvasProvider;
