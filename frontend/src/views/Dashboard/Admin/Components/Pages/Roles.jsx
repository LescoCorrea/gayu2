import { useEffect, useState } from 'react';
import './admin.css';
import './sweet.css';
/*import axios from 'axios';*/
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addRole, updateRole, deleteRole, fetchRoles } from './actions/roleActions';

export default function Roles() {
  const dispatch = useDispatch(); // Initialiser le hook useDispatch

  const [roleName, setRoleName] = useState('');
  const [editingRoleId, setEditingRoleId] = useState(null);
  const roles = useSelector(state => state.roles.roles); 
  const [loading, setLoading] = useState(false);

  const handleRoleNameChange = (e) => {
    setRoleName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingRoleId !== null) {
        await handleRoleUpdate(editingRoleId);
      } else {
        dispatch(addRole({ name: roleName }));
      }
    } catch (error) {
      console.error('Erreur lors de la requête API', error);
    } finally {
      setLoading(false);
      setRoleName('');
      setEditingRoleId(null);
    }
  };

  const handleEditRole = (roleId, roleName) => {
    setEditingRoleId(roleId);
    setRoleName(roleName);
  };

  const handleRoleUpdate = async (roleId) => {
    try {
      // Dispatch de l'action de mise à jour d'un rôle
      dispatch(updateRole({ id: roleId, name: roleName }));
    } catch (error) {
      console.error('Erreur lors de la requête API', error);
    } finally {
      // Réinitialiser le champ d'entrée après la mise à jour
      setRoleName('');
      setEditingRoleId(null);
    }
  };

  const handleRoleDetails = async (roleId) => {
    try {
      dispatch(fetchRoles(roleId));
    } catch (error) {
      console.error('Erreur lors de la requête API', error);
    }
  };

  const handleRoleDelete = async (roleId) => {
    try {
      dispatch(deleteRole(roleId));
    } catch (error) {
      console.error('Erreur lors de la requête API', error);
    }
  };

  useEffect(() => {
    dispatch(fetchRoles());
  }, []);

  return (
    <div>
      <div className="container mt-3">
        <ToastContainer />
        <div className=''>
          <h1 className='titel-sd'>Rôles</h1>
          <span className='s-t-sd'>Visualiser, modifier et supprimer un rôle</span>
        </div>
        <div className='row mt-3'>
          <div className="col-md-7">
            <table className="table t-cont-role">
              <thead>
                <tr className='tr-usr'>
                  <th>Nom du rôle</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles && roles.map((role, index) => (
                  <tr key={index} className='t-row-b'>
                    <td className='n-tb'>{role.name}</td>
                    <td>
                      <div>
                        <i className="fa-solid fa-eye i-eye" onClick={() => handleRoleDetails(role.id)}></i>
                        <i className="fa-solid fa-trash-can i-trs" onClick={() => handleRoleDelete(role.id)}></i>
                        <i className="fa-solid fa-pen-to-square i-pen" onClick={() => handleEditRole(role.id, role.name)}></i>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-md-5">
            <div>
              <form className='form-cont-role' onSubmit={handleSubmit}>
                <div><h6 className='n-f-role'>{editingRoleId !== null ? 'Modifier' : 'Ajouter'} un rôle</h6></div>
                <div className="mt-3">
                  <input type="text" className="form-control-role" value={roleName} onChange={handleRoleNameChange} placeholder='Saisir un rôle' />
                </div>
                {loading ? (
                  <button type="submit" className="btn-aj-role" disabled>
                    <span className="spinner"></span> {/* Spinner de chargement */}
                    <span className='nm-tbl'>Chargement...</span>
                  </button>
                ) : (
                  <button type="submit" className="btn-aj-role">
                    <i className={editingRoleId !== null ? 'fa-solid fa-check i-pls' : 'fa-solid fa-plus i-pls'}></i>
                    <span className='nm-tbl'>{editingRoleId !== null ? 'Modifier' : 'Ajouter'}</span>
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
