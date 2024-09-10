import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTemoignages, addTemoignage, deleteTemoignage } from './actions/temoignageActions';
import './admin.css'

export default function Temoignage() {
    const dispatch = useDispatch();
    const temoignages = useSelector(state => state.temoignages.temoignages);
    const [showModalTesti, setShowModalTesti] = useState(false);
    const [newTemoignage, setNewTemoignage] = useState({
        nom_complet: '',
        profession: '',
        temoignage: ''
    });

    const [currentPage, setCurrentPage] = useState(1);
    const temoignagesPerPage = 6;
    const totalPages = temoignages ? Math.ceil(temoignages.length / temoignagesPerPage) : 0;


    useEffect(() => {
        dispatch(fetchTemoignages());
    }, [dispatch]);

    const handleCloseModalTesti = () => {
        setShowModalTesti(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTemoignage({
            ...newTemoignage,
            [name]: value
        });
    };

    const handleAddTemoignage = (e) => {
        e.preventDefault();
        dispatch(addTemoignage(newTemoignage));
        setShowModalTesti(false);
        setNewTemoignage({ nom_complet: '', profession: '', temoignage: '' });
    };

    const handleDeleteTemoignage = (id) => {
        dispatch(deleteTemoignage(id));
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    const indexOfLastTemoignage = currentPage * temoignagesPerPage;
    const indexOfFirstTemoignage = indexOfLastTemoignage - temoignagesPerPage;
    const currentTemoignages = temoignages ? temoignages.slice(indexOfFirstTemoignage, indexOfLastTemoignage) : [];


  return (
    <div>
        <div className="container content-flou mt-3">
            <div className=''>
                <h1 className='titel-sd'>Témoignages</h1>
                <span className='s-t-sd'>Visualiser, modifier et supprimer un témoignage</span>
            </div>
            <div className='contenair-btn-aj-art'>
              <button className='btn-aj-artian' onClick={() => setShowModalTesti(true)}><i className="fa-solid fa-plus i-pls"></i><span className='nm-tbl'>Nouvel témoignage</span></button>
            </div>
            {showModalTesti && (
                          <div className='modal-overlay-modif'>
                            <div className="modal-modif">
                              <div className="modal-content-modif">
                                <div>
                                  <span className="close-atri" onClick={handleCloseModalTesti}>&times;</span>
                                  <h1 className="t-md-rl"><i className="fa-solid fa-arrow-left"></i>AJOUTER UN TEMOIGNAGE</h1>
                                </div>
                                    <form onSubmit={handleAddTemoignage}>
                                        <div className="modal-body">
                                            <div className='cnt-rls mt-3'>
                                                <div>
                                                    <label className='ti-fm-re'>Nom complet</label>
                                                    <input type="text" name='nom_complet' value={newTemoignage.nom_complet} onChange={handleInputChange} className='ipt-rls' required
                                                    />
                                                </div>
                                                <div>
                                                    <label className='ti-fm-re'>Profféssion</label>
                                                    <input type="text" name='profession' value={newTemoignage.profession} onChange={handleInputChange} className='ipt-rls' required/>
                                                </div>
                                            </div>
                                            <div className='descons mt-3'>
                                                <div className='C-rl'>
                                                    <label className='ti-fm-re'>Témoignage</label>
                                                    <textarea name="temoignage" value={newTemoignage.temoignage} onChange={handleInputChange} id="description"  cols="55" rows="10" className='tx-dc' required></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer-form">
                                          <button type="reset" className="btn-r-upl" onClick={handleCloseModalTesti}>ANNULER</button>
                                          <button type="submit" className="btn-r-smt">
                                            AJOUTER
                                          </button>
                                        </div>
                                  </form>
                              </div>
                            </div>
                          </div>
            )}
            <div className="row mt-3 mb-3">
                {currentTemoignages.map((temoignage) => (
                        <div className="col-md-4" key={temoignage.id}>
                            <div className="testimonials">
                                <div className='c-tr-ic-tes'>
                                    <i
                                        className="fa-regular fa-circle-xmark c-cr-tst"
                                        onClick={() => handleDeleteTemoignage(temoignage.id)}
                                    ></i>
                                </div>
                                <div className="testimonial-content">
                                    <div>
                                        
                                        <p className="testimonial-text">
                                            <i className="fa fa-quote-left quote-l-tst" aria-hidden="true"></i>
                                            <span className='txt-ts'>{temoignage.temoignage}</span>
                                            <i className="fa fa-quote-right quote-r-tst" aria-hidden="true"></i>
                                        </p>
                                    </div>
                                    <div className="testimonial-author">
                                        <div className="author-info">
                                            <h5 className="author-name">{temoignage.nom_complet}</h5>
                                            <p className="author-role">{temoignage.profession}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
            <div className='pagination-container mb-3'>
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
  )
}
