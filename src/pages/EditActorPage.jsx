import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getActorById, updateActor } from '../api/actorsApi';
import ActorForm from '../components/ActorForm';
import LoadingSpinner from '../components/LoadingSpinner';

export default function EditActorPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [actor, setActor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadActor() {
      try {
        const data = await getActorById(id);
        if (isMounted) {
          setActor(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'No fue posible cargar la información del actor.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (id) {
      loadActor();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await updateActor(id, formData);
      navigate('/actors');
    } catch (err) {
      setError(err.message || 'Error al actualizar el actor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando actor..." />;
  }

  return (
    <div>
      <header className="page-header" style={{ maxWidth: '580px', margin: '0 auto 1.5rem auto' }}>
        <h1 className="page-title">Editar Actor</h1>
        <p className="page-subtitle">Modifique los datos del actor y guarde los cambios</p>
      </header>

      {error && (
        <div style={{ maxWidth: '580px', margin: '0 auto 1rem auto' }}>
          <div className="alert alert-danger">{error}</div>
        </div>
      )}

      {actor && (
        <ActorForm
          initialData={actor}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitButtonText="Guardar Cambios"
        />
      )}
    </div>
  );
}
