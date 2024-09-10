
import { Link } from "react-router-dom";
import './Propos.css'
import TopNav from '../Components/Topnav';
import Footer from '../Components/Footer';
import Contacts from '../Components/Contacts';

export default function Propos() {
    return (
        <div>
            <div className='mt-3'>
                <TopNav />
                <div className="container mt-5">
                    <ul className="breadcrumb">
                        <li className='breadcumbs'><Link to="/" className='lnk'>Accueil /</Link></li>
                        <li  className='breadcumbs'><Link to="/artisan" className='lnk'>Nos Artisans /</Link></li>
                        <li className='breadcumbs'>A propos de nous</li>
                    </ul>
                    <div>
                        <h1 className='title-propos'>A propos de Nous</h1>
                    </div>
                    <div className="row mt-5">
                        <div className="col-md-6">
                            <div className='par-prop'>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                    Donec gravida accumsan venenatis.Integer convallis, ex quis
                                    pulvinar sodales, velit urna elementum est, ut dapibus felis
                                    mauris in nisi. Fusce posuere sodales ante non sollicitudin.
                                    Donec turpis justo, finibus vel mollis ac, porttitor quis
                                    est. Fusce ultrices urna a augue tempus gravida. Nullam
                                    volutpat libero ultrices semper maximus.
                                </p>
                                <p>
                                    Pellentesque varius orci nec ante facilisis ultrices. Phasellus maximus dolor eget
                                    diam rutrum, vitae aliquet nisi luctus. Duis id efficitur neque. Morbi tincidunt,
                                    augue vel lacinia pulvinar, lectus turpis ultrices augue, sit amet scelerisque ligula
                                    velit vel mi. In gravida vel lacus non pretium. Cras ullamcorper accumsan quam,
                                    at placerat sapien scelerisque eu. Nullam eget neque mauris. Nam tellus nisi, rutrum
                                    nec risus at, cursus vestibulum mi. Class aptent taciti sociosqu ad litora torquent
                                    per conubia nostra, per inceptos himenaeos. Curabitur porttitor ex id risus feugiat
                                    efficitur. Phasellus id justo ac risus auctor porttitor nec at felis. Nullam ligula
                                    metus, egestas luctus quam tempus, ultricies sollicitudin justo.
                                    aliquam sit amet pharetra vitae, posuere vitae nulla. Fusce ullamcorper molestie
                                    tortor, ac faucibus sem bibendum vitae.
                                </p>
                                <p>
                                    Pellentesque varius orci nec ante facilisis ultrices. Phasellus maximus dolor eget
                                    diam rutrum, vitae aliquet nisi luctus. Duis id efficitur neque. Morbi tincidunt,
                                    augue vel lacinia pulvinar, lectus turpis ultrices augue, sit amet scelerisque ligula
                                    velit vel mi.
                                </p>
                                <p>
                                    Pellentesque varius orci nec ante facilisis ultrices. Phasellus maximus dolor eget
                                    diam rutrum, vitae aliquet nisi luctus. Duis id efficitur neque. Morbi tincidunt,
                                    augue vel lacinia pulvinar, lectus turpis ultrices augue. Fusce ullamcorper molestie
                                    tortor, ac faucibus sem bibendum vitae.
                                </p>
                                <p>
                                    Pellentesque varius orci nec ante facilisis ultrices. Phasellus maximus dolor eget
                                    diam rutrum, vitae aliquet nisi luctus. Duis id efficitur neque. Morbi tincidunt,
                                    augue vel lacinia pulvinar, lectus turpis ultrices augue. Fusce ullamcorper molestie
                                    tortor, ac faucibus sem bibendum vitae.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className='prop-img'>
                                <img src="images/img-prop.png" alt="" />
                            </div>
                            <div className='prop-img mt-5'>
                                <img src="images/img-props.png" alt="" />
                            </div>
                        </div>
                    </div>

                    <div className='cont-prop'>
                        <Contacts />
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    )
}
