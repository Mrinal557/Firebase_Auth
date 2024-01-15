// header:-
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import img1 from '../assets/png_img.png';
import img2 from '../assets/png_img.png';
import "../Styles/Header.css";
const Header = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    const user = auth.currentUser;
    return (
        <div>
            <div className='headerbar' style={{ backgroundImage: "linear-gradient(to right, purple, #019CAD)" }}>
                <div className="headright">
                    <Link to="/">
                        <img src={img1} alt="Logo" className='logoimage' />
                    </Link>
                </div>
                <div className="headleft">
                    <span className="left-logo-name" style={{}}></span>
                    <img src={img2} alt="Logo" className='logoimageleft' />
                </div>

            </div>
        </div>
    )
}

export default Header;