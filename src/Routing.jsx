import React from 'react'
// import Form from './Unused/Form';
import ShowUser from './Pages/ShowUser';
import RegisterUser from './Pages/RegisterUser';
// import Carousel from './Components/Carousel';
// import Card from './Components/Card';
// import Sidenav from './Components/Sidenav';
import LoginUser from './Pages/LoginUser';
import LoginAdmin from './Pages/LoginAdmin';
import RegisterAdmin from './Pages/RegisterAdmin';
import ShowAdmin from './Pages/ShowAdmin';
import NotFound from './Pages/NotFound';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const Routing = () => {
    return (
        <div>
            <Router>
                <Routes>
                    <Route exact path="/" element={<LoginUser />} />
                    <Route path="/loginUser" element={<LoginUser />} />
                    <Route path="/registerUser" element={<RegisterUser />} />
                    <Route path="/homeUser" element={<ShowUser />} />
                    <Route path="/loginAdmin" element={<LoginAdmin />} />
                    <Route path="/registerAdmin" element={<RegisterAdmin />} />
                    <Route path="/homeAdmin" element={<ShowAdmin />} />
                </Routes>
            </Router>
        </div >
    )
}

export default Routing;