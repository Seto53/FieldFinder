const {db} = require("./config/firebase");
const {doc, getDoc, setDoc, Timestamp, collection, where, query, getDocs, updateDoc} = require("firebase/firestore")

const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

const validateInput = (username, password, email) => {
    if (username.length < 6 || username.length > 20) {
        return {message: 'Username must be between 6 and 20 characters'};
    }
    if (password.length < 8 || password.length > 30) {
        return {message: 'Password must be between 8 and 30 characters'};
    }
    if (!validateEmail(email)) {
        return {message: 'Invalid email'};
    }
    return {message: 'Valid'};
}

const getUsers = async (request, response) => {
    try {
        const usersRef = collection(db, "user");
        const querySnapshot = await getDocs(usersRef);
        const users = [];
        querySnapshot.forEach((doc) => {
            users.push(doc.data());
        });
        users.forEach((user) => {
            delete user.password;
        });
        users.forEach((user) => {
            delete user.createdAt;
        });
        users.forEach((user) => {
            delete user.updatedAt;
        });
        return response.status(200).json({message: 'Users found', data: {users: users}});
    } catch (error) {
        console.log(error)
        return response.status(500).json(error);
    }
}

const getUser = async (request, response) => {
    try {
        const username = request.params.username;
        if (!username) {
            return response.status(400).json({message: 'Missing username'});
        }
        const usersRef = collection(db, "user");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.size === 0) {
            return response.status(404).json({message: 'User not found'});
        }
        const user = querySnapshot.docs[0].data();
        delete user.password;
        delete user.createdAt;
        delete user.updatedAt;
        return response.status(200).json({message: 'User found', data: {user: user}});
    } catch (error) {
        console.log(error)
        return response.status(500).json(error);
    }
}

const createUser = async (request, response) => {
    try {
        if (!request.body) {
            return response.status(400).json({message: 'Missing fields'});
        }
        const email = request.body.email;
        const password = request.body.password;
        const username = request.body.username;
        if (!email || !password || !username) {
            return response.status(400).json({message: 'Missing fields'});
        }
        const message = validateInput(username, password, email)
        if (message.message !== "Valid") {
            return response.status(400).json(message);
        }

        const usersRef = collection(db, "user");
        let q = query(usersRef, where("username", "==", username));
        let querySnapshot = await getDocs(q);
        if (querySnapshot.size > 0) {
            return response.status(409).json({message: 'Username already in use'});
        }

        q = query(usersRef, where("email", "==", email));
        querySnapshot = await getDocs(q);
        if (querySnapshot.size > 0) {
            return response.status(409).json({message: 'Email already in use'});
        }

        const users = [];
        const querySnapshot2 = await getDocs(usersRef);
        querySnapshot2.forEach((doc) => {
            users.push(doc.data());
        });
        const userID = users.length + 1;
        const user = {
            userID: userID,
            email: email,
            password: password,
            username: username,
            reservation: {
                hasReserved: false,
                data: {
                    court: {courtID: null, name: null, address: null},
                    spot: {spotID: null, capacity: null, start: null, end: null}
                }
            },
            pastReservations: [],
            createdAt: Timestamp.fromDate(new Date()),
            updatedAt: Timestamp.fromDate(new Date())
        }
        const docRef = doc(db, "user", String(userID));
        await setDoc(docRef, user);
        return response.status(201).json({message: 'User created', data: {user: {username: user.username}}});
    } catch (error) {
        console.log(error)
        return response.status(500).json(error);
    }
}

