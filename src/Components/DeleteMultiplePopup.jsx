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

    var set = props.set;
    console.log(set);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="contained" color="secondary" onClick={handleClickOpen} endIcon={<DeleteIcon />}>DELETE Selected</Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Are you sure you want to delete the marked Users?</DialogTitle>
                <DialogContent>
                    This action cannot be undone
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="primary" onClick={() => {
                        handleClose();
                       
                    }}>Yes</Button>
                    <Button variant="contained" color="secondary" onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Popup;