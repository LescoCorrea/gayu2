import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { BounceLoader } from 'react-spinners';
import { register } from './AuthActions';
import './Auth.css'

export default function Register() {

  const dispatch = useDispatch();
  const { user, error } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEmailError('');
    setNameError('');
    setPasswordError('');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await dispatch(register({ name, email, password }));
    } catch (error) {
      console.error('Erreur Login :', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      if (user.role === 1) {
        navigate('/admin/dashboard');
      } else if (user.role === 0) {
        navigate('/user/dashboard');
      }
    }
  }, [user, navigate]);

  return (
    <>
        <div className="vh-100 bg-image">
            <div className="mask d-flex align-items-center h-100 gradient-custom-3">
                    <div className="container h-100">
                        <div className="row d-flex justify-content-center align-items-center h-100">
                            <div className="col-12 col-md-12 col-lg-7 col-xl-6">
                                <div className="cards-log">
                                    <div className="card-body body-form">
                                        <h2 className="text-uppercase text-center mb-3 tit">Inscription</h2>
                                        <div className='cont-form'>
                                            {error && <p className="error-message">{error}</p>}
                                            <form className='formSub' onSubmit={handleFormSubmit}>
                                                <div className='error-content'>
                                                </div>
                                                <div className="mb-3">
                                                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="inp-log" placeholder='Nom complet' />
                                                  {nameError && <p className="error-message">{nameError}</p>}
                                                </div>
                                                <div className="mb-3">
                                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="inp-log" placeholder='Email' />    
                                                    {emailError && <p className="error-message">{emailError}</p>}
                                                </div>
                                                <div className="mb-3">
                                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="inp-log" placeholder='Mot de Passe' />  
                                                    {passwordError && <p className="error-message">{passwordError}</p>}
                                                </div>
                                                <div className="d-flex justify-content-center">
                                                    <button type="submit" className="btn-co">
                                                        {loading ? (
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <BounceLoader size={20} color={"#fff"} />
                                                                <span style={{ marginLeft: '8px' }}>Chargement...</span>
                                                            </div>
                                                            ) : 'INSCRIPTION'
                                                        }
                                                    </button>
                                                </div>
                                                <p className="text-center text-muted mt-5 mb-0 par-con">J&apos;ai déjà un compte <Link to="/connexion"
                                                className="fw-bold text-body"><u className='ins-con'>S&apos;identifier</u></Link></p>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
      </>
  )
}
