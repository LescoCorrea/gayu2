import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { fetchAvis } from '../../../../Pages/Artisans/actions/AvisActions';

export default function Avis() {

  const { id } = useParams();
  const dispatch = useDispatch();
  const avis = useSelector(state => state.avis.avis);

  useEffect(() => {
    dispatch(fetchAvis(id));
  }, [dispatch, id]);

  const totalAvis = (avis || []).length;

  const calculateAverageRating = (avis) => {
    if (!avis.length) return 0;
    const totalRating = avis.reduce((acc, item) => acc + (item.note || 0), 0);
    return totalRating / avis.length;
  };

  const averageRating = calculateAverageRating(avis);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const totalStars = 5;
    let stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<li key={`star-${i}`} className="list-inline-item"><i className="fa fa-star"></i></li>);
    }
    
    if (hasHalfStar) {
      stars.push(<li key={`star-half`} className="list-inline-item"><i className="fa fa-star-half-o"></i></li>);
    }
    
    while (stars.length < totalStars) {
      stars.push(<li key={`star-empty-${stars.length}`} className="list-inline-item"><i className="fa fa-star-o"></i></li>);
    }
    
    return stars;
  };

  return (
    <div>
      <div className="container mt-3">
        <div className=''>
          <h1 className='titel-sd-re'>Avis {totalAvis}</h1>
          <span className='s-t-sd-re'>Visualisez ce que disent les utilisateurs</span>
        </div>
        <div className="row mt-5">
          {avis && avis.map(avisItem => (
            <div className="col-md-4" key={avisItem.id}>
              <div className="avis-cont-avis">
                  <p className="description">
                    <i className="fa fa-quote-left av-left" aria-hidden="true"></i>
                    <span className='cnt-avs'>
                      {avisItem.avis}
                    </span>
                  </p>
                <div className="testimonial-profile">
                <div className="media">
									<div className="media-body">
										<div className="overview">
											<div className="name"><b>{avisItem.user.name}</b></div>
											<div className="star-rating">
												<ul className="list-inline">
                          {renderStars(averageRating)}
												</ul>
											</div>
										</div>										
									</div>
								</div>
                </div>
              </div>
            </div>
          ))}  
        </div>
      </div>
    </div>
  )
}
