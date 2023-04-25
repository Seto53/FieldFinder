import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Container,
    Grid,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    TextField,
    Typography,
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

// Predefined sport types
const sportTypes = [
    "Football",
    "Basketball",
    "Tennis",
    "Volleyball",
    "Baseball",
    "Ice Hockey",
    "Rugby",
    "Golf",
    "Boxing",
];


const usersHeaderMapping = {
    ID: "userID",
    Username: "username",
    Email: "email",
    Password: "password",
    "Has Reserved": "reservation.hasReserved",
};

const courtsHeaderMapping = {
    ID: "courtID",
    "Court Name": "name",
    Address: "address",
    Description: "description",
    "Sport Type": "sportType",
    Reviews: "reviews",
};


const Admin = () => {
    const navigate = useNavigate();

    const [usersData, setUsersData] = useState([]);
    const [courtsData, setCourtsData] = useState([]);
    const [usersChanged, setUsersChanged] = useState(false);
    const [courtsChanged, setCourtsChanged] = useState(false);
    const [usersSort, setUsersSort] = useState({column: null, direction: "asc"});
    const [courtsSort, setCourtsSort] = useState({column: null, direction: "asc"});
    const [alert, setAlert] = useState({open: false, message: "", severity: "error"});

    useEffect(() => {
        if (localStorage.getItem("loggedInUser") !== "admin") {
            navigate("/account");
        }
        // Fetch users data
        fetch("http://localhost:5000/admin/users", {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer adminToken",
                "Content-Type": "application/json",
            }),
        })
            .then((res) => res.json())
            .then((response) => {
                // remove the admin user from the users table
                response.data.users = response.data.users.filter(
                    (user) => user.username !== "admin"
                );
                setUsersData(response.data.users);
            })
            .catch((err) => {
                console.log(err);
            });
        // Fetch courts data
        fetch("http://localhost:5000/admin/courts", {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer adminToken",
                "Content-Type": "application/json",
            }),
        })
            .then((res) => res.json())
            .then((response) => {
                setCourtsData(response.data.courts);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [navigate]);

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlert({open: false, message: "", severity: alert.severity});
    };


    const handleInputChange = (e, index, data, setData, setChanged) => {
        setChanged(true);
        const {name, value} = e.target;
        const newData = [...data];
        if (name === 'reservation.hasReserved') {
            newData[index]['reservation']['hasReserved'] = value === 'true';
        } else {
            newData[index][name] = value;
        }
        setData(newData);
    };


    const handleUpdateUsers = () => {
        const updatedUsers = usersData.map((user) => {
            return {
                userID: user.userID,
                username: user.username,
                email: user.email,
                password: user.password,
                reservation: {
                    hasReserved: user.reservation.hasReserved,
                },
            };
        });
        console.log("Updated users data:", updatedUsers);
        fetch("http://localhost:5000/admin/users", {
            method: "PUT",
            headers: new Headers({
                Authorization: "Bearer adminToken",
                "Content-Type": "application/json",
            }),
            body: JSON.stringify({users: updatedUsers}),
        }).then(async (res) => {
            if (res.status === 200) {
                setUsersChanged(false);
                setAlert({open: true, message: "Users updated successfully", severity: "success"})
            } else {
                const data = await res.json();
                console.log(data);
                setAlert({open: true, message: data.message, severity: "error"})
            }
        });
    };

    const handleUpdateCourts = () => {
        const updatedCourts = courtsData.map((court) => {
            return {
                courtID: court.courtID,
                name: court.name,
                address: court.address,
                description: court.description,
                sportType: court.sportType,
            };
        });
        console.log("Updated courts data:", updatedCourts);
        fetch("http://localhost:5000/admin/courts", {
            method: "PUT",
            headers: new Headers({
                Authorization: "Bearer adminToken",
                "Content-Type": "application/json",
            }),
            body: JSON.stringify({courts: updatedCourts}),
        }).then(async (res) => {
            if (res.status === 200) {
                setCourtsChanged(false);
                setAlert({open: true, message: "Courts updated successfully", severity: "success"})
            } else {
                const data = await res.json();
                console.log(data);
                setAlert({open: true, message: data.message, severity: "error"})
            }
        });
    };

    const handleUsersSort = (header) => {
        const column = usersHeaderMapping[header];
        const isAsc = usersSort.column === column && usersSort.direction === "asc";
        const direction = isAsc ? "desc" : "asc";
        setUsersSort({column, direction});
        const sortedData = [...usersData].sort((a, b) => {
            if (a[column] < b[column]) {
                return direction === "asc" ? -1 : 1;
            }
            if (a[column] > b[column]) {
                return direction === "asc" ? 1 : -1;
            }
            return 0;
        });
        setUsersData(sortedData);
    };

    const handleCourtsSort = (header) => {
        const column = courtsHeaderMapping[header];
        const isAsc = courtsSort.column === column && courtsSort.direction === "asc";
        const direction = isAsc ? "desc" : "asc";
        setCourtsSort({column, direction});
        const sortedData = [...courtsData].sort((a, b) => {
            if (a[column] < b[column]) {
                return direction === "asc" ? -1 : 1;
            }
            if (a[column] > b[column]) {
                return direction === "asc" ? 1 : -1;
            }
            return 0;
        });
        setCourtsData(sortedData);
    };

    const handleResetReservations = () => {
        fetch("http://localhost:5000/admin/reservations", {
            method: "PUT",
            headers: new Headers({
                Authorization: "Bearer adminToken",
                "Content-Type": "application/json",
            }),
        }).then(async (res) => {
            if (res.status === 200) {
                setAlert({open: true, message: "Reservations reset successfully", severity: "success"})
            } else {
                const data = await res.json();
                console.log(data);
                setAlert({open: true, message: "Error", severity: "error"})
            }
        });
    }

    return (
        <Container maxWidth="xl">
            <Box sx={{marginTop: 4}}>
                <Typography variant="h4" align="center">
                    Admin Dashboard
                </Typography>
                <Grid container spacing={4} sx={{marginTop: 4}}>
                    <Grid item xs={12} lg={6}>
                        <Typography variant="h5" align="center">
                            Users
                        </Typography>
                        <Box sx={{width: '100%', minWidth: '300px', margin: '0 auto'}}>
                            <TableContainer component={Paper}>
                                <Table sx={{tableLayout: "auto", minWidth: "100%"}}>
                                    <TableHead>
                                        <TableRow>
                                            {["ID", "Username", "Email", "Password", "Has Reserved"].map((header) => (
                                                <TableCell key={header}>
                                                    <TableSortLabel
                                                        active={usersSort.column === usersHeaderMapping[header]}
                                                        direction={usersSort.direction}
                                                        onClick={() => handleUsersSort(header)}
                                                    >
                                                        {header}
                                                    </TableSortLabel>
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {usersData.map((row, index) => (
                                            <TableRow key={row.username}>
                                                <TableCell>{row.userID}</TableCell>
                                                <TableCell>
                                                    <TextField
                                                        fullWidth
                                                        name="username"
                                                        value={row.username}
                                                        onChange={(e) => handleInputChange(e, index, usersData, setUsersData, setUsersChanged)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        fullWidth
                                                        name="email"
                                                        value={row.email}
                                                        onChange={(e) => handleInputChange(e, index, usersData, setUsersData, setUsersChanged)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        fullWidth
                                                        name="password"
                                                        value={row.password}
                                                        onChange={(e) => handleInputChange(e, index, usersData, setUsersData, setUsersChanged)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Select
                                                        fullWidth
                                                        value={row.reservation.hasReserved.toString()}
                                                        onChange={(e) => handleInputChange(e, index, usersData, setUsersData, setUsersChanged)}
                                                        name="reservation.hasReserved"
                                                    >
                                                        <MenuItem value="true">True</MenuItem>
                                                        <MenuItem value="false">False</MenuItem>
                                                    </Select>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Box sx={{display: 'flex', justifyContent: 'center', marginTop: 2}}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleUpdateUsers}
                                    disabled={!usersChanged}
                                >
                                    Update Users
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Typography variant="h5" align="center">
                            Courts
                        </Typography>
                        <Box sx={{width: "100%", minWidth: "300px", margin: "0 auto"}}>
                            <TableContainer component={Paper}>
                                <Table sx={{tableLayout: "auto", minWidth: "100%"}}>
                                    <TableHead>
                                        <TableRow>
                                            {["ID", "Court Name", "Address", "Description", "Sport Type"].map((header) => (
                                                <TableCell key={header}>
                                                    <TableSortLabel
                                                        active={courtsSort.column === courtsHeaderMapping[header]}
                                                        direction={courtsSort.direction}
                                                        onClick={() => handleCourtsSort(header)}
                                                    >
                                                        {header}
                                                    </TableSortLabel>
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {courtsData.map((row, index) => (
                                            <TableRow key={row.courtID}>
                                                <TableCell>{row.courtID}</TableCell>
                                                <TableCell>
                                                    <TextField
                                                        fullWidth
                                                        name="name"
                                                        value={row.name}
                                                        onChange={(e) => handleInputChange(e, index, courtsData, setCourtsData, setCourtsChanged)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        fullWidth
                                                        name="address"
                                                        value={row.address}
                                                        onChange={(e) => handleInputChange(e, index, courtsData, setCourtsData, setCourtsChanged)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        fullWidth
                                                        name="description"
                                                        value={row.description}
                                                        onChange={(e) => handleInputChange(e, index, courtsData, setCourtsData, setCourtsChanged)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Select
                                                        fullWidth
                                                        value={row.sportType}
                                                        onChange={(e) => handleInputChange(e, index, courtsData, setCourtsData, setCourtsChanged)}
                                                        name="sportType"
                                                    >
                                                        {sportTypes.map((sport) => (
                                                            <MenuItem key={sport} value={sport}>
                                                                {sport}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Box sx={{display: 'flex', justifyContent: 'center', marginTop: 2}}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleUpdateCourts}
                                    disabled={!courtsChanged}
                                >
                                    Update Courts
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Snackbar
                open={alert.open}
                autoHideDuration={6000}
                onClose={handleCloseAlert}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                sx={{top: '50px', maxWidth: '80%'}}
            >
                <Alert
                    onClose={() => handleCloseAlert()}
                    severity={alert.severity}
                    sx={{width: '100%', fontSize: '1.2rem'}}
                >
                    {alert.message}
                </Alert>
            </Snackbar>
            <Box sx={{display: 'flex', justifyContent: 'center', marginTop: 2}}>
                <Button variant="contained" onClick={handleResetReservations}>RESET RESERVATIONS</Button>
            </Box>
            <Box sx={{marginTop: 4, marginBottom: 4}}></Box>
        </Container>
    );
};

export default Admin;
