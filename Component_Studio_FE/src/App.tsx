import { useState } from 'react';
import './App.scss';
import { Navbar, Sidebar, MainCanvas, PropertyPanel } from './components/layout';
import { CanvasProvider } from './store/canvasStore';

type BuilderMode = 'landing' | 'manual' | 'guided';

function App() {
  const [mode, setMode] = useState<BuilderMode>('landing');

  return (
    <CanvasProvider>
      <div className="app">
        <Navbar />
        <div className="app__body">
          <Sidebar mode={mode} />
          <MainCanvas mode={mode} onModeChange={setMode} />
          {mode === 'manual' && <PropertyPanel />}
        </div>
      </div>
    </CanvasProvider>
  );
}

export default App;
