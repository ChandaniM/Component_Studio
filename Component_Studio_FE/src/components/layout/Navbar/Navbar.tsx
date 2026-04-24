import { useState } from 'react';
import { useCanvas } from '../../../store/canvasStore';
import { exportToHTML, copyHTMLToClipboard } from '../../../utils/exportHTML';
import './Navbar.scss';

interface NavbarProps {
  onPreviewClick: () => void;
}

const Navbar = ({ onPreviewClick }: NavbarProps) => {
  const { elements, clearCanvas } = useCanvas();
  const [exportStatus, setExportStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  const handleExport = async () => {
    try {
      const html = exportToHTML(elements);
      const success = await copyHTMLToClipboard(html);
      
      if (success) {
        setExportStatus('copied');
        setTimeout(() => setExportStatus('idle'), 2000);
      } else {
        setExportStatus('error');
        setTimeout(() => setExportStatus('idle'), 2000);
      }
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus('error');
      setTimeout(() => setExportStatus('idle'), 2000);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the canvas? This will delete all elements.')) {
      clearCanvas();
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <div className="navbar__logo">
          <span className="navbar__logo-icon">◇</span>
        </div>
        <h1 className="navbar__title">Component Studio</h1>
      </div>

      <div className="navbar__actions">
        <button 
          className="navbar__btn navbar__btn--secondary"
          onClick={handleReset}
          title="Reset canvas"
        >
          <span className="navbar__btn-icon">↻</span>
          Reset
        </button>
        <button 
          className="navbar__btn navbar__btn--secondary"
          onClick={onPreviewClick}
          title="Preview and view code"
        >
          <span className="navbar__btn-icon">👁</span>
          Preview
        </button>
        <button 
          className="navbar__btn navbar__btn--primary"
          onClick={handleExport}
          title="Copy HTML to clipboard"
        >
          <span className="navbar__btn-icon">
            {exportStatus === 'copied' ? '✓' : exportStatus === 'error' ? '✕' : '↓'}
          </span>
          {exportStatus === 'copied' ? 'Copied!' : exportStatus === 'error' ? 'Failed' : 'Export'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
