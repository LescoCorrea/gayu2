import { useEffect, useState } from 'react';
import './admin.css';
import './sweet.css';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addMetier, updateMetier, deleteMetier, fetchMetiers } from './actions/metierActions';

export default function Metiers() {
  const dispatch = useDispatch(); // Initialiser le hook useDispatch

  const [metierName, setMetierName] = useState('');
  const [editingMetierId, setEditingMetierId] = useState(null);
  const metiers = useSelector(state => state.metiers.metiers);
  const [loading, setLoading] = useState(false);

  const handleMetierNameChange = (e) => {
    setMetierName(e.target.value);
  };

  const handleRegionSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingMetierId !== null) {
        await handleMetierUpdate(editingMetierId);
      } else {
        dispatch(addMetier({ name: metierName }));
      }
    } catch (error) {
      console.error('Erreur lors de la requête API', error);
    } finally {
      setLoading(false);
      setMetierName('');
      //editingRegionId(null);
    }
  };

  const handleEditMetier = (metierId, metierName) => {
    setEditingMetierId(metierId);
    setMetierName(metierName);
  };

  const handleMetierUpdate = async (metierId) => {
    try {
      dispatch(updateMetier({ id: metierId, name: metierName }));
    } catch (error) {
      console.error('Erreur lors de la requête API', error);
    } finally {
      setMetierName('');
      setEditingMetierId(null);
    }
  };


  const handleMetierDetails = async (metierId) => {
    try {
      dispatch(fetchMetiers(metierId));
    } catch (error) {
      console.error('Erreur lors de la requête API', error);
    }
  };

  const handleMetierDelete = async (regionId) => {
    try {
      dispatch(deleteMetier(regionId));
    } catch (error) {
      console.error('Erreur lors de la requête API', error);
    }
  };

  useEffect(() => {
    dispatch(fetchMetiers());
  }, []);

  return (
    <div>
      <div className="container mt-3">
        <ToastContainer />
        <div className=''>
          <h1 className='titel-sd'>Métiers</h1>
          <span className='s-t-sd'>Visualiser, modifier et supprimer un métier</span>
        </div>
        <div className='row mt-3'>
          <div className="col-md-7">
            <table className="table t-cont-role">
              <thead>
                <tr className='tr-usr'>
                  <th>Nom du métier</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {metiers && metiers.map((metier, index) => (
                  <tr key={index} className='t-row-b'>
                    <td className='n-tb'>{metier.name}</td>
                    <td>
                      <div>
                        <i className="fa-solid fa-eye i-eye" onClick={() => handleMetierDetails(metier.id)}></i>
                        <i className="fa-solid fa-trash-can i-trs" onClick={() => handleMetierDelete(metier.id)}></i>
                        <i className="fa-solid fa-pen-to-square i-pen" onClick={() => handleEditMetier(metier.id, metier.name)}></i>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-md-5">
            <div>
              <form className='form-cont-role' onSubmit={handleRegionSubmit}>
                <div><h6 className='n-f-role'>{editingMetierId !== null ? 'Modifier' : 'Ajouter'} un métier</h6></div>
                <div className="mt-3">
                  <input type="text" className="form-control-role" value={metierName} onChange={handleMetierNameChange} placeholder='Saisir un métier' />
                </div>
                {loading ? (
                  <button type="submit" className="btn-aj-role" disabled>
                    <span className="spinner"></span> {/* Spinner de chargement */}
                    <span className='nm-tbl'>Chargement...</span>
                  </button>
                ) : (
                  <button type="submit" className="btn-aj-role">
                    <i className={editingMetierId !== null ? 'fa-solid fa-check i-pls' : 'fa-solid fa-plus i-pls'}></i>
                    <span className='nm-tbl'>{editingMetierId !== null ? 'Modifier' : 'Ajouter'}</span>
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