const loginUser = async (request, response) => {
    try {
        if (!request.body) {
            return response.status(400).json({message: 'Missing fields'});
        }
        const login = request.body.login;
        const password = request.body.password;
        if (!login || !password) {
            return response.status(400).json({message: 'Missing fields'});
        }
        if (login.length < 6 && login !== 'admin') {
            return response.status(400).json({message: 'Invalid login'});
        }
        if (password.length < 8) {
            return response.status(400).json({message: 'Invalid password'});
        }
        if (validateEmail(login)) {
            const usersRef = collection(db, "user");
            const q = query(usersRef, where("email", "==", login));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.size === 0) {
                return response.status(404).json({message: 'Email does not exist'});
            }
            const user = querySnapshot.docs[0].data();
            if (user.password === password) {
                return response.status(200).json({
                    message: 'Login successful', data: {user: {username: user.username}}
                });
            } else {
                return response.status(401).json({message: 'Incorrect password'});
            }
        } else {
            const usersRef = collection(db, "user");
            const q = query(usersRef, where("username", "==", login));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.size === 0) {
                return response.status(404).json({message: 'User does not exist'});
            }
            const user = querySnapshot.docs[0].data();
            const docRef = doc(db, "user", String(user.userID));
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const user = docSnap.data();
                if (user.password === password) {
                    delete user.password;
                    delete user.createdAt;
                    delete user.updatedAt;
                    return response.status(200).json({message: 'Login successful', data: {user: user}});
                } else {
                    return response.status(401).json({message: 'Incorrect password'});
                }
            } else {
                return response.status(404).json({message: 'Username does not exist'});
            }
        }
    } catch (error) {
        console.log(error)
        return response.status(500).json(error);
    }
}

//Update user that changes only the password
const updateUserPassword = async (request, response) => {
    try {
        if (!request.body) {
            return response.status(400).json({message: 'Missing fields'});
        }
        const oldPassword = request.body.oldPassword;
        if (!oldPassword) {
            return response.status(400).json({message: 'Missing oldPassword'});
        }
        const newPassword = request.body.newPassword;
        if (!newPassword) {
            return response.status(400).json({message: 'Missing newPassword'});
        }
        if (newPassword.length < 8 || newPassword.length > 30) {
            return response.status(400).json({message: 'Invalid password'});
        }
        const username = request.params.username;
        if (!username) {
            return response.status(400).json({message: 'Missing username'});
        }
        if (username.length < 6) {
            return response.status(400).json({message: 'Invalid username'});
        }
        const usersRef = collection(db, "user");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.size === 0) {
            return response.status(404).json({message: 'User does not exist'});
        }
        const user = querySnapshot.docs[0].data();
        if (user.password !== oldPassword) {
            return response.status(401).json({message: 'Incorrect password'});
        }
        const docRef = doc(db, "user", String(user.userID));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const user = docSnap.data();
            if (user.password === oldPassword) {
                await updateDoc(docRef, {password: newPassword});
                await updateDoc(docRef, {updatedAt: Timestamp.fromDate(new Date())});
                return response.status(200).json({message: 'Password changed successfully'});
            } else {
                return response.status(401).json({message: 'Incorrect password'});
            }
        } else {
            return response.status(404).json({message: 'Username does not exist'});
        }
    } catch (error) {
        console.log(error)
        return response.status(500).json(error);
    }
}

const getCourts = async (request, response) => {
    try {
        const courtsRef = collection(db, "court");
        const querySnapshot = await getDocs(courtsRef);
        const courts = [];
        querySnapshot.forEach((doc) => {
            courts.push(doc.data());
        });
        return response.status(200).json({message: 'Courts retrieved', data: {courts: courts}});
    } catch (error) {
        console.log(error)
        return response.status(500).json(error);
    }
}

const getCourt = async (request, response) => {
    try {
        let courtID = request.params.courtId;
        if (!courtID) {
            return response.status(400).json({message: 'Missing courtId'});
        }
        try {
            courtID = parseInt(courtID);
        } catch (error) {
            return response.status(400).json({message: 'Invalid courtId'});
        }
        const courtsRef = collection(db, "court");
        const q = query(courtsRef, where("courtID", "==", courtID));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.size === 0) {
            return response.status(404).json({message: 'Court not found'});
        }
        const court = querySnapshot.docs[0].data();
        return response.status(200).json({message: 'Court found', data: {court: court}});
    } catch (error) {
        console.log(error)
        return response.status(500).json(error);
    }
}

