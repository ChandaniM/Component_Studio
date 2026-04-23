import './Sidebar.scss';

interface SidebarProps {
  mode: 'landing' | 'manual' | 'guided';
}

interface SidebarItem {
  id: string;
  icon: string;
  label: string;
  type: 'card' | 'text' | 'image' | 'button';
}

const componentPalette: SidebarItem[] = [
  { id: 'card', icon: '▢', label: 'Card', type: 'card' },
  { id: 'text', icon: 'T', label: 'Text', type: 'text' },
  { id: 'image', icon: '🖼', label: 'Image', type: 'image' },
  { id: 'button', icon: '⬚', label: 'Button', type: 'button' },
];

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

  // Manual Builder - Component palette
  if (mode === 'manual') {
    return (
      <aside className="sidebar">
        <div className="sidebar__header">
          <h2 className="sidebar__title">Components</h2>
          <p className="sidebar__subtitle">Drag to canvas</p>
        </div>

        <div className="sidebar__content">
          <div className="sidebar__section">
            <h3 className="sidebar__section-title">Basic</h3>
            <div className="sidebar__components">
              {componentPalette.map((item) => (
                <div key={item.id} className="sidebar__component" draggable>
                  <span className="sidebar__component-icon">{item.icon}</span>
                  <span className="sidebar__component-label">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar__section">
            <h3 className="sidebar__section-title">Layout</h3>
            <div className="sidebar__components">
              <div className="sidebar__component" draggable>
                <span className="sidebar__component-icon">⊞</span>
                <span className="sidebar__component-label">Container</span>
              </div>
              <div className="sidebar__component" draggable>
                <span className="sidebar__component-icon">☰</span>
                <span className="sidebar__component-label">Stack</span>
              </div>
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
