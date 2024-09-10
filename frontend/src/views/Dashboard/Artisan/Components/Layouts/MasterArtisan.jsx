import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom';


import '../../../../../assets/css/styles.css';
import '../../../../../assets/js/scripts';
import Navbar from './Navbar';
import Sidebar from './Sidebar';


import Dashboard from '../Pages/Dashboard';
import Profil from '../Pages/Profil';
import Realisation from '../Pages/Realisation';
import Avis from '../Pages/Avis';
import Planning from '../Pages/Planning';
import Travaux from '../Pages/Travaux';

export default function MasterArtisan() {

    const Navigate = useNavigate();
    return (
        <div className='sb-nav-fixed'>
            <Navbar/>
            <div id="layoutSidenav">

                <div id="layoutSidenav_nav">
                    <Sidebar/>
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
                            <Route path='profil' element={<Profil />} />
                            <Route path='realisation' element={<Realisation />} />
                            <Route path='travaux' element={<Travaux />} />
                            <Route path='planing' element={<Planning/>} />
                            <Route path='planing/:artisanId?' element={<Planning />} />
                            <Route path='avis' element={<Avis />} />
                        </Routes>

                    </main>
                </div>

            </div>
        </div>
    )
}
