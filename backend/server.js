const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors')
const routes = require('./routes');
const {reset, initialize} = require("./data/db-init");
const {addReview} = require("./routes");

app.use(cors())
app.use(express.json());
app.get('/', (request, response) => {
    response.json({info: 'Express API'})
})

app.put("/users/:username/password", routes.updateUserPassword);
app.put("/reserve", routes.reserveSpot);
app.get('/users', routes.getUsers);
app.get('/users/:username', routes.getUser);
app.post('/users', routes.createUser);
app.post('/users/login', routes.loginUser);
app.post('/review', addReview);
app.get('/courts', routes.getCourts);
app.get('/courts/:courtId', routes.getCourt);
app.get('/admin/users', routes.getAdminUsers);
app.get('/admin/courts', routes.getAdminCourts);
app.put('/admin/users', routes.updateAdminUsers);
app.put('/admin/courts', routes.updateAdminCourts);
app.put('/admin/reservations', routes.adminResetReservations);

const init = async () => {
    await reset().then(() => {
        console.log("Database reset");
    }).catch((error) => {
        console.log(error);
    });
    await initialize().then(() => {
        console.log("Database initialized");
    }).catch((error) => {
        console.log(error);
    });
}

app.listen(port, () => {
    const flag = false;
    if (flag) {
        init().then(() => {
        }).catch((error) => {
            console.log(error);
        });
    }
    console.log(`Listening on port ${port}`)
});
