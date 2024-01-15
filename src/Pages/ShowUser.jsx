/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from '../Components/Header';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import firebase from '../Firebase/Firebase'
import { getAuth, signOut } from 'firebase/auth';
import "../Styles/ShowUser.css";
import DeleteUserButton from "../Components/DeleteUserPopup";
import UpdateUserProfile from '../Components/UpdateUserProfile';
import LogoutUserProfile from '../Components/LogoutUserPopup';



const ShowUser = (props) => {
  const [name, setName] = useState("");
  const [iuId, setiuId] = useState("");
  const [num, setNum] = useState("");
  const [img1, setImg1] = useState(null);
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [vin, setVin] = useState("");
  const hosturl = process.env.HOST;

  const location = useLocation();
  const navigate = useNavigate();
  // console.log(location.state); 

  useEffect(() => {
    setNum(location.state.phoneNo.slice(3))
  }, [location.state.phoneNo])

  useEffect(() => {
    const handleBackClick = () => {
      window.location.reload(); // Reload the current page
    };

    window.addEventListener('popstate', handleBackClick);

    return () => {
      window.removeEventListener('popstate', handleBackClick);
    };
  }, []);

  useEffect(() => {
    if (num) {
      async function getDetails() {
        const response = await axios.get(`https://10.1.2.201/api/facedetection/users/${num}`).then(response => {

          // console.log(response.data)
          // console.log(num);
          setName(response.data.firstName)
          setiuId(response.data.iuId)
          setUrl(response.data.picture);

          setLastname(response.data.lastName)
          setEmail(response.data.email);
          setPhone(response.data.phoneNo);
          setVin(response.data.vin);
        })
      }
      getDetails();
    }
  }, [num])

  return (
    <div style={{
      "height": "100vh",
      "background": "#0f0c29",
      "background": "-webkit-linear-gradient(to right, #24243e, #302b63, #0f0c29)",
      "background": "linear-gradient(to right, #24243e, #302b63, #0f0c29)"
    }}>
      <Header />
      <div style={{ display: "flex", justifyContent: "flex-end", marginRight: "20px", marginTop: "10px", columnGap: "4px" }}>
        <LogoutUserProfile />
        <DeleteUserButton id={iuId} />
      </div>

      <div style={{ justifyContent: "center", background: "linear-gradient(#004687,#0039a6F)", alignContent: "center", margin: "auto", width: "50vw", height: "77vh", borderRadius: "20px", border: "5px solid #fff" }}>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "0px" }}>
          <img src={`data:image/png;base64,${url}`} alt="my image" style={{ width: "150px", height: "150px", backgroundColor: "white", marginTop: "15px", borderRadius: "50%", border: "2px solid #6CB4EE" }} />
        </div>
        <div style={{ color: "#fff", marginLeft: "15px", marginRight: "10px", marginTop: "10px", }}>
          <div className="userinfo"> <h4 >User ID:  {iuId}</h4></div>
          <div className="userinfo"> <h4 >VIN:  {vin}</h4></div>
          <div className="userinfo"><h4>Name: {name} {lastname}</h4></div>
          <div className="userinfo"><h4>Email: {email}</h4></div>
          <div className="userinfo"><h4>Mobile No: {phone}</h4></div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "5px" }}>
          <UpdateUserProfile iuId={iuId} />
        </div>
      </div>
    </div>

  )
}

export default ShowUser