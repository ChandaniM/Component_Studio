import { useState, useEffect } from 'react';
import { useCanvas } from '../../../store/canvasStore';
import { exportToHTML } from '../../../utils/exportHTML';
import './PreviewModal.scss';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PreviewModal = ({ isOpen, onClose }: PreviewModalProps) => {
  const { elements } = useCanvas();
  const [htmlCode, setHtmlCode] = useState('');
  const [previewHTML, setPreviewHTML] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const code = exportToHTML(elements);
      setHtmlCode(code);
      
      // Create full HTML document for preview iframe
      const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 16px; font-family: system-ui, -apple-system, sans-serif; }
  </style>
</head>
<body>
${code}
</body>
</html>`;
      setPreviewHTML(fullHTML);
      setIsCopied(false);
    }
  }, [isOpen, elements]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(htmlCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="preview-modal">
      <div className="preview-modal__overlay" onClick={onClose} />
      <div className="preview-modal__content">
        {/* Header */}
        <div className="preview-modal__header">
          <h2 className="preview-modal__title">Preview & Code</h2>
          <div className="preview-modal__header-actions">
            <button 
              className="preview-modal__btn preview-modal__btn--copy"
              onClick={handleCopyCode}
            >
              {isCopied ? (
                <>
                  <span className="preview-modal__btn-icon">✓</span>
                  Copied!
                </>
              ) : (
                <>
                  <span className="preview-modal__btn-icon">📋</span>
                  Copy Code
                </>
              )}
            </button>
            <button 
              className="preview-modal__btn preview-modal__btn--close"
              onClick={onClose}
            >
              <span className="preview-modal__btn-icon">✕</span>
            </button>
          </div>
        </div>

        {/* Split View */}
        <div className="preview-modal__body">
          {/* Left: Code Editor */}
          <div className="preview-modal__code-panel">
            <div className="preview-modal__panel-header">
              <span className="preview-modal__panel-title">HTML Code</span>
              <span className="preview-modal__panel-badge">
                {htmlCode.split('\n').length} lines
              </span>
            </div>
            <div className="preview-modal__code-wrapper">
              <pre className="preview-modal__code">
                <code>{htmlCode}</code>
              </pre>
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="preview-modal__preview-panel">
            <div className="preview-modal__panel-header">
              <span className="preview-modal__panel-title">Live Preview</span>
              <span className="preview-modal__panel-badge">Interactive</span>
            </div>
            <div className="preview-modal__preview-wrapper">
              <iframe
                className="preview-modal__iframe"
                srcDoc={previewHTML}
                title="Preview"
                sandbox="allow-scripts"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
