
import { Link } from "react-router-dom";
import TopNav from '../Components/Topnav';
import Footer from '../Components/Footer';
import Contacts from '../Components/Contacts';
import './Contact.css'

export default function Contact() {
    return (
        <div>
            <div className='mt-3'>
                <TopNav />
                <div className="container mt-5">
                    <ul className="breadcrumb">
                        <li className='breadcumbs'><Link to="/" className='lnk'>Accueil /</Link></li>
                        <li className='breadcumbs'><Link to="/artisan" className='lnk'>Nos Artisans /</Link></li>
                        <li className='breadcumbs'><Link to="/propos" className='lnk'>A propos de nous /</Link></li>
                        <li className='breadcumbs'>Contact</li>
                    </ul>

                    <Contacts />
                </div>
                <Footer />
            </div>
        </div>
    )
}
