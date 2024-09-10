
import {NavLink } from 'react-router-dom'
import './Navbar.css'

export default function Sidebar() {

    
    return (
        <div>
            <nav className="sb-sidenav accordion bg-sid" id="sidenavAccordion">
                <div className="sb-sidenav-menu ">
                    <div className="nav mt-3 sb-dash">
                        <NavLink className="nav-links-user" activeClassName="nav-links-user-active" to="/admin/dashboard">
                            <div className="sb-nav-link-icon"><i className="fa-sharp fa-solid fa-house f-sr"></i></div>
                            <div><h6 className='nam-dash'>Dashboard</h6></div>
                        </NavLink>
                        <NavLink className="nav-links-user" activeClassName="nav-links-user-active" to="/admin/users">
                            <div className="sb-nav-link-icon"><i className="fa-solid fa-users f-sr"></i></div>
                            <div><h6 className='nam-dash'>Utilisateurs</h6></div>
                        </NavLink>
                        <NavLink className="nav-links-user" activeClassName="nav-links-user-active" to="/admin/artisans">
                            <div className="sb-nav-link-icon"><i className="fa-solid fa-user f-sr"></i></div>
                            <div><h6 className='nam-dash'>Artisans</h6></div>
                        </NavLink>
                        <NavLink className="nav-links-user" activeClassName="nav-links-user-active" to="/admin/roles">
                            <div className="sb-nav-link-icon"><i className="fa-solid fa-users-gear f-sr"></i></div>
                            <div><h6 className='nam-dash'>Roles</h6></div>
                        </NavLink>
                        <NavLink className="nav-links-user" activeClassName="nav-links-user-active" to="/admin/metiers">
                            <div className="sb-nav-link-icon"><i className="fa-solid fa-hammer f-sr"></i></div>
                            <div><h6 className='nam-dash'>Métiers</h6></div>
                        </NavLink>
                        <NavLink className="nav-links-user" activeClassName="nav-links-user-active" to="/admin/regions">
                            <div className="sb-nav-link-icon"><i className="fa-solid fa-building-user f-sr"></i></div>
                            <div><h6 className='nam-dash'>Régions</h6></div>
                        </NavLink>
                        <NavLink className="nav-links-user" activeClassName="nav-links-user-active" to="/admin/temoignage">
                            <div className="sb-nav-link-icon"><i className="fa-solid fa-comment f-sr"></i></div>
                            <div><h6 className='nam-dash'>Témoignages</h6></div>
                        </NavLink>
                        <NavLink className="nav-links-user" activeClassName="nav-links-user-active" to="/admin/profil">
                            <div className="sb-nav-link-icon"><i className="fa-solid fa-gear f-sr"></i></div>
                            <div><h6 className='nam-dash'>Paramètres</h6></div>
                        </NavLink>
                    </div>
                </div>
            </nav>
        </div>
    )
}
