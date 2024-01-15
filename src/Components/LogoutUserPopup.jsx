import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { getAuth, signOut } from 'firebase/auth';

const Popup = ({props}) => {
    const [open, setOpen] = React.useState(false);
    const iaId = props;
    const navigate = useNavigate();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>logout</Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Are you sure you want to logout from this profile?</DialogTitle>
                <DialogActions>
                    <Button variant="contained" color="primary" onClick={() => {
                        handleClose();
                        const auth = getAuth();
                        signOut(auth).then(() => {
                            console.log('signed out!');
                            window.location.replace("/loginUser");
                            window.localStorage.clear();
                            window.sessionStorage.clear();
                        }).catch(err => {
                            alert('something went wrong!');
                            window.location.reload();
                        })
                    }}>LogOut</Button>
                    <Button variant="contained" color="secondary" onClick={handleClose}>Go Back
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Popup;