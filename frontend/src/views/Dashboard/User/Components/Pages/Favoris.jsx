import { useState,  useEffect, useRef} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { BounceLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './DropdownCheckbox.css';
import { fetchFavorites, archiveFavoris, removeFromFavorites } from '../../../../Pages/Artisans/actions/FavorisActions';
import { createReservation } from './actions/reservationActions';

export default function Favoris() {

    const dispatch = useDispatch();
    const favoris = useSelector(state => state.favoris.favoris || []);
    const isLoadingFavoris = useSelector(state => state.favoris.loading);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [setSelectedOptions] = useState([]);
    const fileInputReservationRef = useRef(null);
    const [selectedArtisanId, setSelectedArtisanId] = useState(null);
    const [formData, setFormData] = useState({
        date: '',
        heure: '',
        message: '',
        image: []
    });
    const [showModalReservation, setShowModalReservation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        dispatch(fetchFavorites());
    }, [dispatch]);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const toggleDropdownAction = (artisanId) => {
        setIsOpen({
            ...!isOpen,
            [artisanId]: !isOpen[artisanId] // Inverse l'état du dropdown correspondant à l'artisanId
          });
    };

    const handleOptionChange = (e) => {
        const { value, checked } = e.target;
        setSelectedOptions(prevState =>
            checked ? [...prevState, value] : prevState.filter(option => option !== value)
        );
    };

    const handleFileChangeRes = (event) => {
        const files = event.target.files;
        handleFilesRes(files);
    };

    const handleFilesRes = (files) => {
        let newImages = [];
        if (Array.isArray(formData.image)) {
          newImages = [...formData.image];
        }
        for (let i = 0; i < files.length; i++) {
          newImages.push(files[i]);
        }
        setFormData({ ...formData, image: newImages });
    };

    const handleButtonResClick = (e) => {
        e.preventDefault(); // Empêche le formulaire de se soumettre
        fileInputReservationRef.current.click(); // Ouvre la fenêtre de sélection de fichiers
    };

    const handleDropRes = (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        handleFilesRes(files);
    };

    const handleDragOverRes = (event) => {
        event.preventDefault();
    };

    const handleDeleteImageRes = (index, event) => {
        event.stopPropagation();
        const newImages = [...formData.image]; // Utiliser formData.image au lieu de simplement image
        newImages.splice(index, 1);
        setFormData({ ...formData, image: newImages }); // Mettre à jour l'état de formData avec la nouvelle valeur pour l'image
    };

    const handleInputChangeRes = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmitReservation = async (event) => {
        event.preventDefault();
        setIsLoading(true);
    
        if (!selectedArtisanId) {
            console.error("L'ID de l'artisan est indéfini.");
            return;
        }
    
        const reservationData = new FormData();
        reservationData.append('date', formData.date);
        reservationData.append('heure', formData.heure);
        reservationData.append('message', formData.message);
        formData.image.forEach((img) => reservationData.append('image', img));
        reservationData.append('artisanId', selectedArtisanId);
    
        console.log("Données de réservation à envoyer :", Object.fromEntries(reservationData));
    
        try {
            await dispatch(createReservation(reservationData));
            toast.success("Réservation créée avec succès!");
            
            // Réinitialiser les champs de réservation une fois la requête réussie
            setFormData({
                date: '',
                heure: '',
                message: '',
                image: []
            });
            setShowModalReservation(false);
        } catch (error) {
            console.error("Erreur lors de la création de la réservation :", error);
            toast.error("Erreur lors de la création de la réservation. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleArchiveFavoris = async (artisanId) => {
        try {
            await dispatch(archiveFavoris(artisanId));
        } catch (error) {
            console.error("Erreur lors de l'archivage du favori :", error);
        }
    };

    const handleDeleteFavori = (artisanId) => {
        // Afficher la boîte de dialogue SweetAlert
        Swal.fire({
            title: 'Êtes-vous sûr?',
            text: 'Vous ne pourrez pas revenir en arrière!',
            showCancelButton: true,
            confirmButtonColor: '#02df56',
            cancelButtonColor: '#9A0000',
            confirmButtonText: 'Oui, supprimer!',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.isConfirmed) {
                // Si l'utilisateur confirme, appeler la fonction de suppression
                handleDeleteFavoriConfirmed(artisanId);
            }
        });
    };
    
    const handleDeleteFavoriConfirmed = async (artisanId) => {
        try {
            // Appeler la fonction de suppression de l'artisan
            await dispatch(removeFromFavorites(artisanId));
            // Afficher une alerte de succès avec SweetAlert
            toast.success("Artisan a été supprimé de vos favoris!");
        } catch (error) {
            toast.error('Une erreur est survenue lors de la suppression de l\'artisan.');
        }
    };
      
    const handleCloseModalReservation = () => {
        setShowModalReservation(false);
    };

  return (
    <div>
        <div className="container mt-3">
            <ToastContainer />
            <div className=''>
            <h1 className='titel-sd-re'>Favoris {favoris.length}</h1>
            <span className='s-t-sd-re'>Retrouvez tous vos favoris ici</span>
            </div>
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
                                <input type="checkbox" value="option2" onChange={handleOptionChange} className='chekbox-status' />
                                Disponible
                            </label>
                            <label>
                                <input type="checkbox" value="option3" onChange={handleOptionChange} />
                                Occupée
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
                    <input className="r-ds r-ds-s" type="text" placeholder="Recherchez une favoris" />
                </div>
                </form>
            </div>
            
            <div className=' mt-3'>
                <table className="table table-favoris">
                    <thead className='na-table-res'>
                        <tr>
                            <th scope="col">Nom Artisan</th>
                            <th scope="col">Métiers</th>
                            <th scope="col">Atélier</th>
                            <th scope="col">Adrésse</th>
                            <th scope="col">Lieu</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoadingFavoris ? (
                        <tr>
                        <td colSpan="8">
                            <div className="text-center">
                            <Skeleton count={6} height={40} />
                            </div>
                        </td>
                        </tr>
                        ) : favoris.length === 0 ? (
                            <tr>
                              <td colSpan="8">
                                <div className="text-center">
                                  Aucun favoris disponible.
                                </div>
                              </td>
                            </tr>
                          ): ( favoris.map(favori => (
                            <tr key={favori.id} className='ct-nm-res'>
                            <td><span className='tx-rsvt'>{favori.artisan.prenom} {favori.artisan.nom}</span></td>
                            <td>
                                <span className='tx-rsvt'>
                                    {favori.artisan.metiers && favori.artisan.metiers.length > 0
                                        ? favori.artisan.metiers.map(metier => metier.name).join(', ')
                                        : 'N/A'
                                    }
                                </span>
                            </td>
                            <td><span className='tx-rsvt'>{favori.artisan.atélier}</span></td>
                            <td><span className='tx-rsvt'>{favori.artisan.addréss}</span></td>
                            <td>
                                <span className='tx-rsvt'>
                                    {favori.artisan.regions && favori.artisan.regions.length > 0
                                        ? favori.artisan.regions.map(region => region.name).join(', ')
                                        : 'N/A'
                                    }
                                </span>
                            </td>
                            <td>
                                <small className={favori.artisan.status === 'occupé' ? 'occupée' : 'disponible'}>
                                    {favori.artisan.status}
                                </small>
                            </td>
                            <td>
                                <div className='cont-icons'>
                                    <div className='fa-ellipsis-h-cont'>
                                        <i className="fa-solid fa-ellipsis-h" onClick={() => toggleDropdownAction(favori.artisan.id)}></i>
                                    </div>
                                    {isOpen[favori.artisan.id]  && (
                                        <div className={`dropdown-menu-horizontal ${isOpen ? 'show' : ''}`}>
                                            <div className='drop-con' onClick={() => handleArchiveFavoris(favori.artisan.id)}>
                                                <i className="fa-solid fa-box-archive icn-arv"></i>
                                                <span>Archiver</span>
                                            </div>
                                            <div className='drop-con' onClick={() => {
                                                    setSelectedArtisanId(favori.artisan.id); // Met à jour l'ID de l'artisan avant d'ouvrir le modal
                                                    setShowModalReservation(true);
                                                }}>
                                                    <i className="fa-solid fa-file-pen icn-rsv"></i>
                                                    <span>Réserver</span>
                                            </div>
                                            <div className='drop-con' data-bs-toggle="modal" data-bs-target="#modificationModal">
                                                <i className="fa-solid fa-pencil icn-rsv" ></i>
                                                <span>Modifier</span>
                                            </div>
                                            <div className='drop-con sp-drp' onClick={() => handleDeleteFavori(favori.artisan.id)}>
                                                <i className="fa-solid fa-trash-can"></i>
                                                <span>Supprimer</span>
                                            </div>
                                        </div>
                                    )}
                                    {showModalReservation && (
                                        <div className="modal-overlay-modif">
                                            <div className="modal-modif">
                                                <div className="modal-content-modif">
                                                    <div className="modal-header-form">
                                                        <h1 className="t-md-rl" id="realisationModalLabel"><i className="fa-solid fa-arrow-left"></i> AJOUTER UNE RESERVATION</h1>
                                                        <span className="close-atri" onClick={handleCloseModalReservation}>&times;</span>
                                                    </div>
                                                <div className='bord-botr'>
                                                </div>
                                                <form onSubmit={(event) => handleSubmitReservation(event, favori.artisan.id)}>
                                                    <div className="modal-body">
                                                    <div className='cnt-rls'>
                                                        <div>
                                                        <label className='ti-fm-re'>Date</label>
                                                            <input type="date" name='date' className='ipt-rls' value={formData.date} onChange={handleInputChangeRes} />
                                                        </div>
                                                        <div>
                                                        <label className='ti-fm-re'>Heure</label>
                                                            <input type="time" name='heure' className='ipt-rls' value={formData.heure} onChange={handleInputChangeRes}/>
                                                        </div>
                                                    </div>
                                                    <div className='cnt-rls mt-3'>
                                                        <textarea className='text-res' value={formData.message} onChange={handleInputChangeRes} name="message" id="" placeholder='saisir votre message....'></textarea>
                                                    </div>
                                                    <div className='cont-upload-img'>
                                                        <div className='mt-3'>
                                                            <div className='img-upload'>
                                                                <input
                                                                type="file"
                                                                ref={fileInputReservationRef}
                                                                onChange={handleFileChangeRes}
                                                                style={{ display: 'none' }}
                                                                multiple
                                                                accept="image/*"
                                                                />
                                                                <button className='tl-upl' onClick={handleButtonResClick}>Importer une image</button>
                                                            </div>
                                                            <div
                                                                onDrop={handleDropRes}
                                                                onDragOver={handleDragOverRes}
                                                                style={{
                                                                border: '2px dashed #ccc',
                                                                borderRadius: '5px',
                                                                padding: '20px',
                                                                marginBottom: '20px',
                                                                textAlign: 'center',
                                                                width: '100%',
                                                                }}
                                                                className='drop-upload'
                                                            >

                                                                {formData.image && Array.isArray(formData.image) && formData.image.map((image, index) => (
                                                                <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                                                                    <img
                                                                    src={URL.createObjectURL(image)}
                                                                    alt=""
                                                                    className='img-rvc'
                                                                    style={{ marginRight: '10px', marginBottom: '10px' }}
                                                                    />
                                                                    <i className="fa-regular fa-circle-xmark c-tr-ic" onClick={(event) => handleDeleteImageRes(index, event)} style={{ position: 'absolute', top: '-5px', right: '1px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}></i>
                                                                </div>
                                                                ))}

                                                            {!(formData.image && formData.image.length > 0) && !formData.currentImage && (
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
            </div>
        </div>
    </div>
  )
}
