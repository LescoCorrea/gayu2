
import { NavLink } from 'react-router-dom'
import './user.css'


export default function Sidebar() {
    return (
        <div>
            <nav className="sb-sidenav accordion sb-sidenav-art" id="sidenavAccordion">
                <div className="sb-sidenav-menu">
                    <div className="nav">
                        <NavLink className="nav-links-user" activeClassName="nav-links-user-active" to="/user/dashboard">
                            <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                            <div className='link-ar'><h6 className='link-name-ar'>Dashboard</h6></div>
                        </NavLink>
                        <NavLink className="nav-links-user" activeClassName="nav-links-user-active" to="/user/favoris">
                            <div className="sb-nav-link-icon"><i className="fa fa-gratipay" aria-hidden="true"></i></div>
                            <div className='link-ar'><h6 className='link-name-ar'>Mes Favoris</h6></div>
                        </NavLink>
                        <NavLink className="nav-links-user" activeClassName="nav-links-user-active" to="/user/reservation">
                            <div className="sb-nav-link-icon"><i className="fa-solid fa-table-list" aria-hidden="true"></i></div>
                            <div className='link-ar'><h6 className='link-name-ar'>Reservations</h6></div>
                        </NavLink>
                        <NavLink className="nav-links-user" activeClassName="nav-links-user-active" to="/user/archive">
                            <div className="sb-nav-link-icon"><i className="fa-solid fa-box-archive"></i></div>
                            <div className='link-ar'><h6 className='link-name-ar'>Archives</h6></div>
                        </NavLink>
                        <NavLink className="nav-links-user" activeClassName="nav-links-user-active" to="/user/profil">
                            <div className="sb-nav-link-icon"><i className="fa fa-user-circle-o" aria-hidden="true"></i></div>
                            <div className='link-ar'><h6 className='link-name-ar'>Profil</h6></div>
                        </NavLink>
                    </div>
                </div>
                <div className="sb-sidenav-footer">
                    <h6 className="t-b">Tableau de bord</h6>
                </div>
            </nav>
        </div>
    )
}
