import * as React from 'react';
import {useEffect, useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {useNavigate} from "react-router-dom";

const theme = createTheme();

const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export default function Login() {
    const navigate = useNavigate();

    const [signUp, setSignUp] = useState(false);

    const [form, setForm] = useState({
        "login": {
            data: "",
            error: ""
        },
        "password": {
            data: "",
            error: ""
        },
        "username": {
            data: "",
            error: ""
        },
        "email": {
            data: "",
            error: ""
        },
    });

    useEffect(() => {
        if (localStorage.getItem("loggedInUser")) {
            navigate("/");
        }
    });

    const updateForm = (field, newData) => {
        setForm(prevForm => ({
            ...prevForm,
            [field]: {
                ...prevForm[field],
                ...newData,
            },
        }));
    };

    const resetFormErrors = () => {
        updateForm("login", {error: ""});
        updateForm("password", {error: ""});
        updateForm("username", {error: ""});
        updateForm("email", {error: ""});
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        resetFormErrors();
        let valid = true;
        if (signUp) {
            if (form.username.data === "") {
                updateForm("username", {error: "This field is required"});
                valid = false;
            } else if (form.username.data.length < 6) {
                updateForm("username", {error: "Username must be at least 6 characters"});
                valid = false;
            }
            if (form.password.data === "") {
                updateForm("password", {error: "This field is required"})
                valid = false;
            } else if (form.password.data.length < 8) {
                updateForm("password", {error: "Password must be at least 8 characters"});
                valid = false;
            }
            if (form.email.data === "") {
                updateForm("email", {error: "This field is required"})
                valid = false;
            } else if (!validateEmail(form.email.data)) {
                updateForm("email", {error: "Invalid Email Address"});
                valid = false;
            }
            if (!valid) return;
            fetch('http://localhost:5000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: form.username.data,
                    email: form.email.data,
                    password: form.password.data,
                })
            }).then(async res => {
                if (res.status === 201) {
                    const user = (await res.json()).data.user;
                    if (!user) {
                        console.log("User not found");
                        return;
                    }
                    localStorage.setItem("loggedInUser", String(user.username));
                    navigate("/");
                    window.location.reload();
                } else if (res.status === 409) {
                    const message = (await res.json()).message;
                    if (message === "Username already in use") {
                        updateForm("username", {error: "Username already in use"});
                    } else if (message === "Email already in use") {
                        updateForm("email", {error: "Email already in use"});
                    } else {
                        console.log(res);
                    }
                } else {
                    console.log(res);
                }
            }).then(data => {
                console.log(data)
            }).catch(
                err => {
                    console.log(err);
                }
            )
        } else {
            if (form.login.data === "") {
                updateForm("login", {error: "This field is required"});
                valid = false;
            } else if (form.login.data.length < 6 && form.login.data !== "admin") {
                updateForm("login", {error: "Username or Email Address must be at least 6 characters"});
                valid = false;
            }
            if (form.password.data === "") {
                updateForm("password", {error: "This field is required"})
                valid = false;
            } else if (form.password.data.length < 8) {
                updateForm("password", {error: "Password must be at least 8 characters"});
                valid = false;
            }
            if (!valid) return;
            fetch('http://localhost:5000/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    login: form.login.data,
                    password: form.password.data
                })
            }).then(async res => {
                if (res.status === 200) {
                    const user = (await res.json()).data.user;
                    if (!user) {
                        console.log("User not found");
                        return;
                    }
                    localStorage.setItem("loggedInUser", String(user.username));
                    navigate("/");
                    window.location.reload();
                } else if (res.status === 401) {
                    updateForm("password", {error: "Incorrect Password"});
                } else if (res.status === 404) {
                    updateForm("login", {error: "User not found"});
                } else {
                    console.log(res);
                }
            }).catch(
                err => {
                    console.log(err);
                }
            )
        }
    };

    return (
        <div>
            {!signUp ? (<ThemeProvider theme={theme}>
                    <Container component="main" maxWidth="xs">
                        <CssBaseline/>
                        <Box
                            sx={{
                                marginTop: 8,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                                <LockOutlinedIcon/>
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Sign in
                            </Typography>
                            <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="login"
                                    label="Username or Email Address"
                                    name="login"
                                    autoComplete="current-login"
                                    autoFocus
                                    value={form.login.data}
                                    onChange={event => setForm({
                                        ...form,
                                        login: {...form.login, data: event.target.value}
                                    })}
                                    error={form.login.error !== ""}
                                    helperText={form.login.error}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    value={form.password.data}
                                    onChange={event => setForm({
                                        ...form,
                                        password: {...form.password, data: event.target.value}
                                    })}
                                    error={form.password.error !== ""}
                                    helperText={form.password.error}
                                />
                                <FormControlLabel
                                    control={<Checkbox value="remember" color="primary"/>}
                                    label="Remember me"
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{mt: 3, mb: 2}}
                                >
                                    Sign In
                                </Button>
                                <Grid container>
                                    <Grid
                                        item
                                        onClick={() => {
                                            setSignUp(true);
                                            resetFormErrors();
                                        }}>
                                        <Link href="#" variant="body2">
                                            {"Don't have an account? Sign Up"}
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Container>
                </ThemeProvider>) :
                (<ThemeProvider theme={theme}>
                    <Container component="main" maxWidth="xs">
                        <CssBaseline/>
                        <Box
                            sx={{
                                marginTop: 8,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                                <LockOutlinedIcon/>
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Sign up
                            </Typography>
                            <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            autoComplete="user-name"
                                            name="username"
                                            required
                                            fullWidth
                                            id="username"
                                            label="Username"
                                            autoFocus
                                            value={form.username.data}
                                            onChange={event => setForm({
                                                ...form,
                                                username: {...form.username, data: event.target.value}
                                            })}
                                            error={form.username.error !== ""}
                                            helperText={form.username.error}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="email"
                                            label="Email Address"
                                            name="email"
                                            autoComplete="email"
                                            value={form.email.data}
                                            onChange={event => setForm({
                                                ...form,
                                                email: {...form.email, data: event.target.value}
                                            })}
                                            error={form.email.error !== ""}
                                            helperText={form.email.error}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="password"
                                            label="Password"
                                            type="password"
                                            id="password"
                                            autoComplete="new-password"
                                            value={form.password.data}
                                            onChange={event => setForm({
                                                ...form,
                                                password: {...form.password, data: event.target.value}
                                            })}
                                            error={form.password.error !== ""}
                                            helperText={form.password.error}
                                        />
                                    </Grid>
                                </Grid>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{mt: 3, mb: 2}}
                                >
                                    Sign Up
                                </Button>
                                <Grid container justifyContent="flex-end">
                                    <Grid
                                        item
                                        onClick={() => {
                                            setSignUp(false);
                                            resetFormErrors();
                                        }}>
                                        <Link href="#" variant="body2">
                                            Already have an account? Sign in
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Container>
                </ThemeProvider>)}
        </div>
    )
}
