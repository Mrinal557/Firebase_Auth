import axios from "axios";
import React, { useEffect, useState } from "react";
// import { CButton } from '@coreui/react';
import "../Styles/UsersList.css";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { TextField } from "@mui/material";
import DeleteConfirmation from './DeleteUserPopup';
import UpdateUserPopup from './UpdateUserPopup';
import DeleteMultiplePopup from './DeleteMultiplePopup';
import Checkbox from '@mui/material/Checkbox';
import { InputGroup, Form, Table } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
 
export default function UsersList() {
    toast.configure();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPageUsers, setCurrentPageUsers] = useState([]);
    const [ticked, setTicked] = useState(false);
    var totalUsersOnPage = 0, startIndex, endIndex;
    const [reload, setReload] = useState(true);
    const [query, setQuery] = useState("");
    var phone = "";
    const set = new Set();
    const hosturl = process.env.HOST;
 
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
 
    function handlePageChange(page) {
        setCurrentPage(page);
    }
 
    useEffect(() => {
        axios
            .get("https://10.1.2.201/api/facedetection/admin/users/getall")
            .then((res) => {
                // console.log(res.data);
                setUsers(res.data);
            })
            .catch((err) => console.log(err));
    }, []);
 
    useEffect(() => {
        function fun() {
 
            const startIndex = (currentPage - 1) * rowsPerPage;
            const totalUsers = users.length;
            const endIndex = Math.min(totalUsers - startIndex, startIndex + rowsPerPage) //startIndex + rowsPerPage;
 
            const LIMIT = 3;
            const skip = LIMIT * currentPage; //
            const dataskip = (users.slice(currentPage === 1 ? 0 : skip - LIMIT, skip))
            setCurrentPageUsers(dataskip);
            setTotalPages(Math.ceil(totalUsers / LIMIT));
            // console.log("totalpages:" + totalPages);
        }
        fun();
    }, [users, currentPage]);
 
    function multipleDelete() {
 
        for (const element of set) {
            // console.log(element);
            axios
                .delete(
                    `https://10.1.2.201/api/facedetection/user/delete/${element}`
                )
        }
        if (set.size > 0) {
            toast.success('Users Deleted Successfully!', {
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
                if (window.location === "/homeUser") { navigate("/"); }
                else { window.location.reload(); }
            }, 1500);
        }
        else {
            console.log("no users selected");
        }
 
    }
 
    return (
 
        <div className="container">
            <div id='delete-multiple' style={{ display: "none", justifyContent: "flex-end", marginRight: "10px" }}>
                <Button variant="contained"
                    color="secondary" onClick={multipleDelete} endIcon={<DeleteIcon />}>
                    DELETE Selected</Button>
            </div>
            <div
                style={{
                    border: "2px solid #7393B3",
                    margin: "auto",
                    marginTop: "20px",
                    width: "90%",
                    position: "relative",
                    height: "100%",
                }}
            >
                <div className="search-container">
                <input type="text" placeholder="Search User" onChange={(e) => { setQuery(e.target.value) }}
                    style={{ width: "99%", margin: "2px", backgroundColor: "Menu" }} /></div>
                <div className="table" style={{ display: "flex", margin: "auto", overflowY: "scroll", maxHeight: "300px" }}>
                    <Table>
                        <thead className="users-table-head">
                            <tr>
                                <th id='users-table-heading'>Select</th>
                                <th id='users-table-heading'>First Name</th>
                                <th id='users-table-heading'>Last Name</th>
                                <th id='users-table-heading' >Email</th>
                                <th id='users-table-heading'>Phone</th>
                                <th id='users-table-heading'>VIN</th>
                                <th id='users-table-heading' style={{width: "10%"}}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.filter((item) => {
                                return (
                                    query.toLowerCase() === '' ||
                                    item.firstName.toLowerCase().includes(query) || item.lastName.toLowerCase().includes(query) || item.email.toLowerCase().includes(query) || item.vin.toLowerCase().includes(query) || ((item.phoneNo).toString()).toLowerCase().includes(query)
                                );
                            }).map((user, index) =>
                                <tr key={index}>
                                    <td>
                                        <Checkbox {...label}
                                            size="small" onChange={() => {
                                                if (set.has(user.iuId)) {
                                                    set.delete(user.iuId);
                                                    if (set.size === 0) {
                                                        document.getElementById('delete-multiple').style.display = "none";
                                                    }
                                                }
                                                else {
                                                    document.getElementById('delete-multiple').style.display = "flex"; set.add(user.iuId);
 
                                                }
                                                console.log(set);
                                            }} />
                                    </td>
                                    <td>{user.firstName}</td>
                                    <td>{user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phoneNo}</td>
                                    <td>{user.vin}</td>
                                    <td>
                                        <div style={{ display: "flex", columnGap: "3px" ,width:"100%"}}>
                                            <UpdateUserPopup iuId={user.iuId} />
                                            <DeleteConfirmation iuId={user.iuId} />
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
                <div>
                   
                </div>
            </div>
        </div>
 );
};