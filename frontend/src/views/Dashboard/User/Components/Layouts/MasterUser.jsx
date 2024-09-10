import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom';


import '../../../../../assets/css/styles.css';
import '../../../../../assets/js/scripts';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Dashboard from '../Pages/Dashboard';
import Avis from '../Pages/Avis';
import Favoris from '../Pages/Favoris';
import Reservation from '../Pages/Reservation';
import Profil from '../Pages/Profil';
import Archives from '../Pages/Archives';

export default function MasterUser() {

    const Navigate = useNavigate();
    return (
        <div className='sb-nav-fixed grey-bg'>
            <Navbar />
            <div id="layoutSidenav">

                <div id="layoutSidenav_nav">
                    <Sidebar />
                </div>

                <div id="layoutSidenav_content">
                    <main>

                        <Routes>
                            <Route
                                path='/'
                                element={
                                    <React.Fragment>
                                        <Navigate to='dashboard' replace />
                                    </React.Fragment>
                                }
                            />
                            <Route path='dashboard' element={<Dashboard />} />
                            <Route path='favoris' element={<Favoris />} />
                            <Route path='reservation' element={<Reservation />} />
                            <Route path='archive' element={<Archives />} />
                            <Route path='profil' element={<Profil />} />
                            <Route path='avis' element={<Avis/>} />
                        </Routes>
                    </main>
                </div>

            </div>
        </div>
    )
}
