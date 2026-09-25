import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ActorCard({ actor, onDeleteClick }) {
  const [imgError, setImgError] = useState(false);

  const formattedBirthDate = actor.birthDate
    ? new Date(actor.birthDate).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC',
      })
    : 'No registrada';

  return (
    <article className="actor-card">
      <div className="actor-photo-wrapper">
        {!imgError && actor.photo ? (
          <img
            src={actor.photo}
            alt={actor.name}
            className="actor-photo"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="actor-photo-placeholder">
            Sin imagen
          </div>
        )}
      </div>

      <div className="actor-card-body">
        <h3 className="actor-name">{actor.name}</h3>

        <div className="actor-meta">
          {actor.nationality && (
            <span className="actor-meta-item">
              {actor.nationality}
            </span>
          )}
          <span className="actor-meta-item">
            {formattedBirthDate}
          </span>
        </div>

        <p className="actor-biography">
          {actor.biography || 'Sin biografía disponible.'}
        </p>

        <div className="actor-card-actions">
          <Link
            to={`/actors/edit/${actor.id}`}
            className="btn btn-secondary btn-sm"
          >
            Editar
          </Link>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => onDeleteClick(actor)}
          >
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
}
