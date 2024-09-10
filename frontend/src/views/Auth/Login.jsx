import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BounceLoader } from 'react-spinners';
import { login } from './AuthActions';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, error } = useSelector(state => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEmailError('');
    setPasswordError('');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await dispatch(login({ email, password }));
    } catch (error) {
      console.error('Erreur Login :', error);
    } finally {
      setLoading(false); // Désactiver le chargement après la demande
    }
  };
  
  useEffect(() => {
    if (user) {
      if (user.role === 1) {
        navigate('/admin/dashboard');
      } else if (user.role === 0) {
        navigate('/user/dashboard');
      } else if (user.role && user.role.includes('artisan')) {
        navigate('/artisan/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);
  
  useEffect(() => {
    if (error) {
      if (error === 'Email incorrect') {
        setEmailError('Email incorrect.');
      } else if (error === 'Mot de passe incorrect') {
        setPasswordError('Mot de passe incorrect.');
      } else {
        // Afficher un message d'erreur général
        setEmailError('Une erreur est survenue. Veuillez réessayer.');
        setPasswordError(''); // Assurer qu'il n'y a pas de message de mot de passe si une autre erreur se produit
      }
    }
  }, [error]);


  return (
    <div>
      <section className="vh-100 bg-image">
        <div className="mask d-flex align-items-center h-100 gradient-custom-3">
          <div className="container h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-12 col-md-12 col-lg-7 col-xl-6">
                <div className="cards-log">
                  <div className="card-body body-form">
                    <h2 className="text-uppercase text-center mb-3 tit">Connexion</h2>

                    <div className='cont-form'>
                      <form className='formSub' onSubmit={handleForm}>
                        <div className="mb-3">
                          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="inp-log" placeholder='Email' />
                          {emailError && <p className="error-message">{emailError}</p>}
                        </div>
                        <div className="mb-3">
                          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="inp-log" placeholder='Mot de Passe' />
                          {passwordError && <p className="error-message">{passwordError}</p>}
                        </div>

                        <div className="d-flex justify-content-center" >
                          <button type="submit" className="btn-co">
                            {loading ? (
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <BounceLoader size={20} color={"#fff"} />
                                <span style={{ marginLeft: '8px' }}>Connexion en cours...</span>
                              </div>
                              ) : 'SE CONNECTER'
                            }
                          </button>
                        </div>

                        <p className="text-center text-muted mt-5 mb-0 par-con">J&apos;ai pas de compte? <Link to="/inscription"
                          className="fw-bold text-body"><u className="ins-con">M&apos;inscrire</u></Link></p>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
