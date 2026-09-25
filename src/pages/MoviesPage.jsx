import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMovies } from '../api/moviesApi';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadMovies() {
      try {
        const data = await getMovies();
        if (isMounted) {
          setMovies(data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'No fue posible cargar el listado de películas.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadMovies();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredMovies = movies.filter((movie) => {
    const term = searchQuery.toLowerCase().trim();
    if (!term) return true;
    return (
      movie.title?.toLowerCase().includes(term) ||
      movie.country?.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <header className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Películas</h1>
            <p className="page-subtitle">Catálogo general de películas registradas en el sistema</p>
          </div>
          <Link to="/movies/create" className="btn btn-primary">
            Crear Película
          </Link>
        </div>
      </header>

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && movies.length > 0 && (
        <div style={{ marginBottom: '1.25rem', maxWidth: '360px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Buscar por título o país..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {loading && <LoadingSpinner message="Cargando películas..." />}

      {!loading && !error && filteredMovies.length === 0 && (
        <div className="empty-state">
          <h2 className="empty-state-title">
            {searchQuery ? 'Sin coincidencias' : 'No hay películas registradas'}
          </h2>
          <p className="empty-state-desc">
            {searchQuery
              ? `No se encontraron resultados para "${searchQuery}".`
              : 'Utilice el botón de Crear Película para registrar la primera.'}
          </p>
          {searchQuery ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setSearchQuery('')}
            >
              Limpiar búsqueda
            </button>
          ) : (
            <Link to="/movies/create" className="btn btn-primary">
              Crear Película
            </Link>
          )}
        </div>
      )}

      {!loading && filteredMovies.length > 0 && (
        <div className="actors-grid">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
