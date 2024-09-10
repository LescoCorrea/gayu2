import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { updateArtisanStatus } from '../../../Artisan/Components/Actions/artisanActions';
import { fetchArtisans } from '../../../Admin/Components/Pages/actions/artisanActions';

export default function Planning() {
    const dispatch = useDispatch();
    const [selectedStatus, setSelectedStatus] = useState('');
    const handleStatusChange = async (newStatus) => {
        try {
            setSelectedStatus(newStatus);
            dispatch(updateArtisanStatus(newStatus));
            dispatch(fetchArtisans());
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut :', error);
        }
    };

    return (
        <div>
            <div className="container mt-3">
                <div className=''>
                    <h1 className='titel-sd-re'>Planning</h1>
                    <span className='s-t-sd-re'>Disponibilité de l&apos;artisan</span>
                </div>

                <div className='mt-3'>
                    <h3>Emplois recommandés</h3>
                    <div className='plan-cont'>
                      <div>
                        <h6>
                          N&apos;hésitez pas à planifier vos demandes de service en tenant compte de ces horaires
                            de disponibilité de l&apos;artisan.
                        </h6>
                      </div>
                      <div className='btn-plan'>
                        <div className='form-check'>
                          <button className={`btn-oui ${selectedStatus === 'disponible' ? 'active' : ''}`} 
                            onClick={() => handleStatusChange('disponible')}>OUI</button>
                        </div>
                        <div className="form-check">
                          <button className={`btn-non ${selectedStatus === 'occupé' ? 'active' : ''}`} 
                          onClick={() => handleStatusChange('occupé')}>NON</button>
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
