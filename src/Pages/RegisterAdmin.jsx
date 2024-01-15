import React from 'react'
import axios from 'axios'
// import Firebase from '../Firebase/Firebase';
import firebase from 'firebase/compat/app';
import { getAuth } from 'firebase/auth';
import 'firebase/compat/auth'
import bgImg from '../assets/jpg_img.jpg';
import { useForm } from 'react-hook-form';
import "../Styles/LoginUser.css"
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import { useState, useRef } from 'react';
import Button from '@mui/material/Button';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'
import Footer from '../Components/Footer';
import Camera from '../Components/Camera';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import validator from 'validator';

import Webcam from "react-webcam";
import Stack from "@mui/material/Stack";

export default function RegisterAdmin() {
    const [adminid, setadminid] = useState(0);
    const [vin, setvin] = useState('');
    const [firstName, setfirstName] = useState('');
    const [lastName, setlastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNo, setphone] = useState('');
    const [pic, setPic] = useState("");
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');

    const [image, setImage] = useState("");
    const [profilePhoto, setProfilePhoto] = useState(null);

    const videoConstraints = {
        width: 240,
        height: 240,
        facingMode: "environment",
    };

    const webcamRef = useRef(null);
    const [url, setUrl] = useState(null);

    const capturePhoto = React.useCallback(async (event) => {
        event.preventDefault();
        const imageSrc = webcamRef.current.getScreenshot();
        setUrl(imageSrc);
        const blob = await fetch(imageSrc).then((res) => res.blob());
        setImage(blob);
        console.log(blob);
    }, [webcamRef]);

    const onUserMedia = (e) => {
        console.log(e);
    };

    const handleImage = (e) => {
        console.log(e.target.files);
        setPic(e.target.files[0]);
        console.log(pic);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("picture", image);

        for (const [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
        if(url!==null){
        axios
            .post(
                `https://10.1.2.201/api/facedetection/admin/create?firstName=${firstName}&lastName=${lastName}&email=${email}&password=${password}&phoneNo=${phoneNo}&iaId=${adminid}&vin=${vin}`,
                formData,
                {
                    headers: {
                        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
                    },
                }
            )
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
        Swal.fire({
            position: "center",
            icon: "success",
            title: "New Admin Registered",
            showConfirmButton: false,
            timer: 2500
        });
        navigate("/loginAdmin");}
        else{
            Swal.fire({
                position: "top",
                icon: "error",
                title: "Click a picture to upload",
                showConfirmButton: false,
                timer: 2000
            });
        }
    };

    const formData = new FormData();
    const navigate = useNavigate();
    return (
        <div className="RegisterBody">
            <Header />
            <div className='formBackground'  >
                <form onSubmit={handleSubmit} style={{ backgroundColor: "#fff" }}>
                    <div className="input-group"> <label>
                        Admin ID:
                    </label>
                        <input type="number" name="adminid" value={adminid} required onChange={(e) => setadminid(e.target.value)} /></div>

                    <div className="input-group"> <label>
                        Vehicle Identification Number:
                    </label>
                        <input type="text" name="vin" value={vin} required onChange={(e) => setvin(e.target.value)} /></div>
                    <div className="input-group"> <label>
                        First Name:
                    </label>
                        <input type="text" name="firstName" value={firstName} required onChange={(e) => setfirstName(e.target.value)} /></div>
                    <div className="input-group"><label>
                        Last Name:
                    </label>
                        <input type="text" name="lastName" value={lastName} required onChange={(e) => setlastName(e.target.value)} /></div>
                    <div className="input-group">
                        <label>
                            Email:
                        </label>
                        <input type="email" name="email" value={email} required onChange={(e) => {
                            if (validator.isEmail(e.target.value)) {
                                setEmailError('');
                            }
                            else {
                                setEmailError('Enter valid email!');
                            }
                            setEmail(e.target.value)
                        }} />
                        <span style={{ fontWeight: "bold", color: "red" }}>{emailError}</span>
                    </div>
                    <div className="input-group">
                        <label>
                            PhoneNo:
                        </label>
                        <input type="tel" name="phoneNo" value={phoneNo} required onChange={(e) => {
                            if (e.target.value.length < 10) {
                                setPhoneError('enter a valid phone number');
                            }
                            else if (validator.isMobilePhone(e.target.value)) {
                                setPhoneError("");
                            }
                            else {
                                setPhoneError('Enter a valid phone number');
                            }
                            setphone(e.target.value)
                        }} />
                        <span style={{ fontWeight: "bold", color: "red" }}>{phoneError}</span>
                    </div>
                    <label style={{ fontSize: "0.9rem", fontWeight: "700", marginBottom: "0.3rem" }}>ProfilePhoto:</label>
                    <button onClick={capturePhoto} style={{ backgroundColor: "#89CFF0", margin: "2px", borderRadius: "8px", }}>Capture</button>
                    <div id="camerastack">
                        <Webcam
                            ref={webcamRef}
                            audio={false}
                            screenshotFormat="image/png"
                            videoConstraints={videoConstraints}
                            onUserMedia={onUserMedia}
                            mirrored={true}
                            screenshotQuality={1}
                        />
                        <div style={{ marginTop: "6px" }}>
                            {url && (
                                <div>
                                    <img height="240" width="240" src={url} alt="Screenshot" />
                                </div>
                            )}
                        </div>
                    </div>
                    <button type="submit" className="submit-btn">
                        Submit
                    </button>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <p>
                            Already have an account? <Link to="/loginAdmin">Login Admin</Link>
                        </p>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
  );
}