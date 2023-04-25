import React, {useState} from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from "@mui/material/IconButton";
import {Close} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Rating from '@mui/material/Rating';
import calculateAverageRating from "../utils/ituls";
import DoneIcon from '@mui/icons-material/Done';
import {Stack} from "@mui/material";

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    borderRadius: 4,
    boxShadow: 24,
    p: 4,
};

const isButtonDisabled = (spot, user) => {
    let disabled = false;
    if (spot) {
        disabled = spot.reservations >= spot.capacity;
    }
    if (localStorage.getItem('loggedInUser')) {
        disabled = disabled || user.reservation.hasReserved;
    }
    return disabled;
};

function Reservation({user, court, setOpenedCourt, refreshData}) {
    const navigate = useNavigate();
    const [alert, setAlert] = useState({open: false, message: "", severity: "error"});
    const [showDescriptions, setShowDescriptions] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [userRating, setUserRating] = useState();
    const [hasRated, setHasRated] = useState(false);

    const handleOpenRatingModal = () => {
        setShowRatingModal(true);
    };

    const handleCloseRatingModal = () => {
        setShowRatingModal(false);
    };

    const toggleDescriptions = () => {
        setShowDescriptions(!showDescriptions);
    };

    const closeReservation = () => {
        setOpenedCourt();
    };

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlert({open: false, message: "", severity: alert.severity});
    };

    const handleRatingSubmit = async () => {
        const apiUrl = 'http://localhost:5000/review';
        const loggedInUser = localStorage.getItem('loggedInUser');
        try {
            await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    courtID: court.courtID,
                    review: {
                        username: loggedInUser,
                        rating: parseInt(userRating),
                    },
                }),
            });
        } catch (error) {
            console.error(error);
        }
        refreshData();
        handleCloseRatingModal();
        setHasRated(true);
        setAlert({open: true, message: "Rating submitted!", severity: "success"});
    };

    const handleReserveSpot = (spotID) => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            if (!court.courtID || !spotID) {
                console.log("Error: courtID or spotID is undefined")
            }
            fetch(`http://localhost:5000/reserve`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: loggedInUser,
                    courtID: court.courtID,
                    spotID: spotID,
                }),
            }).then(async (res) => {
                refreshData();
                const message = (await res.json()).message;
                if (res.status === 200) {
                    refreshData();
                    const newCourt = {...court};
                    newCourt.spots = newCourt.spots.map(spot => {
                        if (spot.spotID === spotID) {
                            spot.reservations++;
                        }
                        return spot;
                    });
                    setOpenedCourt(newCourt);
                    setAlert({open: true, message: "Reservation successful!", severity: "success"});
                } else {
                    setAlert({open: true, message: message, severity: "erro"});
                    console.log(message);
                }
            })
        } else {
            navigate("/login");
        }
    };

    const renderRow = (spot) => {
        const isReservedByUser = user?.reservation?.data.spot.spotID === spot.spotID &&
            user?.reservation?.data.court.courtID === court.courtID && user?.reservation?.hasReserved;
        for (let i = 0; i < court.reviews.length; i++) {
            if (court.reviews[i].username === user.username) {
                if (!hasRated) {
                    setHasRated(true);
                }
                break;
            }
        }
        return (
            <ListItem key={spot.spotID} alignItems="flex-start" sx={{py: 1}}>
                <ListItemText
                    primary={`Spot ${spot.spotID}`}
                    secondary={
                        <>
                            <Typography component="span" variant="body2" color="text.primary">
                                {spot.start} - {spot.end}
                            </Typography>
                            {` — ${spot.reservations} / ${spot.capacity} reservations`}
                        </>
                    }
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleReserveSpot(spot.spotID)}
                    disabled={isButtonDisabled(spot, user)}
                    sx={{ml: 2}}>
                    {spot.reservations >= spot.capacity ? "Full" : "Reserve"}
                </Button>
                {isReservedByUser && (
                    <>
                        <DoneIcon color="primary" sx={{ml: 2}}/>
                        <Typography sx={{ml: 1}}>Reserved by you</Typography>
                        <Button
                            disabled={hasRated}
                            variant="outlined"
                            color="primary"
                            onClick={handleOpenRatingModal}
                            sx={{ml: 2}}
                        >
                            Rate
                        </Button>
                    </>
                )}
            </ListItem>
        );
    };

    const RatingModal = () => (
        <Modal
            open={showRatingModal}
            onClose={() => handleCloseRatingModal()}
            aria-labelledby="rating-modal-title"
            aria-describedby="rating-modal-description"
        >
            <Box sx={{...modalStyle, width: 300}}>
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={() => handleCloseRatingModal()}
                    aria-label="close"
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <Close/>
                </IconButton>
                <Typography id="rating-modal-title" variant="h6" component="h2">
                    Rate this court
                </Typography>
                <Typography id="rating-modal-description" sx={{mt: 2}}>
                    Please provide your rating for this court.
                </Typography>
                <Stack direction="column" alignItems="center" spacing={2}>
                    <Rating
                        name="court-rating"
                        value={userRating}
                        onChange={(event, newValue) => {
                            setUserRating(newValue);
                        }}
                        precision={1}
                    />
                    <Button
                        disabled={!userRating}
                        variant="contained"
                        color="primary"
                        onClick={handleRatingSubmit}
                    >
                        Submit
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );

    return (
        <>
            <Modal
                open={true}
                onClose={() => closeReservation()}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={() => closeReservation()}
                        aria-label="close"
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <Close/>
                    </IconButton>

                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {court.name}
                    </Typography>
                    <Typography id="modal-modal-address" variant="subtitle1" component="h2">
                        {court.address}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{mt: 2}}>
                        {showDescriptions ? (
                            <>
                                {court.description + " "}
                                <a href="#" onClick={toggleDescriptions}
                                   style={{color: "grey", textDecoration: "none"}}>
                                    Hide description
                                </a>
                            </>
                        ) : (
                            <>
                                {court.description.slice(0, 100) + "..."}
                                {(court.description.length > 100) ?
                                    <a href="#" onClick={toggleDescriptions}
                                       style={{color: "grey", textDecoration: "none"}}>
                                        show more
                                    </a> : ""
                                }
                            </>
                        )}

                    </Typography>
                    <Typography sx={{mt: 1}}>
                        <Rating
                            value={calculateAverageRating(court.reviews)}
                            precision={0.1}
                            readOnly
                        />
                    </Typography>
                    <Typography sx={{mt: 2, fontWeight: 500}}>Available Spots:</Typography>
                    <Divider sx={{my: 2}}/>
                    <List sx={{width: '100%', bgcolor: 'background.paper'}}>
                        {court.spots.map((spot) => renderRow(spot))}
                    </List>
                </Box>
            </Modal>
            <RatingModal/>
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
        </>
    );
}

export default Reservation;
