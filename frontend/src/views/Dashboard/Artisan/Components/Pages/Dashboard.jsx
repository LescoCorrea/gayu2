import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './artisan.css'
import { fetchRealisations } from '../Actions/realisationActions';
import { fetchArtisans } from '../../../Admin/Components/Pages/actions/artisanActions';
import { fetchReservationsArtisan } from '../../../User/Components/Pages/actions/reservationActions'; 
import { fetchAvis } from '../../../../Pages/Artisans/actions/AvisActions';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function Dashboard() {

  const dispatch = useDispatch();
  const realisationList = useSelector(state => state.realisations.realisations);
  const isLoadingRealisation = useSelector(state => state.realisations.loading);
  const artisanId = useSelector(state => state.auth.user.id);
  const artisanStatus = useSelector(state => {
    const artisan = state.artisans.artisans ? state.artisans.artisans.find(a => a.id === artisanId) : null;
    return artisan ? artisan.status : 'indisponible';
  });
  const isLoadingArtisans = useSelector(state => state.artisans.loading);
  const reservationListArtisan= useSelector(state =>  state.reservations.reservations);
  const isLoadingReservation = useSelector(state => state.reservations.loading);
  const avisList = useSelector(state => state.avis.avis);
  const isLoadingAvis = useSelector(state => state.avis.loading);

  useEffect(() => {
    dispatch(fetchArtisans());
    dispatch(fetchRealisations());
    dispatch(fetchReservationsArtisan());
    dispatch(fetchAvis());
  }, [dispatch]);

  const calculatePercentage = (total) => {
    const percentage = (total / 1000) * 100;
    return !isNaN(percentage) ? percentage.toFixed(2) : 0;
  };
  
  const countAvisForArtisan = (avisList, artisanId) => {
    if (!avisList || !artisanId) return 0;
    const filteredAvis = avisList.filter(avis => avis.artisan_id === artisanId);
    return filteredAvis.length;
  };

  const avisCount = avisList ? avisList.reduce((count, avis) => countAvisForArtisan(avisList, avis.artisan_id), 0) : 0;

  return (
    <div>
      <div className='container mt-3'>
        <div className=''>
          <h1 className='titel-sd-re'>Dashboard</h1>
          <span className='s-t-sd-re'>Votre plate-forme d&apos;annuaires artisans</span>
        </div>
        <div className="row mt-3">
          <div className="col-md-3">
            <div className="card-body c-de">
                {isLoadingRealisation ? (
                    <Skeleton height={69} />
                  ) : (
                    <>
                      <div className='c-fd'>
                        <div><span className='name-dah-user'>REALISATIONS</span></div>
                        <div><i className="fa-solid fa-users fr-rt"></i></div>
                      </div>
                      <div className='c-fd mt-3'>
                        <div><span className='nomb-dah'>{realisationList ? realisationList.length : 0}</span></div>
                        <div><span className='pr-dah'>+ {calculatePercentage(realisationList ? realisationList.length : 0)}%{' '}<i className="fa-solid fa-arrow-up"></i></span></div>
                      </div>
                    </>
                )}
            </div>
          </div>
          <div className="col-md-3">
            <div className="card-body c-de">
              {isLoadingReservation ? (
                <Skeleton height={69} />
              ) : (
                <>
                  <div className='c-fd'>
                    <div><span className='name-dah'>RESERVATIONS</span></div>
                    <div><i className="fa-solid fa-table-list fr-rt"></i></div>
                  </div>
                  <div className='c-fd mt-3'>
                    <div><span className='nomb-dah'>{reservationListArtisan ? reservationListArtisan.length : 0}</span></div>
                    <div><span className='pr-dah'>+ {calculatePercentage(reservationListArtisan ? reservationListArtisan.length : 0)}%{' '} <i className="fa-solid fa-arrow-up"></i></span></div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="col-md-3">
            <div className="card-body c-de">
              {isLoadingArtisans ? (
                <Skeleton height={69} />
              ) : (
                <>
                  <div className='c-fd'>
                    <div><span className='name-dah'>DISPONIBILITE</span></div>
                    <div><i className="fa fa-calendar-check-o fr-rt"></i></div>
                  </div>
                  <div className='c-fd mt-3'>
                    <div><span className='nomb-dah'>{artisanStatus === 'disponible' ? 'Oui' : 'Non'}</span></div>
                    <div><span className='pr-dah'>STATUS</span></div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="col-md-3">
            <div className="card-body c-de">
              {isLoadingAvis ? (
                <Skeleton height={69} />
              ) : (
                <>
                  <div className='c-fd'>
                    <div><span className='name-dah'>AVIS</span></div>
                    <div><i className="fa fa-commenting fr-rt"></i></div>
                  </div>
                  <div className='c-fd mt-3'>
                    <div><span className='nomb-dah'>{avisCount}</span></div>
                    <div><span className='pr-dah'>+ {calculatePercentage(avisCount)}% <i className="fa-solid fa-arrow-up"></i></span></div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
