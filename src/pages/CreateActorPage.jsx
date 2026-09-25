import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createActor } from '../api/actorsApi';
import ActorForm from '../components/ActorForm';

export default function CreateActorPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await createActor(formData);
      navigate('/actors');
    } catch (err) {
      setError(err.message || 'Error al crear el actor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <header className="page-header" style={{ maxWidth: '580px', margin: '0 auto 1.5rem auto' }}>
        <h1 className="page-title">Crear Actor</h1>
        <p className="page-subtitle">Formulario para registrar un nuevo actor</p>
      </header>

      {error && (
        <div style={{ maxWidth: '580px', margin: '0 auto 1rem auto' }}>
          <div className="alert alert-danger">{error}</div>
        </div>
      )}

      <ActorForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitButtonText="Crear Actor"
      />
    </div>
  );
}
