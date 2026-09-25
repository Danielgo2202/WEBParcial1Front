import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function MovieCard({ movie }) {
  const [imgError, setImgError] = useState(false);

  const formattedDate = movie.releaseDate
    ? new Date(movie.releaseDate).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC',
      })
    : 'No registrada';

  const authorName =
    (movie.actors && movie.actors.length > 0 && movie.actors[0].name) ||
    (movie.director && movie.director.name) ||
    'Sin autor';

  const prizeName =
    movie.prizes && movie.prizes.length > 0 && movie.prizes[0].name
      ? movie.prizes[0].name
      : 'Sin premio';

  return (
    <article className="actor-card">
      <div className="actor-photo-wrapper">
        {!imgError && movie.poster ? (
          <img
            src={movie.poster}
            alt={movie.title}
            className="actor-photo"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="actor-photo-placeholder">
            Sin poster
          </div>
        )}
      </div>

      <div className="actor-card-body">
        <h3 className="actor-name">{movie.title}</h3>

        <div className="actor-meta">
          <span className="actor-meta-item">
            {formattedDate}
          </span>
          {movie.country && (
            <span className="actor-meta-item">
              {movie.country}
            </span>
          )}
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem' }}>
          <div>
            <strong style={{ color: 'var(--text-main)' }}>Autor/Actor:</strong> {authorName}
          </div>
          <div>
            <strong style={{ color: 'var(--text-main)' }}>Premio:</strong> {prizeName}
          </div>
        </div>

        <div className="actor-card-actions">
          <Link
            to={`/movies/${movie.id}`}
            className="btn btn-secondary btn-sm"
          >
            Ver Detalle
          </Link>
        </div>
      </div>
    </article>
  );
}
