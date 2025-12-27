import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { CreatePage } from './pages/CreatePage';
import { EditPage } from './pages/EditPage';
import { ReadPage } from './pages/ReadPage';
import { PreviewPage } from './pages/PreviewPage';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/create" replace />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/edit/:id" element={<EditPage />} />
          <Route path="/read/:id" element={<ReadPage />} />
          <Route path="/preview/:id" element={<PreviewPage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
