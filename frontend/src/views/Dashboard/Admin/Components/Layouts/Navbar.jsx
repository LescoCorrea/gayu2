import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import cookies from 'js-cookie';
import PropTypes from 'prop-types';

import logoImage from './image/Group.png';
import { setLogout } from '../../../../../views/Auth/AuthActions'; 

const Navbar = (props) => {
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  
  const handleLogout = (e) => {
    e.preventDefault();
    cookies.remove('token');
    props.setLogout();
    navigate('/connexion');
  };

  const getInitials = (name) => {
    if (!name) return '';
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      // Si le nom est composé d'un seul mot (prénom ou nom), utiliser les deux premières lettres
      return nameParts[0].slice(0, 2).toUpperCase();
    } else {
      // Sinon, utiliser la première lettre du prénom et du nom
      return `${nameParts[0][0] || ''}${nameParts[1][0] || ''}`.toUpperCase();
    }
  };

  return (
    <div>
      <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dash">
        <Link className="navbar-brand ps-3" to="/">
          <img src={logoImage} alt="logo" />
        </Link>
        <button
          className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0"
          id="sidebarToggle"
          href="#!"
        >
          <i className="fas fa-bars"></i>
        </button>
        <form className="d-none d-md-inline-block ms-auto me-0 me-md-3 my-2 my-md-0">
          <div className="d-inp-ad">
            <i className="fa-solid fa-magnifying-glass sr-f-src"></i>
            <input className="r-ds" type="text" placeholder="Recherchez..." />
          </div>
        </form>
        <div className='notificat-ds'>
          <div><i className="fa-regular fa-bell fs-be"></i></div>
          <div className='c-n-nb'><span className='notif-nbr'>3</span></div>
        </div>
        <div className='na-nav'>
          <span>{getInitials(user?.name)}</span>
        </div>
        <div className='d-logt'>
          <i className="fa-solid fa-right-from-bracket log-d" onClick={handleLogout}></i>
        </div>
      </nav>
    </div>
  );
};

Navbar.propTypes = {
  setLogout: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => {
  return {
    setLogout: () => dispatch(setLogout())
  };
};

export default connect(null, mapDispatchToProps)(Navbar);
