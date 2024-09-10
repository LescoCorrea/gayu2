import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchReservations } from './actions/reservationActions';
import { fetchFavorites } from '../../../../Pages/Artisans/actions/FavorisActions';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './dashuser.css'

export default function Dashboard() {

  const dispatch = useDispatch();
  const reservationList = useSelector(state => state.reservations.reservations);
  const favorisList = useSelector(state => state.favoris.favoris);
  const isLoadingReservations = useSelector(state => state.reservations.loading);
  const isLoadingFavoris = useSelector(state => state.favoris.loading);

  useEffect(() => {
    dispatch(fetchReservations());
    dispatch(fetchFavorites());
  }, [dispatch]);


  const pendingReservations = (reservationList || []).filter(reservation => reservation.status === 'En attente').length;
const validatedReservations = (reservationList || []).filter(reservation => reservation.status === 'Valider').length;
const rejectedReservations = (reservationList || []).filter(reservation => reservation.status === 'Rejeter').length;
  const goal = 1000;

  const calculatePercentage = (total) => {
    const percentage = (total / 1000) * 100; // Supposons que 1000 est votre objectif
    return !isNaN(percentage) ? percentage.toFixed(2) : 0;
  };

  const calculatePercentageReservation = (count) => {
    if (goal <= 0) return '0.00';
    const percentage = (count / goal) * 100;
    return percentage.toFixed(2);
  };
  

  return (
    <div>
      <div className="container mt-3">
        <div className='rs-us'>
          <h1 className='titel-sd'>Dashboard</h1>
          <h6 className='s-t-sd'>Votre plate-forme d&apos;annuaires utilisateur</h6>
        </div>
        <div className="row mt-3">
          <div className="col-md-4 c-user">
            <div className="card">
              <div className="card-body c-de">
                {isLoadingReservations ? (
                    <Skeleton height={69} />
                  ) : (
                    <>
                      <div className='c-fd'>
                        <div><span className='name-dah-user'>RESERVATIONS</span></div>
                        <div><i className="fa-solid fa-users fr-rt"></i></div>
                      </div>
                      <div className='c-fd mt-3'>
                        <div><span className='nomb-dah'>{reservationList ? reservationList.length : 0}</span></div>
                        <div><span className='pr-dah'>+ {calculatePercentage(reservationList ? reservationList.length : 0)}%{' '}<i className="fa-solid fa-arrow-up"></i></span></div>
                      </div>
                    </>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-4 c-user">
            <div className="card">
              <div className="card-body c-de">
                {isLoadingFavoris ? (
                    <Skeleton height={69} />
                  ) : (
                    <>
                      <div className='c-fd'>
                        <div><span className='name-dah-user'>FAVORIS</span></div>
                        <div><i className="fa-solid fa-users fr-rt"></i></div>
                      </div>
                      <div className='c-fd mt-3'>
                        <div><span className='nomb-dah'>{favorisList ? favorisList.length : 0}</span></div>
                        <div><span className='pr-dah'>+ {calculatePercentage(favorisList ? favorisList.length : 0)}%{' '}<i className="fa-solid fa-arrow-up"></i></span></div>
                      </div>
                    </>
                  )}
              </div>
            </div>
          </div>
          <div className="col-md-4 c-user">
            <div className="card ">
              <div className="card-body c-de">
              {isLoadingReservations ? (
                  <Skeleton height={69} />
                ) : (
                  <>
                    <div className='c-fd'>
                      <div><span className='name-dah-user'>RESERVATIONS EN COURS</span></div>
                      <div><i className="fa-solid fa-users-gear fr-rt"></i></div>
                    </div>
                    <div className='c-fd mt-3'>
                      <div><span className='nomb-dah'>{pendingReservations}</span></div>
                      <div><span className='pr-dah'>+ {calculatePercentageReservation(pendingReservations)}%<i className="fa-solid fa-arrow-up"></i></span></div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='row mt-3'>
          <div className="col-md-4 c-user">
            <div className="card">
              <div className="card-body c-de">
                {isLoadingReservations ? (
                    <Skeleton height={69} />
                  ) : (
                    <>
                      <div className='c-fd'>
                        <div><span className='name-dah-user'>RESERVATIONS EN COURS</span></div>
                        <div><i className="fa-solid fa-users-gear fr-rt"></i></div>
                      </div>
                      <div className='c-fd mt-3'>
                        <div><span className='nomb-dah'>{validatedReservations}</span></div>
                        <div><span className='pr-dah'>+ {calculatePercentageReservation(validatedReservations)}%<i className="fa-solid fa-arrow-up"></i></span></div>
                      </div>
                    </>
                  )}
              </div>
            </div>
          </div>
          <div className="col-md-4 c-user">
            <div className="card">
              <div className="card-body c-de">
                {isLoadingReservations ? (
                      <Skeleton height={69} />
                    ) : (
                      <>
                        <div className='c-fd'>
                          <div><span className='name-dah-user'>RESERVATIONS EN COURS</span></div>
                          <div><i className="fa-solid fa-users-gear fr-rt"></i></div>
                        </div>
                        <div className='c-fd mt-3'>
                          <div><span className='nomb-dah'>{rejectedReservations}</span></div>
                          <div><span className='pr-dah'>+ {calculatePercentageReservation(rejectedReservations)}%<i className="fa-solid fa-arrow-up"></i></span></div>
                        </div>
                      </>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
