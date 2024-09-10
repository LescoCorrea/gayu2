import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserDetails, updateProfile } from '../../../../Auth/AuthActions';

export default function Profil() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.users.user);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  // Mettre à jour les champs du formulaire avec les détails récupérés
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }
  
    const updatedUserData = { name, email, password, password_confirmation: confirmPassword };
  
    dispatch(updateProfile(updatedUserData))
      .then(() => {
        // Gérer le succès
        alert('Profil mis à jour avec succès.');
      })
      .catch((error) => {
        // Gérer l'échec
        alert(`Erreur lors de la mise à jour du profil: ${error.message}`);
      });
  };
  

  return (
    <div>
      <div className="container mt-3">
        <div className=''>
          <h1 className='titel-sd-re'>Profil</h1>
          <span className='s-t-sd-re'>Gérez votre profil</span>
        </div>
        <div className="dt-cont mt-3">
          <div className='bt-clr'>

          </div>
          <div className='prf-dt'>
            <div className='mb-cnt'>
              <div className='pdg-prf'>
                <h6 className='mb-usr'>{`${name.charAt(0)} ${user?.name?.charAt(0) || ''}`}</h6>
              </div>
            </div>
            <div className='cnt-nm-prf'>
              <h4 className='nm-pfl'>{name}</h4>
              <span className='dtl-pfl'>Mettez à jour votre photo et vos détails personnels</span>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className='cnt-ipt-pfl'>
              <div className='flx-in'>
                <label>Prénom</label>
                <input type="text" name='name' value={name} onChange={(e) => setName(e.target.value)}  className='wdt-inp' />
              </div>
              <div className='flx-in lf-in'>
                <label>Email</label>
                <input type="email" name='email' value={email} onChange={(e) => setEmail(e.target.value)} className='wdt-inp' />
              </div>
            </div>
            <div className='cnt-ipt-pfl mt-3'>
              <div className='flx-in'>
                <label>Mot de passe</label>
                <div className="input-container">
                  <input type={showPassword ? "text" : "password"} name='password' value={password} onChange={(e) => setPassword(e.target.value)} className='wdt-inp' />
                  <i
                    className={`fa-solid ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}
                    onClick={() => setShowPassword(!showPassword)}
                  ></i>
                </div>
              </div>
              <div className='flx-in lf-in'>
                <label>Confirmation mot de passe</label>
                <div className="input-container">
                  <input type={showConfirmPassword ? "text" : "password"} name='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="wdt-inp" />
                  <i
                    className={`fa-solid ${showConfirmPassword ? 'fa-eye' : 'fa-eye-slash'}`}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  ></i>
                </div>
              </div>
            </div>
            <div className='cnt-btn-pfl'>
              <button className='btn-mod-pfl'>Modifier</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
