
import { NavLink } from 'react-router-dom'
import './art.css'

export default function Sidebar() {
    return (
        <div>
            <nav className="sb-sidenav accordion sb-sidenav-art" id="sidenavAccordion">
                <div className="sb-sidenav-menu">
                    <div className="nav">
                        <NavLink className="nav-links-user" activeClassName="nav-links-user-active" to="/artisan/dashboard">
                            <div className="sb-nav-link-icon"><i className="fa-sharp fa-solid fa-house"></i></div>
                            <div className='link-ar'><h6 className='link-name-ar'>Dashboard</h6></div>
                        </NavLink>
                        <NavLink className="nav-links-user" activeClassName="nav-links-user-active" to="/artisan/realisation">
                            <div className="sb-nav-link-icon"><i className="fa-solid fa-golf-ball-tee"></i></div>
                            <div className='link-ar'><h6 className='link-name-ar'>Réalisations</h6></div>
                        </NavLink>
                        <NavLink className="nav-links-user" activeClassName="nav-links-user-active" to="/artisan/travaux">
                            <div className="sb-nav-link-icon"><i className="fa-solid fa-table-list"></i></div>
                            <div className='link-ar'><h6 className='link-name-ar'>Réservations</h6></div>
                        </NavLink>
                        <NavLink className="nav-links-user" activeClassName="nav-links-user-active" to="/artisan/planing">
                            <div className="sb-nav-link-icon"><i className="fa fa-calendar-check-o" aria-hidden="true"></i></div>
                            <div className='link-ar'><h6 className='link-name-ar'>Disponibilité</h6></div>
                        </NavLink>
                        <NavLink className="nav-links-user" activeClassName="nav-links-user-active" to="/artisan/avis">
                            <div className="sb-nav-link-icon"><i className="fa fa-commenting" aria-hidden="true"></i></div>
                            <div className='link-ar'><h6 className='link-name-ar'>Avis</h6></div>
                        </NavLink>
                        <NavLink className="nav-links-user" activeClassName="nav-links-user-active" to="/artisan/profil">
                            <div className="sb-nav-link-icon"><i className="fa fa-user-circle-o" aria-hidden="true"></i></div>
                            <div className='link-ar'><h6 className='link-name-ar'>Profil</h6></div>
                        </NavLink>
                        {/*<li className="dropdown mh">
                            <Link className="nav-link nav-links dropdown-toggle" id="navbarDropdown" to="/#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Signaler</Link>
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                <li><Link className="dropdown-item di" to="#!">Occupée</Link></li>
                                <li><Link className="dropdown-item di" to="#!">Disponible</Link></li>
                                <li><hr className="dropdown-divider" /></li>
                            </ul>
                        </li>*/}
                    </div>
                </div>
            </nav>
        </div>
    )
}
