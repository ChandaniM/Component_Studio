import { useCanvas } from '../../../store/canvasStore';
import type { ElementStyles, ElementProps } from '../../../types/canvas.types';
import './PropertyPanel.scss';

const PropertyPanel = () => {
  const { 
    getSelectedElement, 
    updateElementStyles, 
    updateElementProps, 
    updateElementName,
    removeElement,
    duplicateElement,
    selectedElementId 
  } = useCanvas();

  const selectedElement = getSelectedElement();

  // Helper to parse pixel values
  const parsePixelValue = (value: string | undefined): string => {
    if (!value) return '0';
    return value.replace('px', '');
  };

  // Helper to update a style property
  const handleStyleChange = (property: keyof ElementStyles, value: string) => {
    if (selectedElementId) {
      updateElementStyles(selectedElementId, { [property]: value });
    }
  };

  // Helper to update a prop
  const handlePropChange = (property: keyof ElementProps, value: string) => {
    if (selectedElementId) {
      updateElementProps(selectedElementId, { [property]: value });
    }
  };

  // If no element selected, show empty state
  if (!selectedElement) {
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
        </div>
      </aside>
    );
  }

  const styles = selectedElement.styles;
  const props = selectedElement.props;
  const isContainer = ['div', 'container', 'stack'].includes(selectedElement.type);

  return (
    <aside className="property-panel">
      <div className="property-panel__header">
        <h2 className="property-panel__title">Properties</h2>
        <p className="property-panel__subtitle">{selectedElement.type}</p>
      </div>

      <div className="property-panel__content">
        {/* Element Name */}
        <div className="property-panel__section">
          <h3 className="property-panel__section-title">Element</h3>
          <div className="property-panel__field">
            <label className="property-panel__label">Name</label>
            <input 
              type="text" 
              className="property-panel__input" 
              value={selectedElement.name}
              onChange={(e) => selectedElementId && updateElementName(selectedElementId, e.target.value)}
            />
          </div>
          <div className="property-panel__actions">
            <button 
              className="property-panel__action-btn property-panel__action-btn--duplicate"
              onClick={() => selectedElementId && duplicateElement(selectedElementId)}
            >
              Duplicate
            </button>
            <button 
              className="property-panel__action-btn property-panel__action-btn--delete"
              onClick={() => selectedElementId && removeElement(selectedElementId)}
            >
              Delete
            </button>
          </div>
        </div>

        {/* Content Properties - for specific element types */}
        {selectedElement.type === 'input' && (
          <div className="property-panel__section">
            <h3 className="property-panel__section-title">Input</h3>
            <div className="property-panel__field">
              <label className="property-panel__label">Placeholder</label>
              <input 
                type="text" 
                className="property-panel__input" 
                value={props.placeholder || ''}
                onChange={(e) => handlePropChange('placeholder', e.target.value)}
              />
            </div>
            <div className="property-panel__field">
              <label className="property-panel__label">Type</label>
              <select 
                className="property-panel__select"
                value={props.inputType || 'text'}
                onChange={(e) => handlePropChange('inputType', e.target.value as ElementProps['inputType'])}
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="password">Password</option>
                <option value="number">Number</option>
                <option value="tel">Phone</option>
              </select>
            </div>
          </div>
        )}

        {selectedElement.type === 'button' && (
          <div className="property-panel__section">
            <h3 className="property-panel__section-title">Button</h3>
            <div className="property-panel__field">
              <label className="property-panel__label">Text</label>
              <input 
                type="text" 
                className="property-panel__input" 
                value={props.buttonText || ''}
                onChange={(e) => handlePropChange('buttonText', e.target.value)}
              />
            </div>
          </div>
        )}

        {selectedElement.type === 'text' && (
          <div className="property-panel__section">
            <h3 className="property-panel__section-title">Content</h3>
            <div className="property-panel__field">
              <label className="property-panel__label">Text</label>
              <textarea 
                className="property-panel__textarea" 
                value={props.textContent || ''}
                onChange={(e) => handlePropChange('textContent', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Layout Properties - for container elements */}
        {isContainer && (
          <div className="property-panel__section">
            <h3 className="property-panel__section-title">Layout</h3>
            
            {/* Layout Type Selector */}
            <div className="property-panel__field">
              <label className="property-panel__label">Layout Type</label>
              <div className="property-panel__button-group">
                <button 
                  className={`property-panel__toggle-btn ${styles.display === 'flex' ? 'property-panel__toggle-btn--active' : ''}`}
                  onClick={() => handleStyleChange('display', 'flex')}
                >
                  Flex
                </button>
                <button 
                  className={`property-panel__toggle-btn ${styles.display === 'grid' ? 'property-panel__toggle-btn--active' : ''}`}
                  onClick={() => handleStyleChange('display', 'grid')}
                >
                  Grid
                </button>
              </div>
            </div>

            {/* Flexbox Properties */}
            {styles.display === 'flex' && (
              <>
                <div className="property-panel__field">
                  <label className="property-panel__label">Direction</label>
                  <div className="property-panel__button-group">
                    <button 
                      className={`property-panel__toggle-btn ${styles.flexDirection === 'column' ? 'property-panel__toggle-btn--active' : ''}`}
                      onClick={() => handleStyleChange('flexDirection', 'column')}
                    >
                      ↓ Vertical
                    </button>
                    <button 
                      className={`property-panel__toggle-btn ${styles.flexDirection === 'row' ? 'property-panel__toggle-btn--active' : ''}`}
                      onClick={() => handleStyleChange('flexDirection', 'row')}
                    >
                      → Horizontal
                    </button>
                  </div>
                </div>
                <div className="property-panel__field">
                  <label className="property-panel__label">Justify Content</label>
                  <select 
                    className="property-panel__select"
                    value={styles.justifyContent || 'flex-start'}
                    onChange={(e) => handleStyleChange('justifyContent', e.target.value as ElementStyles['justifyContent'])}
                  >
                    <option value="flex-start">Start</option>
                    <option value="center">Center</option>
                    <option value="flex-end">End</option>
                    <option value="space-between">Space Between</option>
                    <option value="space-around">Space Around</option>
                    <option value="space-evenly">Space Evenly</option>
                  </select>
                </div>
                <div className="property-panel__field">
                  <label className="property-panel__label">Align Items</label>
                  <select 
                    className="property-panel__select"
                    value={styles.alignItems || 'flex-start'}
                    onChange={(e) => handleStyleChange('alignItems', e.target.value as ElementStyles['alignItems'])}
                  >
                    <option value="flex-start">Start</option>
                    <option value="center">Center</option>
                    <option value="flex-end">End</option>
                    <option value="stretch">Stretch</option>
                    <option value="baseline">Baseline</option>
                  </select>
                </div>
                <div className="property-panel__field">
                  <label className="property-panel__label">Flex Wrap</label>
                  <select 
                    className="property-panel__select"
                    value={styles.flexWrap || 'nowrap'}
                    onChange={(e) => handleStyleChange('flexWrap', e.target.value as ElementStyles['flexWrap'])}
                  >
                    <option value="nowrap">No Wrap</option>
                    <option value="wrap">Wrap</option>
                    <option value="wrap-reverse">Wrap Reverse</option>
                  </select>
                </div>
                <div className="property-panel__field">
                  <label className="property-panel__label">Gap</label>
                  <div className="property-panel__input-with-unit">
                    <input 
                      type="number" 
                      className="property-panel__input" 
                      value={parsePixelValue(styles.gap)}
                      onChange={(e) => handleStyleChange('gap', `${e.target.value}px`)}
                      min={0}
                    />
                    <span className="property-panel__unit">px</span>
                  </div>
                </div>
              </>
            )}

            {/* Grid Properties */}
            {styles.display === 'grid' && (
              <>
                <div className="property-panel__field">
                  <label className="property-panel__label">Columns</label>
                  <input 
                    type="text" 
                    className="property-panel__input" 
                    placeholder="e.g., 1fr 1fr or repeat(3, 1fr)"
                    value={styles.gridTemplateColumns || ''}
                    onChange={(e) => handleStyleChange('gridTemplateColumns', e.target.value)}
                  />
                  <div className="property-panel__hint">Examples: 1fr 1fr, repeat(3, 1fr), 200px auto</div>
                </div>
                <div className="property-panel__field">
                  <label className="property-panel__label">Rows</label>
                  <input 
                    type="text" 
                    className="property-panel__input" 
                    placeholder="e.g., auto or 100px 200px"
                    value={styles.gridTemplateRows || ''}
                    onChange={(e) => handleStyleChange('gridTemplateRows', e.target.value)}
                  />
                </div>
                <div className="property-panel__field">
                  <label className="property-panel__label">Column Gap</label>
                  <div className="property-panel__input-with-unit">
                    <input 
                      type="number" 
                      className="property-panel__input" 
                      value={parsePixelValue(styles.gridColumnGap || styles.gap)}
                      onChange={(e) => handleStyleChange('gridColumnGap', `${e.target.value}px`)}
                      min={0}
                    />
                    <span className="property-panel__unit">px</span>
                  </div>
                </div>
                <div className="property-panel__field">
                  <label className="property-panel__label">Row Gap</label>
                  <div className="property-panel__input-with-unit">
                    <input 
                      type="number" 
                      className="property-panel__input" 
                      value={parsePixelValue(styles.gridRowGap || styles.gap)}
                      onChange={(e) => handleStyleChange('gridRowGap', `${e.target.value}px`)}
                      min={0}
                    />
                    <span className="property-panel__unit">px</span>
                  </div>
                </div>
                <div className="property-panel__field">
                  <label className="property-panel__label">Justify Items</label>
                  <select 
                    className="property-panel__select"
                    value={styles.justifyItems || 'stretch'}
                    onChange={(e) => handleStyleChange('justifyItems', e.target.value as ElementStyles['justifyItems'])}
                  >
                    <option value="start">Start</option>
                    <option value="center">Center</option>
                    <option value="end">End</option>
                    <option value="stretch">Stretch</option>
                  </select>
                </div>
                <div className="property-panel__field">
                  <label className="property-panel__label">Align Items</label>
                  <select 
                    className="property-panel__select"
                    value={styles.alignItems || 'stretch'}
                    onChange={(e) => handleStyleChange('alignItems', e.target.value as ElementStyles['alignItems'])}
                  >
                    <option value="flex-start">Start</option>
                    <option value="center">Center</option>
                    <option value="flex-end">End</option>
                    <option value="stretch">Stretch</option>
                  </select>
                </div>
              </>
            )}
          </div>
        )}

        {/* Spacing */}
        <div className="property-panel__section">
          <h3 className="property-panel__section-title">Padding</h3>
          <div className="property-panel__spacing-box">
            <div className="property-panel__spacing-row">
              <div className="property-panel__spacing-input-group">
                <input 
                  type="number" 
                  className="property-panel__spacing-input"
                  placeholder="0"
                  value={parsePixelValue(styles.paddingTop || styles.padding)}
                  onChange={(e) => handleStyleChange('paddingTop', `${e.target.value}px`)}
                  min={0}
                />
                <span className="property-panel__spacing-label">Top</span>
              </div>
            </div>
            <div className="property-panel__spacing-row property-panel__spacing-row--middle">
              <div className="property-panel__spacing-input-group">
                <input 
                  type="number" 
                  className="property-panel__spacing-input"
                  placeholder="0"
                  value={parsePixelValue(styles.paddingLeft || styles.padding)}
                  onChange={(e) => handleStyleChange('paddingLeft', `${e.target.value}px`)}
                  min={0}
                />
                <span className="property-panel__spacing-label">Left</span>
              </div>
              <div className="property-panel__spacing-center-box">
                <span>px</span>
              </div>
              <div className="property-panel__spacing-input-group">
                <input 
                  type="number" 
                  className="property-panel__spacing-input"
                  placeholder="0"
                  value={parsePixelValue(styles.paddingRight || styles.padding)}
                  onChange={(e) => handleStyleChange('paddingRight', `${e.target.value}px`)}
                  min={0}
                />
                <span className="property-panel__spacing-label">Right</span>
              </div>
            </div>
            <div className="property-panel__spacing-row">
              <div className="property-panel__spacing-input-group">
                <input 
                  type="number" 
                  className="property-panel__spacing-input"
                  placeholder="0"
                  value={parsePixelValue(styles.paddingBottom || styles.padding)}
                  onChange={(e) => handleStyleChange('paddingBottom', `${e.target.value}px`)}
                  min={0}
                />
                <span className="property-panel__spacing-label">Bottom</span>
              </div>
            </div>
          </div>
        </div>

        {/* Margin */}
        <div className="property-panel__section">
          <h3 className="property-panel__section-title">Margin</h3>
          <div className="property-panel__spacing-box">
            <div className="property-panel__spacing-row">
              <div className="property-panel__spacing-input-group">
                <input 
                  type="number" 
                  className="property-panel__spacing-input"
                  placeholder="0"
                  value={parsePixelValue(styles.marginTop || styles.margin)}
                  onChange={(e) => handleStyleChange('marginTop', `${e.target.value}px`)}
                />
                <span className="property-panel__spacing-label">Top</span>
              </div>
            </div>
            <div className="property-panel__spacing-row property-panel__spacing-row--middle">
              <div className="property-panel__spacing-input-group">
                <input 
                  type="number" 
                  className="property-panel__spacing-input"
                  placeholder="0"
                  value={parsePixelValue(styles.marginLeft || styles.margin)}
                  onChange={(e) => handleStyleChange('marginLeft', `${e.target.value}px`)}
                />
                <span className="property-panel__spacing-label">Left</span>
              </div>
              <div className="property-panel__spacing-center-box">
                <span>px</span>
              </div>
              <div className="property-panel__spacing-input-group">
                <input 
                  type="number" 
                  className="property-panel__spacing-input"
                  placeholder="0"
                  value={parsePixelValue(styles.marginRight || styles.margin)}
                  onChange={(e) => handleStyleChange('marginRight', `${e.target.value}px`)}
                />
                <span className="property-panel__spacing-label">Right</span>
              </div>
            </div>
            <div className="property-panel__spacing-row">
              <div className="property-panel__spacing-input-group">
                <input 
                  type="number" 
                  className="property-panel__spacing-input"
                  placeholder="0"
                  value={parsePixelValue(styles.marginBottom || styles.margin)}
                  onChange={(e) => handleStyleChange('marginBottom', `${e.target.value}px`)}
                />
                <span className="property-panel__spacing-label">Bottom</span>
              </div>
            </div>
          </div>
        </div>

        {/* Colors */}
        <div className="property-panel__section">
          <h3 className="property-panel__section-title">Colors</h3>
          <div className="property-panel__field">
            <label className="property-panel__label">Background</label>
            <div className="property-panel__color-input">
              <input 
                type="color" 
                value={styles.backgroundColor || '#ffffff'}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              />
              <input 
                type="text" 
                className="property-panel__input" 
                value={styles.backgroundColor || 'transparent'}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              />
            </div>
          </div>
          <div className="property-panel__field">
            <label className="property-panel__label">Text Color</label>
            <div className="property-panel__color-input">
              <input 
                type="color" 
                value={styles.color || '#1f2937'}
                onChange={(e) => handleStyleChange('color', e.target.value)}
              />
              <input 
                type="text" 
                className="property-panel__input" 
                value={styles.color || '#1f2937'}
                onChange={(e) => handleStyleChange('color', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Border */}
        <div className="property-panel__section">
          <h3 className="property-panel__section-title">Border</h3>
          <div className="property-panel__row">
            <div className="property-panel__field property-panel__field--half">
              <label className="property-panel__label">Width</label>
              <div className="property-panel__input-with-unit">
                <input 
                  type="number" 
                  className="property-panel__input" 
                  value={parsePixelValue(styles.borderWidth)}
                  onChange={(e) => handleStyleChange('borderWidth', `${e.target.value}px`)}
                  min={0}
                />
                <span className="property-panel__unit">px</span>
              </div>
            </div>
            <div className="property-panel__field property-panel__field--half">
              <label className="property-panel__label">Style</label>
              <select 
                className="property-panel__select"
                value={styles.borderStyle || 'none'}
                onChange={(e) => handleStyleChange('borderStyle', e.target.value as ElementStyles['borderStyle'])}
              >
                <option value="none">None</option>
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
              </select>
            </div>
          </div>
          <div className="property-panel__field">
            <label className="property-panel__label">Border Color</label>
            <div className="property-panel__color-input">
              <input 
                type="color" 
                value={styles.borderColor || '#e5e7eb'}
                onChange={(e) => handleStyleChange('borderColor', e.target.value)}
              />
              <input 
                type="text" 
                className="property-panel__input" 
                value={styles.borderColor || '#e5e7eb'}
                onChange={(e) => handleStyleChange('borderColor', e.target.value)}
              />
            </div>
          </div>
          <div className="property-panel__field">
            <label className="property-panel__label">Border Radius</label>
            <div className="property-panel__input-with-unit">
              <input 
                type="number" 
                className="property-panel__input" 
                value={parsePixelValue(styles.borderRadius)}
                onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`)}
                min={0}
              />
              <span className="property-panel__unit">px</span>
            </div>
          </div>
        </div>

        {/* Size */}
        <div className="property-panel__section">
          <h3 className="property-panel__section-title">Size</h3>
          <div className="property-panel__row">
            <div className="property-panel__field property-panel__field--half">
              <label className="property-panel__label">Width</label>
              <input 
                type="text" 
                className="property-panel__input" 
                value={styles.width || 'auto'}
                onChange={(e) => handleStyleChange('width', e.target.value)}
                placeholder="auto"
              />
            </div>
            <div className="property-panel__field property-panel__field--half">
              <label className="property-panel__label">Height</label>
              <input 
                type="text" 
                className="property-panel__input" 
                value={styles.height || 'auto'}
                onChange={(e) => handleStyleChange('height', e.target.value)}
                placeholder="auto"
              />
            </div>
          </div>
          <div className="property-panel__row">
            <div className="property-panel__field property-panel__field--half">
              <label className="property-panel__label">Min Height</label>
              <input 
                type="text" 
                className="property-panel__input" 
                value={styles.minHeight || ''}
                onChange={(e) => handleStyleChange('minHeight', e.target.value)}
                placeholder="auto"
              />
            </div>
            <div className="property-panel__field property-panel__field--half">
              <label className="property-panel__label">Max Width</label>
              <input 
                type="text" 
                className="property-panel__input" 
                value={styles.maxWidth || ''}
                onChange={(e) => handleStyleChange('maxWidth', e.target.value)}
                placeholder="none"
              />
            </div>
          </div>
        </div>

        {/* Position */}
        <div className="property-panel__section">
          <h3 className="property-panel__section-title">Position</h3>
          <div className="property-panel__field">
            <label className="property-panel__label">Position Type</label>
            <select 
              className="property-panel__select"
              value={styles.position || 'relative'}
              onChange={(e) => handleStyleChange('position', e.target.value as ElementStyles['position'])}
            >
              <option value="static">Static</option>
              <option value="relative">Relative</option>
              <option value="absolute">Absolute</option>
            </select>
          </div>
          <div className="property-panel__row">
            <div className="property-panel__field property-panel__field--half">
              <label className="property-panel__label">Top</label>
              <div className="property-panel__input-with-unit">
                <input 
                  type="number" 
                  className="property-panel__input" 
                  value={parsePixelValue(styles.top)}
                  onChange={(e) => handleStyleChange('top', `${e.target.value}px`)}
                />
                <span className="property-panel__unit">px</span>
              </div>
            </div>
            <div className="property-panel__field property-panel__field--half">
              <label className="property-panel__label">Left</label>
              <div className="property-panel__input-with-unit">
                <input 
                  type="number" 
                  className="property-panel__input" 
                  value={parsePixelValue(styles.left)}
                  onChange={(e) => handleStyleChange('left', `${e.target.value}px`)}
                />
                <span className="property-panel__unit">px</span>
              </div>
            </div>
          </div>
          <button 
            className="property-panel__reset-btn"
            onClick={() => {
              handleStyleChange('top', '0px');
              handleStyleChange('left', '0px');
            }}
          >
            Reset Position
          </button>
        </div>
      </div>
    </aside>
  );
};

export default PropertyPanel;
