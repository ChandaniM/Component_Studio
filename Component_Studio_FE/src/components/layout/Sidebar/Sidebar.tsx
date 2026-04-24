import { DragEvent } from 'react';
import type { ElementType } from '../../../types/canvas.types';
import './Sidebar.scss';

interface SidebarProps {
  mode: 'landing' | 'manual' | 'guided';
}

interface SidebarItem {
  id: string;
  icon: string;
  label: string;
  type: ElementType;
  description: string;
}

const basicComponents: SidebarItem[] = [
  { id: 'input', icon: '⎕', label: 'Input', type: 'input', description: 'Text input field' },
  { id: 'button', icon: '▣', label: 'Button', type: 'button', description: 'Clickable button' },
  { id: 'text', icon: 'T', label: 'Text', type: 'text', description: 'Text paragraph' },
  { id: 'image', icon: '🖼', label: 'Image', type: 'image', description: 'Image placeholder' },
];

const layoutComponents: SidebarItem[] = [
  { id: 'div', icon: '▢', label: 'Div', type: 'div', description: 'Flexible container' },
  { id: 'container', icon: '⊞', label: 'Container', type: 'container', description: 'Card-like container' },
  { id: 'stack', icon: '☰', label: 'Stack', type: 'stack', description: 'Vertical stack layout' },
];

// Draggable component item
const DraggableComponent = ({ item }: { item: SidebarItem }) => {
  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    const dragData = {
      type: item.type,
      isNew: true,
    };
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'copy';
    
    // Add drag styling
    const target = e.currentTarget;
    target.classList.add('sidebar__component--dragging');
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('sidebar__component--dragging');
  };

  return (
    <div
      className="sidebar__component"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      title={item.description}
    >
      <span className="sidebar__component-icon">{item.icon}</span>
      <span className="sidebar__component-label">{item.label}</span>
    </div>
  );
};

const Sidebar = ({ mode }: SidebarProps) => {
  // Landing page - minimal sidebar
  if (mode === 'landing') {
    return (
      <aside className="sidebar sidebar--minimal">
        <div className="sidebar__header">
          <h2 className="sidebar__title">Component Studio</h2>
          <p className="sidebar__subtitle">Visual UI Builder</p>
        </div>

        <div className="sidebar__content">
          <div className="sidebar__info-card">
            <span className="sidebar__info-icon">✨</span>
            <p className="sidebar__info-text">
              Select a builder mode to start creating your component
            </p>
          </div>
        </div>

        <div className="sidebar__footer">
          <div className="sidebar__help">
            <span className="sidebar__help-icon">?</span>
            <span className="sidebar__help-text">Need help?</span>
          </div>
        </div>
      </aside>
    );
  }

  // Manual Builder - Component palette with drag support
  if (mode === 'manual') {
    return (
      <aside className="sidebar">
        <div className="sidebar__header">
          <h2 className="sidebar__title">Components</h2>
          <p className="sidebar__subtitle">Drag to canvas</p>
        </div>

        <div className="sidebar__content">
          <div className="sidebar__section">
            <h3 className="sidebar__section-title">Layout</h3>
            <div className="sidebar__components">
              {layoutComponents.map((item) => (
                <DraggableComponent key={item.id} item={item} />
              ))}
            </div>
          </div>

          <div className="sidebar__section">
            <h3 className="sidebar__section-title">Form Elements</h3>
            <div className="sidebar__components">
              {basicComponents.filter(c => c.type === 'input' || c.type === 'button').map((item) => (
                <DraggableComponent key={item.id} item={item} />
              ))}
            </div>
          </div>

          <div className="sidebar__section">
            <h3 className="sidebar__section-title">Content</h3>
            <div className="sidebar__components">
              {basicComponents.filter(c => c.type === 'text' || c.type === 'image').map((item) => (
                <DraggableComponent key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>

        <div className="sidebar__footer">
          <div className="sidebar__tip">
            <span className="sidebar__tip-icon">💡</span>
            <span className="sidebar__tip-text">Drag elements onto the canvas or into containers</span>
          </div>
        </div>
      </aside>
    );
  }

  // Guided Builder - Hidden (questions shown in main canvas)
  return (
    <aside className="sidebar sidebar--minimal">
      <div className="sidebar__header">
        <h2 className="sidebar__title">Guided Builder</h2>
        <p className="sidebar__subtitle">Follow the steps</p>
      </div>

      <div className="sidebar__content">
        <div className="sidebar__info-card">
          <span className="sidebar__info-icon">💬</span>
          <p className="sidebar__info-text">
            Answer the questions in the main area to configure your component
          </p>
        </div>

        <div className="sidebar__progress">
          <div className="sidebar__progress-item sidebar__progress-item--active">
            <span className="sidebar__progress-number">1</span>
            <span className="sidebar__progress-label">Component Type</span>
          </div>
          <div className="sidebar__progress-item">
            <span className="sidebar__progress-number">2</span>
            <span className="sidebar__progress-label">Content</span>
          </div>
          <div className="sidebar__progress-item">
            <span className="sidebar__progress-number">3</span>
            <span className="sidebar__progress-label">Styling</span>
          </div>
          <div className="sidebar__progress-item">
            <span className="sidebar__progress-number">4</span>
            <span className="sidebar__progress-label">Generate</span>
          </div>
        </div>
      </div>

      <div className="sidebar__footer">
        <div className="sidebar__help">
          <span className="sidebar__help-icon">?</span>
          <span className="sidebar__help-text">Need help?</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
