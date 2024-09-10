import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from './actions/userActions'
import './admin.css'


export default function User() {

  const dispatch = useDispatch();
  const users = useSelector(state => state.users.users);
  const auth = useSelector(state => state.auth);

  
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const getRoleName = (roleAs) => {
    const roleNumber = parseInt(roleAs);
    return roleNumber === 1 ? 'admin' : 'user';
  };

  const isUserConnected = (userId) => {
    return auth.user && auth.user.id === userId;
  };

  return (
    <div>
      <div className="container mt-3">
        <div className=''>
          <h1 className='titel-sd'>Utilisateurs</h1>
          <span className='s-t-sd'>Visualiser, modifier et supprimer un utilisateur</span>
        </div>
        <div className='mt-3'>
          <table className="table t-cont-role">
            <thead>
              <tr className='tr-usr'>
                <th scope="col">Nom de l&apos;utilisateur</th>
                <th scope="col">Email</th>
                <th scope="col">Rôle</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users && users.map((user, index) => (
                <tr key={index} className='t-row-b'>
                  <td className='n-tb'>{user.name}</td>
                  <td className='n-tb'>{user.email}</td>
                  <td className='n-tb'>{getRoleName(user.role_as)}</td>
                  <td>
                    <div className={isUserConnected(user.id) ? 'mode-actif' : 'mode-inactif'}>
                      <i className={isUserConnected(user.id) ? 'fa-solid fa-circle c-fs' : 'fa-solid fa-circle c-fs-in'}></i>
                      <span className={isUserConnected(user.id) ? 'act-mo' : 'act-mod-in'}>
                        {isUserConnected(user.id) ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <i className="fa-solid fa-eye i-eye"></i>
                      <i className="fa-solid fa-trash-can i-trs"></i>
                      <i className="fa-solid fa-pen-to-square i-pen"></i>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
