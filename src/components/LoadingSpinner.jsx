export default function LoadingSpinner({ message = 'Cargando...' }) {
  return (
    <div className="spinner-container">
      <div className="spinner" role="status" aria-label="Cargando"></div>
      <p>{message}</p>
    </div>
  );
}
