import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import "../Styles/RegisterUser.css"
import TextField from '@mui/material/TextField';
import img1 from "../assets/png_img.png"
import img2 from "../assets/png_img.png"
import Header from '../Components/Header';
import ShowUser from './ShowUser';
import Footer from '../Components/Footer';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import validator from 'validator';
import Camera from '../Components/Camera';
import Stack from "@mui/material/Stack";
import Webcam from "react-webcam";

function Form() {
    const [iuId, setIuId] = useState(0);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNo, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [pic, setPic] = useState("");
    const [vin, setVin] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [camvis, setCamvis] = useState(false);
    const [image, setImage] = useState("");

    // const formData = new FormData();
    const navigate = useNavigate();

    const handleImage = (e) => {
        console.log(e.target.files);
        setPic(e.target.files[0]);
    }

    const videoConstraints = {
        width: 240,
        height: 240,
        facingMode: "environment",
    };

    const webcamRef = useRef(null);
    const [url, setUrl] = useState(null);

    const capturePhoto = React.useCallback(async (e) => {
        e.preventDefault();
        const imageSrc = webcamRef.current.getScreenshot();
        setUrl(imageSrc);
        const blob = await fetch(imageSrc).then((res) => res.blob());
        setImage(blob);
        console.log(blob);
    }, [webcamRef]);

    const onUserMedia = (e) => {
        console.log(e);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("picture", image);
        for (const [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
        if (url !== null) {
            axios
                .post(
                    `https://10.1.2.201/api/facedetection/users?firstName=${firstName}&lastName=${lastName}&iuId=${iuId}&vin=${vin}&email=${email}&password=${password}&phoneNo=${phoneNo}`,
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
                title: "New User Registered",
                showConfirmButton: false,
                timer: 2500
            });
            navigate("/loginUser");
        }
        else {
            Swal.fire({
                position: "top",
                icon: "error",
                title: "Click a picture to upload",
                showConfirmButton: false,
                timer: 2000
            });
        }
    };



    //#4880EC, #019CAD)
    return (
        <div className="RegisterBody">
            <Header />
            <div className='formBackground'  >
                <form onSubmit={handleSubmit} style={{ backgroundColor: "#fff" }}>
                    <div className="input-group">
                        <label>
                            UserID:
                        </label>
                        <input type="number" name="iuId" value={iuId} required onChange={(e) => setIuId(e.target.value)} /></div>
                    <div className="input-group">
                        <label>
                            FirstName:
                        </label>
                        <input type="text" name="firstName" value={firstName} required onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label>
                            LastName:
                        </label>
                        <input type="text" name="lastName" value={lastName} required onChange={(e) => setLastName(e.target.value)} /></div>
                    <div className="input-group"><label>
                        Vehicle Identification Number:
                    </label>
                        <input type="text" name="vin" value={vin} required onChange={(e) => setVin(e.target.value)} />
                    </div>
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
                            setEmail(e.target.value);
                        }} />
                        <span style={{ fontWeight: "bold", color: "red" }}>{emailError}</span>
                    </div>
                    <div className="input-group">
                        <label>
                            PhoneNo:
                        </label>
                        <input type="number" name="phoneNo" value={phoneNo} required onChange={(e) => {
                            if (e.target.value.length < 10) {
                                setPhoneError('Enter a valid phone number!');
                            }
                            else if (validator.isMobilePhone(e.target.value)) {
                                // setPhoneValid('');
                                setPhoneError("");
                            }
                            else {
                                setPhoneError('Enter a valid Phone Number!');
                                // setPhoneValid("");
                            }
                            setPhone(e.target.value);
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
                    <button type="submit" className="submit-btn" >
                        Submit
                    </button>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <p>
                            Already have an account? <Link to="/loginUser">Login User</Link>
                        </p>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default Form;