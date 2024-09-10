import { useState, useEffect } from 'react';
import './user.css';
import { Link, useNavigate } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from '../../../Artisan/Components/Layouts/actions/NotificationActions';
import cookies from 'js-cookie';
import PropTypes from 'prop-types';
import Sidebar from './Sidebar';
import logoImage from './image/Group.png';
import { setLogout } from '../../../../../views/Auth/AuthActions';

const Navbar = (props) => {
  const navigate = useNavigate();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.items);
  const [dropdownNotification, setDropdownNotification] = useState(false);
  
  const handleLogout = (e) => {
    e.preventDefault();
    cookies.remove('token');
    props.setLogout();
    navigate('/connexion');
  };

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const toggleDropdownNotification = () => {
    setDropdownNotification(!dropdownNotification);
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

  const renderNotificationContentUser = (notification) => {
    // Fonction pour formater le message avec le texte entre <<
    const formatMessage = (message) => {
      if (!message) return null;
  
      // Ajouter les délimiteurs et une classe à la balise <strong>
      const formattedMessage = message.replace(/<<([^>]*)>>/g, '<< <strong class="highlighted-text">$1</strong> >>');
      console.log('Formatted Message:', formattedMessage); // Affichage dans la console
  
      return formattedMessage;
    };
  
    // Rendu conditionnel basé sur les propriétés de la notification
    if (notification.user && notification.artisan) {
      return (
        <div className='cnt-nt-usr'>
          <div className='cnt-nt-usr-usr'>
            <div className='cont-txt-nt'>
              <h6 className='nm-usr-text'>
                {notification.artisan.prenom} {notification.artisan.nom} <span className='message-style' dangerouslySetInnerHTML={{ __html: formatMessage(notification.message) }} />
              </h6>
            </div>
            <div className='d-img-nt'>
              {notification.realisation_image && (
                <img src={`http://localhost:8000/storage/realisation/${notification.realisation_image}`} alt="Réalisation" className='realisation-image-nt' />
              )}
            </div>
          </div>
        </div>
      );
    } else if (notification.user) {
      return (
        <div className='cnt-nt-usr'>
          <div className='cnt-nt-usr-usr'>
            <div className='cont-txt-nt'>
              <h6 className='nm-usr-text'><span className='message-style' dangerouslySetInnerHTML={{ __html: formatMessage(notification.message) }} /></h6>
            </div>
            <div className='d-img-nt'>
              {notification.realisation_image && (
                <img src={`http://localhost:8000/storage/realisation/${notification.realisation_image}`} alt="Réalisation" className='realisation-image-nt' />
              )}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className='cnt-nt-usr'>
          <div className='cnt-nt-usr-usr'>
            <div className='cont-txt-nt'>
              <h6 className='nm-usr-text'><span className='message-style' dangerouslySetInnerHTML={{ __html: formatMessage(notification.message) }} /></h6>
            </div>
            <div className='d-img-nt'>
              {notification.realisation_image && (
                <img src={`http://localhost:8000/storage/realisation/${notification.realisation_image}`} alt="Réalisation" className='realisation-image-nt' />
              )}
            </div>
          </div>
        </div>
      );
    }
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

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };


  return (
    <div>
      <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dash">
        <Link className="navbar-brand ps-3" to="/">
          <img src={logoImage} alt="logo" />
        </Link>
        
        <form className="d-none d-md-inline-block ms-auto me-0 me-md-3 my-2 my-md-0">
          <div className="d-inp-ad">
            <i className="fa-solid fa-magnifying-glass sr-f-src"></i>
            <input className="r-ds" type="text" placeholder="Recherchez..." />
          </div>
        </form>
        <div className='cnt-nt-nm'>
          <div className='notificat-ds' onClick={toggleDropdownNotification}>
            <div><i className="fa-regular fa-bell fs-be"></i></div>
            <div className='c-n-nb'><span className='notif-nbr'>{notifications ? notifications.length : 0}</span></div>
              {dropdownNotification && (
                <div className={`dropdown-menu-notification ${dropdownNotification ? 'show' : ''} notification-scroll`}>
                  <div className='cont-tt-nt'>
                    <h5 className='titre-notification'>NOTIFICATION</h5>
                  </div>
                  <div>
                    {notifications && notifications.length > 0 ? (
                      // Affichage des notifications
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
                                      {notification.artisan && notification.artisan.image ? (
                                        <img src={`http://localhost:8000/storage/${notification.artisan.image}`} alt={notification.artisan.prenom} className='avatar-notif' />
                                      ) : (
                                        <span className='usr-cm-usr'>{notification.user && notification.user.name ? notification.user.name.split(' ').map(part => part[0]).join('').toUpperCase() : 'NN'}</span>
                                      )}
                                  </div>
                                  {renderNotificationContentUser(notification)}
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
        
          <div className='na-nav'>
            <span>{getInitials(user?.name)}</span>
          </div>
        </div>
        <button
          className="btn btn-link btn-sm"
          id="sidebarToggle"
          onClick={toggleSidebar}
        >
          <i className="fas fa-bars"></i>
        </button>
        <div className='d-logt'>
          <i className="fa-solid fa-right-from-bracket log-d" onClick={handleLogout}></i>
        </div>
      </nav>
      {sidebarVisible && <Sidebar />}
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
