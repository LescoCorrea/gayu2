import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './admin.css';
import { fetchRoles } from './actions/roleActions';
import { fetchUsers } from './actions/userActions';
import { fetchMetiers } from './actions/metierActions';
import { fetchRegions } from './actions/regionActions';
import { fetchArtisans } from './actions/artisanActions';

export default function Dashboard() {

  const dispatch = useDispatch();
  const userList = useSelector(state => state.users.users);
  const roleList = useSelector(state => state.roles.roles);
  const metierList = useSelector(state => state.metiers.metiers);
  const regionList = useSelector(state => state.regions.regions);
  const artisanList = useSelector(state => state.artisans.artisans);
  const temoignageList = useSelector(state => state.artisans.artisans);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchArtisans());
    dispatch(fetchRoles());
    dispatch(fetchMetiers());
    dispatch(fetchRegions());
  }, []);

  const calculatePercentage = (total) => {
    const percentage = (total / 1000) * 100; // Supposons que 1000 est votre objectif
    return !isNaN(percentage) ? percentage.toFixed(2) : 0;
  };

  return (
    <div>
      <div className="container mt-3">
        <div className=''>
          <h1 className='titel-sd'>Dashboard</h1>
          <span className='s-t-sd'>Votre plate-forme d&apos;annuaires administrateur</span>
        </div>
        <div className="row mt-3">
          <div className="col-md-4">
            <div className="card-dash">
              <div className="card-body c-de">
                <div className='c-fd'>
                  <div><span className='name-dah'>UTILISATEURS</span></div>
                  <div><i className="fa-solid fa-users fr-rt"></i></div>
                </div>
                <div className='c-fd mt-3'>
                  <div><span className='nomb-dah'>{userList ? userList.length : 0}</span></div> {/* Affichage du nombre d'utilisateurs */}
                  <div><span className='pr-dah'>+ {calculatePercentage(userList ? userList.length : 0)}%{' '}  <i className="fa-solid fa-arrow-up"></i></span></div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card-dash">
              <div className="card-body c-de">
                <div className='c-fd'>
                  <div><span className='name-dah'>ARTISANS</span></div>
                  <div><i className="fa-solid fa-users fr-rt"></i></div>
                </div>
                <div className='c-fd mt-3'>
                  <div><span className='nomb-dah'>{artisanList ? artisanList.length : 0}</span></div> {/* Affichage du nombre d'artisans */}
                  <div><span className='pr-dah'>+ {calculatePercentage(artisanList ? artisanList.length : 0)}%{' '} <i className="fa-solid fa-arrow-up"></i></span></div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card-dash">
              <div className="card-body c-de">
                <div className='c-fd'>
                  <div><span className='name-dah'>ROLES</span></div>
                  <div><i className="fa-solid fa-users-gear fr-rt"></i></div>
                </div>
                <div className='c-fd mt-3'>
                  <div><span className='nomb-dah'>{roleList ? roleList.length : 0}</span></div> {/* Affichage du nombre de rôles */}
                  <div><span className='pr-dah'>+ {calculatePercentage(roleList ? roleList.length : 0)}%{' '} <i className="fa-solid fa-arrow-up"></i></span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='row mt-3'>
          <div className="col-md-4">
            <div className="card-dash">
              <div className="card-body c-de">
                <div className='c-fd'>
                  <div><span className='name-dah'>METIERS</span></div>
                  <div><i className="fa-solid fa-hammer fr-rt"></i></div>
                </div>
                <div className='c-fd mt-3'>
                  <div><span className='nomb-dah'>{metierList ? metierList.length : 0}</span></div> {/* Affichage du nombre de métiers */}
                  <div><span className='pr-dah'>+ {calculatePercentage(metierList ? metierList.length : 0)}%{' '}<i className="fa-solid fa-arrow-up"></i></span></div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card-dash">
              <div className="card-body c-de">
                <div className='c-fd'>
                  <div><span className='name-dah'>REGIONS</span></div>
                  <div><i className="fa-solid fa-building-user fr-rt"></i></div>
                </div>
                <div className='c-fd mt-3'>
                  <div><span className='nomb-dah'>{regionList ? regionList.length : 0}</span></div>
                  <div><span className='pr-dah'>+ {calculatePercentage(regionList ? regionList.length : 0)}%{' '}<i className="fa-solid fa-arrow-up"></i></span></div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card-dash">
              <div className="card-body c-de">
                <div className='c-fd'>
                  <div><span className='name-dah'>TEMOIGNAGES</span></div>
                  <div><i className="fa-solid fa-comment fr-rt"></i></div>
                </div>
                <div className='c-fd mt-3'>
                  <div><span className='nomb-dah'>{temoignageList ? temoignageList.length : 0}</span></div>
                  <div><span className='pr-dah'>+ {calculatePercentage(temoignageList ? temoignageList.length : 0)}%{' '}<i className="fa-solid fa-arrow-up"></i></span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
