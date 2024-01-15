/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react'
import axios from 'axios'
// import Firebase from '../Firebase/Firebase';
import firebase from 'firebase/compat/app';
import { getAuth, signOut } from 'firebase/auth';
import 'firebase/compat/auth'
import bgImg from '../assets/jpg_img.jpg';
import { useForm } from 'react-hook-form';
import "../Styles/LoginUser.css"
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import { useState } from 'react';
import Button from '@mui/material/Button';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'
import Footer from '../Components/Footer';
import { useEffect } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

const Form = () => {
    toast.configure();
    const { register, watch, formState: { errors } } = useForm()
    const onSubmit = data => console.log(data);
    const [num, setNum] = useState(null);
    const [valid, setValid] = useState(false);
    const [otp, setOtp] = useState("");
    const [checked, setChecked] = useState(false);
    const [user, setUser] = useState(null);
    const [msg, setMsg] = useState("Invalid Admin!");
    var phoneNumber = "";
    let phonenum;

    const navigate = useNavigate();


    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        });

        return () => unsubscribe();
    }, []);

    function handleVerify() {
        if (num !== null) {
            phonenum = num.slice(3);
            // console.log(phonenum);
            console.log(isLoggedIn);
            if (isLoggedIn) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `Already Logged in with ${phonenum}! Wait for a moment while we log you out from previous session`,
                });
                setMsg("Logged out! Plz retry");
                const auth = getAuth();
                signOut(auth).then(() => {
                    // window.location.reload();
                    window.localStorage.clear();
                    window.sessionStorage.clear();
                }).catch((err) => {
                    console.log(err);
                });
            }
            if (!isLoggedIn) {
                axios.get(`https://10.1.2.201/api/facedetection/admin/phone/${phonenum}`)
                    .then(res => {
                        // console.log(res);
                        if (res.data !== "") { setValid(true); document.getElementById('message').style.display = 'none'; }
                    }).catch((err)=>console.log(err));
            }
            setChecked(true);
        }
    }

    // console.log(msg);
    const onSignInSubmit = (e) => {
        // e.preventDefault();
        configureCaptcha()
        // console.log('sign in submit called!!');
        // const phoneNumber = "+91" + state.mobile
        phoneNumber = num;

        // console.log('phone number in +91 format --> ' + phoneNumber);
        const appVerifier = window.recaptchaVerifier;
        const auth = getAuth();
        firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
            .then((confirmationResult) => {
                // SMS sent. Prompt user to type the code from the message, then sign the
                // user in with confirmationResult.confirm(code).
                window.confirmationResult = confirmationResult;
                console.log("OTP has been sent")
                toast.info('OTP has been sent successfully!', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                // ...
            }).catch((error) => {
                // Error; SMS not sent
                // ...
                console.log("SMS not sent")
            });
    }

    const configureCaptcha = () => {
        // console.log('got into configureCaptcha');
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
            'size': 'invisible',
            'callback': (response) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                console.log("Recaptcha verified")
                onSignInSubmit();
            },
            defaultCountry: "IN"
        });
    }

    const onSubmitOTP = (e) => {
        // e.preventDefault()
        // const code = state.otp
        const code = otp;
        // console.log(code)
        window.confirmationResult.confirm(code).then((result) => {
            // User signed in successfully.
            const user = result.user;
            // navigate('/home');
            // console.log(JSON.stringify(user))
            var credential = firebase.auth.PhoneAuthProvider.credential
                (window.confirmationResult.verificationId, code);
            navigate("/homeAdmin", { replace: true, state: { phoneNo: num } });
            // console.log('credentials --> ' + credential);
            // firebase.auth().signInWithCredential(credential);
            // alert("User is verified")

        }).catch((error) => {
            // User couldn't sign in (bad verification code?)
            // ...
            alert('invalid verification code');
            setTimeout(() => {
                window.location.reload();
            }, 1500)
        });
    }

    return (
        <div className="LoginBody" >
            <Header />
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
                <Button variant="contained" onClick={() => {

                    navigate("/loginUser");

                }} style={{ marginTop: "10px", marginRight: "15px" }} endIcon={<AccountCircleIcon />}>

                    User Login

                </Button></div>
            <section className='App' >
                <div className="register">
                    <div className="col-1">
                        <h2>Sign In</h2>
                        <div className="phonediv" style={{ display: "flex", alignItems: "baseline", width: "85%", margin: "15px" }} >
                            <div id="sign-in-button"></div>
                            <PhoneInput style={{ height: "45px", width: "90%" }} required placeholder="Verify phone number" value={num} onChange={setNum} />
                            <div className='verify'> <Button className="phonebutton" variant='outlined' style={{ marginLeft: "10%", height: "40px" }} size='small' onClick={handleVerify}>Verify</Button></div>
                        </div>
                        {valid ? (
                            <div>
                                <div>
                                    <Button variant='contained' onClick={() => onSignInSubmit()}>Send OTP</Button>
                                </div>
                                <div style={{ display: "inline" }}>
                                    <input type="num" required placeholder='Enter OTP' onChange={e => { setOtp(e.target.value) }} style={{ height: "20px", width: "53%", marginTop: "10px" }} />
                                    <Button variant='outlined' style={{ margin: "20px" }} onClick={() => {
                                        onSubmitOTP()
                                    }}>Sign In</Button>
                                </div>
                            </div>) : (
                            checked ? (<div>
                                <h2 style={{ opacity: "0.2", display: "flex", marginLeft: "15%" }} id='message'>{msg}</h2>
                            </div>) : ("")
                        )}
                        <p>Don't have an account? <Link to="/registerAdmin">RegisterAdmin</Link></p>
                    </div>
                    <div className="col-2">
                        <img src={bgImg} alt="image" />
                    </div>
                </div>

            </section>
            <Footer />

        </div>
    )
}

export default Form