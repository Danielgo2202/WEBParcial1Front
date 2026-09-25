import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ActorForm({
  initialData = {},
  onSubmit,
  isSubmitting = false,
  submitButtonText = 'Guardar',
}) {
  const navigate = useNavigate();

  const getFormattedDate = (dateVal) => {
    if (!dateVal) return '';
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return '';
      return d.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const [formData, setFormData] = useState({
    name: initialData.name || '',
    photo: initialData.photo || '',
    nationality: initialData.nationality || '',
    birthDate: getFormattedDate(initialData.birthDate),
    biography: initialData.biography || '',
  });

  const [errors, setErrors] = useState({});

  const isValidUrl = (string) => {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres.';
    }

    if (!formData.photo.trim()) {
      newErrors.photo = 'La URL de la foto es obligatoria.';
    } else if (!isValidUrl(formData.photo.trim())) {
      newErrors.photo = 'Ingrese una URL válida (http:// o https://).';
    }

    if (!formData.nationality.trim()) {
      newErrors.nationality = 'La nacionalidad es obligatoria.';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'La fecha de nacimiento es obligatoria.';
    } else {
      const selectedDate = new Date(formData.birthDate);
      if (selectedDate > new Date()) {
        newErrors.birthDate = 'La fecha no puede ser futura.';
      }
    }

    if (!formData.biography.trim()) {
      newErrors.biography = 'La biografía es obligatoria.';
    } else if (formData.biography.trim().length < 10) {
      newErrors.biography = 'La biografía debe contener al menos 10 caracteres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: formData.name.trim(),
      photo: formData.photo.trim(),
      nationality: formData.nationality.trim(),
      birthDate: formData.birthDate,
      biography: formData.biography.trim(),
    });
  };

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="name" className="form-label">
          Nombre <span className="form-label-required">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className={`form-input ${errors.name ? 'is-invalid' : ''}`}
          value={formData.name}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.name && <p className="form-error">{errors.name}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="photo" className="form-label">
          URL de la foto <span className="form-label-required">*</span>
        </label>
        <input
          type="url"
          id="photo"
          name="photo"
          className={`form-input ${errors.photo ? 'is-invalid' : ''}`}
          placeholder="https://"
          value={formData.photo}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.photo && <p className="form-error">{errors.photo}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="nationality" className="form-label">
          Nacionalidad <span className="form-label-required">*</span>
        </label>
        <input
          type="text"
          id="nationality"
          name="nationality"
          className={`form-input ${errors.nationality ? 'is-invalid' : ''}`}
          value={formData.nationality}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.nationality && <p className="form-error">{errors.nationality}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="birthDate" className="form-label">
          Fecha de nacimiento <span className="form-label-required">*</span>
        </label>
        <input
          type="date"
          id="birthDate"
          name="birthDate"
          className={`form-input ${errors.birthDate ? 'is-invalid' : ''}`}
          value={formData.birthDate}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.birthDate && <p className="form-error">{errors.birthDate}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="biography" className="form-label">
          Biografía <span className="form-label-required">*</span>
        </label>
        <textarea
          id="biography"
          name="biography"
          rows={4}
          className={`form-textarea ${errors.biography ? 'is-invalid' : ''}`}
          value={formData.biography}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.biography && <p className="form-error">{errors.biography}</p>}
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate('/actors')}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Guardando...' : submitButtonText}
        </button>
      </div>
    </form>
  );
}
