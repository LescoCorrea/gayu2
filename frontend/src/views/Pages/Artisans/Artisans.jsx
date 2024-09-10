import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './Artisan.css'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BounceLoader } from 'react-spinners';
import Footer from '../Components/Footer';
import Contacts from '../Components/Contacts';
import TopNav from '../Components/Topnav';
import { fetchArtisans } from '../../../views/Dashboard/Admin/Components/Pages/actions/artisanActions';
import { fetchMetiers } from '../../../views/Dashboard/Admin/Components/Pages/actions/metierActions';
import { fetchRegions } from '../../../views/Dashboard/Admin/Components/Pages/actions/regionActions';
import { createRating, fetchRatingCount } from '../Artisans/actions/AvisActions';
import { login, register } from '../../Auth/AuthActions';

export default function Artisans() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, error } = useSelector(state => state.auth);
    const artisans = useSelector(state => state.artisans.artisans)  || [];
    const [artisanId, setArtisanId] = useState(null);
    const ratings = useSelector(state => state.artisans.ratings) || {};
    const [dakarArtisansCount, setDakarArtisansCount] = useState(0);
    const [saintLouisArtisansCount, setSaintLouisArtisansCount] = useState(0);
    const [thiesArtisansCount, setThiesArtisansCount] = useState(0);
    const metiers = useSelector(state => state.metiers.metiers);
    const regions = useSelector(state => state.regions.regions);
    const [showDropdownRegion, setShowDropdownRegion] = useState(false);
    const [showDropdownCategorie, setShowDropdownCategorie] = useState(false);
    const [showDropdownMetier, setShowDropdownMetier] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedMetiers, setSelectedMetiers] = useState([]);
    const [selectedRegions, setSelectedRegions] = useState([]);
    const artisanList = useSelector(state => state.artisans.artisans);
    const [localRatings, setLocalRatings] = useState({});
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isLoginNote, setIsLoginNote] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [nameError, setNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState(null);
    const [isAuthModalRatingOpen, setIsAuthModalRatingOpen] = useState(false);
    const [selectedArtisan, setSelectedArtisan] = useState(null);

    useEffect(() => {
        dispatch(fetchArtisans());
        dispatch(fetchMetiers());
        dispatch(fetchRegions());
    }, [dispatch]);

    useEffect(() => {
        if (artisans.length > 0) {
            artisans.forEach(artisan => {
                dispatch(fetchRatingCount(artisan.id));
            });
        }
    }, [dispatch, artisans]);

    useEffect(() => {
        // Initialiser les compteurs pour chaque région à 0
        let dakarCount = 0;
        let saintLouisCount = 0;
        let thiesCount = 0;
    
        // Parcourir tous les artisans pour compter ceux associés à chaque région
        artisans.forEach(artisan => {
            if (artisan.regions.some(region => region.name === 'Dakar')) {
                dakarCount++;
            }
            if (artisan.regions.some(region => region.name === 'Saint-Louis')) {
                saintLouisCount++;
            }
            if (artisan.regions.some(region => region.name === 'Thies')) {
                thiesCount++;
            }
        });
    
        // Mettre à jour l'état avec les compteurs obtenus
        setDakarArtisansCount(dakarCount);
        setSaintLouisArtisansCount(saintLouisCount);
        setThiesArtisansCount(thiesCount);
    }, [artisans]);
    
    const toggleDropdownRegion = () => {
        setShowDropdownRegion(!showDropdownRegion);
    };
    const toggleDropdownCategorie = () => {
        setShowDropdownCategorie(!showDropdownCategorie);
    };

    const toggleDropdownMetier = () => {
        setShowDropdownMetier(!showDropdownMetier);
    };

    const handleOptionChange = (event) => {
        const optionValue = event.target.value;
        if (selectedOptions.includes(optionValue)) {
            setSelectedOptions(selectedOptions.filter(item => item !== optionValue));
        } else {
            setSelectedOptions([...selectedOptions, optionValue]);
        }
    };

    const handleOptionChangeMetier = (event) => {
        const optionValue = event.target.value;
        if (selectedMetiers.includes(optionValue)) {
            setSelectedMetiers(selectedMetiers.filter(item => item !== optionValue));
        } else {
            setSelectedMetiers([...selectedMetiers, optionValue]);
        }
        
    };

    const handleOptionChangeRegion = (event) => {
        const { value } = event.target;
        setSelectedRegions(prevSelected =>
            prevSelected.includes(value)
                ? prevSelected.filter(name => name !== value)
                : [...prevSelected, value]
        );
    };

    const filteredArtisans = artisans
        .filter(artisan => {
            return (selectedRegions.length === 0 || artisan.regions.some(region => selectedRegions.includes(region.name)))
                && (selectedMetiers.length === 0 || artisan.metiers.some(metier => selectedMetiers.includes(metier.id.toString())));
        })
        .sort((a, b) => {
            const ratingA = ratings[a.id] || 0;
            const ratingB = ratings[b.id] || 0;
            if (sortOrder === 'highest') {
                return ratingB - ratingA; // Tri décroissant
            } else if (sortOrder === 'lowest') {
                return ratingA - ratingB; // Tri croissant
            }
            return 0; // Pas de tri
        });

    const handleRatingClick = (artisanId, rating) => {
        if (!user) {
            setArtisanId(artisanId); // Enregistrez l'ID de l'artisan pour l'utiliser après la connexion
            setLocalRatings({ ...localRatings, [artisanId]: rating });
            setIsAuthModalRatingOpen(true);
            return;
        }
        dispatch(createRating(artisanId, rating));
        setLocalRatings({ ...localRatings, [artisanId]: rating });
    };
        
    const closeAuthModalRating = () => {
        setIsAuthModalRatingOpen(false);
    };

    const handleViewDetailClick = (artisanId) => {
        if (!user) {
            setSelectedArtisan(artisanId); // Enregistre l'ID de l'artisan
            setIsAuthModalOpen(true); // Ouvre le modal de connexion/inscription
        } else {
            navigate(`/voirartisan/${artisanId}`); // Redirige directement si l'utilisateur est connecté
        }
    };

    const closeAuthModal = () => {
        setIsAuthModalOpen(false);
    };

    const switchMode = () => {
        setIsLoginMode(!isLoginMode);
    };

    const switchNote = () => {
        setIsLoginNote(!isLoginNote);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        
        if (!name) {
            setNameError('Le nom est requis.');
            setLoading(false);
            return;
        }
        
        if (!email) {
            setEmailError('L\'email est requis.');
            setLoading(false);
            return;
        }
        
        if (!password) {
            setPasswordError('Le mot de passe est requis.');
            setLoading(false);
            return;
        }
        
        const credentials = { name, email, password };
        
        dispatch(register(credentials))
            .then(() => {
                setLoading(false);
                closeAuthModal();
                navigate(`/voirartisan/${artisanId}`);
            })
            .catch(() => {
                setLoading(false);
                const errMsg = error.response?.data?.message || 'La connexion a échoué, veuillez vérifier vos informations.';
                setEmailError(errMsg);
            });
    };

    const handleFormSubmitNote = (e) => {
        e.preventDefault();
        setLoading(true);
        
        if (!name) {
            setNameError('Le nom est requis.');
            setLoading(false);
            return;
        }
        
        if (!email) {
            setEmailError('L\'email est requis.');
            setLoading(false);
            return;
        }
        
        if (!password) {
            setPasswordError('Le mot de passe est requis.');
            setLoading(false);
            return;
        }
        
        const credentials = { name, email, password };
        
        dispatch(register(credentials))
            .then(() => {
                setLoading(false);
                closeAuthModal();
                navigate(`/voirartisan/${artisanId}`);
            })
            .catch(() => {
                setLoading(false);
                const errMsg = error.response?.data?.message || 'La connexion a échoué, veuillez vérifier vos informations.';
                setEmailError(errMsg);
            });
    };

    const handleForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        setEmailError('');
        setPasswordError('');
        if (!email) {
            setEmailError('L\'email est requis.');
            setLoading(false);
            return;
        }
    
        if (!password) {
            setPasswordError('Le mot de passe est requis.');
            setLoading(false);
            return;
        }
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          await dispatch(login({ email, password }));
          setIsAuthModalOpen(false);
        } catch (error) {
          console.error('Erreur Login :', error);
        } finally {
          setLoading(false); // Désactiver le chargement après la demande
        }
    };

    useEffect(() => {
        if (user) {
            // Rediriger vers la page de l'artisan si connecté et un artisan est sélectionné
            if (selectedArtisan) {
                navigate(`/voirartisan/${selectedArtisan}`);
            } else {
                navigate('/artisans'); // Redirige vers la liste des artisans sinon
            }
        }
    }, [user, selectedArtisan, navigate]);

    const handleFormNote = async (e) => {
        e.preventDefault();
        setLoading(true);
        setEmailError('');
        setPasswordError('');
        if (!email) {
            setEmailError('L\'email est requis.');
            setLoading(false);
            return;
        }
    
        if (!password) {
            setPasswordError('Le mot de passe est requis.');
            setLoading(false);
            return;
        }
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          await dispatch(login({ email, password }));
          if (artisanId) {
            dispatch(createRating(artisanId, localRatings[artisanId] || 0));
            setLocalRatings({ ...localRatings, [artisanId]: 0 });
        }

        // Rediriger vers la page des artisans
        navigate('/artisans');
        setIsAuthModalRatingOpen(false);
        } catch (error) {
          console.error('Erreur Login :', error);
        } finally {
          setLoading(false); // Désactiver le chargement après la demande
        }
    }; 
    
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
    
    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        if (value === 'highest') {
            setSortOrder(checked ? 'highest' : null);
        } else if (value === 'lowest') {
            setSortOrder(checked ? 'lowest' : null);
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    

    return (
        <div>
            <div>
                <div className='mt-3'>
                    <TopNav />
                    <div className="container-fluid mt-5 mb-5">
                        <div className="row">
                            <div className="col-md-2">
                                <div className="sidebar">
                                    <div className="flt-rst">
                                        <h6 className='titre-filtre'>Filtrer les résultats</h6>
                                        <hr className='clr' />
                                    </div>
                                    <div>
                                        <h6 className='titre-filtre'>Trier par Métiers</h6>
                                        <hr className='clr' />
                                        <div className="triage">
                                            <div style={{ width: '180px', position: 'relative' }}>
                                                {/* Déclencheur du Dropdown (simule une balise <select>) */}
                                                <div className='togl-css' onClick={toggleDropdownMetier}>
                                                    <span>Métiers</span>
                                                    <span style={{ fontSize: '12px' }}>&#9660;</span> {/* Icône flèche vers le bas */}
                                                </div>

                                                {/* Contenu du Dropdown */}
                                                {showDropdownMetier && (
                                                    <div
                                                        style={{
                                                            marginTop: '5px',
                                                            border: '1px solid #ccc',
                                                            borderRadius: '4px',
                                                            backgroundColor: '#fff',
                                                            position: 'absolute',
                                                            width: '170px',
                                                            zIndex: 10,
                                                            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
                                                        }}
                                                    >
                                                        <div 
                                                            style={{
                                                                padding: '5px',
                                                                maxHeight: '130px',
                                                                overflowY: 'auto',
                                                            }}
                                                            className="custom-scroll-metier" // Classe pour le conteneur avec scroll personnalisé
                                                        >
                                                            {metiers && metiers.map(metier => (
                                                                <label key={metier.id} style={{ display: 'block', marginBottom: '5px' }}>
                                                                    <input
                                                                        type="checkbox"
                                                                        value={metier.id}
                                                                        checked={selectedMetiers.includes(metier.id.toString())}
                                                                        onChange={handleOptionChangeMetier}
                                                                        className={selectedMetiers.includes(metier.id.toString()) ? 'red-checkbox' : ''}
                                                                        style={{ marginRight: '5px', cursor: 'pointer' }}
                                                                    />
                                                                    {metier.name}
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <h6 className='titre-filtre mt-3'>Catégories</h6>
                                        <hr className='clr' />
                                        <div className="triage">
                                            <div className="dropdown-bnt-region">
                                                <div className='togl-css' onClick={toggleDropdownCategorie}>
                                                    <span>Catégories</span>
                                                    <span style={{ fontSize: '12px' }}>&#9660;</span> {/* Down arrow icon */}
                                                </div>
                                                <div className={`dropdown-content ${showDropdownCategorie ? 'show' : ''}`}>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            value="option2"
                                                            checked={selectedOptions.includes("option2")}
                                                            onChange={handleOptionChange}
                                                            className='chekbox-status'
                                                        />
                                                        Option 1
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            value="option3"
                                                            checked={selectedOptions.includes("option3")}
                                                            onChange={handleOptionChange}
                                                        />
                                                        Option 2
                                                    </label>
                                                    {/* Add more labels for additional options as needed */}
                                                </div>
                                            </div>
                                        </div>
                                        <h6 className='titre-filtre mt-3'>Lieux</h6>
                                        <hr className='clr' />
                                        <div className="">
                                            <h6 className='titre-filtre mt-3'>Sénégal</h6>
                                            <div className='senegal'>
                                                <div className='all-local'>
                                                    <h6>Dakar</h6>
                                                    <span className='region-count'>{dakarArtisansCount}</span>
                                                </div>
                                                <div className='all-local'>
                                                    <h6>Saint-Louis</h6>
                                                    <span className='region-count'>{saintLouisArtisansCount}</span>
                                                </div>
                                                <div className='all-local'>
                                                    <h6>Thies</h6>
                                                    <span className='region-count'>{thiesArtisansCount}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tri-not">
                                            <div style={{ width: '180px', position: 'relative' }}>
                                                {/* Déclencheur du Dropdown (simule une balise <select>) */}
                                                <div className='togl-css' onClick={toggleDropdownRegion}>
                                                    <span>Régions</span>
                                                    <span style={{ fontSize: '12px' }}>&#x25BC;</span> {/* Icône flèche vers le bas */}
                                                </div>

                                                {/* Contenu du Dropdown */}
                                                {showDropdownRegion && (
                                                    <div
                                                        style={{
                                                            marginTop: '5px',
                                                            border: '1px solid #ccc',
                                                            borderRadius: '4px',
                                                            backgroundColor: '#fff',
                                                            position: 'absolute',
                                                            width: '170px',
                                                            zIndex: 10,
                                                            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
                                                        }}
                                                    >
                                                        <div 
                                                            style={{
                                                                padding: '5px',
                                                                maxHeight: '130px',
                                                                overflowY: 'auto',
                                                            }}
                                                            className="custom-scroll"
                                                        >
                                                            {regions && regions.map(region => (
                                                                <label key={region.id} style={{ display: 'block', marginBottom: '5px' }}>
                                                                    <input
                                                                        type="checkbox"
                                                                        value={region.name}
                                                                        checked={selectedRegions.includes(region.name)}
                                                                        onChange={handleOptionChangeRegion}
                                                                        className={selectedRegions.includes(region.name) ? 'red-checkbox' : ''}
                                                                        style={{ marginRight: '5px', cursor: 'pointer' }}
                                                                    />
                                                                    {region.name}
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-10">
                                <div className=" ">
                                    <div className='search-content'>
                                        <div>
                                            <ul className="breadcrumb">
                                                <li className='breadcumbs'><Link to="/" className='lnk-art'>Accueil / </Link></li>
                                                <li className='breadcumbs'>Nos artisans</li>
                                            </ul>
                                            <div className='lieu'>
                                                <h1 className='pays'>Sénégal</h1>
                                                <h6 className='resultats'>{artisanList ? artisanList.length : 0} résultats trouvés</h6>
                                            </div>
                                        </div>
                                        <div className="tri-not">
                                            <div style={{ width: '200px', position: 'relative' }}>
                                                {/* Dropdown trigger (mimics a <select> tag) */}
                                                <div className='togl-css' onClick={toggleDropdown}>
                                                    <span>{sortOrder === 'highest' ? 'Triez : les mieux notés' : 'Triez : les moins notés'}</span>
                                                    <span style={{ fontSize: '12px' }}>&#x25BC;</span> {/* Down arrow icon */}
                                                </div>

                                                {/* Dropdown content */}
                                                {isDropdownOpen && (
                                                    <div
                                                        style={{
                                                            marginTop: '5px',
                                                            border: '1px solid #ccc',
                                                            borderRadius: '4px',
                                                            backgroundColor: '#fff',
                                                            position: 'absolute',
                                                            width: '100%',
                                                            zIndex: 1,
                                                            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
                                                        }}
                                                    >
                                                        <div style={{ padding: '10px' }}>
                                                            <label style={{ display: 'block', marginBottom: '5px' }}>
                                                                <input
                                                                    type="checkbox"
                                                                    value="highest"
                                                                    checked={sortOrder === 'highest'}
                                                                    onChange={handleCheckboxChange}
                                                                    className={sortOrder === 'highest' ? 'red-checkbox' : ''}
                                                                    style={{ marginRight: '5px', cursor: 'pointer' }}
                                                                />
                                                                Les plus notées
                                                            </label>
                                                            <label style={{ display: 'block' }}>
                                                                <input
                                                                    type="checkbox"
                                                                    value="lowest"
                                                                    checked={sortOrder === 'lowest'}
                                                                    onChange={handleCheckboxChange}
                                                                    className={sortOrder === 'lowest' ? 'red-checkbox' : ''}
                                                                    style={{ marginRight: '5px', cursor: 'pointer' }}
                                                                />
                                                                Les moins notées
                                                            </label>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="content-container mt-5">
                                        <div className="row mt-3">
                                            {filteredArtisans.map((artisan, index) => (
                                                <div key={index} className="col-md-3 avatar mt-3">
                                                    <div className='prop'>
                                                        <div className='avatar-prop'>
                                                            <img src={`http://localhost:8000/storage/${artisan.image}`} alt={artisan.nom} />
                                                            <div className='coordonne mt-3'>
                                                                <div>
                                                                    <div className='nm-t'>
                                                                        <h3 className='nm-link-art'>{artisan.prenom} {artisan.nom}</h3>
                                                                    </div>
                                                                    
                                                                    {artisan.metiers.map((metier, index) => (
                                                                        <h6 className='prof' key={index}>{metier.name}</h6>
                                                                    ))}
                                                                    {artisan.regions.map((region, index) => (
                                                                        <h6 className='prof' key={index}>{region.name}, Sénégal</h6>
                                                                    ))}
                                                                    <div className='all-stars'>
                                                                        {[...Array(5)].map((_, i) => (
                                                                            <i
                                                                                key={i}
                                                                                className={`fa fa-star${i < (localRatings[artisan.id] || 0) ? '' : '-o'}`}
                                                                                aria-hidden="true"
                                                                                style={{ color: i < (localRatings[artisan.id] || 0) ? '#9A0000' : '#9A0000', cursor: 'pointer', transition: 'color 0.2s ease-in-out' }}
                                                                                onClick={() => handleRatingClick(artisan.id, i + 1)}
                                                                                onMouseEnter={() => console.log('Hovered star')}
                                                                            ></i>
                                                                        ))}
                                                                        <div className='rating-count'>
                                                                            <span className='rating-nm'>
                                                                                {ratings[artisan.id] || 0} {ratings[artisan.id] === 1 ? 'Note' : 'Notes'}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className='v-dt'>
                                                                <button className='btn-v-dtl' onClick={() => handleViewDetailClick(artisan.id)}>Voir détail</button>
                                                            </div>
                                                        </div>
                                                        {isAuthModalOpen && (
                                                            <div className="auth-modal-overlay" onClick={closeAuthModal}>
                                                                <div className="auth-modal-content" onClick={e => e.stopPropagation()}>
                                                                    <div className='close-auth-modal'>
                                                                        <i className="fa-regular fa-circle-xmark close-icon-auth" onClick={closeAuthModal} ></i>
                                                                    </div>
                                                                    <h2>{isLoginMode ? 'Vous devez vous connecter' : 'Inscription'}</h2>
                                                                    <p>{isLoginMode ? 'Pour voir les détails, veuillez vous connecter ou vous inscrire.' : 'Veuillez remplir les informations suivantes pour vous inscrire.'}</p>
                                                                    <form onSubmit={isLoginMode ? handleForm : handleFormSubmit}>
                                                                        {isLoginMode ? (
                                                                            <>
                                                                                <div className='cont-auth-input mb-3'>
                                                                                    <input type="text" className='auth-input' value={email} onChange={e => setEmail(e.target.value)} placeholder='Email' required />
                                                                                    {emailError && <p className="error-message-auth">{emailError}</p>}
                                                                                </div>
                                                                                <div className='cont-auth-input mb-3'>
                                                                                    <input type="password" className='auth-input' value={password} onChange={e => setPassword(e.target.value)} placeholder='Mot de passe' required />
                                                                                    {passwordError && <p className="error-message-auth">{passwordError}</p>}
                                                                                </div>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <div className='cont-auth-input mb-3'>
                                                                                    <input type="text" value={name} onChange={e => setName(e.target.value)} className='auth-input' placeholder='Nom' required />
                                                                                    {nameError && <p className="error-message-auth">{nameError}</p>}
                                                                                </div>
                                                                                <div className='cont-auth-input mb-3'>
                                                                                    <input type="text" value={email} onChange={e => setEmail(e.target.value)} className='auth-input' placeholder='Email' required />
                                                                                    
                                                                                </div>
                                                                                <div className='cont-auth-input mb-3'>
                                                                                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className='auth-input' placeholder='Mot de passe' required />
                                                                                    {passwordError && <p className="error-message-auth">{passwordError}</p>}
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                        <div className='mb-3'>
                                                                            <button type="submit" className='button-auth-con'disabled={loading}>
                                                                                {loading ? (
                                                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                        <BounceLoader size={20} color={"#fff"} />
                                                                                        <span style={{ marginLeft: '8px' }}>
                                                                                            {isLoginMode ? 'Connexion en cours...' : 'Inscription en cours...'}
                                                                                        </span>
                                                                                    </div>
                                                                                ) : (
                                                                                    isLoginMode ? 'SE CONNECTER' : 'S\'INSCRIRE'
                                                                                )}
                                                                            </button>
                                                                        </div>
                                                                    </form>
                                                                    <div className=''>
                                                                        <p className="text-center text-muted mb-0 par-con">
                                                                            {isLoginMode ? (
                                                                                <>J&apos;ai pas de compte? <a href="#" className="fw-bold text-body" onClick={switchMode}><u className="ins-con">M&apos;inscrire</u></a></>
                                                                                ) : (
                                                                                <>Déjà un compte? <a href="#" className="fw-bold text-body" onClick={switchMode}><u className="ins-con">Se connecter</u></a></>
                                                                                )
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {isAuthModalRatingOpen && (
                                                            <div className="auth-modal-overlay" onClick={closeAuthModalRating}>
                                                                <div className="auth-modal-content" onClick={e => e.stopPropagation()}>
                                                                    <div className='close-auth-modal'>
                                                                        <i className="fa-regular fa-circle-xmark close-icon-auth" onClick={closeAuthModalRating} ></i>
                                                                    </div>
                                                                    <h2>{isLoginNote ? 'Vous devez connecter' : 'Inscription'}</h2>
                                                                    <p>{isLoginNote ? 'Pour noter, veuillez vous connecter ou vous inscrire.' : 'Veuillez remplir les informations suivantes pour vous inscrire.'}</p>
                                                                    <form onSubmit={isLoginNote ? handleFormNote : handleFormSubmitNote}>
                                                                        {isLoginNote ? (
                                                                            <>
                                                                                <div className='cont-auth-input mb-3'>
                                                                                    <input type="text" className='auth-input' value={email} onChange={e => setEmail(e.target.value)} placeholder='Email' required />
                                                                                    {emailError && <p className="error-message-auth">{emailError}</p>}
                                                                                </div>
                                                                                <div className='cont-auth-input mb-3'>
                                                                                    <input type="password" className='auth-input' value={password} onChange={e => setPassword(e.target.value)} placeholder='Mot de passe' required />
                                                                                    {passwordError && <p className="error-message-auth">{passwordError}</p>}
                                                                                </div>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <div className='cont-auth-input mb-3'>
                                                                                    <input type="text" value={name} onChange={e => setName(e.target.value)} className='auth-input' placeholder='Nom' required />
                                                                                    {nameError && <p className="error-message-auth">{nameError}</p>}
                                                                                </div>
                                                                                <div className='cont-auth-input mb-3'>
                                                                                    <input type="text" value={email} onChange={e => setEmail(e.target.value)} className='auth-input' placeholder='Email' required />
                                                                                </div>
                                                                                <div className='cont-auth-input mb-3'>
                                                                                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className='auth-input' placeholder='Mot de passe' required />
                                                                                    {passwordError && <p className="error-message-auth">{passwordError}</p>}
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                        <div className='mb-3'>
                                                                            <button type="submit" className='button-auth-con' disabled={loading}>
                                                                            {loading ? (
                                                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                        <BounceLoader size={20} color={"#fff"} />
                                                                                        <span style={{ marginLeft: '8px' }}>
                                                                                            {isLoginNote ? 'Connexion en cours...' : 'Inscription en cours...'}
                                                                                        </span>
                                                                                    </div>
                                                                                ) : (
                                                                                    isLoginNote ? 'SE CONNECTER' : 'S\'INSCRIRE'
                                                                                )}
                                                                            </button>
                                                                        </div>
                                                                    </form>
                                                                    <div className=''>
                                                                        <p className="text-center text-muted mb-0 par-con">
                                                                            {isLoginNote ? (
                                                                                <>J&apos;ai pas de compte? <a href="#" className="fw-bold text-body" onClick={switchNote}><u className="ins-con">M&apos;inscrire</u></a></>
                                                                            ) : (
                                                                                <>Déjà un compte? <a href="#" className="fw-bold text-body" onClick={switchNote}><u className="ins-con">Se connecter</u></a></>
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className='pagination-container mt-5'> 
                                    <div id="app" className="container-pagination">  
                                        <ul className="page">
                                            <li className="page__numbers"> 1</li>
                                            <li className="page__numbers actives">2</li>
                                            <li className="page__numbers">3</li>
                                            <li className="page__numbers">4</li>
                                            <li className="page__numbers">5</li>
                                            <li className="page__numbers">6</li>
                                            <li className="page__dots">....</li>
                                            <li className="page__numbers"> 10</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Contacts />
                    <Footer />
                </div>
            </div>
        </div>
    )
}
