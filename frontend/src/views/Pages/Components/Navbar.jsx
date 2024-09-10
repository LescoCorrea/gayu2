import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './Topnav.css';
import cookies from 'js-cookie';
import { setLogout } from '../../Auth/AuthActions'; 
import logo from './image/logo.png';


export default function Navbar() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [click, setClick] = useState(false);
    const handleClick = () => setClick(!click);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = (e) => {
        e.preventDefault();
        cookies.remove('token');
        dispatch(setLogout()); // Utilisez dispatch ici
        navigate('/');
    };

    const user = useSelector(state => state.auth.user);
    const role = user ? user.role : ''; 
    const roles = Array.isArray(role) ? role : [role];

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };


    var Authbutton = '';

    if (!user) {
        Authbutton = (
            <div className='btn-cont'>
                <Link to="/connexion">CONNEXION</Link>
                <span className='bar'>/</span>
                <Link to="/inscription" className='reg'> INSCRIPTION</Link>
            </div>
        );
    } else {
        Authbutton = (
            <div className='es-link'>
                <div className='mn-es'>
                    <Link to={
                        role === 1 ? "/admin/dashboard" :
                        roles.includes('artisan') ? "/artisan/dashboard" :
                        role === 0 ? "/user/dashboard" :
                            "/accueil"
                    }>
                        MON ESPACE
                    </Link>
                </div>
                <div className="custom-dropdown-container">
                    <i 
                        className="fa-solid fa-user icon-d" 
                        onClick={toggleDropdown}
                    ></i>
                    <i className="fa-solid fa-right-from-bracket lgt" onClick={handleLogout}></i>
                </div>
            </div>
        );
    }


    return (
        <div>
            <div className="container navbar-cont">
                <nav className='navs' >
                    <a href="/" className='avatar-img'><img src={logo} alt="logo-gayu" /></a>
                    <ul className={click ? "nav-menu active" : "nav-menu"}>
                        <li className='nav-item'>
                            <NavLink to="/" activeClassName="active" className="nav-links" onClick={handleClick}>ACCUEIL</NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink to="/artisans" activeClassName="active" className="nav-links" onClick={handleClick} >NOS ARTISANS</NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink to="/propos" activeClassName="active" className="nav-links" onClick={handleClick} >A PROPOS DE NOUS</NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink to="/contact" activeClassName="active" className="nav-links" onClick={handleClick} >CONTACT</NavLink>
                        </li>
                        {Authbutton}
                    </ul>
                    {/*<div className='nav-icon' onClick={handleClick}>
                        <i className={click ? "fa fa-times" : 'fa fa-bars'}></i>
                    </div>*/}
                </nav>

            </div>
        </div>
    )
}
