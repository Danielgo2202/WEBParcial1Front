import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieById } from '../api/moviesApi';
import LoadingSpinner from '../components/LoadingSpinner';

export default function MovieDetailPage() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadMovie() {
      try {
        const data = await getMovieById(id);
        if (isMounted) {
          setMovie(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'No fue posible cargar el detalle de la película.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (id) {
      loadMovie();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Cargando detalle de la película..." />;
  }

  if (error || !movie) {
    return (
      <div className="empty-state">
        <h2 className="empty-state-title">Error</h2>
        <p className="empty-state-desc">{error || 'Película no encontrada.'}</p>
        <Link to="/movies" className="btn btn-secondary">
          Volver a Películas
        </Link>
      </div>
    );
  }

  const formattedReleaseDate = movie.releaseDate
    ? new Date(movie.releaseDate).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
      })
    : 'No registrada';

  return (
    <div>
      <div style={{ marginBottom: '1.25rem' }}>
        <Link to="/movies" className="btn btn-secondary btn-sm">
          ← Volver a Películas
        </Link>
      </div>

      <div className="form-card" style={{ maxWidth: '840px', padding: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ width: '240px', flexShrink: 0 }}>
            <div className="actor-photo-wrapper" style={{ height: '340px', borderRadius: 'var(--radius)' }}>
              {!imgError && movie.poster ? (
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="actor-photo"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="actor-photo-placeholder">
                  Sin poster
                </div>
              )}
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '260px' }}>
            <h1 className="page-title" style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>
              {movie.title}
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <div>
                <span className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fecha de estreno</span>
                <p style={{ fontWeight: 500 }}>{formattedReleaseDate}</p>
              </div>

              <div>
                <span className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Duración</span>
                <p style={{ fontWeight: 500 }}>{movie.duration ? `${movie.duration} minutos` : 'No registrada'}</p>
              </div>

              <div>
                <span className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>País</span>
                <p style={{ fontWeight: 500 }}>{movie.country || 'No registrado'}</p>
              </div>

              <div>
                <span className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Popularidad</span>
                <p style={{ fontWeight: 500 }}>{movie.popularity ?? 'No registrada'}</p>
              </div>

              {movie.genre && (
                <div>
                  <span className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Género</span>
                  <p style={{ fontWeight: 500 }}>{movie.genre.type || movie.genre.name || 'No especificado'}</p>
                </div>
              )}

              {movie.director && (
                <div>
                  <span className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Director</span>
                  <p style={{ fontWeight: 500 }}>{movie.director.name}</p>
                </div>
              )}
            </div>

            {movie.youtubeTrailer && movie.youtubeTrailer.url && (
              <div style={{ marginTop: '0.5rem' }}>
                <span className="form-label" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Trailer oficial</span>
                <a
                  href={movie.youtubeTrailer.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--text-main)', textDecoration: 'underline', fontSize: '0.9rem', wordBreak: 'break-all' }}
                >
                  {movie.youtubeTrailer.name || movie.youtubeTrailer.url}
                </a>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-main)' }}>
            Listado de Autores / Actores
          </h2>

          {movie.actors && movie.actors.length > 0 ? (
            <div className="actors-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
              {movie.actors.map((actor) => (
                <div
                  key={actor.id}
                  style={{
                    backgroundColor: 'var(--bg-surface-subtle)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius)',
                    padding: '0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                  }}
                >
                  {actor.photo && (
                    <img
                      src={actor.photo}
                      alt={actor.name}
                      style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '4px' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {actor.name}
                  </h4>
                  {actor.nationality && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Nacionalidad: {actor.nationality}
                    </p>
                  )}
                  {actor.biography && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>
                      {actor.biography}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Esta película no tiene autores o actores asociados actualmente.
            </p>
          )}
        </div>

        {movie.prizes && movie.prizes.length > 0 && (
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-main)' }}>
              Premios
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {movie.prizes.map((prize) => (
                <div
                  key={prize.id}
                  style={{
                    backgroundColor: 'var(--bg-surface-subtle)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius)',
                    padding: '0.65rem 1rem',
                    fontSize: '0.85rem',
                  }}
                >
                  <strong style={{ color: 'var(--text-main)' }}>{prize.name}</strong> - {prize.category} ({prize.year})
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Estado: {prize.status === 'won' ? 'Ganador' : 'Nominado'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
