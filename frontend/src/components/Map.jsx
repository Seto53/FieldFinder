import React, {useEffect, useState} from 'react';
import {GoogleMap, MarkerF, OverlayView, useJsApiLoader} from '@react-google-maps/api';
import '../styles/map.css'
import football from '../assets/sports/football.png';
import basketball from '../assets/sports/basketball.png';
import tennis from '../assets/sports/tennis.png';
import volleyball from '../assets/sports/volleyball.png';
import baseball from '../assets/sports/baseball.png';
import hockey from '../assets/sports/hockey.png';
import rugby from '../assets/sports/rugby.png';
import golf from '../assets/sports/golf.png';
import boxing from '../assets/sports/boxing.png';
import Reservation from "./Reservation";
import {useNavigate} from "react-router-dom";
import {Card, CardContent, Grow, Typography} from "@mui/material";
import Rating from "@mui/material/Rating";
import calculateAverageRating from "../utils/ituls";

const getIcon = (sportType) => {
    switch (sportType) {
        case 'Football':
            return markerStyle(football);
        case 'Basketball':
            return markerStyle(basketball);
        case 'Tennis':
            return markerStyle(tennis);
        case 'Volleyball':
            return markerStyle(volleyball);
        case 'Baseball':
            return markerStyle(baseball);
        case 'Hockey':
            return markerStyle(hockey);
        case 'Rugby':
            return markerStyle(rugby);
        case 'Golf':
            return markerStyle(golf);
        case 'Boxing':
            return markerStyle(boxing);
        default:
            return markerStyle(football);
    }
}

const markerStyle = (sportType) => {
    return new window.google.maps.MarkerImage(sportType, null, // size is specified separately below
        null, // origin and anchor are not needed for MarkerImage
        null, // scaledSize is not needed for MarkerImage
        new window.google.maps.Size(45, 45));
}
const containerStyle = {
    width: '100%', height: '100%'
};

const getPixelPositionOffset = (width, height) => ({
    x: -(width / 2),
    y: -(height + 10),
});

function Map({user, courts, refreshData, selectedSport}) {
    const [map, setMap] = useState(null);
    const [currentLocation, setCurrentLocation] = useState({lat: 45.425256, lng: -75.699871});
    const [zoom, setZoom] = useState(13);
    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script', googleMapsApiKey: '',
    });
    const [openedCourt, setOpenedCourt] = useState();
    const [openedInfoWindow, setOpenedInfoWindow] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("loggedInUser") === "admin") {
            navigate("/admin");
            return;
        }
        navigator?.geolocation.getCurrentPosition(({coords: {latitude: lat, longitude: lng}}) => {
            setCurrentLocation(prevState => ({...prevState, lat, lng}));
            setZoom(18);
        });
    }, [navigate]);

    const openInfoWindow = (courtID) => {
        setOpenedInfoWindow(courtID);
    };

    const closeInfoWindow = () => {
        setOpenedInfoWindow(null);
    };

    const onLoad = (newMap) => {
        setMap(newMap);
    }

    const onZoomChanged = () => {
        if (map !== null) {
            setZoom(map.getZoom());
        }
    }

    const openReservation = (courtID) => {
        refreshData();
        setOpenedCourt(courts.find(court => court.courtID === courtID));
    }

    return (
        <div data-testid="map" className={'map'}>
            {isLoaded && (
                <GoogleMap
                    center={currentLocation}
                    mapContainerStyle={containerStyle}
                    zoom={zoom}
                    onLoad={(map) => {
                        onLoad(map);
                    }}
                    onZoomChanged={onZoomChanged}
                >
                    {courts && courts.map((court) => {
                        if (selectedSport === '' || court.sportType === selectedSport) {
                            return (
                                <MarkerF
                                    key={court.courtID}
                                    position={{lat: court.location.lat, lng: court.location.lng}}
                                    icon={getIcon(court.sportType)}
                                    onClick={() => {
                                        openReservation(court.courtID);
                                    }}
                                    onMouseOver={() => {
                                        openInfoWindow(court.courtID);
                                    }}
                                    onMouseOut={closeInfoWindow}>
                                    {openedInfoWindow === court.courtID && (
                                        <OverlayView
                                            position={{lat: court.location.lat, lng: court.location.lng}}
                                            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                                            getPixelPositionOffset={getPixelPositionOffset}
                                        >
                                            <Grow in={openedInfoWindow !== null}>
                                                <Card>
                                                    <CardContent>
                                                        <Typography variant="h6">{court.name}</Typography>
                                                        <Typography
                                                            variant="body2">Sport: {court.sportType}</Typography>
                                                        <Typography sx={{mt: 1}}>
                                                            <Rating
                                                                value={calculateAverageRating(court.reviews)}
                                                                precision={0.1}
                                                                readOnly
                                                            />
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grow>
                                        </OverlayView>
                                    )}
                                </MarkerF>
                            );
                        }
                        return null;
                    })}
                </GoogleMap>
            )}
            {openedCourt && (
                <Reservation
                    key={openedCourt.courtID}
                    court={openedCourt}
                    setOpenedCourt={setOpenedCourt}
                    refreshData={refreshData}
                    user={user}
                />
            )}
        </div>
    );
}

export default Map;
