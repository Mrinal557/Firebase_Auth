/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from '../Components/Header';
import { useNavigate } from 'react-router-dom';
import "../Styles/ShowAdmin.css";
import DeleteAdminPopup from "../Components/DeleteAdminPopup"
import UsersList from '../Components/UsersList';
import LogoutAdminPopup from "../Components/LogoutAdminPopup";
import UpdateAdminProfile from '../Components/UpdateAdminProfile';
import BackgroundImg from '../assets/jpg_img.jpg';

// import UserContext from './Context'
const ShowAdmin = (props) => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [num, setNum] = useState("");
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [vin, setVin] = useState("");

  const [visible, setVisible] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();


  // console.log(location.state);

  useEffect(() => {
    setNum(location.state.phoneNo.slice(3));
  }, [location.state.phoneNo])

  useEffect(() => {
    if (num) {
      async function getDetails() {
        const res =
          await axios.get(`https://10.1.2.201/api/facedetection/admin/phone/${num}`)
            .then(response => {
              // console.log('show admin data ---> '+response)
              setName(response.data.firstName)
              setId(response.data.iaId)
              setUrl(response.data.picture)
              setLastname(response.data.lastName)
              setEmail(response.data.email)
              setPhone(response.data.phoneNo)
              setVin(response.data.vin)
            })
      }
      getDetails();
    }
  }, [num])

  return (

    <div style={{
      // "height": "100vh",
      "width": "100%",
      // "position": "absolute",
      // "top": "0",
      // "left": "0",
      // "right": "0",
      // "bottom": "0",
      // "background": "#0f0c29",
      // "background": "-webkit-linear-gradient(to right, #24243e, #302b63)",
      "background": "linear-gradient(to right, #24243e, #302b63)",
      "backgroundSize": "cover",
    }}>
      <Header />

      {(!visible) ?
        (
          <div>
            <button onClick={() => {
              setVisible(true);
            }} style={{}}>Show Users List</button>
            <div style={{ display: "flex", justifyContent: "flex-end", columnGap: "10px", margin: "10px" }}>
              <LogoutAdminPopup />
              <DeleteAdminPopup iaId={id} />
            </div>
            <div style={{
              justifyContent: "center",
              background: "linear-gradient(#004687,#0039a6F)", alignContent: "center",
              margin: "auto", width: "70%", height: "70vh",
              borderRadius: "20px", border: "3px solid white"
            }}>
              <div style={{
                display: "flex", justifyContent: "center", backgroundColor: "#42549e8f", height: "137px",
                borderRadius: "10px"
              }} className='profile-upper'>
                <img src={`data:image/png;base64,${url}`} alt="my image"
                  style={{
                    width: "100px", height: "100px", backgroundColor: "white",
                    marginTop: "3%", borderRadius: "20%", border: "2px solid #6CB4EE"
                  }} />
              </div>
              <div style={{ color: "#F0EAD6", marginLeft: "5%", marginTop: "3%", marginRight: "5%" }} className='admin-info-list'>
                <div className="userinfo"> <h4 >Admin ID:  {id}</h4></div>
                <div className="userinfo"> <h4 >VIN:  {vin}</h4></div>
                <div className="userinfo"><h4>Name: {name} {lastname}</h4></div>
                <div className="userinfo"><h4>Email: {email}</h4></div>
                <div className="userinfo"><h4>Mobile No: {phone}</h4></div>
                <div style={{ display: "flex", justifyContent: "center", marginTop: "3px" }}>
                  <UpdateAdminProfile id={id} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <button onClick={() => { setVisible(false); }}>Show Admin Profile</button>
            <UsersList />
          </div>
        )
      }
    </div>
  );
}

export default ShowAdmin