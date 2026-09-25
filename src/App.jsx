import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ActorsPage from './pages/ActorsPage';
import CreateActorPage from './pages/CreateActorPage';
import EditActorPage from './pages/EditActorPage';
import MoviesPage from './pages/MoviesPage';
import CreateMoviePage from './pages/CreateMoviePage';
import MovieDetailPage from './pages/MovieDetailPage';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/actors" replace />} />
            <Route path="/actors" element={<ActorsPage />} />
            <Route path="/actors/create" element={<CreateActorPage />} />
            <Route path="/actors/edit/:id" element={<EditActorPage />} />

            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/movies/create" element={<CreateMoviePage />} />
            <Route path="/movies/:id" element={<MovieDetailPage />} />

            <Route
              path="*"
              element={
                <div className="empty-state">
                  <h2 className="empty-state-title">Página no encontrada</h2>
                  <p className="empty-state-desc">La ruta solicitada no existe.</p>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
