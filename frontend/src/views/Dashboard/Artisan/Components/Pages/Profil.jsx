import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchArtisanDetails, updateArtisanProfile, updateArtisanImage } from '../Actions/artisanActions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Profil() {
  const fileInputRefProfil = useRef(null);
  const dispatch = useDispatch();
  const artisan = useSelector(state => state.artisans.artisanDetails);
  const [selectedImages, setSelectedImages] = useState([]);
  const [inputsImage, setInputsImage] = useState({
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [showModalProfil, setShowModalProfil] = useState(false);

  useEffect(() => {
    dispatch(fetchArtisanDetails());
  }, [dispatch]);

  useEffect(() => {
    if (artisan) {
      setPrenom(artisan.prenom || '');
      setNom(artisan.nom || '');
      setTelephone(artisan.téléphone || '');
      setEmail(artisan.email || '');
      if (artisan.image) {
        setInputsImage({ image: [artisan.image] });
        setSelectedImages([artisan.image]);
      }
    }
  }, [artisan]);

  const handleFileButtonClickProfil = () => {
    if (fileInputRefProfil.current) {
      fileInputRefProfil.current.click();
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setInputsImage(prevInputs => ({
      ...prevInputs,
      image: files.length > 0 ? files : prevInputs.image
    }));
    setSelectedImages(files);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = Array.isArray(inputsImage.image)
      ? inputsImage.image.filter((_, idx) => idx !== index)
      : [];

    setInputsImage({
      ...inputsImage,
      image: updatedImages
    });
    setSelectedImages(updatedImages);
  };
  

  const handleSubmitImage = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const formData = new FormData();
  
    formData.append('_method', 'PUT');
    if (inputsImage.image) {
      formData.append('image', inputsImage.image[0]);
    }
  
    try {
      await dispatch(updateArtisanImage(formData));
      toast.success('Image mise à jour avec succès!');
      dispatch(fetchArtisanDetails());
      setShowModalProfil(false);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour de l\'image');
    } finally {
      setLoading(false);
    }
  };
  

  const handleSubmitProfil = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas.');
      return;
    }

    const updatedData = {
      prenom,
      nom,
      telephone,
      email,
      password: newPassword,
      password_confirmation: confirmPassword,
    };

    try {
      const response = await dispatch(updateArtisanProfile(updatedData));
      console.log('Response:', response);
      toast.success('Profil mis à jour avec succès!');
    } catch (error) {
      console.error('Error during profile update', error);
      toast.error('Erreur lors de la mise à jour du profil');
    }
    
  };

  const handleCloseModalProfil = () => {
    setShowModalProfil(false);
  };

  return (
    <div>
      <div className="container mt-3">
        <ToastContainer />
        <div className=''>
          <h1 className='titel-sd-re'>Profil</h1>
          <span className='s-t-sd-re'>Gérez votre profil</span>
        </div>
        <div className="dt-cont mt-3">
          <div className='bt-clr'>

          </div>
          <div className='prf-dt'>
            <div className='mb-cnt'>
              {artisan && (
                <div className='pdg-prf-img'>
                  <img src={`http://localhost:8000/storage/${artisan.image}`} alt="img" />
                </div>
              )}
              <div className='cnt-cam'>
                <i className="fa-solid fa-camera" onClick={() => setShowModalProfil(true)}></i>
              </div>
                        {showModalProfil && (
                          <div className='modal-overlay-modif'>
                            <div className="modal-modif">
                              <div className="modal-content-modif">
                                <div>
                                  <span className="close-atri" onClick={handleCloseModalProfil}>&times;</span>
                                  <h1 className="t-md-rl">MODIFIER VOTRE IMAGE</h1>
                                </div>
                                    <form onSubmit={handleSubmitImage}>
                                        <div className="modal-body">
                                            <div className=' mt-3'>
                                                <div>
                                                  <div className='mt-3 cont-upload'>
                                                    <button type="button" onClick={handleFileButtonClickProfil} className='tl-upl'>
                                                      Selectionner une image
                                                    </button>
                                                    <input
                                                      type="file"
                                                      ref={fileInputRefProfil}
                                                      multiple
                                                      accept="image/*"
                                                      style={{ display: 'none' }}
                                                      onChange={handleImageChange}
                                                    />
                                                    <div className="selected-images mt-3">
                                                        {selectedImages.map((image, index) => (
                                                          <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                                                            <img
                                                              src={image instanceof File ? URL.createObjectURL(image) : `http://127.0.0.1:8000/storage/${artisan.image}`}
                                                              alt={`Selected ${index}`}
                                                              className="ig-pfl"
                                                            />
                                                            <i
                                                              className="fa-regular fa-circle-xmark c-tr-ic"
                                                              style={{ position: 'absolute', top: '-8px', right: '-9px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                                                              onClick={(event) => handleRemoveImage(index, event)}
                                                            ></i>
                                                          </div>
                                                        ))}
                                                        {selectedImages.length === 0 && (
                                                          <>
                                                            <div className=''><i className="fa-solid fa-upload f-upld"></i></div>
                                                            <p className='upl-img'>Glisser ou importer une image</p>
                                                          </>
                                                        )}
                                                    </div>
                                                  </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer-form">
                                          <button type="reset" className="btn-r-upl" onClick={handleCloseModalProfil}>ANNULER</button>
                                          <button type="submit" className="btn-r-smt" disabled={loading}>
                                            {loading ? (
                                              <>
                                                <span className="spinner"></span>
                                                <span>Patientez...</span>
                                              </>
                                            ) : (
                                              <span>ENREGISTRER</span>
                                            )}
                                          </button>
                                        </div>
                                  </form>
                              </div>
                            </div>
                          </div>
                        )}
            </div>
            <div className='cnt-nm-prf'>
              <h4 className='nm-pfl'>{prenom} {nom}</h4>
              <span className='dtl-pfl'>Mettez à jour votre photo et vos détails personnels.</span>
            </div>
          </div>
          <form onSubmit={handleSubmitProfil}>
            <div className='cnt-ipt-pfl'>
              <div className='flx-in'>
                <label>Prénom</label>
                <input type="text" name='prenom' value={prenom} onChange={(e) => setPrenom(e.target.value)} className='wdt-inp' />
              </div>
              <div className='flx-in lf-in'>
                <label>Nom de famille</label>
                <input type="text" name='nom' value={nom} onChange={(e) => setNom(e.target.value)} className='wdt-inp' />
              </div>
            </div>
            <div className='cnt-ipt-pfl mt-3'>
              <div className='flx-in'>
                <label>Téléphone</label>
                <input type="text" name='téléphone' value={telephone} onChange={(e) => setTelephone(e.target.value)} className='wdt-inp' />
              </div>
              <div className='flx-in lf-in'>
                <label>Email</label>
                <input type="text" name='email'  value={email} onChange={(e) => setEmail(e.target.value)} className='wdt-inp' />
              </div>
            </div>
            <div className='cnt-ipt-pfl mt-3'>
              <div className='flx-in '>
                <label>Nouveau mot de passe</label>
                <div className="input-container">
                  <input type={showPassword ? 'password' : 'text'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}  className='wdt-inp' />
                  <i onClick={() => setShowPassword(!showPassword)} className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </div>
              </div>
              <div className='flx-in lf-in'>
                <label>Confirmation mot de passe</label>
                <div className="input-container">
                  <input type={showPasswordConfirm ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="wdt-inp" />
                  <i onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} className={`fa-solid ${showPasswordConfirm ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                </div>
              </div>
            </div>
            <div className='cnt-btn-pfl'>
              <button type='button' className='btn-mod-pfl-an'>Annuler</button>
              <button type='submit'  className='btn-mod-pfl'>Soumettre</button>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  )
}
