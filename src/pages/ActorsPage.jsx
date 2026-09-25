import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getActors, deleteActor } from '../api/actorsApi';
import ActorCard from '../components/ActorCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ActorsPage() {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadActors() {
      try {
        const data = await getActors();
        if (isMounted) {
          setActors(data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'No fue posible cargar el listado de actores.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadActors();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const handleDeleteClick = async (actor) => {
    const confirmed = window.confirm(`¿Está seguro de que desea eliminar a "${actor.name}"?`);
    if (!confirmed) return;

    setError(null);
    setSuccessMessage(null);
    try {
      await deleteActor(actor.id);
      setActors((prevActors) => prevActors.filter((item) => item.id !== actor.id));
      setSuccessMessage(`El actor "${actor.name}" fue eliminado.`);
    } catch (err) {
      setError(err.message || 'Error al eliminar el actor.');
    }
  };

  const filteredActors = actors.filter((actor) => {
    const term = searchQuery.toLowerCase().trim();
    if (!term) return true;
    return (
      actor.name?.toLowerCase().includes(term) ||
      actor.nationality?.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <header className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Actores</h1>
            <p className="page-subtitle">Listado de actores registrados en la plataforma</p>
          </div>
          <Link to="/actors/create" className="btn btn-primary">
            Crear Actor
          </Link>
        </div>
      </header>

      {error && (
        <div className="alert alert-danger">
          <span>{error}</span>
          <button
            type="button"
            className="alert-close"
            onClick={() => setError(null)}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
      )}
      {successMessage && (
        <div className="alert alert-success">
          <span>{successMessage}</span>
          <button
            type="button"
            className="alert-close"
            onClick={() => setSuccessMessage(null)}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
      )}

      {!loading && actors.length > 0 && (
        <div style={{ marginBottom: '1.25rem', maxWidth: '360px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Buscar por nombre o nacionalidad..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {loading && <LoadingSpinner message="Cargando actores..." />}

      {!loading && !error && filteredActors.length === 0 && (
        <div className="empty-state">
          <h2 className="empty-state-title">
            {searchQuery ? 'Sin coincidencias' : 'No hay actores registrados'}
          </h2>
          <p className="empty-state-desc">
            {searchQuery
              ? `No se encontraron resultados para "${searchQuery}".`
              : 'Utilice el botón de Crear Actor para registrar el primero.'}
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
            <Link to="/actors/create" className="btn btn-primary">
              Crear Actor
            </Link>
          )}
        </div>
      )}

      {!loading && filteredActors.length > 0 && (
        <div className="actors-grid">
          {filteredActors.map((actor) => (
            <ActorCard
              key={actor.id}
              actor={actor}
              onDeleteClick={handleDeleteClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
