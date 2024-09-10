import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { Routes, Route, useNavigate } from 'react-router-dom';

import '../../../../../assets/css/styles.css';
import '../../../../../assets/js/scripts';
import Dashboard from '../Pages/Dashboard';
import Artisans from '../Pages/Artisans';
import Roles from '../Pages/Roles';
import Metiers from '../Pages/Metiers';
import Regions from '../Pages/Regions';
import User from '../Pages/User';
import Profil from '../Pages/Profil';
import Temoignage from '../Pages/Temoignage';

export default function MasterAdmin() {

    const Navigate = useNavigate();

    return (
        <div className='sb-nav-fixed'>
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
                            <Route path='artisans' element={<Artisans />} />
                            <Route path='roles' element={<Roles />} />
                            <Route path='metiers' element={<Metiers />} />
                            <Route path='regions' element={<Regions />} />
                            <Route path='users' element={<User />} />
                            <Route path='temoignage' element={<Temoignage />} />
                            <Route path='profil' element={<Profil />} />
                        </Routes>

                    </main>
                </div>

            </div>
        </div>
    )
}