const reserveSpot = async (request, response) => {
    try {
        if (!request.body) {
            return response.status(400).json({message: 'Missing fields'});
        }
        const username = request.body.username;
        if (!username) {
            return response.status(400).json({message: 'Missing username'});
        }
        let courtID = request.body.courtID;
        if (!courtID) {
            return response.status(400).json({message: 'Missing courtID'});
        }
        let spotID = request.body.spotID;
        if (!spotID) {
            return response.status(400).json({message: 'Missing spotID'});
        }
        try {
            courtID = parseInt(courtID);
            spotID = parseInt(spotID);
        } catch (error) {
            return response.status(400).json({message: 'Invalid courtID or spotID'});
        }
        const usersRef = collection(db, "user");
        let q = query(usersRef, where("username", "==", username));
        const querySnapshotUsers = await getDocs(q);
        if (querySnapshotUsers.size === 0) {
            return response.status(404).json({message: 'User not found'});
        }
        const user = querySnapshotUsers.docs[0].data();
        if (user.reservation.hasReserved) {
            return response.status(400).json({message: 'User already has a reserved spot'});
        }
        const courtsRef = collection(db, "court");
        q = query(courtsRef, where("courtID", "==", courtID));
        const querySnapshotCourts = await getDocs(q);
        if (querySnapshotCourts.size === 0) {
            return response.status(404).json({message: 'Court not found'});
        }
        const court = querySnapshotCourts.docs[0].data();

        try {
            if (court.spots[spotID - 1] === undefined) {
                return response.status(404).json({message: 'Spot not found'});
            }
        } catch {
            return response.status(404).json({message: 'Spot not found'});
        }
        const spot = court.spots[spotID - 1];
        if (spot.reservations >= spot.capacity) {
            return response.status(400).json({message: 'Spot is full'});
        }
        spot.reservations++;
        user.updatedAt = Timestamp.fromDate(new Date());
        spot.updatedAt = Timestamp.fromDate(new Date());
        court.updatedAt = Timestamp.fromDate(new Date());
        user.pastReservations.push(user.reservation);
        user.reservation.hasReserved = true;
        user.reservation.data.court.address = court.address;
        user.reservation.data.court.courtID = court.courtID;
        user.reservation.data.court.name = court.name;
        user.reservation.data.spot.spotID = spot.spotID;
        user.reservation.data.spot.capacity = spot.capacity;
        user.reservation.data.spot.start = spot.start;
        user.reservation.data.spot.end = spot.end;
        await updateDoc(doc(usersRef, String(querySnapshotUsers.docs[0].data().userID)), user);
        await updateDoc(doc(courtsRef, String(querySnapshotCourts.docs[0].data().courtID)), court);
        return response.status(200).json({
            message: 'Spot reserved', data: {username: username, reservation: user.reservation, court: court}
        });
    } catch (error) {
        console.log(error)
        return response.status(500).json(error);
    }
}

const getAdminCourts = async (request, response) => {
    let token = request.headers.authorization;
    if (!token) {
        return response.status(401).json({message: 'Missing token'});
    }
    token = token.replace('Bearer ', '');
    if (token !== "adminToken") {
        return response.status(401).json({message: 'Invalid token'});
    }
    return getCourts(request, response);
}

const getAdminUsers = async (request, response) => {
    let token = request.headers.authorization;
    if (!token) {
        return response.status(401).json({message: 'Missing token'});
    }
    token = token.replace('Bearer ', '');
    if (token !== "adminToken") {
        return response.status(401).json({message: 'Invalid token'});
    }
    try {
        const usersRef = collection(db, "user");
        const querySnapshot = await getDocs(usersRef);
        const users = [];
        querySnapshot.forEach((doc) => {
            users.push(doc.data());
        });
        return response.status(200).json({message: 'Users retrieved', data: {users: users}});
    } catch (error) {
        console.log(error)
        return response.status(500).json(error);
    }
}

