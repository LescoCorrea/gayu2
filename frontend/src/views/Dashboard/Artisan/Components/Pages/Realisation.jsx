
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';
import Swal from 'sweetalert2';
import { addRealisation, fetchRealisations, deleteRealisation, showRealisation, updateRealisation  } from '../Actions/realisationActions';
import './artisan.css'

export default function Realisation() {
  const dispatch = useDispatch();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsModif, setModalIsModif] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const fileInputRef = useRef(null);
  const realisations = useSelector(state => state.realisations.realisations || []);
  const realisation = useSelector((state) => state.realisations.realisation);
  const [titre, setTitre] = useState('');
  const [prix, setPrix] = useState('');
  const [status, setStatus] = useState('nouveau');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [inputs, setInputs] = useState({
    titre: '',
    prix: '',
    status: '',
    images: []
  });
  const [editId, setEditId] = useState(null);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  useEffect(() => {
    dispatch(fetchRealisations());
  }, [dispatch]);

  useEffect(() => {
    if (realisation) {
      setInputs({
        titre: realisation.titre || '',
        prix: realisation.prix || '',
        status: realisation.status || '',
        images: realisation.images || []
      });
      setExistingImages(realisation.images || []);
    }
  }, [realisation]);

  function openModal() {
    setModalIsOpen(true);
  }

  function handleEdit(id) {
    dispatch(showRealisation(id));
    setEditId(id);
    setModalIsModif(true);
  }


  function closeModif() {
    setModalIsModif(false);
    setInputs({
      titre: '',
      prix: '',
      status: '',
    });
    setSelectedImages([]);
    setExistingImages([]);
    setErrors({});
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  function handleImageUpload(event) {
    const files = Array.from(event.target.files);
    setSelectedImages(prevImages => [...prevImages, ...files]);
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages((prevImages) => [...prevImages, ...files]);
  };

  useEffect(() => {
    return () => {
        selectedImages.forEach(image => URL.revokeObjectURL(image.url));
    };
  }, [selectedImages]);

  function handleFileButtonClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }
  function handleDrop(event) {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setSelectedImages(prevImages => [...prevImages, ...files]);
  }

  function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy'; // Visual cue for copy operation
  }

  const removeImage = (index, isExisting, imageId) => {
    if (isExisting) {
      // Ajouter l'image à la liste des images à supprimer
      if (imageId) {
        setImagesToDelete(prev => [...prev, imageId]);
        console.log('id img :', imageId);
      }
      // Supprimer l'image de la liste d'images existantes
      setExistingImages(existingImages.filter((_, i) => i !== index));
    } else {
      // Supprimer l'image de la liste des nouvelles images sélectionnées
      setSelectedImages(selectedImages.filter((_, i) => i !== index));
    }
  };
  

  const handleArtSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Démarrer le chargement
    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('prix', prix);
    formData.append('status', status);
    selectedImages.forEach(image => {
      formData.append('images[]', image);
    });

    try {
      await dispatch(addRealisation(formData));
      toast.success('Réalisation ajoutée avec succès.');
      // Réinitialiser le formulaire
      setTitre('');
      setPrix('');
      setStatus('nouveau');
      setSelectedImages([]);
      closeModal();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error('Une erreur s\'est produite lors de l\'ajout de la réalisation.');
      }
    } finally {
      setLoading(false); // Arrêter le chargement
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Êtes-vous sûr?',
        text: 'Vous ne pourrez pas revenir en arrière!',
        showCancelButton: true,
        confirmButtonColor: '#02df56',
        cancelButtonColor: '#9A0000',
        confirmButtonText: 'supprimer',
        cancelButtonText: 'Annuler',
        customClass: {
          confirmButton: 'btn-swal-confirm', // Utilisez customClass pour appliquer votre classe personnalisée au bouton
          cancelButton: 'btn-swal-annul'
        },
        buttonsStyling: false,
      });
  
      if (result.isConfirmed) {
        await dispatch(deleteRealisation(id));
        toast.success('Réalisation supprimée avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la réalisation :', error);
      toast.error('Une erreur s\'est produite lors de la suppression de la réalisation.');
    }
  };

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs(values => ({...values, [name]: value}));
  };

  const uploadArtisan = async() => {
    setLoading(true);
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('titre', inputs.titre);
    formData.append('prix', inputs.prix);
    formData.append('status', inputs.status);
    
    existingImages.forEach((image, index) => {
      formData.append(`existing_images[${index}]`, image);
    });

    selectedImages.forEach((file, index) => {
        formData.append(`images[${index}]`, file);
    });

    imagesToDelete.forEach((imageId) => {
      formData.append('images_to_delete[]', imageId);
    });

    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    console.log('FormData avant envoi :', formData);

    try {
      console.log('FormData envoyé :', formData);
      await dispatch(updateRealisation(editId, formData)); 
      toast.success('Réalisation modifiée avec succès.');
      closeModif();
    } catch (error) {
      console.error('Erreur lors de la modification de la réalisation :', error);
      toast.error('Une erreur s\'est produite lors de la modification de la réalisation.');
    }finally {
      setLoading(false);
    }
  }

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    await uploadArtisan();
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const totalRealisations = realisations.length;

  return (
    <div>
      <div className="container mt-3">
        <div className=''>
          <h1 className='titel-sd-re'>Réalisations {totalRealisations}</h1>
          <span className='s-t-sd-re'>Visualisez, modifiez et supprimez une réalisation</span>
        </div>
        <div className='contenair-btn-aj-art mt-3'>
          <button className='btn-ajt-cont' onClick={openModal}>
            <div>
              <i className="fa-solid fa-plus i-pls-art"></i>
            </div>
            <div className='spnm'>
              <span className='nm-tbl-art'>Nouvelle réalisation</span>
            </div>
          </button>
        </div>
        {modalIsOpen && (
          <div className="modal-overlay-modif">
            <div className="modal-modif">
              <div className="modal-content-modif">
                <div>
                  <span className="close-atri" onClick={closeModal}>&times;</span>
                  <h1 className="t-md-rl"><i className="fa-solid fa-arrow-left"></i>AJOUTER UNE REALISATION</h1>
                </div>
                <div className='bord-bot'>
                </div>
                <form onSubmit={handleArtSubmit} className='mt-3'>
                  <div className='cnt-rls'>
                    <div>
                      <label className='ti-fm-re'>Titre de la réalisation</label>
                      <input type="text" name='titre' value={titre} onChange={(e) => setTitre(e.target.value)} className='ipt-rls-mdf' />
                      {errors.titre && <p className='error-message'>{errors.titre[0]}</p>}
                    </div>
                    <div>
                      <label className='ti-fm-re'>Prix de la réalisation</label>
                      <input type="text" name='prix' value={prix} onChange={(e) => setPrix(e.target.value)} className='ipt-rls-mdf' />
                      {errors.prix && <p className='error-message'>{errors.prix[0]}</p>}
                    </div>
                  </div>
                  <div className='mt-3'>
                    <div className='sl-st-re'>
                        <label className='ti-fm-re'>Status de la réalisation</label>
                        <select name="status" value={status} onChange={(e) => setStatus(e.target.value)}  className='ipt-rls-mdf'>
                          <option value="nouveau">Nouveau</option>
                          <option value="ancien">Ancien</option>
                        </select>
                        {errors.status && <p className='error-message'>{errors.status[0]}</p>}
                    </div>
                  </div>
                  <div className='mt-3 cont-upload'
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <button type="button" onClick={handleFileButtonClick} className='tl-upl'>
                      Importer vos réalisations
                    </button>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                    />
                    <div className="selected-images mt-3">
                      {selectedImages.map((image, index) => (
                        <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                          <img
                            src={image instanceof File ? URL.createObjectURL(image) : `http://127.0.0.1:8000/storage/realisation/${image.image}`}
                            alt={`Selected ${index}`}
                            className="selected-image"
                          />
                          <i className="fa-regular fa-circle-xmark c-tr-ic" style={{ position: 'absolute', top: '-8px', right: '-9px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}></i>
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
                  <br />
                  <div className="modal-footer-form">
                    <button type="reset" className="btn-r-upl" onClick={closeModal}>ANNULER</button>
                    <button type="submit" className="btn-r-smt" disabled={loading} >
                        {loading ? (
                          <>
                            <span className="spinner"></span>
                            <span>Patientez...</span>
                          </>
                        ) : (
                          <span>AJOUTER</span>
                        )}
                    </button>
                  </div>
                </form>
            </div>
            </div>
          </div>
        )}
        <div className="row mt-3">
          {realisations && realisations.map((realisation) => (
            <div key={realisation.id} className="col-md-4">
              <div className="card-rea cd-img">
                <div className='st-fl-end'>
                  <div className='n-re'>
                    <small className='s-r'>{realisation.status}</small>
                  </div>
                </div>

                  {realisation.images && realisation.images.length > 0 ? (
                      <div className='image-gallery'>
                        {realisation.images.length > 1 ? (
                          <Slider {...sliderSettings}>
                            {realisation.images.map((image, index) => (
                              <div key={index} className='image-item'>
                                <img src={`http://127.0.0.1:8000/storage/realisation/${image.image}`} className="card-img-top" alt={`realisation-${index}`} />
                              </div>
                            ))}
                          </Slider>
                        ) : (
                          realisation.images.map((image, index) => (
                            <div key={index} className='image-item'>
                              <img src={`http://127.0.0.1:8000/storage/realisation/${image.image}`} className="card-img-top" alt={`realisation-${index}`} />
                            </div>
                          ))
                        )}
                      </div>
                    ) : (
                      <p>Aucune image disponible.</p>
                    )
                  }

                <div className="card-body-re mt-3">
                  <div className='co-real'>
                    <div>
                      <h6 className='t-re-i'>{realisation.titre}</h6>
                      <small className='r-pr'>{realisation.prix} FCFA</small>
                    </div>
                    <div className='c-ic-re'>
                      <div>
                        <i className="fa-solid fa-trash-can i-trs-r re-i" onClick={() => handleDelete(realisation.id)}></i>
                      </div>
                      <div>
                        <i className="fa-solid fa-pen-to-square i-pen-i" onClick={() => handleEdit(realisation.id)}></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {modalIsModif && (
            <div className="modal-overlay-modif">
              <div className="modal-modif">
                <div className="modal-content-modif">
                  <div>
                    <span className="close-atri" onClick={closeModif}>&times;</span>
                    <h1 className="t-md-rl">
                      <i className="fa-solid fa-arrow-left"></i> MODIFIER UNE REALISATION
                    </h1>
                  </div>
                  <form onSubmit={handleUpdateSubmit} className='mt-3' encType="multipart/form-data">
                    <div className='cnt-rls'>
                      <div>
                        <label className='ti-fm-re'>Titre de la réalisation</label>
                        <input
                          type="text"
                          name='titre'
                          value={inputs.titre}
                          onChange={handleInputChange}
                          className='ipt-rls-mdf'
                        />
                        {errors.titre && <p className='error-message'>{errors.titre[0]}</p>}
                      </div>
                      <div>
                        <label className='ti-fm-re'>Prix de la réalisation</label>
                        <input
                          type="text"
                          name='prix'
                          value={inputs.prix}
                          onChange={handleInputChange}
                          className='ipt-rls-mdf'
                        />
                        {errors.prix && <p className='error-message'>{errors.prix[0]}</p>}
                      </div>
                    </div>
                    <div className='mt-3'>
                      <div className='sl-st-re'>
                        <label className='ti-fm-re'>Status de la réalisation</label>
                        <select
                          name="status"
                          value={inputs.status}
                          onChange={handleInputChange}
                          className='ipt-rls-mdf'
                        >
                          <option value="nouveau">Nouveau</option>
                          <option value="ancien">Ancien</option>
                        </select>
                        {errors.status && <p className='error-message'>{errors.status[0]}</p>}
                      </div>
                    </div>
                    <div className='mt-3 cont-upload'>
                      <input
                        type='file'
                        multiple
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                      />
                      <button type='button' className='tl-upl' onClick={() => fileInputRef.current.click()}>
                        Importer vos réalisations
                      </button>
                      <div className="selected-images mt-3">
                        {existingImages.length === 0 && selectedImages.length === 0 ? (
                          <div className="dropzone-content">
                            <div className=''><i className="fa-solid fa-upload f-upld"></i></div>
                            <p className='upl-img'>Glisser ou importer une image</p>
                          </div>
                        ) : (
                          <div className="image-preview">
                            {existingImages.map((image, index) => (
                              <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                                <img
                                  src={`http://127.0.0.1:8000/storage/realisation/${image.image}`}
                                  alt={`Image ${index}`}
                                  className="selected-image"
                                />
                                <i className="fa-regular fa-circle-xmark c-tr-ic" onClick={() => removeImage(index, true, image.id)}
                                style={{ position: 'absolute', top: '-8px', right: '-9px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }} />
                              </div>
                            ))}
                            {selectedImages.map((image, index) => (
                              <div key={index} className='mt-3' style={{ position: 'relative', display: 'inline-block' }}>
                                <img
                                  src={URL.createObjectURL(image)}
                                  alt={`Image ${index}`}
                                  className="selected-image"
                                />
                                <i className="fa-regular fa-circle-xmark c-tr-ic" onClick={() => removeImage(index, true)}
                                style={{ position: 'absolute', top: '-8px', right: '-9px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }} />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className='modal-footer-form mt-3'>
                      <button type="submit" className='btn-r-smt' disabled={loading}>
                        {loading ? (
                          <>
                            <div className="btn-loading">
                              <span className="spinner"></span>
                              <span className='load-text'>Patientez...</span>
                            </div>
                          </>
                        ) : (
                          <span>MODIFIER</span>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      <ToastContainer />
    </div>
  )
}
