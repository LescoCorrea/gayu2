import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchReservationsArtisan } from '../../../User/Components/Pages/actions/reservationActions';
import { updateReservationStatus } from '../Actions/reservationsActions'
// Définissez la fonction truncateMessage
/*function truncateMessage(message, maxLength = 50) {
  if (message.length > maxLength) {
    return message.substring(0, maxLength) + '...';
  }
  return message;
}*/

export default function Travaux() {

  const dispatch = useDispatch();
  const reservationsArtisan = useSelector(state => state.reservations.reservations || []);
  const [showDropdown, setShowDropdown] = useState(false);
  const [setSelectedOptions] = useState([]);
  

  useEffect(() => {
    dispatch(fetchReservationsArtisan());
  }, [dispatch]);

  useEffect(() => { // Ajoutez cette console pour afficher les réservations de l'artisan
  }, [reservationsArtisan]);


  const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
  };

  const handleOptionChange = (e) => {
        const { value, checked } = e.target;
        setSelectedOptions(prevState =>
            checked ? [...prevState, value] : prevState.filter(option => option !== value)
        );
  };

  const handleUpdate = async (id, status) => {
    try {
      // Mettez à jour la réservation
      await dispatch(updateReservationStatus(id, status));
      // Récupérez les réservations de l'artisan après la mise à jour
      dispatch(fetchReservationsArtisan());
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la réservation :', error);
    }
  };

  const totalReservations = reservationsArtisan.length;

  return (
    <div>
      <div className="container mt-3">
        <div className=''>
          <h1 className='titel-sd-re'>Réservations {totalReservations}</h1>
          <span className='s-t-sd-re'>Visualisez, valider ou rejeter une réservation</span>
        </div>

         <div className='df-filtr mt-3'>
             <div className='c-fil-dte'>
                <div><h6 className='pr-f'>Filtrer par :</h6></div>
                <div className='c-dt-r'>
                <div>
                    <form className=''>
                    <input className='f-r-dte' type="date" name="date" />
                    </form>
                </div>
                <div className='c-ch'>
                    <div className="dropdown">
                        <button className="dropdown-button" onClick={toggleDropdown}>
                            Status <span>&#9660;</span>
                        </button>
                        <div className={`dropdown-content ${showDropdown ? 'show' : ''}`}>
                            <label>
                                <input type="checkbox" value="option2" onChange={handleOptionChange} className='chekbox-status' />
                                En attente
                            </label>
                            <label>
                                <input type="checkbox" value="option3" onChange={handleOptionChange} />
                                Validée
                            </label>
                            <label>
                                <input type="checkbox" value="option3" onChange={handleOptionChange} />
                                Rejeter
                            </label>
                        </div>
                    </div>
                </div>
             </div>
            </div>
            </div>
        
            <div className='s-frv'>
                <form className="">
                <div className="d-inp-ad der-pr">
                    <i className="fa-solid fa-magnifying-glass sr-f-src"></i>
                    <input className="r-ds r-ds-s" type="text" placeholder="Recherchez une favoris" />
                </div>
                </form>
          </div>

        <div className=' mt-3'>
          <table className="table">
            <thead className='na-table-res'>
              <tr>
                <th scope="col">Nom du client</th>
                <th scope="col">Date / Heure</th>
                <th scope="col">Message</th>
                <th scope="col">Image</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
              <tbody>
                {reservationsArtisan.map(reservation => (
                  <tr key={reservation.id} className='ct-nm-res'>
                    <td><span className='tx-rsvt'>{reservation.user.name}</span></td>
                    <td><span className='tx-rsvt'>{reservation.date} {reservation.heure}</span></td>
                    <td><span className='tx-rsvt'>{reservation.message}</span></td>
                    <td>
                      <button type="button" className="clic-img" data-bs-toggle="modal" data-bs-target={`#exampleModal-${reservation.id}`}>
                          clic pour voir l&apos;image
                        </button>
                        <div className="modal fade" id={`exampleModal-${reservation.id}`} tabIndex="-1" aria-labelledby={`exampleModalLabel-${reservation.id}`} aria-hidden="true">
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-header-form">
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>
                              <div className='bord-bot'></div>
                              <div className="modal-body">
                                <h6 className='titre-img-rs'>Image Réservation</h6>
                                <div className='click-img'>
                                  <img src={`http://127.0.0.1:8000/storage/${reservation.image}`} alt="Réservation" className='cnt-rs-img' />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                    </td>
                    <td>
                      <small className={reservation.status === 'En attente' ? 'en-cours' : reservation.status === 'Valider' ? 'disponible' : 'occupée'}>
                        {reservation.status}
                      </small>
                    </td>
                    <td>
                      <div className='cont-icons'>
                        <i className="fa-regular fa-circle-check icn-tsh-vl" onClick={() => handleUpdate(reservation.id, 'Valider')}></i>
                        <i className="fa-regular fa-circle-xmark icn-tsh-rt" onClick={() => handleUpdate(reservation.id, 'Rejeter')}></i>
                        
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}
