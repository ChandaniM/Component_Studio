import { useState, DragEvent } from 'react';
import { useCanvas } from '../../../store/canvasStore';
import { CanvasElement } from '../../canvas';
import type { ElementType } from '../../../types/canvas.types';
import './MainCanvas.scss';

interface MainCanvasProps {
  mode: 'landing' | 'manual' | 'guided';
  onModeChange: (mode: 'landing' | 'manual' | 'guided') => void;
}

interface GuidedFormData {
  componentType: string;
  title: string;
  description: string;
  hasImage: boolean;
  hasButton: boolean;
  buttonText: string;
  outerPadding: number;
  innerPadding: number;
  borderRadius: number;
  backgroundColor: string;
  titleColor: string;
  titleSize: number;
  descriptionColor: string;
  descriptionSize: number;
}

const MainCanvas = ({ mode, onModeChange }: MainCanvasProps) => {
  // All hooks must be called unconditionally at the top
  const { elements, addElement, selectElement, selectedElementId, setDragOverElement, clearCanvas } = useCanvas();
  const [isDragOver, setIsDragOver] = useState(false);
  const [guidedStep, setGuidedStep] = useState(1);
  const [formData, setFormData] = useState<GuidedFormData>({
    componentType: 'card',
    title: 'Card Title',
    description: 'This is a description text for your component.',
    hasImage: true,
    hasButton: true,
    buttonText: 'Click Me',
    outerPadding: 16,
    innerPadding: 20,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    titleColor: '#1f2937',
    titleSize: 18,
    descriptionColor: '#6b7280',
    descriptionSize: 14,
  });

  const updateFormData = (key: keyof GuidedFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Landing View - Mode Selection Cards
  if (mode === 'landing') {
    return (
      <main className="main-canvas main-canvas--landing">
        <div className="landing">
          <div className="landing__header">
            <h1 className="landing__title">What would you like to create?</h1>
            <p className="landing__subtitle">
              Choose a builder mode to start designing your component
            </p>
          </div>

          <div className="landing__cards">
            <div
              className="landing__card"
              onClick={() => onModeChange('manual')}
            >
              <div className="landing__card-icon">🛠</div>
              <h3 className="landing__card-title">Manual Builder</h3>
              <p className="landing__card-desc">
                Build from scratch using drag & drop components
              </p>
              <span className="landing__card-badge landing__card-badge--active">
                Available
              </span>
            </div>

            <div
              className="landing__card"
              onClick={() => onModeChange('guided')}
            >
              <div className="landing__card-icon">💬</div>
              <h3 className="landing__card-title">Guided Builder</h3>
              <p className="landing__card-desc">
                Answer questions and we'll generate your component
              </p>
              <span className="landing__card-badge landing__card-badge--active">
                Available
              </span>
            </div>

            <div className="landing__card landing__card--disabled">
              <div className="landing__card-icon">🤖</div>
              <h3 className="landing__card-title">AI Builder</h3>
              <p className="landing__card-desc">
                Upload a design or describe what you want
              </p>
              <span className="landing__card-badge landing__card-badge--soon">
                Coming Soon
              </span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Guided Builder - Step-by-step Questions
  if (mode === 'guided') {
    return (
      <main className="main-canvas main-canvas--guided">
        <div className="guided">
          <div className="guided__container">
            {/* Left: Questions */}
            <div className="guided__questions">
              <div className="guided__header">
                <button className="guided__back" onClick={() => onModeChange('landing')}>
                  ← Back
                </button>
                <h2 className="guided__title">Configure Your Component</h2>
                <p className="guided__subtitle">Step {guidedStep} of 4</p>
              </div>

              {guidedStep === 1 && (
                <div className="guided__step">
                  <h3 className="guided__step-title">What type of component?</h3>
                  <div className="guided__options">
                    {['card', 'banner', 'profile', 'product'].map((type) => (
                      <div
                        key={type}
                        className={`guided__option ${formData.componentType === type ? 'guided__option--selected' : ''}`}
                        onClick={() => updateFormData('componentType', type)}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </div>
                    ))}
                  </div>

                  <h3 className="guided__step-title">What elements do you need?</h3>
                  <div className="guided__checkboxes">
                    <label className="guided__checkbox">
                      <input
                        type="checkbox"
                        checked={formData.hasImage}
                        onChange={(e) => updateFormData('hasImage', e.target.checked)}
                      />
                      <span>Image</span>
                    </label>
                    <label className="guided__checkbox">
                      <input
                        type="checkbox"
                        checked={formData.hasButton}
                        onChange={(e) => updateFormData('hasButton', e.target.checked)}
                      />
                      <span>Button</span>
                    </label>
                  </div>
                </div>
              )}

              {guidedStep === 2 && (
                <div className="guided__step">
                  <h3 className="guided__step-title">Content</h3>
                  
                  <div className="guided__field">
                    <label>Title Text</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => updateFormData('title', e.target.value)}
                      placeholder="Enter title..."
                    />
                  </div>

                  <div className="guided__field">
                    <label>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => updateFormData('description', e.target.value)}
                      placeholder="Enter description..."
                      rows={3}
                    />
                  </div>

                  {formData.hasButton && (
                    <div className="guided__field">
                      <label>Button Text</label>
                      <input
                        type="text"
                        value={formData.buttonText}
                        onChange={(e) => updateFormData('buttonText', e.target.value)}
                        placeholder="Button label..."
                      />
                    </div>
                  )}
                </div>
              )}

              {guidedStep === 3 && (
                <div className="guided__step">
                  <h3 className="guided__step-title">Spacing & Layout</h3>
                  
                  <div className="guided__field-row">
                    <div className="guided__field">
                      <label>Outer Padding</label>
                      <input
                        type="number"
                        value={formData.outerPadding}
                        onChange={(e) => updateFormData('outerPadding', parseInt(e.target.value) || 0)}
                        min={0}
                        max={100}
                      />
                    </div>
                    <div className="guided__field">
                      <label>Inner Padding</label>
                      <input
                        type="number"
                        value={formData.innerPadding}
                        onChange={(e) => updateFormData('innerPadding', parseInt(e.target.value) || 0)}
                        min={0}
                        max={100}
                      />
                    </div>
                  </div>

                  <div className="guided__field">
                    <label>Border Radius</label>
                    <input
                      type="range"
                      value={formData.borderRadius}
                      onChange={(e) => updateFormData('borderRadius', parseInt(e.target.value))}
                      min={0}
                      max={32}
                    />
                    <span className="guided__field-value">{formData.borderRadius}px</span>
                  </div>

                  <h3 className="guided__step-title">Typography</h3>
                  
                  <div className="guided__field-row">
                    <div className="guided__field">
                      <label>Title Size</label>
                      <input
                        type="number"
                        value={formData.titleSize}
                        onChange={(e) => updateFormData('titleSize', parseInt(e.target.value) || 16)}
                        min={12}
                        max={48}
                      />
                    </div>
                    <div className="guided__field">
                      <label>Title Color</label>
                      <input
                        type="color"
                        value={formData.titleColor}
                        onChange={(e) => updateFormData('titleColor', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="guided__field-row">
                    <div className="guided__field">
                      <label>Description Size</label>
                      <input
                        type="number"
                        value={formData.descriptionSize}
                        onChange={(e) => updateFormData('descriptionSize', parseInt(e.target.value) || 14)}
                        min={10}
                        max={24}
                      />
                    </div>
                    <div className="guided__field">
                      <label>Description Color</label>
                      <input
                        type="color"
                        value={formData.descriptionColor}
                        onChange={(e) => updateFormData('descriptionColor', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="guided__field">
                    <label>Background Color</label>
                    <input
                      type="color"
                      value={formData.backgroundColor}
                      onChange={(e) => updateFormData('backgroundColor', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {guidedStep === 4 && (
                <div className="guided__step">
                  <h3 className="guided__step-title">Review & Generate</h3>
                  <div className="guided__summary">
                    <div className="guided__summary-item">
                      <span>Type:</span>
                      <strong>{formData.componentType}</strong>
                    </div>
                    <div className="guided__summary-item">
                      <span>Title:</span>
                      <strong>{formData.title}</strong>
                    </div>
                    <div className="guided__summary-item">
                      <span>Padding:</span>
                      <strong>{formData.outerPadding}px outer / {formData.innerPadding}px inner</strong>
                    </div>
                    <div className="guided__summary-item">
                      <span>Border Radius:</span>
                      <strong>{formData.borderRadius}px</strong>
                    </div>
                  </div>
                </div>
              )}

              <div className="guided__actions">
                {guidedStep > 1 && (
                  <button
                    className="guided__btn guided__btn--secondary"
                    onClick={() => setGuidedStep(guidedStep - 1)}
                  >
                    Previous
                  </button>
                )}
                {guidedStep < 4 ? (
                  <button
                    className="guided__btn guided__btn--primary"
                    onClick={() => setGuidedStep(guidedStep + 1)}
                  >
                    Next
                  </button>
                ) : (
                  <button className="guided__btn guided__btn--generate">
                    ✨ Generate Component
                  </button>
                )}
              </div>
            </div>

            {/* Right: Live Preview */}
            <div className="guided__preview">
              <div className="guided__preview-header">
                <span>Live Preview</span>
              </div>
              <div className="guided__preview-area">
                <div
                  className="preview-component"
                  style={{
                    padding: `${formData.outerPadding}px`,
                  }}
                >
                  <div
                    className="preview-card"
                    style={{
                      backgroundColor: formData.backgroundColor,
                      borderRadius: `${formData.borderRadius}px`,
                      padding: `${formData.innerPadding}px`,
                    }}
                  >
                    {formData.hasImage && (
                      <div className="preview-card__image">
                        <span>🖼</span>
                      </div>
                    )}
                    <h4
                      className="preview-card__title"
                      style={{
                        color: formData.titleColor,
                        fontSize: `${formData.titleSize}px`,
                      }}
                    >
                      {formData.title}
                    </h4>
                    <p
                      className="preview-card__desc"
                      style={{
                        color: formData.descriptionColor,
                        fontSize: `${formData.descriptionSize}px`,
                      }}
                    >
                      {formData.description}
                    </p>
                    {formData.hasButton && (
                      <button className="preview-card__btn">
                        {formData.buttonText}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Manual Builder - Drag & Drop Canvas
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.stopPropagation();
    // Only set to false if we're leaving the artboard entirely
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!e.currentTarget.contains(relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDragOverElement(null);

    const data = e.dataTransfer.getData('application/json');
    if (!data) return;

    try {
      const dragData = JSON.parse(data);
      
      if (dragData.isNew) {
        // Adding new element to root level
        addElement(dragData.type as ElementType, null);
      }
    } catch (err) {
      console.error('Drop error:', err);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Deselect when clicking on empty canvas area
    if (e.target === e.currentTarget) {
      selectElement(null);
    }
  };

  return (
    <main className="main-canvas">
      <div className="main-canvas__toolbar">
        <button className="main-canvas__back-btn" onClick={() => onModeChange('landing')}>
          ← Back
        </button>
        <div className="main-canvas__zoom">
          <button className="main-canvas__zoom-btn">−</button>
          <span className="main-canvas__zoom-value">100%</span>
          <button className="main-canvas__zoom-btn">+</button>
        </div>
        <div className="main-canvas__device-toggle">
          <button className="main-canvas__device-btn main-canvas__device-btn--active">
            🖥
          </button>
          <button className="main-canvas__device-btn">📱</button>
        </div>
        {elements.length > 0 && (
          <button className="main-canvas__clear-btn" onClick={clearCanvas}>
            Clear Canvas
          </button>
        )}
      </div>

      <div className="main-canvas__workspace">
        <div 
          className={`main-canvas__artboard ${isDragOver ? 'main-canvas__artboard--drag-over' : ''} ${elements.length > 0 ? 'main-canvas__artboard--has-elements' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleCanvasClick}
        >
          {elements.length === 0 ? (
            <div className="main-canvas__empty">
              <div className="main-canvas__empty-icon">◇</div>
              <h3 className="main-canvas__empty-title">Start Building</h3>
              <p className="main-canvas__empty-text">
                Drag components from the sidebar to start creating your UI
              </p>
            </div>
          ) : (
            <div className="main-canvas__elements" onClick={handleCanvasClick}>
              {elements.map((element) => (
                <CanvasElement key={element.id} element={element} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default MainCanvas;
