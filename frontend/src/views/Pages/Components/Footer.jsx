
import './Footer.css'
import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <div>
            <div className="container-footer">
                <div className="container">
                    <div className="rows">
                        <div className="cols">
                            <li className='footer-title-link'>Product
                                <div className='sous-title'>
                                    <li><a href="/#" className='blog-link1'>Lorem ipsum dolor</a></li>
                                    <li><a href="/#" className='blog-link1'>Lorem ipsum dolor</a></li>
                                    <li><a href="/#" className='blog-link1'>Lorem ipsum dolor</a></li>
                                    <li><a href="/#" className='blog-link1'>Lorem ipsum dolor</a></li>
                                    <li><a href="/#" className='blog-link1'>Lorem ipsum dolor</a></li>
                                    <li><a href="/#" className='blog-link1'>Lorem ipsum dolor</a></li>
                                </div>
                            </li>
                        </div>
                        <div className="cols ">
                            <li className='footer-title-link'>Information
                                <div className='sous-title'>
                                    <li><a href="/#" className='blog-link1'>FAQ</a></li>
                                    <li><a href="/#" className='blog-link1'>Blog</a></li>
                                    <li><a href="/#" className='blog-link1'>Support</a></li>
                                </div>
                            </li>
                        </div>
                        <div className="cols">
                            <li className='footer-title-link'>Company
                                <div className='sous-title'>
                                    <li><a href="/" className='blog-link1'>Accueil</a></li>
                                    <li><a href="/artisans" className='blog-link1'>Nos artisans</a></li>
                                    <li><a href="/propos" className='blog-link1'>A propos de nous</a></li>
                                    <li><a href="/contact" className='blog-link1'>Contactez nous</a></li>
                                    <li><a href="/#" className='blog-link1'>Recherche</a></li>
                                </div>
                            </li>
                        </div>
                        <div className="cols clos">
                            <div className='adresse-footer'>
                                <li className='footer-title-link'>S&apos;abonner
                                    <div>
                                        <div className='input-containers'>
                                            <form>
                                                <input type="text" className='input-foot' placeholder='Adresse e-mail*' />
                                            </form>
                                            <div className='arc'>
                                                <i className="fa fa-arrow-right" aria-hidden="true"></i>
                                            </div>
                                        </div>
                                        <p>
                                            Lorem ipsum dolorLorem ipsum dolor sit amet consectetur. Egestas sit enim egestas malesuada nulla.
                                            Lorem ipsum dolor sit amet consectetur. Egestas sit enim egestas malesuada nulla.
                                        </p>
                                    </div>
                                </li>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className='footer-end'>
                        <div className='img-gayu'>
                            <img src="images/Group.png" alt="" />
                        </div>
                        <div className='cont-conditions'>
                            <div className='conditions'>
                                <Link to="/confidentialite" className='blog-link1'>Conditions</Link>
                                <Link to="/confidentialite" className='blog-link1'>Confidentialité</Link>
                                <Link to="/confidentialite" className='blog-link1'>Cookies</Link>
                            </div>
                        </div>
                        <div className='reseau-social'>
                            <div className=''>
                                <div className='lesco'>
                                    <i className="fa fa-linkedin" aria-hidden="true"></i>
                                </div>
                            </div>
                            <div>
                                <div className='lesco'>
                                    <i className="fa fa-facebook" aria-hidden="true"></i>
                                </div>
                            </div>
                            <div className=''>
                                <div className='lesco'>
                                    <i className="fa fa-twitter" aria-hidden="true"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
