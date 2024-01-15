import {getAuth,onAuthStateChanged} from 'firebase/auth';
import {useState,useEffect} from 'react';
const useAuth =()=>{

    const auth = getAuth();
    const user = auth.currentUser;
    const isLoggedIn= user!==null;
    const[isLoggedin,setIsLoggedIn] = useState(false);

    useEffect(()=>{
        const auth = getAuth();
        onAuthStateChanged(auth,(user)=>{
            setIsLoggedIn(user!==null);
        })
    },[]);
    return isLoggedIn
}