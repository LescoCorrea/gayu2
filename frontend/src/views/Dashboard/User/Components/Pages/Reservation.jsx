import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { BounceLoader } from 'react-spinners';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { NavLink } from 'react-router-dom';
import { fetchReservations, deleteReservation, updateReservation } from './actions/reservationActions';
import './DropdownCheckbox.css';

export default function Reservations() {

  const dispatch = useDispatch();
  const fileInputModifRef = useRef(null);
  const reservationsFromStore = useSelector(state => state.reservations.reservations);
  const isLoadingReservations = useSelector(state => state.reservations.loading);
  const [selectedTab, setSelectedTab] = useState('enCours');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isOpenEnCours, setIsOpenEnCours] = useState(false);
  const [setSelectedOptions] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [showEditModalReservation, setShowEditModalReservation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [inputsReservation, setInputsReservation] = useState({
    date: '',
    heure: '',
    message: '',
    image: null,
  });
  const [formData, setFormData] = useState({
    date: '',
    heure: '',
    message: '',
    image: null,
  });

  useEffect(() => {
    dispatch(fetchReservations());
  }, [dispatch]);

  useEffect(() => {
    setReservations(reservationsFromStore);  // Mettre à jour l'état local lorsque les réservations du store changent
  }, [reservationsFromStore])
  

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

  const toggleDropdownEnCours = (artisanId) => {
      setIsOpenEnCours({
          ...!isOpenEnCours,
          [artisanId]: !isOpenEnCours[artisanId] // Inverse l'état du dropdown correspondant à l'artisanId
        });
  };

    const handleOptionChange = (e) => {
        const { value, checked } = e.target;
        setSelectedOptions(prevState =>
            checked ? [...prevState, value] : prevState.filter(option => option !== value)
        );
    };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const handleDelete = (id) => {
    dispatch(deleteReservation(id));
  };

  const filteredReservations = reservations?.filter(reservation => {
    if (selectedTab === 'enCours') {
      return reservation.status === 'En attente';
    } else if (selectedTab === 'terminee') {
      return reservation.status === 'Valider';
    } else if (selectedTab === 'annulee') {
      return reservation.status === 'Rejeter';
    }
    return false;
  }) || [];

  const handleButtonClickModif = (e) => {
    e.preventDefault(); // Empêche le formulaire de se soumettre
    fileInputModifRef.current.click(); // Ouvre la fenêtre de sélection de fichiers
  };

  const handleFileChangeModif = (event) => {
    const files = Array.from(event.target.files);

    setInputsReservation((prevInputs) => {
        // Si nous avons déjà des images, nous les fusionnons avec les nouvelles images
        const updatedImages = prevInputs.image ? [...prevInputs.image, ...files] : files;

        return {
            ...prevInputs,
            image: updatedImages
        };
    });
  };

  const handleDropModif = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    handleFilesModif(files);
  };

  const handleFilesModif = (files) => {
    let newImages = [];
    if (Array.isArray(formData.image)) {
      newImages = [...formData.image];
    }
    for (let i = 0; i < files.length; i++) {
      newImages.push(files[i]);
    }
    setFormData({ ...formData, image: newImages });
  };

  const handleDragOverModif = (event) => {
    event.preventDefault();
  };

  const handleDeleteArtisanImage = (index, event) => {
    event.preventDefault();

    // Créez une copie de l'objet inputsArtisan
    const updatedInputsArtisan = { ...inputsReservation };

    // Si inputsArtisan.image est un tableau (plusieurs images), supprimez l'élément du tableau
    if (Array.isArray(inputsReservation.image)) {
      const updatedImages = inputsReservation.image.filter((_, idx) => idx !== index);
      updatedInputsArtisan.image = updatedImages;
    } else {
      // Si inputsArtisan.image est une seule image, supprimez simplement l'image
      updatedInputsArtisan.image = null;
    }

    // Mettez à jour l'état avec le nouveau inputsArtisan
    setInputsReservation(updatedInputsArtisan);
  };

  const handleCloseModalReservation = () => {
    setShowEditModalReservation(false);
  };

  const handleEditClickReservation = (reservation) => {
    setInputsReservation({
        date: reservation.date || '',
        heure: reservation.heure || '',
        message: reservation.message || '',
        image: reservation.image || null,
    });
    setSelectedReservation(reservation);
    setShowEditModalReservation(true);
  };

  const handleInputChangeModifReservation = (e) => {
    const { name, value } = e.target;
    setInputsReservation(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleReservationUpdate = async () => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append('_method', 'PUT'); 
      formData.append('date', inputsReservation.date);
      formData.append('heure', inputsReservation.heure);
      formData.append('message', inputsReservation.message);

      if (inputsReservation.image) {
        formData.append('image', inputsReservation.image[0]);
      }
    Object.keys(formData).forEach(key => {
      formData.append(key, formData[key]);
    });
    
    try {
      await dispatch(updateReservation(selectedReservation.id, formData));
      toast.success('Réservation modifié avec succès!');
      dispatch(fetchReservations());
      resetFormReservation();
      handleCloseModalEditReservation();
    } catch (error) {
      toast.error('Erreur lors de la modification du réservation.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateReservationSubmit = async (e) => {
    e.preventDefault();
    console.log('ID sélectionné pour la mise à jour :', selectedReservation.id);
    await handleReservationUpdate();
  };

  const resetFormReservation = () => {
    setFormData({
      date: '',
      heure: '',
      message: '',
      image: null,
    });
  };

  const handleCloseModalEditReservation = () => {
    setInputsReservation({
        date: '',
        heure: '',
        message: '',
        image: null,
    });
    setSelectedReservation(null);
    setShowEditModalReservation(false);
  };

  return (
    <div>
      <div className="container mt-3">
        <ToastContainer />
        <div className=''>
          <h1 className='titel-sd-re'>Réservations 3</h1>
          <span className='s-t-sd-re'>Visualisez, modifiez et supprimez une réservation</span>
        </div>

        <div className="navbar-reservation mt-3">
          <NavLink className={`nav-link-resv ${selectedTab === 'enCours' ? 'active' : ''} ${selectedTab === 'enCours' ? 'enCoursClass' : ''}`} style={selectedTab === 'enCours' ? { borderBottom: '2px solid #000', color: '#000', fontWeight: 600 } : {}} onClick={() => handleTabChange('enCours')} >En cours</NavLink>
          <NavLink className={`nav-link-resv nav-link-resv-trm ${selectedTab === 'terminee' ? 'active' : ''} ${selectedTab === 'terminee' ? 'termineeClass' : ''}`} style={selectedTab === 'terminee' ? { borderBottom: '2px solid #000', color: '#000', fontWeight: 600 } : {}} onClick={() => handleTabChange('terminee')}>Terminée</NavLink>
          <NavLink className={`nav-link-resv nav-link-resv-anl ${selectedTab === 'annulee' ? 'active' : ''} ${selectedTab === 'annulee' ? 'annuleeClass' : ''}`} style={selectedTab === 'annulee' ? { borderBottom: '2px solid #000', color: '#000', fontWeight: 600 } : {}} onClick={() => handleTabChange('annulee')}>Annulée</NavLink>
        </div>
        <div className='brbtm'></div>
        <div className='df-filtr mt-3'>
          <div className='c-fil-dte'>
            <div><h6 className='pr-f'>Filtrer par :</h6></div>
            <div className='c-dt-r'>
              <div>
                <form className=''>
                  <input className='f-r-dte' type="date" name="date" />
                </form>
              </div>
              <div className='c-ch'>
                <div className="dropdown">
                  <button className="dropdown-button" onClick={toggleDropdown}>
                    Status <span>&#9660;</span>
                  </button>
                  <div className={`dropdown-content ${showDropdown ? 'show' : ''}`}>
                    <label>
                      <input type="checkbox" value="option2" onChange={handleOptionChange} />
                        En attente
                    </label>
                    <label>
                      <input type="checkbox" value="option3" onChange={handleOptionChange} />
                        Complété
                    </label>
                    <label>
                      <input type="checkbox" value="option4" onChange={handleOptionChange} />
                        Annulé
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
        <div className='s-frv'>
            <form className="">
              <div className="d-inp-ad der-pr">
                <i className="fa-solid fa-magnifying-glass sr-f-src"></i>
                <input className="r-ds r-ds-s" type="text" placeholder="Recherchez une réservation" />
              </div>
            </form>
        </div>

        <div className=' mt-3'>

          {selectedTab === 'enCours' && (
            <table className="table table-favoris">
              <thead className='na-table-res'>
                <tr>
                  <th scope="col">Nom de l&apos;artisan</th>
                  <th scope="col">Date / Heure</th>
                  <th scope="col">Message</th>
                  <th scope="col">Image réservation</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr> 
              </thead>
              <tbody>
              {isLoadingReservations ? (
                        <tr>
                        <td colSpan="8">
                            <div className="text-center">
                            <Skeleton count={6} height={40} />
                            </div>
                        </td>
                        </tr>
                ) : filteredReservations.length === 0 ? (
                  <tr>
                    <td colSpan="8">
                      <div className="text-center">
                        Aucun réservation disponible.
                      </div>
                    </td>
                  </tr>
                ): (filteredReservations.map(reservation => (
                  <tr key={reservation.id} className='ct-nm-res'>
                    <td><span className='tx-rsvt'>{reservation.artisan.prenom} {reservation.artisan.nom}</span></td>
                    <td><span className='tx-rsvt'>{reservation.date} {reservation.heure}</span></td>
                    <td><span className='tx-rsvt'>{reservation.message}</span></td>
                    <td>
                      <button type="button" className="clic-img" data-bs-toggle="modal" data-bs-target={`#exampleModal-${reservation.id}`}>
                        clic pour voir l&apos;image
                      </button>
                      <div className="modal fade" id={`exampleModal-${reservation.id}`} tabIndex="-1" aria-labelledby={`exampleModalLabel-${reservation.id}`} aria-hidden="true">
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header-form">
                              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className='bord-bot'></div>
                            <div className="modal-body">
                                <h6 className='titre-img-rs'>Image Réservation</h6>
                                <div className='click-img'>
                                  <img src={`http://127.0.0.1:8000/storage/${reservation.image}`} alt="Réservation" className='cnt-rs-img' />
                                </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <small className={reservation.status === 'En attente' ? 'en-cours' : reservation.status === 'Valider' ? 'disponible' : 'occupée'}>
                        {reservation.status}
                      </small>
                    </td>
                    <td>
                      <div className='cont-icons'>
                        <div className='fa-ellipsis-h-cont'>
                          <i className="fa-solid fa-ellipsis-h" onClick={() => toggleDropdownEnCours(reservation.artisan.id)}></i>
                        </div>
                          {isOpenEnCours[reservation.artisan.id]  && (
                            <div className={`dropdown-menu-horizontal ${isOpenEnCours ? 'show' : ''}`}>
                              <div className='drop-con' onClick={() => handleEditClickReservation(reservation)}>
                                <i className="fa-solid fa-pencil icn-rsv" ></i>
                                <span>Modifier</span>
                              </div>
                              <div className='drop-con sp-drp'>
                                <i className="fa-solid fa-trash-can" onClick={() => handleDelete(reservation.id)}></i>
                                <span>Supprimer</span>
                              </div>
                            </div>
                          )}
                          {showEditModalReservation && (
                            <div className="modal-overlay-modif">
                              <div className="modal-modif">
                                                <div className="modal-content-modif">
                                                    <div className="modal-header-form">
                                                        <h1 className="t-md-rl" id="realisationModalLabel"><i className="fa-solid fa-arrow-left"></i> MODIFIER UNE RESERVATION</h1>
                                                        <span className="close-atri" onClick={handleCloseModalReservation}>&times;</span>
                                                    </div>
                                                <div className='bord-botr'>
                                                </div>
                                                <form onSubmit={handleUpdateReservationSubmit}>
                                                    <div className="modal-body">
                                                      <div className='cnt-rls'>
                                                          <div>
                                                          <label className='ti-fm-re'>Date</label>
                                                              <input type="date" name='date' value={inputsReservation.date} onChange={handleInputChangeModifReservation} className='ipt-rls' />
                                                          </div>
                                                          <div>
                                                          <label className='ti-fm-re'>Heure</label>
                                                              <input type="time" name='heure' value={inputsReservation.heure} onChange={handleInputChangeModifReservation} className='ipt-rls'/>
                                                          </div>
                                                      </div>
                                                      <div className='cnt-rls mt-3'>
                                                          <textarea className='text-res' name="message" value={inputsReservation.message} onChange={handleInputChangeModifReservation}  id="" placeholder='saisir votre message....'></textarea>
                                                      </div>
                                                      <div className='cont-upload-img'>
                                                        <div className=''>
                                                          <div className='img-upload'>
                                                            <input
                                                              type="file"
                                                              ref={fileInputModifRef}
                                                              onChange={handleFileChangeModif}
                                                              style={{ display: 'none' }}
                                                              multiple
                                                              accept="image/*"
                                                            />
                                                            <button className='tl-upl' onClick={handleButtonClickModif}>Importer une image</button>
                                                          </div>
                                                          <div
                                                            onDrop={handleDropModif}
                                                            onDragOver={handleDragOverModif}
                                                            style={{
                                                              border: '2px dashed #ccc',
                                                              borderRadius: '5px',
                                                              padding: '8px',
                                                              textAlign: 'center',
                                                              width: '100%',
                                                            }}
                                                            className='drop-upload'
                                                          >
                                                            {inputsReservation.image && (
                                                              Array.isArray(inputsReservation.image) ? (
                                                                inputsReservation.image.map((image, index) => (
                                                                  <div key={index} style={{ marginBottom: '4px', position: 'relative', display: 'inline-block' }}>
                                                                    <img
                                                                      src={URL.createObjectURL(image)}
                                                                      alt={`Image ${index}`} className='form-img'
                                                                    />
                                                                    <i className="fa-regular fa-circle-xmark c-tr-ic" onClick={(event) => handleDeleteArtisanImage(index, event)} style={{ position: 'absolute', top: '-10px', right: '-9px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}></i>
                                                                  </div>
                                                                ))
                                                              ) : (
                                                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                                                  <img
                                                                    src={`http://localhost:8000/storage/${inputsReservation.image}`}
                                                                    alt="" className='form-img'
                                                                  />
                                                                  <i className="fa-regular fa-circle-xmark c-tr-ic" onClick={(event) => handleDeleteArtisanImage(0, event)} style={{ position: 'absolute', top: '-10px', right: '-9px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}></i>
                                                                </div>
                                                              )
                                                            )}

                                                            {!(inputsReservation.image && inputsReservation.image.length > 0) && !formData.currentImage && (
                                                              <>
                                                                <div className=''><i className="fa-solid fa-upload f-upld"></i></div>
                                                                <p className='upl-img'>Glisser ou importer une image</p>
                                                              </>
                                                            )}
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className="modal-footer-form">
                                                        <button type="reset" className="btn-r-upl" onClick={handleCloseModalReservation}>ANNULER</button>
                                                        <button type="submit" className="btn-r-smt">
                                                            {isLoading ? (
                                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                    <BounceLoader size={20} color={"#fff"} />
                                                                    <span style={{ marginLeft: '8px' }}>Chargement...</span>
                                                                </div>
                                                                ) : 'AJOUTER'
                                                            }
                                                        </button>
                                                    </div>
                                                </form>
                                                </div>
                                            </div>
                                        </div>
                          )}   
                      </div>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          )}
          {selectedTab === 'terminee' && (
            <table className="table table-favoris">
              <thead className='na-table-res'>
                <tr>
                  <th scope="col">Nom de l&apos;artisan</th>
                  <th scope="col">Date réservation</th>
                  <th scope="col">Message</th>
                  <th scope="col">Image réalisations</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingReservations ? (
                        <tr>
                        <td colSpan="8">
                            <div className="text-center">
                            <Skeleton count={6} height={40} />
                            </div>
                        </td>
                        </tr>
                  ) : filteredReservations.length === 0 ? (
                    <tr>
                      <td colSpan="8">
                        <div className="text-center">
                          Aucun réservation disponible.
                        </div>
                      </td>
                    </tr>
                  ): (filteredReservations.map(reservation => (
                  <tr key={reservation.id} className='ct-nm-res'>
                    <td><span className='tx-rsvt'>{reservation.artisan.prenom} {reservation.artisan.nom}</span></td>
                    <td><span className='tx-rsvt'>{reservation.date} {reservation.heure}</span></td>
                    <td><span className='tx-rsvt'>{reservation.message}</span></td>
                    <td>
                      <button type="button" className="clic-img" data-bs-toggle="modal" data-bs-target={`#exampleModal-${reservation.id}`}>
                        clic pour voir l&apos;image
                      </button>
                      <div className="modal fade" id={`exampleModal-${reservation.id}`} tabIndex="-1" aria-labelledby={`exampleModalLabel-${reservation.id}`} aria-hidden="true">
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header-form">
                              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className='bord-bot'></div>
                              <h6 className='titre-img-rs mt-3'>Image Réservation</h6>
                                <div className='click-img mb-3'>
                                  <img src={`http://127.0.0.1:8000/storage/realisations/${reservation.image}`} alt="Réservation" className='cnt-rs-img' />
                                </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <small className={reservation.status === 'En attente' ? 'en-cours' : reservation.status === 'Valider' ? 'disponible' : 'occupée'}>
                        {reservation.status}
                      </small>
                    </td>
                    <td>
                      <div className='cont-icons'>
                        <div className='fa-ellipsis-h-cont'>
                          <i className="fa-solid fa-ellipsis-h" onClick={() => toggleDropdownEnCours(reservation.artisan.id)}></i>
                        </div>
                          {isOpenEnCours[reservation.artisan.id]  && (
                            <div className={`dropdown-menu-horizontal ${isOpenEnCours ? 'show' : ''}`}>
                              <div className='drop-con' data-bs-toggle="modal" data-bs-target="#exampleModal">
                                <i className="fa-solid fa-pencil icn-rsv" ></i>
                                <span>Modifier</span>
                              </div>
                               
                              <div className='drop-con sp-drp'>
                                <i className="fa-solid fa-trash-can" onClick={() => handleDelete(reservation.id)}></i>
                                <span>Supprimer</span>
                              </div>
                            </div>
                          )}
                      </div>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          )}
          {selectedTab === 'annulee' && (
            <table className="table table-favoris">
              <thead className='na-table-res'>
                <tr>
                  <th scope="col">Nom de l&apos;artisan</th>
                  <th scope="col">Date réservation</th>
                  <th scope="col">Message</th>
                  <th scope="col">Image réalisations</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingReservations ? (
                        <tr>
                        <td colSpan="8">
                            <div className="text-center">
                            <Skeleton count={6} height={40} />
                            </div>
                        </td>
                        </tr>
                        ) : filteredReservations.length === 0 ? (
                          <tr>
                            <td colSpan="8">
                              <div className="text-center">
                                Aucun réservation disponible.
                              </div>
                            </td>
                          </tr>
                        ) : (filteredReservations.map(reservation => (
                  <tr key={reservation.id} className='ct-nm-res'>
                    <td><span className='tx-rsvt'>{reservation.artisan.prenom} {reservation.artisan.nom}</span></td>
                    <td><span className='tx-rsvt'>{reservation.date} {reservation.heure}</span></td>
                    <td><span className='tx-rsvt'>{reservation.message}</span></td>
                    <td>
                      <button type="button" className="clic-img" data-bs-toggle="modal" data-bs-target={`#exampleModal-${reservation.id}`}>
                        clic pour voir l&apos;image
                      </button>
                      <div className="modal fade" id={`exampleModal-${reservation.id}`} tabIndex="-1" aria-labelledby={`exampleModalLabel-${reservation.id}`} aria-hidden="true">
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header-form">
                              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className='bord-bot'></div>
                            <div className="modal-body">
                                <h6 className='titre-img-rs'>Image Réservation</h6>
                                <div className='click-img'>
                                  <img src={`http://127.0.0.1:8000/storage/${reservation.image}`} alt="Réservation" className='cnt-rs-img' />
                                </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <small className={reservation.status === 'En attente' ? 'en-cours' : reservation.status === 'Valider' ? 'disponible' : 'occupée'}>
                        {reservation.status}
                      </small>
                    </td>
                    <td>
                    <div className='cont-icons'>
                        <div className='fa-ellipsis-h-cont'>
                          <i className="fa-solid fa-ellipsis-h" onClick={() => toggleDropdownEnCours(reservation.artisan.id)}></i>
                        </div>
                          {isOpenEnCours[reservation.artisan.id]  && (
                            <div className={`dropdown-menu-horizontal ${isOpenEnCours ? 'show' : ''}`}>
                              <div className='drop-con'>
                                <i className="fa-solid fa-box-archive icn-arv"></i>
                                <span>Archiver</span>
                              </div>
                              <div className='drop-con'>
                                <i className="fa-solid fa-pencil icn-rsv" data-bs-toggle="modal" data-bs-target="#realisationModal"></i>
                                <span>Modifier</span>
                              </div>
                              <div className='drop-con sp-drp'>
                                <i className="fa-solid fa-trash-can" onClick={() => handleDelete(reservation.id)}></i>
                                <span>Supprimer</span>
                              </div>
                            </div>
                          )}
                      </div>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          )}

        </div>
      </div>
    </div>
  )
}
