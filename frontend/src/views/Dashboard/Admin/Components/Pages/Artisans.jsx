import { useState, useRef, useEffect } from 'react'
import './admin.css';
import './modal.css';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Swal from 'sweetalert2';
import { BounceLoader } from 'react-spinners';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMetiers } from './actions/metierActions';
import { fetchRegions } from './actions/regionActions';
import { fetchRoles } from './actions/roleActions';
import { assignRoleAndDetails } from './actions/artisanActions';
import { addArtisan, deleteArtisan, updateArtisan, fetchArtisans, updateArtisanAccess  } from './actions/artisanActions';

export default function Artisans() {

  const [artisanStatus, setArtisanStatus] = useState({});
  const [filteredArtisans, setFilteredArtisans] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [metierFilter, setMetierFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDropdownMetierOpen, setDropdownMetierOpen] = useState(false);
  const [isDropdownRegionOpen, setDropdownRegionOpen] = useState(false);
  const fileInputRef = useRef(null);
  const fileInputModifRef = useRef(null);
  const dispatch = useDispatch();
  const metiers = useSelector(state => state.metiers.metiers) || []; // Initialiser metiers comme tableau vide si undefined
  const regions = useSelector(state => state.regions.regions) || [];
  const roles = useSelector(state => state.roles.roles) || [];
  const artisans = useSelector(state => state.artisans.artisans) || []; 
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    password: '',
    téléphone: '',
    image: null,
    atélier: '',
    addréss: '',
    region: '',
    metier: '',
    role: '',
    description: '',
    conseil: '',
    metiers: [], // Ajoutez un état pour stocker les métiers
    regions: [],
    roles: [],
  });
  const [inputsArtisan, setInputsArtisan] = useState({
    prenom: '',
    nom: '',
    email: '',
    password: '',
    téléphone: '',
    image: null,
    atélier: '',
    addréss: '',
    region: '',
    metier: '',
    role: '',
    description: '',
    conseil: '',
    metiers: [], // Ajoutez un état pour stocker les métiers
    regions: [],
    roles: [],
  });
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);


  useEffect(() => {
    dispatch(fetchMetiers());
    dispatch(fetchRegions());
    dispatch(fetchArtisans());
    dispatch(fetchRoles());
  }, []);

  useEffect(() => {
    setFormData(prevState => ({
      ...prevState,
      metiers: metiers,
      regions: regions,
    }));
  }, [metiers, regions]);

  const handleButtonClick = (e) => {
    e.preventDefault(); // Empêche le formulaire de se soumettre
    fileInputRef.current.click(); // Ouvre la fenêtre de sélection de fichiers
  };

  const handleButtonClickModif = (e) => {
    e.preventDefault(); // Empêche le formulaire de se soumettre
    fileInputModifRef.current.click(); // Ouvre la fenêtre de sélection de fichiers
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    handleFiles(files);
  };

  const handleFileChangeModif = (event) => {
    const files = Array.from(event.target.files);

    setInputsArtisan((prevInputs) => {
        // Si nous avons déjà des images, nous les fusionnons avec les nouvelles images
        const updatedImages = prevInputs.image ? [...prevInputs.image, ...files] : files;

        return {
            ...prevInputs,
            image: updatedImages
        };
    });
  };


  const handleFiles = (files) => {
    let newImages = [];
    if (Array.isArray(formData.image)) {
      newImages = [...formData.image];
    }
    for (let i = 0; i < files.length; i++) {
      newImages.push(files[i]);
    }
    setFormData({ ...formData, image: newImages });
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
  
  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    handleFiles(files);
  };

  const handleDropModif = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    handleFilesModif(files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDragOverModif = (event) => {
    event.preventDefault();
  };

  const handleDeleteImage = () => {
    setFormData(prevState => ({
      ...prevState,
      image: [],
      currentImage: null
    }));
  };

  const handleDeleteArtisanImage = (index, event) => {
    event.preventDefault();

    // Créez une copie de l'objet inputsArtisan
    const updatedInputsArtisan = { ...inputsArtisan };

    // Si inputsArtisan.image est un tableau (plusieurs images), supprimez l'élément du tableau
    if (Array.isArray(inputsArtisan.image)) {
      const updatedImages = inputsArtisan.image.filter((_, idx) => idx !== index);
      updatedInputsArtisan.image = updatedImages;
    } else {
      // Si inputsArtisan.image est une seule image, supprimez simplement l'image
      updatedInputsArtisan.image = null;
    }

    // Mettez à jour l'état avec le nouveau inputsArtisan
    setInputsArtisan(updatedInputsArtisan);
  };

  const handleInputChangeRole = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      handleFiles(files);
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      prenom: '',
      nom: '',
      email: '',
      password: '',
      téléphone: '',
      image: null,
      atélier: '',
      addréss: '',
      region: '',
      metier: '',
      role: '',
      description: '',
      conseil: '',
      metiers: [],
      regions: [],
      roles: [],
    });
  };

  const handleArtisanSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await dispatch(addArtisan(formData));
      toast.success('Artisan ajouté avec succès!');
      resetForm();
      setShowAddModal(false);
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de l\'artisan.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleArtisanDelete = async (artisanId) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Vous ne pourrez pas revenir en arrière!',
      showCancelButton: true,
      confirmButtonColor: '#02df56',
      cancelButtonColor: '#9A0000',
      confirmButtonText: '<i class="fa fa-check"></i> Supprimer',
      cancelButtonText: '<i class="fa fa-times"></i> Annuler'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await dispatch(deleteArtisan(artisanId));
          toast.success('Artisan supprimé avec succès!');
          await dispatch(fetchArtisans());
          
        } catch (error) {
          console.error('Erreur lors de la requête API', error);
          toast.error('Erreur lors de la suppression de l\'artisan');
        }
      }
    });
  };

  const handleEditClick = (artisan) => {
    setInputsArtisan({
        prenom: artisan.prenom || '',
        nom: artisan.nom || '',
        email: artisan.email || '',
        password: '', // Réinitialiser si non requis
        téléphone: artisan.téléphone || '',
        image: artisan.image || null,
        atélier: artisan.atélier || '',
        addréss: artisan.addréss || '',
        metier: artisan.metiers && artisan.metiers.length > 0 ? artisan.metiers[0].id : '',
        region: artisan.regions && artisan.regions.length > 0 ? artisan.regions[0].id : '',
    });
    setSelectedArtisan(artisan);
    setShowEditModal(true);
  };

  const handleInputChangeModif = (e) => {
    const { name, value } = e.target;
    setInputsArtisan(prevState => ({
      ...prevState,
      [name]: value
    }));
    
  };

  const handleArtisanUpdate = async () => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append('_method', 'PUT'); 
      formData.append('prenom', inputsArtisan.prenom);
      formData.append('nom', inputsArtisan.nom);
      formData.append('email', inputsArtisan.email);
      formData.append('password', inputsArtisan.password);
      formData.append('téléphone', inputsArtisan.téléphone);
      formData.append('atélier', inputsArtisan.atélier);
      formData.append('addréss', inputsArtisan.addréss);
      formData.append('region', inputsArtisan.region);
      formData.append('metier', inputsArtisan.metier);

      if (inputsArtisan.image) {
        formData.append('image', inputsArtisan.image[0]);
      }

    Object.keys(formData).forEach(key => {
      formData.append(key, formData[key]);
    });
    
    try {
      await dispatch(updateArtisan(selectedArtisan.id, formData));
      toast.success('Artisan modifié avec succès!');
      resetForm();
      handleCloseModalEdit();
    } catch (error) {
      toast.error('Erreur lors de la modification de l\'artisan.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    console.log('ID sélectionné pour la mise à jour :', selectedArtisan.id);
    await handleArtisanUpdate();
  };

  const handleCloseModalAdd = () => {
    setShowAddModal(false);
  };

  const handleCloseModalEdit = () => {
    setInputsArtisan({
        prenom: '',
        nom: '',
        email: '',
        password: '',
        téléphone: '',
        image: null,
        atélier: '',
        addréss: '',
        region: '',
        metier: '',
    });
    setSelectedArtisan(null);
    setShowEditModal(false);
  };

  const handleViewModal = (artisanId) => {
    const selectedArtisan = artisans.find(artisan => artisan.id === artisanId);
    setShowModal(true);
    if (selectedArtisan) {
      setFormData({
        ...formData,
        prenom: selectedArtisan.prenom,
        nom: selectedArtisan.nom,
        email: selectedArtisan.email,
        téléphone: selectedArtisan.téléphone,
        image: selectedArtisan.image,
        atélier: selectedArtisan.atélier,
        addréss: selectedArtisan.addréss,
        region: selectedArtisan.regions.map(region => region.name).join(', '),
        metier: selectedArtisan.metiers.map(metier => metier.name).join(', '),
        role: selectedArtisan.role,
        description: selectedArtisan.description,
        conseil: selectedArtisan.conseil,
        artisanId: selectedArtisan.id,
        metiers: selectedArtisan.metiers,
        regions: selectedArtisan.regions
      });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const { role, description, conseil, artisanId } = formData;
      await dispatch(assignRoleAndDetails(artisanId, role, description, conseil));
      toast.success('Rôle attribué avec succès!');
      setFormData(prevState => ({
        ...prevState,
        role: '',
        description: '',
        conseil: '',
      }));
      handleCloseModal();  
    } catch (error) {
      console.error('Erreur lors de l\'attribution du rôle et des détails à l\'artisan', error);
      toast.error('Erreur lors de l\'attribution du rôle');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (Array.isArray(artisans)) {  // Vérifie si artisans est un tableau
      const initialStatus = {};
      artisans.forEach(artisan => {
        initialStatus[artisan.id] = artisan.access === 'actif';
      });
      setArtisanStatus(initialStatus);
    }
  }, [artisans]);

  const handleIconClick = (artisanId) => {
    const newStatus = !artisanStatus[artisanId];
    setArtisanStatus(prevState => ({
      ...prevState,
      [artisanId]: newStatus
    }));
    dispatch(updateArtisanAccess(artisanId, newStatus ? 'actif' : 'inactif'));
  };
  
  const actifCount = artisans.filter(artisan => artisan.access === 'actif').length;
  const inactifCount = artisans.filter(artisan => artisan.access === 'inactif').length;

  useEffect(() => {
    let filtered = artisans;
    
    if (statusFilter) {
      filtered = filtered.filter(artisan => artisan.access === statusFilter);
    }

    if (metierFilter) {
      filtered = filtered.filter(artisan => artisan.metiers.some(metier => metier.name === metierFilter));
    }
    
    if (regionFilter) {
      filtered = filtered.filter(artisan => artisan.regions.some(region => region.name === regionFilter));
    }
    
    if (searchTerm) {
      filtered = filtered.filter(artisan => 
        artisan.prenom.toLowerCase().includes(searchTerm.toLowerCase()) || 
        artisan.nom.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredArtisans(filtered);
  }, [statusFilter, metierFilter, regionFilter, artisans, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleDropdownMode = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleDropdownMetier = () => {
    setDropdownMetierOpen(!isDropdownMetierOpen);
  };
  
  const toggleDropdownRegion = () => {
    setDropdownRegionOpen(!isDropdownRegionOpen);
  };

  const artisansPerPage = 6;
  const indexOfLastArtisan = currentPage * artisansPerPage;
  const indexOfFirstArtisan = indexOfLastArtisan - artisansPerPage;
  const currentArtisans = filteredArtisans.slice(indexOfFirstArtisan, indexOfLastArtisan);const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredArtisans.length / artisansPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const totalPages = Math.ceil(filteredArtisans.length / artisansPerPage);


  return (
    <div>
      <div className="container content-flou mt-3">
        <ToastContainer />
        <div className=''>
          <h1 className='titel-sd'>Artisans</h1>
          <span className='s-t-sd'>Visualiser, modifier et supprimer un artisan</span>
        </div>
          
          <div className='ctn-titre-head mt-3'>
            <div className='clr-srch'>
              <div className="dropdown-container">
                <label className='s-t-sd'>Triez par statut :</label>
                <div className="dropdown">
                  <button className="dropbtn" onClick={toggleDropdownMode}>
                    <div className='bt-dom'>
                      <div>
                        <i className={`fa-regular ${statusFilter === '' ? 'fa-square-check' : 'fa-square cnt-square s-t-sd'}`}></i>
                      </div>
                      <div>
                        <span className='txmode'>
                          {statusFilter === '' ? 'Tous' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                        </span>
                      </div>
                    </div>
                  </button>
                  <div className={`dropdown-content ${isDropdownOpen ? 'show' : ''}`}>
                    <div className='hover-mode' onClick={() => setStatusFilter('')}>
                      <i className={`fa-regular ${statusFilter === '' ? 'fa-square-check chk-st' : 'fa-square cnt-square s-t-sd'}`}></i>
                      <span className='txt-mode'>Tous</span>
                    </div>
                    <div className='hover-mode' onClick={() => setStatusFilter('actif')}>
                      <i className={`fa-regular ${statusFilter === 'actif' ? 'fa-square-check chk-st' : 'fa-square cnt-square s-t-sd'}`}></i>
                      <span className='txt-mode'>Actif</span>
                    </div>
                    <div className='hover-mode' onClick={() => setStatusFilter('inactif')}>
                      <i className={`fa-regular ${statusFilter === 'inactif' ? 'fa-square-check chk-st' : 'fa-square cnt-square s-t-sd'}`}></i>
                      <span className='txt-mode'>Inactif</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='src-artsn'>
                <form className="d-none d-md-inline-block ms-auto me-0 me-md-3 my-2 my-md-0">
                  <div className="d-inp-ad">
                    <i className="fa-solid fa-magnifying-glass sr-f-src"></i>
                    <input className="r-ds" type="text" value={searchTerm} onChange={handleSearchChange} placeholder="Recherchez..." />
                  </div>
                </form>
              </div>
            </div>
            <div className='contenair-btn-aj-art'>
              <button className='btn-aj-artian' onClick={() => setShowAddModal(true)}><i className="fa-solid fa-plus i-pls"></i><span className='nm-tbl'>Nouvel artisan</span></button>
            </div>
          </div>
          {showAddModal && (
                          <div className='modal-overlay-modif'>
                            <div className="modal-modif">
                              <div className="modal-content-modif">
                                <div>
                                  <span className="close-atri" onClick={handleCloseModalAdd}>&times;</span>
                                  <h1 className="t-md-rl"><i className="fa-solid fa-arrow-left"></i>AJOUTER UN ARTISAN</h1>
                                </div>
                                    <form onSubmit={handleArtisanSubmit}>
                                        <div className="modal-body">
                                          <div className='cnt-rls'>
                                            <div>
                                              <label className='ti-fm-re'>Prénom</label>
                                              <input type="text" name='prenom' className='ipt-rls' value={formData.prenom} onChange={(e) => setFormData({ ...formData, prenom: e.target.value })} />
                                            </div>
                                            <div>
                                              <label className='ti-fm-re'>Nom</label>
                                              <input type="text" name='nom' className='ipt-rls' value={formData.nom}  onChange={(e) => setFormData({ ...formData, nom: e.target.value })} />
                                            </div>
                                          </div>
                                          <div className='cnt-rls'>
                                            <div>
                                              <label className='ti-fm-re'>Email</label>
                                              <input type="text" name='email' className='ipt-rls' value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                            </div>
                                            <div className='mdp-art'>
                                              <label className='ti-fm-re'>Mot de passe</label>
                                              <input type="text" name='password' className='ipt-rls' value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                                            </div>
                                          </div>
                                          <div className='cnt-rls'>
                                            <div>
                                              <label className='ti-fm-re'>Numéro Téléphone</label>
                                              <input type="text" name='téléphone' className='ipt-rls' value={formData.téléphone} onChange={(e) => setFormData({ ...formData, téléphone: e.target.value })} />
                                            </div>
                                            <div>
                                              <label className='ti-fm-re'>Adrésse Artisan</label>
                                              <input type="text" name='addréss' className='ipt-rls' value={formData.addréss} onChange={(e) => setFormData({ ...formData, addréss: e.target.value })} />
                                            </div>
                                          </div>
                                          <div className='cnt-rls'>
                                            <div>
                                              <label className='ti-fm-re'>Atélier</label>
                                              <input type="text" name='atélier' className='ipt-rls' value={formData.atélier} onChange={(e) => setFormData({ ...formData, atélier: e.target.value })} />
                                            </div>
                                            <div className='mdp-art'>
                                              <label className='ti-fm-re'>Métier</label>
                                              <select name="metier" className='ipt-rls' id="metier" value={formData.metier} onChange={handleInputChange}>
                                                <option value=""></option>
                                                {metiers && metiers.map(metier => (
                                                  <option key={metier.id} value={metier.id}>{metier.name}</option>
                                                ))}
                                              </select>
                                            </div>
                                          </div>
                                          <div className='cnt-rls'>
                                            <div className='rt-arts'>
                                              <label className='ti-fm-re'>Régions</label>
                                              <select name="region" id="region" className='ipt-rls' value={formData.region} onChange={handleInputChange}>
                                                <option value=""></option>
                                                {regions && regions.map(region => (
                                                  <option key={region.id} value={region.id}>{region.name}</option>
                                                ))}
                                              </select>
                                            </div>
                                          </div>
                                          <div className='cont-upload-img'>
                                            <div className=''>
                                              <div className='img-upload'>
                                                <input
                                                  type="file"
                                                  ref={fileInputRef}
                                                  onChange={handleFileChange}
                                                  style={{ display: 'none' }}
                                                  multiple
                                                  accept="image/*"
                                                />
                                                <button className='tl-upl' onClick={handleButtonClick}>Importer une image</button>
                                              </div>
                                              <div
                                                onDrop={handleDrop}
                                                onDragOver={handleDragOver}
                                                style={{
                                                  border: '2px dashed #ccc',
                                                  borderRadius: '5px',
                                                  padding: '8px',
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
                                                      style={{ marginRight: '10px', marginBottom: '10px', maxWidth: '150px', maxHeight: '150px' }}
                                                    />
                                                    <i className="fa-regular fa-circle-xmark c-tr-ic" onClick={(event) => handleDeleteImage(index, event)} style={{ position: 'absolute', top: '-5px', right: '1px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}></i>
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
                                          <button type="reset" className="btn-r-upl" onClick={handleCloseModalAdd}>ANNULER</button>
                                          <button type="submit" className="btn-r-smt">
                                            {isLoading ? (
                                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <BounceLoader size={20} color={"#fff"} />
                                                <span style={{ marginLeft: '8px' }}>Chargement...</span>
                                              </div>
                                            ) : 'AJOUTER'}
                                          </button>
                                        </div>
                                  </form>
                              </div>
                            </div>
                          </div>
          )}
        <div>
        <div className="filter-container mt-3">
                <div className='clr-srch'>
                  <div className="dropdown-container">
                    <label className='s-t-sd'>Filtrer par métier :</label>
                    <div className="dropdown">
                      <button className="dropbtn-metier" onClick={toggleDropdownMetier}>
                        <div className='bt-dom'>
                          <div>
                            <i className={`fa-regular ${metierFilter === '' ? 'fa-square-check' : 'fa-square cnt-square s-t-sd'}`}></i>
                          </div>
                          <div>
                            <span className='txmode'>
                              {metierFilter === '' ? 'Tous les métiers' : metierFilter}
                            </span>
                          </div>
                        </div>
                      </button>
                      <div className={`dropdown-content ${isDropdownMetierOpen ? 'show' : ''}`}>
                        <div className='hover-mode' onClick={() => setMetierFilter('')}>
                          <i className={`fa-regular ${metierFilter === '' ? 'fa-square-check chk-st' : 'fa-square cnt-square s-t-sd'}`}></i>
                          <span className='txt-mode'>Tous les métiers</span>
                        </div>
                        {metiers.map((metier, index) => (
                          <div key={index} className='hover-mode' onClick={() => setMetierFilter(metier.name)}>
                            <i className={`fa-regular ${metierFilter === metier.name ? 'fa-square-check chk-st' : 'fa-square cnt-square s-t-sd'}`}></i>
                            <span className='txt-mode'>{metier.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="dropdown-container rgn-ctn">
                    <label className='s-t-sd'>Filtrer par région :</label>
                    <div className="dropdown">
                      <button className="dropbtn-metier" onClick={toggleDropdownRegion}>
                        <div className='bt-dom'>
                          <div>
                            <i className={`fa-regular ${regionFilter === '' ? 'fa-square-check' : 'fa-square cnt-square s-t-sd'}`}></i>
                          </div>
                          <div>
                            <span className='txmode'>
                              {regionFilter === '' ? 'Toutes les régions' : regionFilter}
                            </span>
                          </div>
                        </div>
                      </button>
                      <div className={`dropdown-content ${isDropdownRegionOpen ? 'show' : ''}`}>
                        <div className='hover-mode' onClick={() => setRegionFilter('')}>
                          <i className={`fa-regular ${regionFilter === '' ? 'fa-square-check chk-st' : 'fa-square cnt-square s-t-sd'}`}></i>
                          <span className='txt-mode'>Toutes les régions</span>
                        </div>
                        {regions.map((region, index) => (
                          <div key={index} className='hover-mode' onClick={() => setRegionFilter(region.name)}>
                            <i className={`fa-regular ${regionFilter === region.name ? 'fa-square-check chk-st' : 'fa-square cnt-square s-t-sd'}`}></i>
                            <span className='txt-mode'>{region.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
        </div>
          <div className='ctn-inc-circle mt-3'>
            <div className='s-t-sd'>
              <span>Nombre artisan Actif</span> <i className="fa-solid fa-circle c-fs"></i> : {actifCount}
            </div>
            <div className='act-ic s-t-sd'>
              <span>Nombre artisan Inactif </span> <i className="fa-solid fa-circle c-fs-in"></i> : {inactifCount}
            </div>
          </div>

        </div>
        <div className='mt-3'>
          <table className="table t-cont-role">
            <thead>
              <tr className='tr-usr'>
                <th scope="col">Nom de l&apos;artisan</th>
                <th scope="col">Email</th>
                <th scope="col">Métier</th>
                <th scope="col">Téléphone</th>
                <th scope="col">Lieu</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
            {currentArtisans.length === 0 ? (
            <tr>
              <td colSpan="8">
                <div className="text-center">
                  <Skeleton count={6} />
                </div>
              </td>
            </tr>
            ) : ( currentArtisans .map((artisan, index) => (
                <tr key={index} className='t-row-b'>
                  <td className='n-tb'>{artisan.prenom} {artisan.nom}</td>
                  <td className='n-tb'>{artisan.email}</td>
                  <td className='n-tb'>
                    {artisan.metiers && artisan.metiers.map((metier, index) => (
                      <span key={index}>{metier.name}</span>
                    ))}
                  </td>
                  <td className='n-tb'>{artisan.téléphone}</td>
                  <td className='n-tb'>
                    {artisan.regions && artisan.regions.map((region, index) => (
                      <span key={index}>{region.name}</span>
                    ))}
                  </td>
                  <td>
                    <div className={artisanStatus[artisan.id] ? 'mode-actif' : 'mode-inactif'}>
                      <i className={`fa-solid ${artisanStatus[artisan.id] ? 'fa-circle c-fs' : 'fa-circle c-fs-in'}`}></i>
                      <span className={artisanStatus[artisan.id] ? 'act-mo' : 'act-mod-in'}>
                        {artisanStatus[artisan.id] ? 'actif' : 'inactif'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <i 
                        className={`fa-solid ${artisanStatus[artisan.id] ? 'fa-lock-open' : 'fa-unlock'} i-lock`}
                        onClick={() => handleIconClick(artisan.id)} // Appeler la fonction de clic avec l'ID de l'artisan
                      ></i> 
                      <i className="fa-solid fa-eye i-eye" onClick={() => handleViewModal(artisan.id)}></i>
                      {showModal && (
                        <div className="modal-overlay">
                            <div className="modal-atri">
                              <div className="modal-content-atr">
                                <div>
                                  <span className="close-atri" onClick={handleCloseModal}>&times;</span>
                                  <h1 className="t-md-rl"><i className="fa-solid fa-arrow-left"></i> ATTRIBUTION UN ROLE ARTISAN</h1>
                                </div>
                                <div>
                                  <div className='cnt-rls mt-3 mb-3'>
                                    <div className='C-rl'>
                                      <img src={`http://localhost:8000/storage/${formData.image}`} alt="" className='img-dtl-srt' />
                                    </div>
                                    <div className='clr-left'>
                                      <div>
                                        <label className='ti-fm-re '>Nom :</label>
                                        <span className='clt-right'>{formData.prenom} {formData.nom}</span>
                                      </div>
                                      <div className='spc-dt'>
                                        <label className='ti-fm-re '>Email :</label>
                                        <span className='clt-right'>{formData.email}</span>
                                      </div>
                                      <div className='spc-dt'>
                                        <label className='ti-fm-re '>Métier :</label>
                                        <span className='clt-right'>{formData.metier}</span>
                                      </div>
                                      <div className='spc-dt'>
                                        <label className='ti-fm-re '>Téléphone :</label>
                                        <span className='clt-right'>{formData.téléphone}</span>
                                      </div>
                                      <div className='spc-dt'>
                                        <label className='ti-fm-re '>Adrésse :</label>
                                        <span className='clt-right'>{formData.addréss}</span>
                                      </div>
                                      <div className='spc-dt'>
                                        <label className='ti-fm-re'>Lieu :</label>
                                        <span className='clt-right'>{formData.region}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <form onSubmit={handleSubmit}>
                                    <div className=''>
                                      <div className='C-rl'>
                                        <label className='ti-fm-re'>Rôle</label>
                                        <select name="role" className='ipt-rls-atr' id="role" value={formData.role} onChange={handleInputChangeRole}>
                                          <option value=""></option>
                                          {roles && roles.map(role => (
                                            <option key={role.id} value={role.id}>{role.name}</option>
                                          ))}
                                        </select>
                                      </div>
                                    </div>
                                    <div className='descons'>
                                      <div className='C-rl'>
                                        <label className='ti-fm-re'>Déscription</label>
                                        <textarea name="description" id="description" value={formData.description} onChange={handleInputChangeRole} cols="25" rows="6" className='tx-dc'></textarea>
                                      </div>
                                      <div className='C-rl cnt-C-rl'>
                                        <label className='ti-fm-re'>Conseil</label>
                                        <textarea name="conseil" id="conseil" value={formData.conseil} onChange={handleInputChangeRole} cols="25" rows="6" className='tx-dc'></textarea>
                                      </div>
                                    </div>
                                    <div className="modal-footer-form btn-cod">
                                      <button type="reset" className="btn-r-upl-mod">ANNULER</button>
                                      <button type="submit" className="btn-r-smt">
                                        {isLoading ? (
                                          <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <BounceLoader size={20} color={"#fff"} />
                                            <span style={{ marginLeft: '8px' }}>Chargement...</span>
                                          </div>
                                        ) : 'ATTRIBUER'}
                                      </button>
                                    </div>
                                  </form>
                                </div>
                              </div>
                            </div>
                        </div>
                      )}
                      <i className="fa-solid fa-trash-can i-trs" onClick={() => handleArtisanDelete(artisan.id)}></i>
                      <i className="fa-solid fa-pen-to-square i-pen" onClick={() => handleEditClick(artisan)} ></i>
                      {showEditModal && (
                        <div className='modal-overlay-modif'>
                          <div className="modal-modif">
                            <div className="modal-content-modif">
                              <div>
                                <span className="close-atri" onClick={handleCloseModalEdit}>&times;</span>
                                <h1 className="t-md-rl"><i className="fa-solid fa-arrow-left"></i>MODIFIER UN ARTISAN</h1>
                              </div>
                                  <form onSubmit={handleUpdateSubmit}>
                                      <div className="modal-body">
                                        <div className='cnt-rls'>
                                          <div>
                                            <label className='ti-fm-re'>Prénom</label>
                                            <input type="text" name='prenom' className='ipt-rls' value={inputsArtisan.prenom} onChange={handleInputChangeModif} />
                                          </div>
                                          <div>
                                            <label className='ti-fm-re'>Nom</label>
                                            <input type="text" name='nom' className='ipt-rls' value={inputsArtisan.nom}  onChange={handleInputChangeModif} />
                                          </div>
                                        </div>
                                        <div className='cnt-rls'>
                                          <div>
                                            <label className='ti-fm-re'>Email</label>
                                            <input type="text" name='email' className='ipt-rls' value={inputsArtisan.email} onChange={handleInputChangeModif} />
                                          </div>
                                          <div className='mdp-art'>
                                            <label className='ti-fm-re'>Mot de passe</label>
                                            <input type="text" name='password' className='ipt-rls' value={inputsArtisan.password} onChange={handleInputChangeModif} />
                                          </div>
                                        </div>
                                        <div className='cnt-rls'>
                                          <div>
                                            <label className='ti-fm-re'>Numéro Téléphone</label>
                                            <input type="text" name='téléphone' className='ipt-rls' value={inputsArtisan.téléphone} onChange={handleInputChangeModif} />
                                          </div>
                                          <div>
                                            <label className='ti-fm-re'>Adrésse Artisan</label>
                                            <input type="text" name='addréss' className='ipt-rls' value={inputsArtisan.addréss} onChange={handleInputChangeModif} />
                                          </div>
                                        </div>
                                        <div className='cnt-rls'>
                                          <div>
                                            <label className='ti-fm-re'>Atélier</label>
                                            <input type="text" name='atélier' className='ipt-rls' value={inputsArtisan.atélier} onChange={handleInputChangeModif} />
                                          </div>
                                          <div className='mdp-art'>
                                            <label className='ti-fm-re'>Métier</label>
                                            <select name="metier" className='ipt-rls' id="metier" value={inputsArtisan.metier} onChange={handleInputChangeModif}>
                                              <option value=""></option>
                                              {metiers && metiers.map(metier => (
                                                <option key={metier.id} value={metier.id}>{metier.name}</option>
                                              ))}
                                            </select>
                                          </div>
                                        </div>
                                        <div className='cnt-rls'>
                                          <div className='rt-arts'>
                                            <label className='ti-fm-re'>Régions</label>
                                            <select name="region" id="region" className='ipt-rls' value={inputsArtisan.region || ''} onChange={handleInputChangeModif}>
                                              <option value=""></option>
                                              {regions && regions.map(region => (
                                                <option key={region.id} value={region.id}>{region.name}</option>
                                              ))}
                                            </select>
                                          </div>
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
                                              {inputsArtisan.image && (
                                                Array.isArray(inputsArtisan.image) ? (
                                                  inputsArtisan.image.map((image, index) => (
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
                                                      src={`http://localhost:8000/storage/${inputsArtisan.image}`}
                                                      alt="" className='form-img'
                                                    />
                                                    <i className="fa-regular fa-circle-xmark c-tr-ic" onClick={(event) => handleDeleteArtisanImage(0, event)} style={{ position: 'absolute', top: '-10px', right: '-9px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}></i>
                                                  </div>
                                                )
                                              )}

                                              {!(inputsArtisan.image && inputsArtisan.image.length > 0) && !formData.currentImage && (
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
                                        <button type="reset" className="btn-r-upl" onClick={handleCloseModalEdit}>ANNULER</button>
                                        <button type="submit" className="btn-r-smt">
                                          {isLoading ? (
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                              <BounceLoader size={20} color={"#fff"} />
                                              <span style={{ marginLeft: '8px' }}>Chargement...</span>
                                            </div>
                                          ) : 'MODIFIER'}
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

          <div className='pagination-container'>
              <div id="app" className="container">
                <ul className="page">
                  <li className="page__numbers" onClick={handlePreviousPage}>&laquo;</li>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <li
                      key={index + 1}
                      className={`page__numbers ${currentPage === index + 1 ? 'actives' : ''}`}
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </li>
                  ))}
                  <li className="page__numbers" onClick={handleNextPage}>&raquo;</li>
                </ul>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}
