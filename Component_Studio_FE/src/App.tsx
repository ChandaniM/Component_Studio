import { useState } from 'react';
import './App.scss';
import { Navbar, Sidebar, MainCanvas, PropertyPanel, PreviewModal } from './components/layout';
import { CanvasProvider } from './store/canvasStore';

type BuilderMode = 'landing' | 'manual' | 'guided';

function App() {
  const [mode, setMode] = useState<BuilderMode>('landing');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <CanvasProvider>
      <div className="app">
        <Navbar onPreviewClick={() => setIsPreviewOpen(true)} />
        <div className="app__body">
          <Sidebar mode={mode} />
          <MainCanvas mode={mode} onModeChange={setMode} />
          {mode === 'manual' && <PropertyPanel />}
        </div>
        <PreviewModal 
          isOpen={isPreviewOpen} 
          onClose={() => setIsPreviewOpen(false)} 
        />
      </div>
    </CanvasProvider>
  );
}

export default App;
