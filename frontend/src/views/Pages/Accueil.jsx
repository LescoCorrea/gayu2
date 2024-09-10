
import { useEffect } from 'react';
import './Accueil.css';
import { useDispatch, useSelector } from 'react-redux';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Footer from './Components/Footer';
import Topnav from './Components/Topnav';
import Contacts from './Components/Contacts';
import { fetchArtisans } from '../Dashboard/Admin/Components/Pages/actions/artisanActions';
import { fetchMetiers } from '../Dashboard/Admin/Components/Pages/actions/metierActions';
import { fetchTemoignages } from '../Dashboard/Admin/Components/Pages/actions/temoignageActions';
import { Link } from 'react-router-dom';

export default function Accueil() {
    const dispatch = useDispatch();
    const artisans = useSelector((state) => state.artisans.artisans);
    const temoignages = useSelector(state => state.temoignages.temoignages);

    useEffect(() => {
        dispatch(fetchArtisans());
        dispatch(fetchMetiers());
        dispatch(fetchTemoignages());
      }, [dispatch]);
    
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
    };

    const settingTesti= {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
    };

  return (
    <div>
            <header className='header'>
                <div className='head-nav'>
                    <Topnav />
                </div>
                <div className="container mt-5">
                    <div className="">
                        <div className="ban-sect">
                            <h1 className="titl-sect">Le futur digital est arrivé !</h1>

                            <h6 className="sous-sect">Ici, nous réunissons artisans talentueux<br /> et visiteurs passionnés.</h6>

                            <div className="container-par">
                                <p className="par-sect">Lorem ipsum dolor sit amet consectetur. Egestas sit enim egestas malesuada nulla.
                                    Elementum mi
                                    risus nunc non in faucibus sit porttitor nec. Id amet sem donec massa scelerisque mauris tristique
                                    posuere.
                                    Sem integer risus scelerisque sit nibh. Risus quis pretium gravida dapibus faucibus at. Ultricies et
                                    habitant integer risus suspendisse suscipit eu sit pulvinar. Varius duis nisl sed sapien adipiscing a
                                    etiam
                                    mauris.
                                </p>
                            </div>
                            <div className="btn-links mt-3">
                                {/*<div className="links2">
                                    <a href="/#">Commencer</a>
                                </div>*/}
                            </div>
                        </div>
                        <div className='icn-mil' onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}>
                            <div className='icn-chvr'>
                                <i className="fa-solid fa-chevron-down flch"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <section id="services" className='container-services mt-5'>
                <div className='container-fluid'>
                    <div className="container">
                        <h1 className='title-serv'>Gayu en tant que service</h1>
                        <div className="row">
                            <div className="col-md-5 mt-5 sect-service">
                                <p className='par-serv'>
                                    Lorem ipsum dolor sit amet consectetur. Id integer sem egestas urna lectus platea orci ac. Praesent ut nisl luctus eu nunc augue etiam pulvinar vitae. Morbi ultricies risus viverra sit facilisi ridiculus eget pulvinar. Quam justo in nisl enim nec fames dui. Lorem urna cursus in phasellus. Euismod nulla iaculis sapien viverra. Sagittis nisl eu nulla sit laoreet est. Netus
                                    nec at vitae diam quam elit sit lacus elementum. Eget sed nunc maecenas nisl proin. A.
                                </p>
                                <div className="btn-services">
                                    <div className="btn-links d-flex">
                                        <div className='link-servs'>
                                            <a href="/propos" className='propos'>A propos nous</a>
                                        </div>
                                        <div className='reg-links'>
                                            <span className='serv-video'>Regarder la vidéo</span>
                                            <i className="fa fa-play" aria-hidden="true"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-7 mt-5">
                                <div className='bg-video'>
                                    <div className='voir-video-content'>
                                        <img className="voir-video" src="images/Play.png" alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container solution-container ">
                    <h1 className='title-serv'>Solutions</h1>
                    <div className="row">
                        <div className="col-md-6 mt-5 sect-service">
                            <h3 className='sol-title'>Profils d&apos;artisans détaillés</h3>
                            <p className='par-serv'>
                                Notre plateforme peut fournir des profils détaillés pour chaque artisan, comprenant
                                des informations telles que leur expérience, leurs compétences, leurs réalisations
                                précédentes, leur philosophie artistique et leurs coordonnées. Cela permet aux visiteurs
                                d&apos;avoir une vision claire de chaque
                                artisan et de trouver celui qui correspond le mieux à leurs besoins et à leurs attentes.
                            </p>
                            <div className='list-sol d-flex'>
                                <i className="fa fa-circle f-circle" aria-hidden="true"></i>
                                <p className='par-servs'>
                                    Lorem ipsum dolor sit amet consectetur. Lorem nam amet iaculis in dignissim eget sed diam pretium.
                                    Consequat vel sem enim aenean mauris nulla sit. Habitant nec turpis duis.
                                </p>
                            </div>
                            <div className='list-sol d-flex'>
                                <i className="fa fa-circle f-circle" aria-hidden="true"></i>
                                <p className='par-servs'>
                                    Lorem ipsum dolor sit amet consectetur. Pharetra sagittis neque aliquet aliquam cursus phasellus quis eu. Volutpat mauris egestas sit nisl. Consectetur
                                    est dignissim sit dui iaculis. Suscipit a sit porttitor iaculis elit sed elementum.
                                </p>
                            </div>
                            <div className='list-sol d-flex'>
                                <i className="fa fa-circle f-circle" aria-hidden="true"></i>
                                <p className='par-servs'>
                                    Lorem ipsum dolor sit amet consectetur. Id interdum convallis condimentum sit at.
                                    Augue in proin elementum quam. Enim.
                                </p>
                            </div>

                        </div>
                        <div className="col-md-6 mt-5">
                            <div className="sol-profil">
                                <div className='profile'>
                                    <img src="images/profile.png" alt="" />
                                </div>
                                <div className="profile mt-5">
                                    <div className='link-servs'>
                                        <a href="/artisan" className='propos'>Voir nos artisans</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mt-5">

                    <div className="row">
                        <div className="col-md-6 mt-5 sect-service">
                            <h3 className='sol-title'>Messagerie et système de contact</h3>
                            <p className='par-serv'>
                                Notre plateforme peut fournir des profils détaillés pour chaque artisan, comprenant
                                des informations telles que leur expérience, leurs compétences, leurs réalisations
                                précédentes, leur philosophie artistique et leurs coordonnées. Cela permet aux visiteurs
                                d&apos;avoir une vision claire de chaque
                                artisan et de trouver celui qui correspond le mieux à leurs besoins et à leurs attentes.
                            </p>
                            <div className='list-sol d-flex'>
                                <i className="fa fa-circle f-circle" aria-hidden="true"></i>
                                <p className='par-servs'>
                                    Lorem ipsum dolor sit amet consectetur. Lorem nam amet iaculis in dignissim eget sed diam pretium.
                                    Consequat vel sem enim aenean mauris nulla sit. Habitant nec turpis duis.
                                </p>
                            </div>
                            <div className='list-sol d-flex'>
                                <i className="fa fa-circle f-circle" aria-hidden="true"></i>
                                <p className='par-servs'>
                                    Lorem ipsum dolor sit amet consectetur. Pharetra sagittis neque aliquet aliquam cursus phasellus quis eu. Volutpat mauris egestas sit nisl. Consectetur
                                    est dignissim sit dui iaculis. Suscipit a sit porttitor iaculis elit sed elementum.
                                </p>
                            </div>
                            <div className='list-sol d-flex'>
                                <i className="fa fa-circle f-circle" aria-hidden="true"></i>
                                <p className='par-servs'>
                                    Lorem ipsum dolor sit amet consectetur. Id interdum convallis condimentum sit at.
                                    Augue in proin elementum quam. Enim.
                                </p>
                            </div>
                            <div className='list-sol d-flex'>
                                <i className="fa fa-circle f-circle" aria-hidden="true"></i>
                                <p className='par-servs'>
                                    Lorem ipsum dolor sit amet consectetur. Pharetra sagittis neque aliquet aliquam cursus phasellus quis eu. Volutpat mauris egestas sit nisl.
                                    Consectetur est dignissim sit dui iaculis. Suscipit a sit porttitor iaculis elit sed elementum.
                                </p>
                            </div>

                        </div>
                        <div className="col-md-6 mt-5">
                            <div className="sol-profil">
                                <div className='profile'>
                                    <img src="images/contact.png" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mt-5">

                    <div className="row">
                        <div className="col-md-6 mt-5 sect-service">
                            <h3 className='sol-title'>Évaluation et commentaires</h3>
                            <p className='par-serv'>
                                Notre plateforme peut fournir des profils détaillés pour chaque artisan, comprenant
                                des informations telles que leur expérience, leurs compétences, leurs réalisations
                                précédentes, leur philosophie artistique et leurs coordonnées. Cela permet aux visiteurs
                                d&apos;avoir une vision claire de chaque
                                artisan et de trouver celui qui correspond le mieux à leurs besoins et à leurs attentes.
                            </p>
                            <div className='list-sol d-flex'>
                                <i className="fa fa-circle f-circle" aria-hidden="true"></i>
                                <p className='par-servs'>
                                    Lorem ipsum dolor sit amet consectetur. Lorem nam amet iaculis in dignissim eget sed diam pretium.
                                    Consequat vel sem enim aenean mauris nulla sit. Habitant nec turpis duis.
                                </p>
                            </div>
                            <div className='list-sol d-flex'>
                                <i className="fa fa-circle f-circle" aria-hidden="true"></i>
                                <p className='par-servs'>
                                    Lorem ipsum dolor sit amet consectetur. Pharetra sagittis neque aliquet aliquam cursus phasellus quis eu. Volutpat mauris egestas sit nisl. Consectetur
                                    est dignissim sit dui iaculis. Suscipit a sit porttitor iaculis elit sed elementum.
                                </p>
                            </div>
                            <div className='list-sol d-flex'>
                                <i className="fa fa-circle f-circle" aria-hidden="true"></i>
                                <p className='par-servs'>
                                    Lorem ipsum dolor sit amet consectetur. Id interdum convallis condimentum sit at.
                                    Augue in proin elementum quam. Enim.
                                </p>
                            </div>


                        </div>
                        <div className="col-md-6 mt-5">
                            <div className="sol-profil">
                                <div className='profile'>
                                    <img src="images/review.png" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='container-services mt-5'>
                <div className="container">
                    <h1 className='title-serv'>ARTISANS</h1>
                    <div className="row mt-5">
                    { artisans && (
                        <Slider {...settings}>
                            {artisans.map((artisan) => (
                                <div className="col-md-4" key={artisan.id}>
                                    <div className="card-home">
                                        <div className='hom-art'>
                                            <img src={`http://localhost:8000/storage/${artisan.image}`} className="card-img-top" alt={artisan.nom} />
                                        </div>
                                        <div className="card-body">
                                            <div className='hom-art mt-3'>
                                                <h5 className="card-title">{artisan.prenom} {artisan.nom}</h5>
                                            </div>
                                            <div className='hom-art'>
                                                {artisan.metiers.map((metier, index) => (
                                                    <h6 className='card-title-me' key={index}>{metier.name}</h6>
                                                ))}
                                            </div>
                                            <div className='hom-art'>
                                                {artisan.regions.map((region, index) => (
                                                    <h6 className='prof' key={index}>{region.name}, Sénégal</h6>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    )}
                    </div>
                    <div className="profile mt-5">
                        <div className='link-servs'>
                            <Link to="/artisans" className='propos'>Voir plus</Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className='container-services mt-5'>
                <div className="container">
                    <h1 className='title-serv'>L&apos;équipe de Gayu</h1>
                    <div className="row mt-5">
                        <div className="col-md-4">
                            <div className='team-container'>
                                <img src="images/team1.png" alt="" />
                            </div>
                            <div className='team-body'>
                                <h5 className='team-name'>Abdou Khadre D. Maiga</h5>
                                <h6 className='team-fonction'>Co-fondateur & PDG</h6>
                            </div>
                        </div>
                        <div className="col-md-4 ">
                            <div className='team-container'>
                                <img src="images/team3.png" alt="" />
                            </div>
                            <div className='team-body'>
                                <h5 className='team-name'>Abdou Khadre D. Maiga</h5>
                                <h6 className='team-fonction'>Co-fondateur & PDG</h6>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="team-container">
                                <img src="images/team3.png" alt="" />
                            </div>
                            <div className='team-body'>
                                <h5 className='team-name'>Abdou Khadre D. Maiga</h5>
                                <h6 className='team-fonction'>Co-fondateur & PDG</h6>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-5">
                        <div className="col-md-6">
                            <div className='team-container'>
                                <img src="images/team1.png" alt="" />
                            </div>
                            <div className='team-body'>
                                <h5 className='team-name'>Abdou Khadre D. Maiga</h5>
                                <h6 className='team-fonction'>Co-fondateur & PDG</h6>
                            </div>
                        </div>
                        <div className="col-md-6 ">
                            <div className='team-container'>
                                <img src="images/team4.png" alt="" />
                            </div>
                            <div className='team-body'>
                                <h5 className='team-name'>Abdou Khadre D. Maiga</h5>
                                <h6 className='team-fonction'>Co-fondateur & PDG</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='slicks mt-5 mb-5'>
                <div className="container">
                    <h1 className='title-tst'>TEMOIGNAGES</h1>
                    <div className="row cont-tst">
                        <Slider {...settingTesti}>
                            {temoignages && temoignages.map((temoignage) => (
                                <div className="col-md-4" key={temoignage.id}>
                                    <div className="testimonial-cont">
                                        <p className="description">
                                            {temoignage.temoignage}
                                        </p>
                                        <div className="testimonial-profile">
                                            <h3 className="title">{temoignage.nom_complet}</h3>
                                            <p className="author-role">{temoignage.profession}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Slider>

                    </div>
                </div>
            </section>

            <Contacts />

            <Footer/>
        </div>
  )
}
