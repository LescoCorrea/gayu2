import { useEffect, useState } from 'react';
import './admin.css';
import './sweet.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { addRegion, updateRegion, deleteRegion, fetchRegions } from './actions/regionActions';

export default function Regions() {
  const dispatch = useDispatch(); // Initialiser le hook useDispatch ici

  const [regionName, setRegionName] = useState('');
  const [editingRegionId, setEditingRegionId] = useState(null);
  const regions = useSelector(state => state.regions.regions);
  const [loading, setLoading] = useState(false);

  const handleRegionNameChange = (e) => {
    setRegionName(e.target.value);
  };

  const handleRegionSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingRegionId !== null) {
        await handleRegionUpdate(editingRegionId);
      } else {
        dispatch(addRegion({ name: regionName }));
      }
    } catch (error) {
      console.error('Erreur lors de la requête API', error);
    } finally {
      setLoading(false);
      setRegionName('');
      //editingRegionId(null);
    }
  };

  const handleEditRole = (regionId, regionName) => {
    setEditingRegionId(regionId);
    setRegionName(regionName);
  };

  const handleRegionUpdate = async (regionId) => {
    try {
      // Dispatch de l'action de mise à jour d'un rôle
      dispatch(updateRegion({ id: regionId, name: regionName }));
    } catch (error) {
      console.error('Erreur lors de la requête API', error);
    } finally {
      // Réinitialiser le champ d'entrée après la mise à jour
      setRegionName('');
      setEditingRegionId(null);
    }
  };


  const handleRegionDetails = async (regionId) => {
    try {
      // Dispatch de l'action de récupération des détails d'un rôle
      dispatch(fetchRegions(regionId));
    } catch (error) {
      console.error('Erreur lors de la requête API', error);
    }
  };

  const handleRoleDelete = async (regionId) => {
    try {
      // Dispatch de l'action de suppression d'un rôle
      dispatch(deleteRegion(regionId));
    } catch (error) {
      console.error('Erreur lors de la requête API', error);
    }
  };

  useEffect(() => {
    dispatch(fetchRegions());
  }, []);

  return (
    <div>
      <div className="container mt-3">
        <ToastContainer />
        <div className=''>
          <h1 className='titel-sd'>Régions</h1>
          <span className='s-t-sd'>Visualiser, modifier et supprimer un région</span>
        </div>
        <div className='row mt-3'>
          <div className="col-md-7">
            <table className="table t-cont-role">
              <thead>
                <tr className='tr-usr'>
                  <th>Nom du région</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {regions && regions.map((region, index) => (
                  <tr key={index} className='t-row-b'>
                    <td className='n-tb'>{region.name}</td>
                    <td>
                      <div>
                        <i className="fa-solid fa-eye i-eye" onClick={() => handleRegionDetails(region.id)}></i>
                        <i className="fa-solid fa-trash-can i-trs" onClick={() => handleRoleDelete(region.id)}></i>
                        <i className="fa-solid fa-pen-to-square i-pen" onClick={() => handleEditRole(region.id, region.name)}></i>
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
                <div><h6 className='n-f-role'>{editingRegionId !== null ? 'Modifier' : 'Ajouter'} un région</h6></div>
                <div className="mt-3">
                  <input type="text" className="form-control-role" value={regionName} onChange={handleRegionNameChange} placeholder='Saisir un région' />
                </div>
                {loading ? (
                  <button type="submit" className="btn-aj-role" disabled>
                    <span className="spinner"></span> {/* Spinner de chargement */}
                    <span className='nm-tbl'>Chargement...</span>
                  </button>
                ) : (
                  <button type="submit" className="btn-aj-role">
                    <i className={editingRegionId !== null ? 'fa-solid fa-check i-pls' : 'fa-solid fa-plus i-pls'}></i>
                    <span className='nm-tbl'>{editingRegionId !== null ? 'Modifier' : 'Ajouter'}</span>
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
