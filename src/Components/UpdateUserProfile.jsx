import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { getAuth, signOut } from "firebase/auth";
import { useEffect, useRef } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Stack from "@mui/material/Stack";
import Webcam from "react-webcam";
import Swal from 'sweetalert2';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Popup = (props) => {
    toast.configure();
    const iuId = props.iuId;
    const [open, setOpen] = React.useState(false);
    const [firstname, setfirstname] = useState("");
    const [lastname, setlastname] = useState("");
    const [phone, setphone] = useState(0);
    const [email, setemail] = useState("");
    const [vechin, setvechin] = useState("");
    const [pass, setpass] = useState("");
    const [id,setid]=useState("");
    const [pic, setpic] = useState(null);
    const [profilePic, setProfilepic] = useState(null);
    const [image, setImage] = useState(null);


    const navigate = useNavigate();
    const updatingForm = async (id) => {
        const res = await axios.get(
            "https://10.1.2.201/api/facedetection/user/" + id
        );
        // console.log('this one --> ' + res.data.firstName);
        setfirstname(res.data.firstName);
        setlastname(res.data.lastName);
        setphone(res.data.phoneNo);
        setemail(res.data.email);
        setvechin(res.data.vin);
        setpic(res.data.picture);
        setid(id);
    }
    // console.log(phone);
    const handleClickOpen = (id) => {
        updatingForm(id)
        async function preview() {
            const response = await axios.get(
                `https://10.1.2.201/api/facedetection/picture/${id}`,
                {
                    responseType: "arraybuffer", // Specify response type as arraybuffer
                }
            );

            const imageData = response.data;
            const blob = new Blob([imageData], { type: "image/png" }); // Create a blob from the image data and set the type to PNG
            const imgURL = URL.createObjectURL(blob); // Create an object URL for the blob
            setProfilepic(imgURL); // Set the profile picture to the blob
        }
        setOpen(true);
        preview();
    };

    const handleClose = () => {
        setOpen(false);
    };

    const videoConstraints = {
        width: 200,
        height: 200,
        facingMode: "environment",
    };

    const webcamRef = useRef(null);
    const [url, setUrl] = useState(null);

    const capturePhoto = React.useCallback(
        async (e) => {
            e.preventDefault();
            const imageSrc = webcamRef.current.getScreenshot();
            setUrl(imageSrc);
            const blob = await fetch(imageSrc).then((res) => res.blob());
            setImage(blob);
        },
        [webcamRef]
    );

    const onUserMedia = (e) => {
        console.log(e);
    };

    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData();
        formData.append('picture', image);

        axios
            .put(`https://10.1.2.201/api/facedetection/user/update/${iuId}?iuId=${iuId}&vin=${vechin}&firstName=${firstname}&lastName=${lastname}&email=${email}&password=${pass}&phoneNo=${phone}, formData, { headers: { 'Content-Type': 'multipart/form-data'}}`)
            .then((response) => {
                // Update the state variables directly with the updated data
                setfirstname(response.data.firstName);
                setlastname(response.data.lastName);
                setphone(response.data.phoneNo);
                setemail(response.data.email);
                setvechin(response.data.vin);
                setpic(response.data.picture);

                // Update the UI with the updated data
                updatingForm(iuId);

                // Close the popup after updating the UI
                handleClose();
                window.location.reload();
            })
            .catch((error) => {
                toast.error('Something Went Wrong', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                console.error(error);
            });
    }

    return (
        <div>
            <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                    handleClickOpen(iuId);
                }}
                endIcon={<EditIcon />}
            >
                Edit Info
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle style={{ display: "flex", justifyContent: "center" }}>
                    Edit User info
                </DialogTitle>
                <form style={{ backgroundColor: "#fff" }} onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>UserID:</label>
                        <input type="number" name="iuId" value={props.iuId} readOnly />
                    </div>
                    <div className="input-group">
                        <label>FirstName:</label>
                        <input type="text" name="firstName" value={firstname} required onChange={(e) => setfirstname(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label>LastName:</label>
                        <input type="text" name="lastname" value={lastname} required onChange={(e) => setlastname(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label>Vehicle Identification Number:</label>
                        <input type="text" name="vechin" value={vechin} required readOnly />
                    </div>
                    <div className="input-group">
                        <label>Email:</label>
                        <input type="email" name="email" value={email} required onChange={(e) => setemail(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label>PhoneNo:</label>
                        <input type="tel" name="phoneNo" value={phone} required onChange={(e) => setphone(e.target.value)} />
                    </div>
                    <div style={{ display: "flex", margin: "auto" }}>
                        <div className="input-group">
                            <label>ProfilePhoto:</label>
                            <img src={profilePic} style={{border:"0.2px solid #F0F8FF",borderRadius:"8px"}} alt="Profile Pic" height="200" width="200" />

                            <button style={{backgroundColor:"#89CFF0",margin:"2px",borderRadius:"8px"}} onClick={capturePhoto}>
                            Capture</button>
                            <div style={{ display: "flex", margin: "auto" }}>
                                <Stack direction="row" spacing={2}>
                                    <item>
                                        <Webcam
                                            ref={webcamRef}
                                            audio={false}
                                            screenshotFormat="image/png"
                                            videoConstraints={videoConstraints}
                                            onUserMedia={onUserMedia}
                                            mirrored={true}
                                            screenshotQuality={1}
                                        />
                                    </item>
                                    <item>
                                        {url && (
                                            <div>
                                                <img src={url} style={{border:"0.2px solid #F0F8FF",borderRadius:"8px"}} alt="Screenshot" />
                                            </div>
                                        )}
                                    </item>
                                </Stack>
                            </div>
                        </div>
                    </div>
                    <DialogActions>
                        <Button variant="contained" type="submit" color="primary">
                            Update
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
};

export default Popup;