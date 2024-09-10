import { useState,  useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchArchives, unarchiveFavoris, removeFromFavorites  } from '../../../../Pages/Artisans/actions/FavorisActions';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-toastify/dist/ReactToastify.css';
import './DropdownCheckbox.css';

export default function Archives() {

    const dispatch = useDispatch();
    const archives = useSelector(state => state.favoris.archives || []);
    const isLoadingArchive = useSelector(state => state.favoris.loading);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchArchives());
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

    const handleUnarchive = (artisanId) => {
        dispatch(unarchiveFavoris(artisanId));
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

  return (
    <div>
      <div className="container mt-3">
            <ToastContainer />
            <div className=''>
            <h1 className='titel-sd-re'>Archives {archives.length}</h1>
            <span className='s-t-sd-re'>Retrouvez tous vos archives ici</span>
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
                                <input type="checkbox" value="option2" className='chekbox-status' />
                                Disponible
                            </label>
                            <label>
                                <input type="checkbox" value="option3" />
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
                    <input className="r-ds r-ds-s" type="text" placeholder="Recherchez un archive" />
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
                        {isLoadingArchive ? (
                            <tr>
                                <td colSpan="8">
                                    <div className="text-center">
                                        <Skeleton count={6} height={40} />
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            archives.data && archives.data.length > 0 ? (
                                archives.data.map(archive => (
                                    <tr key={archive.id} className='ct-nm-res'>
                                        <td><span className='tx-rsvt'>{archive.artisan.prenom} {archive.artisan.nom}</span></td>
                                        <td>
                                            <span className='tx-rsvt'>
                                                {archive.artisan.metiers && archive.artisan.metiers.length > 0
                                                    ? archive.artisan.metiers.map(metier => metier.name).join(', ')
                                                    : 'N/A'
                                                }
                                            </span>
                                        </td>
                                        <td><span className='tx-rsvt'>{archive.artisan.atélier}</span></td>
                                        <td><span className='tx-rsvt'>{archive.artisan.addréss}</span></td>
                                        <td>
                                            <span className='tx-rsvt'>
                                                {archive.artisan.regions && archive.artisan.regions.length > 0
                                                    ? archive.artisan.regions.map(region => region.name).join(', ')
                                                    : 'N/A'
                                                }
                                            </span>
                                        </td>
                                        <td>
                                            <small className={archive.artisan.status === 'occupé' ? 'occupée' : 'disponible'}>
                                                {archive.artisan.status}
                                            </small>
                                        </td>
                                        <td>
                                            <div className='cont-icons'>
                                                <div className='fa-ellipsis-h-cont'>
                                                    <i className="fa-solid fa-ellipsis-h" onClick={() => toggleDropdownAction(archive.artisan.id)}></i>
                                                </div>
                                                {isOpen[archive.artisan.id] && (
                                                    <div className={`dropdown-menu-horizontal ${isOpen ? 'show' : ''}`}>
                                                        <div className='drop-con' onClick={() => handleUnarchive(archive.artisan.id)}>
                                                            <i className="fa-solid fa-box-archive icn-arv"></i>
                                                            <span>Désarchiver</span>
                                                        </div>
                                                        <div className='drop-con sp-drp' onClick={() => handleDeleteFavori(archive.artisan.id)}>
                                                            <i className="fa-solid fa-trash-can"></i>
                                                            <span>Supprimer</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8">
                                        <div className="text-center">
                                            Aucun archive disponible.
                                        </div>
                                    </td>
                                </tr>
                            )
                        )}

                    </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}
