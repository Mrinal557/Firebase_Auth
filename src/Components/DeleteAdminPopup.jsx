// Components:-
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { TextField } from '@mui/material';

const Popup = (props) => {
  const iaId = props.iaId;
  const [open, setOpen] = React.useState(false);
  const [fname, setFName] = useState("");
  const [lname, setLName] = useState("");
  const [enteredid, setEnteredid] = useState(0);
  // const iaId = props.iaId;
  // console.log("admin id from popup delete --> " + props.iaId);
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };



  return (
    <div>
      <Button variant="contained" color="secondary" onClick={handleClickOpen} className='btn'>DELETE Account</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Are you sure you want to delete this Admin?</DialogTitle>
        <DialogContent>
          <div>
            enter adminID to delete this account
          </div>
          <div>
            <TextField id="standard-basic" type='number' label="Enter Admin ID" variant="standard" onChange={e => setEnteredid(e.target.value)} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={() => {
            handleClose();
            if (parseInt(enteredid) === (props.iaId)) {
              // alert('matched!!');
              // console.log("matched!!");
              axios
                .delete(
                  `https://10.1.2.201/api/facedetection/admin/delete/${props.iaId}`
                )
                .then((res) => {
                  alert(
                    "admin with id " +
                    props.iaId +
                    " deleted"
                  );
                  // console.log(res.data);
                  navigate("/");
                })
                .catch((err) => {
                  alert("something went wrong");
                  window.location.reload();
                  console.log(err);
                });
            }
            else {
              alert('entered value does not match expected');
            }
          }}>Yes</Button>
          <Button variant="contained" color="secondary" onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Popup;