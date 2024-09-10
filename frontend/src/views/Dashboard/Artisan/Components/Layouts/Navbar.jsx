import { useState, useEffect } from 'react';
import './art.css';
import { Link, useNavigate } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { fetchNotificationsArtisan } from '../Layouts/actions/NotificationActions';
import cookies from 'js-cookie';
import PropTypes from 'prop-types';

import logoImage from './image/Group.png';
import { setLogout } from '../../../../../views/Auth/AuthActions';

const Navbar = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const user = auth?.user; 
  const notifications = useSelector((state) => state.notifications.items);
  const [dropdownNotificationArt, setDropdownNotificationArt] = useState(false);

  useEffect(() => {
    dispatch(fetchNotificationsArtisan());
  }, [dispatch]);
  
  const handleLogout = (e) => {
    e.preventDefault();
    cookies.remove('token');
    props.setLogout();
    navigate('/connexion');
  };

  const toggleDropdownNotificationArt = () => {
    setDropdownNotificationArt(!dropdownNotificationArt);
  };

  function formatTimeAgoNotification(created_at) {
    const date = new Date(created_at);
    const now = new Date();
    const diffMs = now - date;
    const diffSeconds = Math.round(diffMs / 1000);
    const diffMinutes = Math.round(diffSeconds / 60);
    const diffHours = Math.round(diffMinutes / 60);
    const diffDays = Math.round(diffHours / 24);
    const diffWeeks = Math.round(diffDays / 7);
    const diffMonths = Math.round(diffDays / 30);
    const diffYears = Math.round(diffDays / 365);

    if (diffSeconds < 60) {
        return `il y a ${diffSeconds} secondes`;
    } else if (diffMinutes < 60) {
        return `il y a ${diffMinutes} minutes`;
    } else if (diffHours < 24) {
        return `il y a ${diffHours} h`;
    } else if (diffDays < 7) {
        return `il y a ${diffDays} j`;
    } else if (diffWeeks < 4) {
        return `il y a ${diffWeeks} semaines`;
    } else if (diffMonths < 12) {
        return `il y a ${diffMonths} mois`;
    } else {
        return `il y a ${diffYears} ans`;
    }
  }
  

  const renderNotificationContentArtisan = (notification) => {

    
    if (notification.user && notification.artisan && notification.user.id !== notification.artisan.id) {
      return (
        <div className='cnt-nt-usr'>
          <div className='cnt-nt-usr-usr'>
            <div className='cont-txt-nt'>
              <h6 className='nm-nt'>{notification.user.name} <span className='message-style '>{notification.message}</span></h6>
            </div>
            <div>
            {notification.realisation_image && (
              <img src={`http://localhost:8000/storage/realisation/${notification.realisation_image}`} alt="Réalisation" className='realisation-image-nt' />
            )}
            </div>
          </div>
        </div>
      );
    } else if (notification.artisan) {
      return (
        <div className='cnt-nt-usr'>
          <div className='cnt-nt-usr-usr'>
            <div className='cont-txt-nt'>
              <h6 className='nm-nt'>
                {notification.artisan.prenom} {notification.artisan.nom} <span className='message-style'>{notification.message}</span>
              </h6>
            </div>
            {notification.realisation_image && (
              <img src={`http://localhost:8000/storage/realisation/${notification.realisation_image}`} alt="Réalisation" className='realisation-image' />
            )}
          </div>
        </div>
      );
    } else if (notification.user) {
      return (
        <div className='cnt-nt-usr'>
          <div className='cnt-nt-usr-usr'>
            <div className='cont-txt-nt'>
              <h6 className='nm-nt'>{notification.user.name} <span className='message-style'>{notification.message}</span></h6>
            </div>
            {notification.realisation_image && (
              <img src={`http://localhost:8000/storage/realisation/${notification.realisation_image}`} alt="Réalisation" className='realisation-image' />
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className='cnt-nt-usr'>
          <div className='cnt-nt-usr-usr'>
            <div className='cont-txt-nt'>
              <h6 className='nm-nt'><span className='message-style'>{notification.message}</span></h6>
            </div>
            {notification.realisation_image && (
              <img src={`http://localhost:8000/storage/realisation/${notification.realisation_image}`} alt="Réalisation" className='realisation-image' />
            )}
          </div>
        </div>
      );
    }
  };

  const imageUrl = user && user.image ? `http://localhost:8000${user.image.replace('/artisans/artisans/', '/artisans/')}` : '';
    
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
        <div className='notificat-ds' onClick={toggleDropdownNotificationArt}>
          <div><i className="fa-regular fa-bell fs-be"></i></div>
          <div className='c-n-nb'><span className='notif-nbr'>{notifications ? notifications.length : 0}</span></div>
            {dropdownNotificationArt && (
              <div className={`dropdown-menu-notification ${dropdownNotificationArt ? 'show' : ''} notification-scroll`}>
                <div className='cont-tt-nt'>
                  <h5 className='titre-notification'>NOTIFICATION</h5>
                </div>
                <div>
                  <div className='duree-nt'>
                    <h6>Aujourd&apos;hui</h6>
                  </div>
                  {notifications && notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div key={notification.id} className='cnt-link-nt-all'>
                        <div className='cnt-link-nt-lft'>
                          <div className='bg-nt'></div>
                        </div>
                        <div className='cnt-link-nt'>
                          <Link className="cont-link" to="#">
                            <div className='content-nt'>
                              <div className='user-notif'>
                                  <div className='ct-usr-com'>
                                    {notification.user_id === notification.artisan.id  ? (
                                      <img src={`http://localhost:8000/storage/${notification.artisan.image}`} alt={notification.artisan.prenom} className='avatar-notif' />
                                    ) : (
                                      <span className='usr-cm'>{notification.user.name.split(' ').map(part => part[0]).join('').toUpperCase()}</span>
                                    )}
                                  </div>
                                  {renderNotificationContentArtisan(notification)}
                              </div>
                              <div className='cnt-jr-nt'>
                                <span className='day-nt'>{formatTimeAgoNotification(notification.created_at)}</span>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='cont-tt-nt'>
                      <p>Aucune notification</p>
                    </div>
                  )}
                </div>
                <div className='cont-voir-tout'>
                  <div><span className='nm-vt'>Voir tout</span></div>
                </div>
              </div>
            )}
        </div>
        <div className='na-nav-art'>
          {imageUrl ? (
            <img src={imageUrl} alt="Profile" className="profile-image" />
          ) : (
            <div className="profile-initials">
              {user.name ? user.name.charAt(0) : 'U'}
            </div>
          )}
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