const updateAdminUsers = async (request, response) => {
    let token = request.headers.authorization;
    if (!token) {
        return response.status(401).json({message: 'Missing token'});
    }
    token = token.replace('Bearer ', '');
    if (token !== "adminToken") {
        return response.status(401).json({message: 'Invalid token'});
    }
    if (!request.body) {
        return response.status(400).json({message: 'Missing fields'});
    }
    const users = request.body.users;
    if (!users) {
        return response.status(400).json({message: 'Missing users'});
    }
    for (let i = 0; i < users.length; i++) {
        if (!users[i].userID || !users[i].username || !users[i].password || !users[i].email || !users[i].reservation) {
            return response.status(400).json({message: 'Missing fields'});
        }
        if (typeof users[i].reservation.hasReserved !== "boolean") {
            return response.status(400).json({message: 'Invalid reservation'});
        }
        const message = validateInput(users[i].username, users[i].password, users[i].email);
        if (message.message !== "Valid") {
            return response.status(400).json(message);
        }
        if (typeof users[i].userID !== "number") {
            return response.status(400).json({message: 'Invalid user ID'});
        }
    }
    try {
        for (let i = 0; i < users.length; i++) {
            const docRef = doc(db, "user", String(users[i].userID));
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const user = docSnap.data();
                user.username = users[i].username;
                user.password = users[i].password;
                user.email = users[i].email;
                user.reservation.hasReserved = users[i].reservation.hasReserved;
                user.updatedAt = Timestamp.fromDate(new Date());
                await updateDoc(docRef, user);
            } else {
                return response.status(404).json({message: 'User not found'});
            }
        }
        return response.status(200).json({message: 'Users updated'});
    } catch (error) {
        console.log(error);
        return response.status(500).json(error);
    }
}

const updateAdminCourts = async (request, response) => {
    let token = request.headers.authorization;
    if (!token) {
        return response.status(401).json({message: 'Missing token'});
    }
    token = token.replace('Bearer ', '');
    if (token !== "adminToken") {
        return response.status(401).json({message: 'Invalid token'});
    }
    if (!request.body) {
        return response.status(400).json({message: 'Missing fields'});
    }
    const courts = request.body.courts;
    if (!courts) {
        return response.status(400).json({message: 'Missing courts'});
    }
    for (let i = 0; i < courts.length; i++) {
        if (!courts[i].courtID || !courts[i].name || !courts[i].address || !courts[i].description || !courts[i].sportType) {
            return response.status(400).json({message: 'Missing fields'});
        }
    }
    try {
        for (let i = 0; i < courts.length; i++) {
            const docRef = doc(db, "court", String(courts[i].courtID));
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const court = docSnap.data();
                court.name = courts[i].name;
                court.address = courts[i].address;
                court.description = courts[i].description;
                court.sportType = courts[i].sportType;
                court.updatedAt = Timestamp.fromDate(new Date());
                await updateDoc(docRef, court);
            } else {
                return response.status(404).json({message: 'Court not found'});
            }
        }
        return response.status(200).json({message: 'Courts updated'});
    } catch (error) {
        console.log(error);
        return response.status(500).json(error);
    }
}

const adminResetReservations = async (request, response) => {
    let token = request.headers.authorization;
    if (!token) {
        return response.status(401).json({message: 'Missing token'});
    }
    token = token.replace('Bearer ', '');
    if (token !== "adminToken") {
        return response.status(401).json({message: 'Invalid token'});
    }
    try {
        const usersRef = collection(db, "user");
        const querySnapshot = await getDocs(usersRef);
        querySnapshot.forEach((doc) => {
            const user = doc.data();
            if (user.userID !== 1) {
                user.reservation.hasReserved = false;
                user.updatedAt = Timestamp.fromDate(new Date());
                updateDoc(doc.ref, user);
            }
        });
        return response.status(200).json({message: 'Reservations reset'});
    } catch (error) {
        console.log(error);
        return response.status(500).json(error);
    }
}

const addReview = async (req, res) => {
    const {courtID, review} = req.body;
    const courtRef = doc(db, "court", courtID.toString());

    try {
        const courtDoc = await getDoc(courtRef);

        if (!courtDoc.exists()) {
            res.status(404).send({message: "Court not found"});
            return;
        }

        const courtData = courtDoc.data();
        const updatedReviews = [...courtData.reviews, review];
        await updateDoc(courtRef, {reviews: updatedReviews});
        await updateDoc(courtRef, {updatedAt: Timestamp.fromDate(new Date())});

        res.status(200).send({message: "Review added"});
    } catch (error) {
        res.status(500).send({message: error.message});
    }
};


module.exports = {
    getUsers,
    getUser,
    createUser,
    loginUser,
    getCourts,
    getCourt,
    updateUserPassword,
    reserveSpot,
    getAdminUsers,
    getAdminCourts,
    updateAdminUsers,
    updateAdminCourts,
    adminResetReservations,
    addReview
};
