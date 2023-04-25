import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SearchIcon from '@mui/icons-material/Search';
import {useState} from "react";
import {alpha, InputBase, styled} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import SearchBar from "./SearchBar";
import Reservation from "./Reservation";

const sportType = ['Football', 'Basketball', 'Baseball', 'Tennis'];
const settings = ['Account', 'Logout'];

const Search = styled('div')(({theme}) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({theme}) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

function ResponsiveAppBar({ onSportChange, setSearchedCourtId, courts, refreshData, user }) {
    const navigate = useNavigate();
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [loggedInUser, setLoggedInUser] = useState(String(localStorage.getItem("loggedInUser")));
    const [selectedSport, setSelectedSport] = useState('Football');
    const [selectedCourt, setSelectedCourt] = useState(null);

    // Add a function to get the corresponding icon for the selected sport
    const getSportIcon = () => {
        switch (selectedSport) {
            case 'Football':
                return <SportsSoccerIcon/>;
            case 'Basketball':
                return <SportsBasketballIcon/>;
            case 'Baseball':
                return <SportsBaseballIcon/>;
            case 'Tennis':
                return <SportsTennisIcon/>;
            default:
                return null;
        }
    };

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = (sport) => {
        setAnchorElNav(null);
        // Update the selected sport when closing the menu
        if (sport) {
            setSelectedSport(sport);
            onSportChange(sport); // Add this line
        }
    };

    const handleCloseUserMenu = (setting) => {
        setAnchorElUser(null);
        switch (setting) {
            case 'Account':
                navigate("/account");
                break;
            case 'Logout':
                localStorage.setItem("loggedInUser", "")
                setLoggedInUser(null);
                navigate("/");
                window.location.reload();
                break;
            default:
                break;
        }
    };

    function handleSearchSubmit(searchText) {
        const foundCourt = courts.find(
            (court) => court.name.toLowerCase() === searchText.toLowerCase()
        );

        console.log("Search text:", searchText);
        console.log("Found court:", foundCourt);

        if (foundCourt) {
            setSearchedCourtId(foundCourt.courtID);
            setSelectedCourt(foundCourt);
        } else {
            alert("Court not found");
        }
    }

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {getSportIcon()}
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: {xs: 'none', md: 'flex'},
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        FieldFinder
                    </Typography>

                    <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: {xs: 'block', md: 'none'},
                            }}
                        >
                            {sportType.map((type) => (
                                <MenuItem key={type} onClick={() => handleCloseNavMenu(type)}>
                                    <Typography textAlign="center">{type}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: {xs: 'flex', md: 'none'},
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        FieldFinder
                    </Typography>
                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                        {sportType.map((type) => (
                            <Button
                                key={type}
                                onClick={() => handleCloseNavMenu(type)}
                                sx={{my: 2, color: 'white', display: 'block'}}
                            >
                                {type}
                            </Button>
                        ))}
                    </Box>

                    {/*<Search>*/}
                    {/*    <SearchIconWrapper>*/}
                    {/*        <SearchIcon/>*/}
                    {/*    </SearchIconWrapper>*/}
                    {/*    <StyledInputBase*/}
                    {/*        placeholder="Search…"*/}
                    {/*        inputProps={{'aria-label': 'search'}}*/}
                    {/*    />*/}
                    {/*</Search>*/}

                    <SearchBar onSubmit={handleSearchSubmit} />
                    {loggedInUser !== "" ? (
                        <Box sx={{flexGrow: 0}}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                    <Avatar alt={loggedInUser}/>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{mt: '45px'}}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((
                                    setting) => (
                                    <MenuItem key={setting} onClick={() => handleCloseUserMenu(setting)}>
                                        <Typography textAlign="center">{setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    ) : (
                        <Button
                            variant="outlined"
                            component={Link}
                            to="/login"
                            sx={{
                                ml: 2,
                                borderColor: 'white',
                                color: 'white',
                                textTransform: 'none',
                            }}
                        >
                            Log In
                        </Button>
                    )}
                    {selectedCourt && (
                        <Reservation
                            key={selectedCourt.courtID}
                            court={selectedCourt}
                            setOpenedCourt={setSelectedCourt}
                            refreshData={refreshData}
                            user={user}
                        />
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default ResponsiveAppBar;
