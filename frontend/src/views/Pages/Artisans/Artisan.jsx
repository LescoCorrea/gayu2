import{ useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import Contacts from '../Components/Contacts';
import { fetchArtisan } from '../../../views/Dashboard/Admin/Components/Pages/actions/artisanActions';
import { addToFavorites, removeFromFavorites, checkIfFavoriteExists } from './actions/FavorisActions';
import { createReservation } from '../../../views/Dashboard/User/Components/Pages/actions/reservationActions';
import { likeRealisation, unlikeRealisation, fetchLikeCount } from './actions/LikeActions';
import { fetchCommentaires, likeCommentaire, addCommentaire, fetchLikesCount } from './actions/CommentaireActions';
import { createAvis } from './actions/AvisActions';
import './art.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ToastContainer} from 'react-toastify';
import { BounceLoader } from 'react-spinners';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Artisan() {
  const { id } = useParams();
  const fileInputReservationRef = useRef(null);
  const dispatch = useDispatch();
  const artisan = useSelector(state => state.artisans.artisan) || {};
  const loading = useSelector(state => state.artisans.loading);
  const favoriExists = useSelector(state => state.favoris.favoriExists);
  const [avisValue, setAvisValue] = useState('');
  const [showModalReserver, setShowModalReserver] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    heure: '',
    message: '',
    image: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedArtisanId, setSelectedArtisanId] = useState(null);
  const Realisations = useSelector(state => state.realisations.realisation || []);
  const commentaires = useSelector(state => state.commentaires.commentaires || []);
  const likesCounts = useSelector(state => state.commentaires.likesCount || {});
  const [likesCount, setLikesCount] = useState({});
  const [likedRealisation, setLikedRealisation] = useState({});
  const [dislikedRealisation, setDislikedRealisation] = useState({});
  const [noteValue, setNoteValue] = useState(0);
  const [selectedRealisationId, setSelectedRealisationId] = useState(null);
  const [commentaire, setCommentaire] = useState('');
  const [replyingToComment, setReplyingToComment] = useState(null);
  const [showReplies, setShowReplies] = useState({});
  const [likedComments, setLikedComments] = useState({}); // État pour gérer les likes des commentaires
  const [likedReplies, setLikedReplies] = useState({});

  useEffect(() => {
    dispatch(fetchArtisan(id));
    dispatch(checkIfFavoriteExists(id));
    dispatch(fetchCommentaires());
  }, [dispatch, id]);

    useEffect(() => {
        if (Realisations.length > 0) {
            Realisations.forEach(realisation => {
                dispatch(fetchLikeCount(realisation.id))
                    .then(response => {
                        setLikesCount(prev => ({ ...prev, [realisation.id]: response.data.count }));
                        setLikedRealisation(prev => ({ ...prev, [realisation.id]: realisation.isLiked }));
                        setDislikedRealisation(prev => ({ ...prev, [realisation.id]: realisation.isDisliked }));
                    })
                    .catch(error => {
                        toast.error('Erreur lors de la récupération du nombre de likes.');
                        console.error('Erreur lors de la récupération du nombre de likes:', error);
                    });
            });
        }
    }, [Realisations]);

  
    const handleFavoriteClick = () => {
        if (favoriExists) {
        dispatch(removeFromFavorites(id));
        toast.info("Retiré des favoris !");
        } else {
        dispatch(addToFavorites(id));
        toast.success("Ajouté aux favoris !");
        }
    };

    const handleLikeClick = (realisationId) => {
            const currentlyLiked = likedRealisation[realisationId] || false;

        if (currentlyLiked) {
            dispatch(unlikeRealisation(realisationId))
                .then(() => {
                    setLikesCount(prev => ({
                        ...prev,
                        [realisationId]: Math.max((prev[realisationId] || 0) - 1, 0)
                    }));
                    setLikedRealisation(prev => ({ ...prev, [realisationId]: false }));
                })
                .catch(error => {
                    toast.error('Erreur lors du retrait du like.');
                    console.error('Erreur lors du retrait du like:', error);
                });
        } else {
            dispatch(likeRealisation(realisationId))
                .then(() => {
                    setLikesCount(prev => ({
                        ...prev,
                        [realisationId]: (prev[realisationId] || 0) + 1
                    }));
                    setLikedRealisation(prev => ({ ...prev, [realisationId]: true }));
                    if (dislikedRealisation[realisationId]) {
                        setDislikedRealisation(prev => ({ ...prev, [realisationId]: false }));
                    }
                })
                .catch(error => {
                    toast.error('Erreur lors de l’ajout du like.');
                    console.error('Erreur lors de l’ajout du like:', error);
                });
            }
    };

    const handleDislikeClick = (realisationId) => {
        const currentlyDisliked = dislikedRealisation[realisationId] || false;

        if (currentlyDisliked) {
            setDislikedRealisation(prev => ({ ...prev, [realisationId]: false }));
        } else {
            setDislikedRealisation(prev => ({ ...prev, [realisationId]: true }));
            if (likedRealisation[realisationId]) {
                setLikedRealisation(prev => ({ ...prev, [realisationId]: false }));
                setLikesCount(prev => ({
                    ...prev,
                    [realisationId]: Math.max((prev[realisationId] || 0) - 1, 0)
                }));
            }
        }
    };

    const handleNoteChange = (value) => {
        setNoteValue(value);
    };

    const handleAvisChange = (e) => {
        setAvisValue(e.target.value);
    };

    const handleSubmitAvis = async (e) => {
        e.preventDefault();

        if (noteValue < 1 || noteValue > 5) {
            alert("Veuillez sélectionner une note entre 1 et 5.");
            return;
        }

        const newAvis = {
            artisan_id: id,
            avis: avisValue,
            note: noteValue,  // Ajoutez la note ici
          };

        try {
            await dispatch(createAvis(id, newAvis));
            toast.success("Votre avis a été ajouté avec succès !");
            setAvisValue('');
            setNoteValue(0);
        } catch (error) {
            toast.error("Une erreur est survenue lors de l'ajout de l'avis.");
            console.error('Error adding avis:', error);
        }
    };

  const { prenom, nom, atélier,addréss, image, metiers = [], regions = [], realisations = [], details = {} } = artisan;

  
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  const headerStyle = {
    backgroundImage: `url(http://localhost:8000/storage/${image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '60vh',
    color: 'white'
  };

  const whatsappLink = `https://wa.me/1234567890?text=Bonjour%20je%20suis%20intéressé%20par%20vos%20services`;
  //Remplacez 1234567890 par le numéro de téléphone du contact WhatsApp.

    const handleFileChangeRes = (event) => {
        const files = event.target.files;
        handleFilesRes(files);
    };
    const handleCloseModalReserver = () => {
        setShowModalReserver(false);
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

    const handleSubmitReservation = async (event) => {
        event.preventDefault();
        setIsLoading(true);
    
        if (!selectedArtisanId) {
            console.error("L'ID de l'artisan est indéfini.");
            setIsLoading(false);
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
            setShowModalReserver(false);
        } catch (error) {
            console.error("Erreur lors de la création de la réservation :", error);
            toast.error("Erreur lors de la création de la réservation. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleCommentModal = (realisationId) => {
        setSelectedRealisationId(prevId => {
            if (prevId === realisationId) {
                return null; // Si on clique sur la même réalisation, fermer le modal
            } else {
                setCommentaire(''); // Réinitialiser le champ de commentaire
                setReplyingToComment(null); // Réinitialiser l'état de réponse
                return realisationId; // Ouvrir le modal pour la nouvelle réalisation
            }
        });
    };

    const handleCommentSubmit = (e, realisationId) => {
        e.preventDefault();
        dispatch(addCommentaire(realisationId, commentaire, replyingToComment?.id));
        setCommentaire('');
        setReplyingToComment(null);
    };

    function formatTimeAgo(created_at) {
        const date = new Date(created_at);
        const now = new Date();
        const diffMs = now - date;
        const diffSeconds = Math.round(diffMs / 1000);
        const diffMinutes = Math.round(diffSeconds / 60);
        const diffHours = Math.round(diffMinutes / 60);
        const diffDays = Math.round(diffHours / 24);
        const diffWeeks = Math.round(diffDays / 7);
        const diffMonths = Math.round(diffDays / 30);
        const diffYears = Math.round(diffDays / 365);
    
        if (diffSeconds < 60) {
            return `il y a ${diffSeconds} secondes`;
        } else if (diffMinutes < 60) {
            return `il y a ${diffMinutes} minutes`;
        } else if (diffHours < 24) {
            return `il y a ${diffHours} heures`;
        } else if (diffDays < 7) {
            return `il y a ${diffDays} jours`;
        } else if (diffWeeks < 4) {
            return `il y a ${diffWeeks} semaines`;
        } else if (diffMonths < 12) {
            return `il y a ${diffMonths} mois`;
        } else {
            return `il y a ${diffYears} ans`;
        }
    }

    const getInitials = (name) => {
        return name ? name.split(' ').map(word => word[0]).join('') : '';
    };

    const handleReplyClick = (comment) => {
        if (replyingToComment?.id !== comment.id) {
          const name = comment.user?.name || (comment.artisan?.prenom + ' ' + comment.artisan?.nom);
            setCommentaire(`@${name} `);
        }
        setReplyingToComment(comment);
    };

    const handleReplyToReplyClick = (reply) => {
        if (replyingToComment?.id !== reply.id) {
            let name;
    
            if (reply.parent_comment_id) {
                // Récupérer le commentaire parent
                const parentComment = commentaires.find(c => c.id === reply.parent_comment_id);
    
                if (parentComment) {
                    // Utilisez le nom de l'utilisateur ou de l'artisan du commentaire parent
                    if (parentComment.user) {
                        name = parentComment.user.name;
                    } else if (parentComment.artisan) {
                        name = `${parentComment.artisan.prenom} ${parentComment.artisan.nom}`;
                    }
                }
            } else {
                // Si pas de commentaire parent, utiliser le nom de l'auteur du commentaire actuel
                if (reply.user) {
                    name = reply.user.name;
                } else if (reply.artisan) {
                    name = `${reply.artisan.prenom} ${reply.artisan.nom}`;
                }
            }
    
            console.log('Replying to:', name || 'undefined'); // Affichage pour debugging
            setCommentaire(`@${name} `);
        }
        setReplyingToComment(reply);
    }; 
    
    const handleReplyToInReplyClick = (reply) => {
        if (replyingToComment?.id !== reply.id) {
            const name = reply.user?.name || (reply.artisan?.prenom + ' ' + reply.artisan?.nom);
            setCommentaire(`@${name} `);
        }
        setReplyingToComment(reply);
    };

    function formatCommentaire(text) {
        const mentionRegex = /@[\w]+(?: [\w]+)?/g;
        return text.replace(mentionRegex, (match) => `<strong>${match}</strong>`);
    }

    const toggleReplies = (commentId) => {
        setShowReplies(prevState => ({
          ...prevState,
          [commentId]: !prevState[commentId] // Inverser la visibilité actuelle
        }));
    };

    useEffect(() => {
        commentaires.forEach(comment => {
            // Charger le nombre de likes pour chaque commentaire
            dispatch(fetchLikesCount(comment.id));
            comment.replies.forEach(reply => dispatch(fetchLikesCount(reply.id)));
        });
    }, [dispatch, commentaires]);

    const handleLikeCommentClick = (commentId, isReply = false) => {
        if (isReply) {
            dispatch(likeCommentaire(commentId));
            setLikedReplies(prevLikes => ({
                ...prevLikes,
                [commentId]: !prevLikes[commentId], // Toggle like state
            }));
        } else {
            dispatch(likeCommentaire(commentId));
            setLikedComments(prevLikes => ({
                ...prevLikes,
                [commentId]: !prevLikes[commentId], // Toggle like state
            }));
        }
    };
    

  return (
    <div className="artisan-page">
        <ToastContainer />
      <header className="artisan-header" style={headerStyle}>  
        <div className=''>
            <Navbar />
        </div>
      </header>
      <section className="artisan-info">
        <div className='container ctn-dtl-nm-art'>
            <div>
                <h3>Vérifié via :</h3>
                <div>
                    <Link href={whatsappLink} target="_blank" rel="noopener noreferrer">
                        <button className='btn-wht-wht'>
                            <i className="fa fa-whatsapp fa-whatsapp-icon" aria-hidden="true"></i>
                            WhatsApp
                        </button>
                    </Link>
                </div>
                <div className='mt-3'>
                    <button className='btn-wht-icon' onClick={() => {setSelectedArtisanId(artisan.id);setShowModalReserver(true);}}>
                        <i className="fa-solid fa-table-list fa-whatsapp-icon" aria-hidden="true"></i>
                        Réservation
                    </button>
                </div>
                {showModalReserver && (
                                        <div className="modal-overlay-modif">
                                            <div className="modal-modif">
                                                <div className="modal-content-modif">
                                                    <div className="modal-header-form">
                                                        <h1 className="t-md-rl" id="realisationModalLabel"><i className="fa-solid fa-arrow-left"></i> AJOUTER UNE RESERVATION</h1>
                                                        <span className="close-atri" onClick={handleCloseModalReserver}>&times;</span>
                                                    </div>
                                                <div className='bord-botr'>
                                                </div>
                                                <form onSubmit={handleSubmitReservation}>
                                                    <div className="modal-body">
                                                    <div className='cnt-rls'>
                                                        <div>
                                                        <label className='ti-fm-re'>Date</label>
                                                            <input type="date" name='date' value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className='ipt-rls' />
                                                        </div>
                                                        <div>
                                                        <label className='ti-fm-re'>Heure</label>
                                                            <input type="time" name='heure' value={formData.heure} onChange={(e) => setFormData({ ...formData, heure: e.target.value })} className='ipt-rls'/>
                                                        </div>
                                                    </div>
                                                    <div className='cnt-rls mt-3'>
                                                        <textarea className='text-res' name="message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} id="" placeholder='saisir votre message....'></textarea>
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
                                                        <button type="reset" className="btn-r-upl" onClick={handleCloseModalReserver}>ANNULER</button>
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
                <div className='mt-3'>
                    <button className='btn-wht-fav' onClick={handleFavoriteClick}>
                        <i className={favoriExists ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
                        {favoriExists ? "Retirer des favoris" : "Ajouter aux favoris"}
                    </button>
                </div>
                <div className='ctn-avis-artisan mt-3'>
                    <div className="">
                        <div className=''>
                            <h6>AVIS</h6>
                            <div className=''>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <i
                                        key={star}
                                        className={`fa ${star <= noteValue ? 'fa-star' : 'fa-star-o'}`}
                                        aria-hidden="true"
                                        onClick={() => handleNoteChange(star)}
                                        style={{ cursor: 'pointer' }}
                                    ></i>
                                ))}
                            </div>
                            <div className='mt-3'>
                                <form className='form-avis' onSubmit={handleSubmitAvis}>
                                    <div className=''>
                                        <div className="form-group">
                                            <textarea name="avis" value={avisValue} onChange={handleAvisChange} className="sai-avis" placeholder='Tapez vos avis ici ....' required></textarea>
                                        </div>
                                        <div className='cont-bnt-av'>
                                            <button type="submit" className="btn-avis">Soumettre</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='cnt-tdl-art'>
                <div className='ctn-info'>
                    <div className='info-left'>
                        <div className=' mt-3'>
                            {loading ? (
                                <Skeleton height={100} width={100} circle />
                            ) : (
                                <img
                                src={`http://localhost:8000/storage/${image}`}
                                
                                className="artisan-image"
                                />
                            )}
                            <div className='cont-info-left'>
                                {loading ? (
                                <Skeleton width={150} height={30} />
                                ) : (
                                <h1 className="artisan-name-info">{prenom} {nom}</h1>
                                )}
                            </div>
                            <div className='cont-info-left'>
                                {loading ? (
                                <Skeleton width={150} height={20} />
                                ) : (
                                <p className="artisan-email-info">
                                    {metiers.map((metier, index) => (
                                    <span key={index}>{metier.name}</span>
                                    ))}
                                </p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='info-rigth'>
                        <h2>Informations</h2>
                        <div>
                            <h6>ATELIER</h6>
                            <div className='cnt-atl'>
                                <i className="fa-solid fa-brush brush"></i>
                                {loading ? (
                                <Skeleton width={150} />
                                ) : (
                                <p className='nmt'>{atélier}</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <h6>ADDRESSE</h6>
                            <div className='cnt-atl'>
                                <i className="fa-solid fa-location-dot brush"></i>
                                {loading ? (
                                <Skeleton width={150} />
                                ) : (
                                <p className='nmt'>{addréss}</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <h6>REGION</h6>
                            <div className='cnt-atl'>
                                <i className="fa-solid fa-map-location-dot brush"></i>
                                {loading ? (
                                <Skeleton width={150} count={regions.length || 1} />
                                ) : (
                                regions.map((region, index) => (
                                    <p key={index} className='nmt'>{region.name}</p>
                                ))
                                )}
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div className='artisan-description-advice'>
                    <div>
                        <h6>DESCRIPTION</h6>
                        {loading ? (
                        <Skeleton count={3} />
                        ) : (
                        <div className='cont-artisan-description'>
                            <p className="artisan-description">
                                {details && details.description ? details.description : ''}
                            </p>
                        </div>
                        )}
                    </div>
                    <div className='mt-3'>
                        <h6>CONSEIL</h6>
                        {loading ? (
                        <Skeleton count={3} />
                        ) : (
                        <div className='cont-artisan-description'>
                            <p className="artisan-advice">
                                {details && details.conseil ? details.conseil : ''}
                            </p>
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </section>
      <section className="artisan-details">
        <div className="container">
            <div className="row artisan-section">
                <div className='mb-3'>
                    <h1 className='reali'>LES REALISATIONS DE L’ARTISAN</h1>
                </div >
                {loading ? (
                    <Skeleton height={300} />
                    ) : (realisations.map((realisation, index) => (
                    <div key={index} className="col-md-4 realisation">
                        <div className='st-fl-end-px prx'>
                            <div className='n-re-px'>
                                <small className='s-r-px'>{realisation.titre}</small>
                            </div>
                        </div>
                        <div className='st-fl-end prre'>
                            <div className='n-re'>
                                <small className='s-r'>{realisation.prix} FR</small>
                            </div>
                        </div>
                        {realisation.images.length > 1 ? (
                            <div className="realisation-slider">
                                <Slider {...sliderSettings}>
                                    {realisation.images.map((image, imageIndex) => (
                                    <div key={imageIndex} className="realisation-image-wrapper">
                                        <img
                                        src={`http://localhost:8000/storage/realisation/${image.image}`}
                                        alt={`Image ${imageIndex}`}
                                        className="realisation-image"
                                        />
                                    </div>
                                    ))}
                                </Slider>
                                </div>
                            ) : (
                                    <div className="realisation-image-wrapper">
                                        <img
                                            src={`http://localhost:8000/storage/realisation/${realisation.images[0]?.image}`}
                                            alt="Single image"
                                            className="realisation-image"
                                        />
                                    </div>
                        )}
                        <div>
                            <div className='cont-realisation-actions'>
                                    <div className="realisation-actions">
                                        <div
                                            onClick={() => handleLikeClick(realisation.id)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <i className={likedRealisation[realisation.id] ? "fa-solid fa-thumbs-up" : "fa-regular fa-thumbs-up"}></i>
                                        </div>
                                        <div className='like-rig'>
                                            <span>{likesCount[realisation.id] || 0}</span>
                                        </div>
                                        <div
                                            onClick={() => handleDislikeClick(realisation.id)}
                                            style={{ cursor: 'pointer' }} className='thmbs-right'
                                        >
                                            <i className={dislikedRealisation[realisation.id] ? "fa-solid fa-thumbs-down" : "fa-regular fa-thumbs-down"}></i>
                                        </div>
                                    </div>
                                    <div className="realisation-action" onClick={() => toggleCommentModal(realisation.id)}>
                                        <h6>{commentaires.filter(comment => comment.realisation_id === realisation.id).length} Commentaires</h6>
                                    </div>  
                            </div>
                            {selectedRealisationId === realisation.id && (
                                <div className="comment-section">
                                    <div className="comment-modal">
                                        {commentaires
                                            .filter(comment => comment.realisation_id === realisation.id)
                                            .map((comment, index) => (
                                            <div key={index} className='comment-item'>
                                                <div className='header-comment'>
                                                    <div className='nam-comment'>
                                                        {comment.user ? (
                                                            <div className='usr-comt'>
                                                                <span>{getInitials(comment.user.name)}</span>
                                                            </div>
                                                        ) : comment.artisan ? (
                                                            <img 
                                                                src={comment.artisan.image ? `http://localhost:8000/storage/${comment.artisan.image}` : 'path/to/default-image.jpg'} 
                                                                alt={comment.artisan.prenom} 
                                                                className='artisan-image-cmot' 
                                                            />
                                                        ) : (
                                                            <span>Utilisateur anonyme</span>
                                                        )}
                                                        <div className='user-nm-comt'>
                                                            <h6>{comment.user?.name || comment.artisan?.prenom + ' ' + comment.artisan?.nom || 'Utilisateur anonyme'}</h6>
                                                        </div>
                                                    </div> 
                                                    <div className='h-comment'>
                                                        <span>{formatTimeAgo(comment.created_at)}</span>
                                                    </div>
                                                </div>
                                                <div className='container-comment'>
                                                    <div>
                                                        <p className='p-com'>{comment.commentaire}</p>
                                                    </div>
                                                </div>
                                                <div className='cont-icon-comment'>
                                                    <div>
                                                        <span>{likesCounts[comment.id] || 0}</span>
                                                        <i  
                                                            className={`fa-heart heart-comt ${likedComments[comment.id] ? 'fa-solid' : 'fa-regular'}`}  
                                                            onClick={() => handleLikeCommentClick(comment.id)}
                                                        ></i>
                                                    </div>
                                                    <div className='cont-rpse-comt' onClick={() => toggleReplies(comment.id)}>
                                                        <span>{comment.replies?.length || 0}</span>
                                                        <h6 className='nm-reps'>réponses</h6>
                                                    </div>
                                                    <div className='cont-rpdre-comt' onClick={() => handleReplyClick(comment)}>
                                                        <h6 className='nm-rpdr'>répondre</h6>
                                                    </div>
                                                </div>
                                                
                                                {showReplies[comment.id] && comment.replies?.length > 0 && (
                                                comment.replies.map((reply, index) => (
                                                    <div key={reply.id || index} className='reply-item'>
                                                        <div className='header-comment'>
                                                            <div className='nam-comment'>
                                                                {reply.user ? (
                                                                    <div className='usr-comt'>
                                                                        <span>{getInitials(reply.user.name)}</span>
                                                                    </div>
                                                                ) : reply.artisan ? (
                                                                    <img 
                                                                    src={reply.artisan.image ? `http://localhost:8000/storage/${reply.artisan.image}` : 'path/to/default-image.jpg'} 
                                                                    alt={reply.artisan.prenom} 
                                                                    className='artisan-image-reply' 
                                                                    />
                                                                ) : (
                                                                    <span>Utilisateur anonyme</span>
                                                                )}
                                                                <div className='user-nm-comt'>
                                                                    <h6>{reply.user?.name || reply.artisan?.prenom + ' ' + reply.artisan?.nom || 'Utilisateur anonyme'}</h6>
                                                                </div>
                                                            </div> 
                                                            <div className='h-comment'>
                                                                <span>{formatTimeAgo(reply.created_at)}</span>
                                                            </div>
                                                        </div>
                                                        <div className='container-reply'>
                                                            <div>
                                                                <p className='p-com' dangerouslySetInnerHTML={{ __html: formatCommentaire(reply.commentaire) }}></p>
                                                            </div>
                                                        </div>
                                                        <div className='cont-icon-comment'>
                                                            <div>
                                                                <span>{likesCounts[reply.id] || 0}</span>
                                                                <i  
                                                                    className={`fa-heart heart-comt ${likedReplies[reply.id] ? 'fa-solid' : 'fa-regular'}`}  
                                                                    onClick={() => handleLikeCommentClick(reply.id, true)}
                                                                ></i>
                                                            </div>
                                                            <div className='cont-rpse-comt'>
                                                                <span>{reply.replies?.length || 0}</span>
                                                                <h6 className='nm-reps'>réponses</h6>
                                                            </div>
                                                            <div className='cont-rpdre-comt' onClick={() => handleReplyToInReplyClick(reply)}>
                                                                <h6 className='nm-rpdr'>répondre</h6>
                                                            </div>
                                                        </div>
                                                        {reply.replies?.map((subReply, index) => (
                                                            <div key={index} className='reply-items'>
                                                                <div className='header-comment'>
                                                                    <div className='nam-comment'>
                                                                        {subReply.user ? (
                                                                            <div className='usr-comt'>
                                                                                <span>{getInitials(subReply.user.name)}</span>
                                                                            </div>
                                                                        ) : subReply.artisan ? (
                                                                            <img 
                                                                                src={subReply.artisan.image ? `http://localhost:8000/storage/${subReply.artisan.image}` : 'path/to/default-image.jpg'} 
                                                                                alt={subReply.artisan.prenom} 
                                                                                className='artisan-image-reply' 
                                                                            />
                                                                        ) : (
                                                                            <span>Utilisateur anonyme</span>
                                                                        )}
                                                                        <div className='user-nm-comt'>
                                                                            <h6>{subReply.user?.name || subReply.artisan?.prenom + ' ' + subReply.artisan?.nom || 'Utilisateur anonyme'}</h6>
                                                                        </div>
                                                                    </div> 
                                                                    <div className='h-comment'>
                                                                        <span>{formatTimeAgo(subReply.created_at)}</span>
                                                                    </div>
                                                                </div>
                                                                <div className='container-reply'>
                                                                    <div>
                                                                        <p className='p-com' dangerouslySetInnerHTML={{ __html: formatCommentaire(subReply.commentaire) }}></p>
                                                                    </div>
                                                                </div>
                                                                <div className='cont-icon-comment'>
                                                                    <div>
                                                                        <span>{likesCounts[subReply.id] || 0}</span>
                                                                        <i className="fa-regular fa-heart heart-comt"></i>
                                                                    </div>
                                                                    <div className='cont-rpse-comt'>
                                                                        <span>{subReply.replies?.length || 0}</span>
                                                                        <h6 className='nm-reps'>réponses</h6>
                                                                    </div>
                                                                    <div className='cont-rpdre-comt' onClick={() => handleReplyToReplyClick(reply)}>
                                                                        <h6 className='nm-rpdr'>répondre</h6>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ))
                                                )}
                                            </div>   
                                        ))}
                                    </div>
                                    <div className='cont-form-comment mt-3'>
                                            <form onSubmit={(e) => handleCommentSubmit(e, realisation.id)}>
                                                <div>
                                                    <input type="text" value={commentaire} onChange={(e) => setCommentaire(e.target.value)} className='inpt-cmot' placeholder='Saisir votre commentaire...' />
                                                    <button type='submit' className='btn-comt'>
                                                        {replyingToComment  ? 'Répondre' : 'Commenter'}
                                                    </button>
                                                </div>
                                            </form>
                                    </div>
                                </div>    
                            )}
                        </div>

                    </div>
                )))}
            </div>
        </div>
      </section>
      <Contacts />
      <Footer />
    </div>
  );
}
