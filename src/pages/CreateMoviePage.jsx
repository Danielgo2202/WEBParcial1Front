import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMovie, assignMovieToActor, assignPrizeToMovie } from '../api/moviesApi';
import { createActor } from '../api/actorsApi';
import { createPrize } from '../api/prizesApi';

export default function CreateMoviePage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [movieData, setMovieData] = useState({
    title: '',
    poster: '',
    duration: '',
    country: '',
    releaseDate: '',
    popularity: '',
  });

  const [actorData, setActorData] = useState({
    name: '',
    photo: '',
    nationality: '',
    birthDate: '',
    biography: '',
  });

  const [prizeData, setPrizeData] = useState({
    name: '',
    category: '',
    year: new Date().getFullYear(),
    status: 'won',
  });

  const [stepErrors, setStepErrors] = useState({});

  const isValidUrl = (str) => {
    try {
      const u = new URL(str);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const validateStep1 = () => {
    const errs = {};
    if (!movieData.title.trim()) errs.title = 'El título es obligatorio.';
    if (!movieData.poster.trim()) {
      errs.poster = 'El poster es obligatorio.';
    } else if (!isValidUrl(movieData.poster.trim())) {
      errs.poster = 'Debe ser una URL válida (http:// o https://).';
    }
    if (!movieData.duration || Number(movieData.duration) <= 0) {
      errs.duration = 'Ingrese una duración válida en minutos.';
    }
    if (!movieData.country.trim()) errs.country = 'El país es obligatorio.';
    if (!movieData.releaseDate) errs.releaseDate = 'La fecha de estreno es obligatoria.';
    if (movieData.popularity === '' || Number(movieData.popularity) < 0) {
      errs.popularity = 'Ingrese un número válido de popularidad.';
    }
    setStepErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!actorData.name.trim()) errs.actorName = 'El nombre del actor es obligatorio.';
    if (!actorData.photo.trim()) {
      errs.actorPhoto = 'La foto del actor es obligatoria.';
    } else if (!isValidUrl(actorData.photo.trim())) {
      errs.actorPhoto = 'Debe ser una URL válida (http:// o https://).';
    }
    if (!actorData.nationality.trim()) errs.actorNationality = 'La nacionalidad es obligatoria.';
    if (!actorData.birthDate) errs.actorBirthDate = 'La fecha de nacimiento es obligatoria.';
    if (!actorData.biography.trim() || actorData.biography.trim().length < 10) {
      errs.actorBiography = 'La biografía debe contener al menos 10 caracteres.';
    }
    setStepErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs = {};
    if (!prizeData.name.trim()) errs.prizeName = 'El nombre del premio es obligatorio.';
    if (!prizeData.category.trim()) errs.prizeCategory = 'La categoría es obligatoria.';
    if (!prizeData.year || Number(prizeData.year) < 1800) {
      errs.prizeYear = 'Ingrese un año válido.';
    }
    if (!prizeData.status) errs.prizeStatus = 'El estado es obligatorio.';
    setStepErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    setError(null);
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setError(null);
    setStepErrors({});
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmitAll = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const createdMovie = await createMovie({
        title: movieData.title.trim(),
        poster: movieData.poster.trim(),
        duration: Number(movieData.duration),
        country: movieData.country.trim(),
        releaseDate: movieData.releaseDate,
        popularity: Number(movieData.popularity),
      });

      const createdActor = await createActor({
        name: actorData.name.trim(),
        photo: actorData.photo.trim(),
        nationality: actorData.nationality.trim(),
        birthDate: actorData.birthDate,
        biography: actorData.biography.trim(),
      });

      await assignMovieToActor(createdActor.id, createdMovie.id);

      const createdPrize = await createPrize({
        name: prizeData.name.trim(),
        category: prizeData.category.trim(),
        year: Number(prizeData.year),
        status: prizeData.status,
      });

      await assignPrizeToMovie(createdMovie.id, createdPrize.id);

      navigate('/movies');
    } catch (err) {
      setError(err.message || 'Error en el proceso de creación y asociación.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <header className="page-header" style={{ maxWidth: '640px', margin: '0 auto 1.5rem auto' }}>
        <h1 className="page-title">Crear Película</h1>
        <p className="page-subtitle">
          Registre la película con su actor principal y premio asociado
        </p>
      </header>

      <div className="form-card" style={{ maxWidth: '640px' }}>
        <div className="steps-bar">
          <div className={`step-indicator ${step === 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <span className="step-badge">1</span>
            <span>Película</span>
          </div>
          <div className={`step-indicator ${step === 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <span className="step-badge">2</span>
            <span>Actor Principal</span>
          </div>
          <div className={`step-indicator ${step === 3 ? 'active' : ''}`}>
            <span className="step-badge">3</span>
            <span>Premio</span>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmitAll} noValidate>
          {step === 1 && (
            <div>
              <div className="form-group">
                <label className="form-label" htmlFor="title">
                  Título de la película <span className="form-label-required">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  className={`form-input ${stepErrors.title ? 'is-invalid' : ''}`}
                  value={movieData.title}
                  onChange={(e) => setMovieData({ ...movieData, title: e.target.value })}
                  disabled={isSubmitting}
                />
                {stepErrors.title && <p className="form-error">{stepErrors.title}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="poster">
                  URL del poster <span className="form-label-required">*</span>
                </label>
                <input
                  type="url"
                  id="poster"
                  className={`form-input ${stepErrors.poster ? 'is-invalid' : ''}`}
                  placeholder="https://"
                  value={movieData.poster}
                  onChange={(e) => setMovieData({ ...movieData, poster: e.target.value })}
                  disabled={isSubmitting}
                />
                {stepErrors.poster && <p className="form-error">{stepErrors.poster}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="duration">
                  Duración en minutos <span className="form-label-required">*</span>
                </label>
                <input
                  type="number"
                  id="duration"
                  min="1"
                  className={`form-input ${stepErrors.duration ? 'is-invalid' : ''}`}
                  value={movieData.duration}
                  onChange={(e) => setMovieData({ ...movieData, duration: e.target.value })}
                  disabled={isSubmitting}
                />
                {stepErrors.duration && <p className="form-error">{stepErrors.duration}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="country">
                  País <span className="form-label-required">*</span>
                </label>
                <input
                  type="text"
                  id="country"
                  className={`form-input ${stepErrors.country ? 'is-invalid' : ''}`}
                  value={movieData.country}
                  onChange={(e) => setMovieData({ ...movieData, country: e.target.value })}
                  disabled={isSubmitting}
                />
                {stepErrors.country && <p className="form-error">{stepErrors.country}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="releaseDate">
                  Fecha de estreno <span className="form-label-required">*</span>
                </label>
                <input
                  type="date"
                  id="releaseDate"
                  className={`form-input ${stepErrors.releaseDate ? 'is-invalid' : ''}`}
                  value={movieData.releaseDate}
                  onChange={(e) => setMovieData({ ...movieData, releaseDate: e.target.value })}
                  disabled={isSubmitting}
                />
                {stepErrors.releaseDate && <p className="form-error">{stepErrors.releaseDate}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="popularity">
                  Popularidad (número) <span className="form-label-required">*</span>
                </label>
                <input
                  type="number"
                  id="popularity"
                  min="0"
                  className={`form-input ${stepErrors.popularity ? 'is-invalid' : ''}`}
                  value={movieData.popularity}
                  onChange={(e) => setMovieData({ ...movieData, popularity: e.target.value })}
                  disabled={isSubmitting}
                />
                {stepErrors.popularity && <p className="form-error">{stepErrors.popularity}</p>}
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate('/movies')}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleNext}
                >
                  Continuar a Actor Principal
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="form-group">
                <label className="form-label" htmlFor="actorName">
                  Nombre del actor principal <span className="form-label-required">*</span>
                </label>
                <input
                  type="text"
                  id="actorName"
                  className={`form-input ${stepErrors.actorName ? 'is-invalid' : ''}`}
                  value={actorData.name}
                  onChange={(e) => setActorData({ ...actorData, name: e.target.value })}
                  disabled={isSubmitting}
                />
                {stepErrors.actorName && <p className="form-error">{stepErrors.actorName}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="actorPhoto">
                  URL de foto del actor <span className="form-label-required">*</span>
                </label>
                <input
                  type="url"
                  id="actorPhoto"
                  className={`form-input ${stepErrors.actorPhoto ? 'is-invalid' : ''}`}
                  placeholder="https://"
                  value={actorData.photo}
                  onChange={(e) => setActorData({ ...actorData, photo: e.target.value })}
                  disabled={isSubmitting}
                />
                {stepErrors.actorPhoto && <p className="form-error">{stepErrors.actorPhoto}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="actorNationality">
                  Nacionalidad del actor <span className="form-label-required">*</span>
                </label>
                <input
                  type="text"
                  id="actorNationality"
                  className={`form-input ${stepErrors.actorNationality ? 'is-invalid' : ''}`}
                  value={actorData.nationality}
                  onChange={(e) => setActorData({ ...actorData, nationality: e.target.value })}
                  disabled={isSubmitting}
                />
                {stepErrors.actorNationality && <p className="form-error">{stepErrors.actorNationality}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="actorBirthDate">
                  Fecha de nacimiento <span className="form-label-required">*</span>
                </label>
                <input
                  type="date"
                  id="actorBirthDate"
                  className={`form-input ${stepErrors.actorBirthDate ? 'is-invalid' : ''}`}
                  value={actorData.birthDate}
                  onChange={(e) => setActorData({ ...actorData, birthDate: e.target.value })}
                  disabled={isSubmitting}
                />
                {stepErrors.actorBirthDate && <p className="form-error">{stepErrors.actorBirthDate}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="actorBiography">
                  Biografía <span className="form-label-required">*</span>
                </label>
                <textarea
                  id="actorBiography"
                  rows={3}
                  className={`form-textarea ${stepErrors.actorBiography ? 'is-invalid' : ''}`}
                  value={actorData.biography}
                  onChange={(e) => setActorData({ ...actorData, biography: e.target.value })}
                  disabled={isSubmitting}
                />
                {stepErrors.actorBiography && <p className="form-error">{stepErrors.actorBiography}</p>}
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  Volver a Película
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleNext}
                  disabled={isSubmitting}
                >
                  Continuar a Premio
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="form-group">
                <label className="form-label" htmlFor="prizeName">
                  Nombre del premio <span className="form-label-required">*</span>
                </label>
                <input
                  type="text"
                  id="prizeName"
                  placeholder="Ej: Oscar, Palma de Oro"
                  className={`form-input ${stepErrors.prizeName ? 'is-invalid' : ''}`}
                  value={prizeData.name}
                  onChange={(e) => setPrizeData({ ...prizeData, name: e.target.value })}
                  disabled={isSubmitting}
                />
                {stepErrors.prizeName && <p className="form-error">{stepErrors.prizeName}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prizeCategory">
                  Categoría <span className="form-label-required">*</span>
                </label>
                <input
                  type="text"
                  id="prizeCategory"
                  placeholder="Ej: Mejor Película, Mejor Director"
                  className={`form-input ${stepErrors.prizeCategory ? 'is-invalid' : ''}`}
                  value={prizeData.category}
                  onChange={(e) => setPrizeData({ ...prizeData, category: e.target.value })}
                  disabled={isSubmitting}
                />
                {stepErrors.prizeCategory && <p className="form-error">{stepErrors.prizeCategory}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prizeYear">
                  Año del premio <span className="form-label-required">*</span>
                </label>
                <input
                  type="number"
                  id="prizeYear"
                  min="1900"
                  className={`form-input ${stepErrors.prizeYear ? 'is-invalid' : ''}`}
                  value={prizeData.year}
                  onChange={(e) => setPrizeData({ ...prizeData, year: e.target.value })}
                  disabled={isSubmitting}
                />
                {stepErrors.prizeYear && <p className="form-error">{stepErrors.prizeYear}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prizeStatus">
                  Estado <span className="form-label-required">*</span>
                </label>
                <select
                  id="prizeStatus"
                  className="form-input"
                  value={prizeData.status}
                  onChange={(e) => setPrizeData({ ...prizeData, status: e.target.value })}
                  disabled={isSubmitting}
                >
                  <option value="won">Ganador (won)</option>
                  <option value="nominated">Nominado (nominated)</option>
                </select>
                {stepErrors.prizeStatus && <p className="form-error">{stepErrors.prizeStatus}</p>}
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  Volver a Actor
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creando y asociando...' : 'Crear Película y Asociar'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
