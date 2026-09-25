import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/actors" className="navbar-brand">
          Plataforma Cine
        </NavLink>

        <nav>
          <ul className="nav-links">
            <li>
              <NavLink
                to="/actors"
                end
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                Actores
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/actors/create"
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                Crear Actor
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/movies"
                end
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                Películas
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/movies/create"
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                Crear Película
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
