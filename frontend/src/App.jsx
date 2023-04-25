import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import Account from "./components/Account";
import {useCallback, useEffect, useState} from "react";
import Admin from "./components/Admin";

function App() {
    const [selectedSport, setSelectedSport] = useState('');
    const [user, setUser] = useState({});
    const [courts, setCourts] = useState([]);
    const [searchedCourtId, setSearchedCourtId] = useState(null);

    const refreshData = useCallback(() => {
        updateCourts();
        updateUser();
    }, []);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const updateCourts = () => {
        fetch('http://localhost:5000/courts')
            .then(res => res.json())
            .then(data => {
                setCourts(data.data.courts);
            }).catch(
            err => {
                console.log(err);
            }
        )
    }

    const updateUser = () => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            fetch(`http://localhost:5000/users/${loggedInUser}`)
                .then(res => res.json())
                .then(data => {
                    setUser(data.data.user);
                }).catch(
                err => {
                    console.log(err);
                }
            )
        }
    }

    return (
        <BrowserRouter>
            <ResponsiveAppBar onSportChange={setSelectedSport} setSearchedCourtId={setSearchedCourtId} courts={courts}
                              refreshData={refreshData}
                              user={user}/>
            <Routes>
                <Route path="/" element={<Home selectedSport={selectedSport} user={user} courts={courts}
                                               refreshData={refreshData}/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/account" element={<Account user={user}/>}/>
                <Route path="/admin" element={<Admin/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;

