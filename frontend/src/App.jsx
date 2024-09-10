import { useEffect, useState } from 'react';
import './App.css'; 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Login from './views/Auth/Login';
import Register from './views/Auth/Register';
import Accueil from './views/Pages/Accueil';
import cookies from 'js-cookie';
import axios from 'axios';
import { setUser  } from './views/Auth/AuthActions'
import MasterAdmin from './views/Dashboard/Admin/Components/Layouts/MasterAdmin';
import MasterUser from './views/Dashboard/User/Components/Layouts/MasterUser';
import MasterArtisan from './views/Dashboard/Artisan/Components/Layouts/MasterArtisan';
import Artisans from './views/Pages/Artisans/Artisans';
import Artisan from './views/Pages/Artisans/Artisan';
import PulseLoader from 'react-spinners/PulseLoader';
import Propos from './views/Pages/Propos/Propos';
import Contact from './views/Pages/Contact/Contact';
import Confidentialite from './views/Pages/Confidentialite';

//axios.defaults.headers.post['Content-Type'] = "Application/json";
//axios.defaults.headers.post['Accept'] = "Application/json";
axios.defaults.withCredentials = true;

axios.interceptors.request.use(
  (config) => {
    const token = cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      //console.log('Authorization header:', config.headers.Authorization); // Ajoutez ce log pour vérifier le format de l'en-tête Authorization
    } else {
      //console.log('Token not found in cookies'); // Ajoutez ce log pour vérifier si le token est récupéré depuis les cookies
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function App() { 

  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = cookies.get('token');
    if (token) {
      axios
        .get('http://127.0.0.1:8000/api/me')
        .then((response) => {
          console.log('User data:', response.data.user);
          dispatch(setUser(response.data.user));
          setLoading(false);
        })
        .catch((error) => {
          console.error('Failed to fetch user info:', error);
          setLoading(false); // Assurez-vous que loading est toujours mis à false en cas d'erreur
        });
    } else {
      setLoading(false); // Si aucun token n'est trouvé, mettez loading à false immédiatement
    }
  }, [dispatch]);


  console.log('état auth:', auth);

  if (loading) {
    return (
      <div className="loading-overlay">
        <PulseLoader color={'#9A0000'} loading={true} size={15} />
      </div>
    );
  }

  const userRole = auth.user ? auth.user.role : null;
  const roles = Array.isArray(userRole) ? userRole : [userRole];

  return (
    <Router>
      <Routes>
        <Route path='/connexion' element={<Login />} />
        <Route path='/inscription' element={<Register />} />
        <Route path='/' element={<Accueil />} />
        <Route path='/artisans' element={<Artisans />} />
        <Route path='/propos' element={<Propos />} />
        <Route path='/confidentialite' element={<Confidentialite />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/voirartisan/:id' element={<Artisan />}/>
        <Route path='/voirartisan/:id/:commentaire_id' element={<Artisan />} />
        {/*<Route path='/user/*' element={<MasterUser />} />
        <Route path='/admin/*' element={<MasterAdmin />} />
        <Route path='/artisan/*' element={<MasterArtisan />} />*/}
        {/* Route protégée par rôle */}
        {auth.user && auth.user.role === 1 && (
          <Route path='/admin/*' element={<MasterAdmin />} />
        )}
        
        {/* Route protégée par rôle */}
        {auth.user && auth.user.role === 0 && (
          <Route path='/user/*' element={<MasterUser />} />
        )}

        {roles.includes('artisan') && (
          <Route path='/artisan/*' element={<MasterArtisan />} />
        )}

        {!auth.user && (
          <Route path='*' element={<Navigate to='/connexion' />} />
        )}

      </Routes>
    </Router>
  );
}
export default App;
