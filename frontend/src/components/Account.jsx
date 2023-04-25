import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
    Box,
    Button,
    Container,
    FormControl,
    Grid,
    InputLabel,
    ListItem,
    ListItemText,
    OutlinedInput,
    Paper,
    Typography,
} from '@mui/material';
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const Account = ({user}) => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [alert, setAlert] = useState({open: false, message: "", severity: "error"});
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("loggedInUser")) {
            navigate("/login");
        }
        if (localStorage.getItem("loggedInUser") === "admin") {
            navigate("/admin");
        }
    }, [navigate]);

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (newPassword.length < 8 || confirmPassword.length < 8 || oldPassword.length < 8) {
            setPasswordError("Password must be at least 8 characters long");
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }
        setPasswordError("");
        const loggedInUser = localStorage.getItem("loggedInUser");
        fetch(`http://localhost:5000/users/${loggedInUser}/password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                oldPassword: oldPassword,
                newPassword: newPassword,
            }),
        }).then(async (res) => {
                const message = (await res.json()).message;
                if (res.status === 200) {
                    setAlert({open: true, message: message, severity: "success"});
                    setOldPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setPasswordError("");
                } else {
                    setAlert({open: true, message: message, severity: "error"});
                }
            }
        ).catch((err) => {
            console.log(err);
        });
    };

    const displayReservation = (reservation) => {
        const {court, spot} = reservation.data;

        return (
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography component="div">Court Name: {court.name}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography component="div">Address: {court.address}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography component="div">Spot Time: {spot.start} - {spot.end}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography component="div">Capacity: {spot.capacity}</Typography>
                </Grid>
            </Grid>
        );
    }

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlert({open: false, message: "", severity: alert.severity});
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{marginTop: 4}}>
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
                <Typography variant="h4" align="center">
                    Account
                </Typography>
                {user ? (
                    <Paper sx={{padding: 3, marginTop: 4}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography>Username: {user.username}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography>Email: {user.email}</Typography>
                            </Grid>
                        </Grid>
                        <Box component="form" onSubmit={handlePasswordChange} sx={{marginTop: 4}}>
                            <FormControl fullWidth variant="outlined" sx={{marginBottom: 2}}>
                                <InputLabel htmlFor="old-password">Old Password</InputLabel>
                                <OutlinedInput
                                    id="old-password"
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    label="Old Password"
                                />
                            </FormControl>
                            <FormControl fullWidth variant="outlined" sx={{marginBottom: 2}}>
                                <InputLabel htmlFor="new-password">New Password</InputLabel>
                                <OutlinedInput
                                    id="new-password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    label="New Password"
                                />
                            </FormControl>
                            <FormControl fullWidth variant="outlined" sx={{marginBottom: 2}}>
                                <InputLabel htmlFor="confirm-password">Confirm Password</InputLabel>
                                <OutlinedInput
                                    id="confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    label="Confirm Password"
                                />
                            </FormControl>
                            {passwordError && (
                                <Typography color="error" align="center">
                                    {passwordError}
                                </Typography>
                            )}
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                Change password
                            </Button>
                        </Box>

                        {user.reservation && user.reservation.hasReserved && (
                            <Paper sx={{padding: 3, marginTop: 4}}>
                                <Typography variant="h6" align="center">
                                    Reservation
                                </Typography>
                                {displayReservation(user.reservation)}
                            </Paper>
                        )}

                        {user.pastReservations && (
                            <Paper sx={{padding: 3, marginTop: 4}}>
                                <Typography variant="h6" align="center">
                                    Past reservations
                                </Typography>
                                {user.pastReservations.map((reservation) => (
                                    <ListItem
                                        key={String(reservation.data.court.name) + "-" + String(reservation.data.spot.spotID)}>
                                        <ListItemText
                                            secondary={displayReservation(reservation)}
                                        />
                                    </ListItem>
                                ))}
                            </Paper>
                        )}

                    </Paper>
                ) : (
                    <Typography align="center" sx={{marginTop: 4}}>
                        Loading data...
                    </Typography>
                )}
            </Box>
        </Container>
    );
};

export default Account;
