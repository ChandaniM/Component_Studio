import './PropertyPanel.scss';

const PropertyPanel = () => {
  return (
    <aside className="property-panel">
      <div className="property-panel__header">
        <h2 className="property-panel__title">Properties</h2>
        <p className="property-panel__subtitle">Select a component</p>
      </div>

      <div className="property-panel__content">
        <div className="property-panel__empty">
          <div className="property-panel__empty-icon">⚙</div>
          <p className="property-panel__empty-text">
            Select a component to edit its properties
          </p>
        </div>

        {/* Property sections - shown when component is selected */}
        {/* 
        <div className="property-panel__section">
          <h3 className="property-panel__section-title">Content</h3>
          <div className="property-panel__field">
            <label className="property-panel__label">Text</label>
            <input type="text" className="property-panel__input" placeholder="Enter text..." />
          </div>
        </div>

        <div className="property-panel__section">
          <h3 className="property-panel__section-title">Typography</h3>
          <div className="property-panel__row">
            <div className="property-panel__field property-panel__field--half">
              <label className="property-panel__label">Size</label>
              <input type="number" className="property-panel__input" value="16" />
            </div>
            <div className="property-panel__field property-panel__field--half">
              <label className="property-panel__label">Weight</label>
              <select className="property-panel__select">
                <option>Normal</option>
                <option>Medium</option>
                <option>Bold</option>
              </select>
            </div>
          </div>
          <div className="property-panel__field">
            <label className="property-panel__label">Color</label>
            <div className="property-panel__color-input">
              <input type="color" value="#1f2937" />
              <input type="text" className="property-panel__input" value="#1f2937" />
            </div>
          </div>
        </div>

        <div className="property-panel__section">
          <h3 className="property-panel__section-title">Spacing</h3>
          <div className="property-panel__spacing-grid">
            <div className="property-panel__spacing-row">
              <span></span>
              <input type="number" placeholder="0" />
              <span></span>
            </div>
            <div className="property-panel__spacing-row">
              <input type="number" placeholder="0" />
              <div className="property-panel__spacing-center">px</div>
              <input type="number" placeholder="0" />
            </div>
            <div className="property-panel__spacing-row">
              <span></span>
              <input type="number" placeholder="0" />
              <span></span>
            </div>
          </div>
        </div>
        */}
      </div>
    </aside>
  );
};

export default PropertyPanel;
