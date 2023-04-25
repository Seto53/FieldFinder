const {initializeApp} = require("firebase/app");
const {getFirestore} = require("firebase/firestore");

const firebase = {
    apiKey: "AIzaSyD_o3NNBmT-2wFuk743iqgqnvdldCbukuw",
    authDomain: "csi4900-aa771.firebaseapp.com",
    projectId: "csi4900-aa771",
    storageBucket: "csi4900-aa771.appspot.com",
    messagingSenderId: "845935798419",
    appId: "1:845935798419:web:8a34ccbe0f8b00bca8c566",
    measurementId: "G-73FTWDVFL7"
};

const app = initializeApp(firebase);
const db = getFirestore(app);

module.exports = {db};
