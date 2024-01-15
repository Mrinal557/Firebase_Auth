import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { TextField } from '@mui/material';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Popup = (props) => {
  toast.configure();
  const [open, setOpen] = React.useState(false);
  // console.log('delete user props --> ' + props);
  const keys = ["firstName", "lastName", "email", "phoneNo"];
  const iuId = props.iuId;
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" color="secondary" onClick={handleClickOpen} endIcon={<DeleteIcon />}>DELETE</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Are you sure you want to delete this User?</DialogTitle>
        <DialogContent>
          This action cannot be undone
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={() => {
            handleClose();
            axios
              .delete(
                `https://10.1.2.201/api/facedetection/user/delete/${iuId}`
              )
              .then((res)=>{
                toast.success('User Deleted Successfully!', {
                  position: "top-center",
                  autoClose: 600,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: false,
                  draggable: true,
                  progress: undefined,
                  theme: "dark",
                });

                setTimeout(() => {
                  if (window.location === "/homeUser")
                    navigate("/");
                  else window.location.reload();
                }, 1500);
              })
              .catch((err) => {
                alert("something went wrong");
                console.log(err);
                window.location.reload();
              });
          }}>Yes</Button>
          <Button variant="contained" color="secondary" onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Popup;