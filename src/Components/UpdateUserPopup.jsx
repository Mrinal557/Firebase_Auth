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

const Popup = (props) => {
  const [open, setOpen] = React.useState(false);
  const iuId = props.iuId;
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [phone, setphone] = useState(0);
  const [email, setemail] = useState("");
  const [vechin, setvechin] = useState("");
  const [pass, setpass] = useState("");
  const [pic, setpic] = useState(null);
  const [profilePic, setProfilepic] = useState(null);
  const [image, setImage] = useState("");
  useEffect(() => {
    async function fun() {
      // console.log(iuId);
      const res = await axios.get(
        `https://10.1.2.201/api/facedetection/user/${iuId}`
      );
      // console.log('this one --> ' + res.data);
      setfirstname(res.data.firstName);
      setlastname(res.data.lastName);
      setphone(res.data.phoneNo);
      setemail(res.data.email);
      setvechin(res.data.vin);
      setpic(res.data.picture);
      setpass(res.data.password);
    }
    fun();
  }, [iuId]);

  const navigate = useNavigate();

  const handleClickOpen = (id) => {
    // console.log(id);
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
    formData.append("picture", image);
    axios
      .put(
        `https://10.1.2.201/api/facedetection/user/update/${iuId}?iuId=${iuId}&vin=${vechin}&firstName=${firstname}&lastName=${lastname}&email=${email}&password=${pass}&phoneNo=${phone}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      .then((response) => {
        // console.log(response.data);
        window.location.reload();
      })
      .catch((error) => {
        alert("something went wrong");
        console.log(error);
      });
    handleClose();
  }

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          handleClickOpen(iuId);
        }}
        endIcon={<EditIcon />}
      >
        Edit
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle style={{ display: "flex", justifyContent: "center" }}>
          Edit User info
        </DialogTitle>
        <form style={{ backgroundColor: "#fff" }} onSubmit={handleSubmit}>
          <div className="input-group">
            <label>UserID:</label>
            <input type="number" name="iuId" value={iuId} readOnly />
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
            <input type="text" name="vechin" value={vechin} required onChange={(e) => setvechin(e.target.value)} />
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
              <img src={profilePic} alt="Profile Pic" height="200" width="200" />

              <button onClick={capturePhoto} style={{backgroundColor:"#89CFF0",margin:"2px",borderRadius:"8px"}}>Capture</button>
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
                        <img src={url} alt="Screenshot" />
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