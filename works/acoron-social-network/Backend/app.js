const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const thoughtRoutes = require('./routes/thought');
const authRoutes = require('./routes/auth');
const userDataRoutes = require('./routes/userData');
const messageRoutes = require('./routes/messages');
require("dotenv").config({ path: "variables.env" });


const app = express();


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Auth-Token');
    next();
})

app.use(express.json({ extended: true }));


app.use('/thoughts', thoughtRoutes);
app.use('/auth', authRoutes);
app.use('/user', userDataRoutes);
app.use('/messages', messageRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));


const port = process.env.PORT || 8080;
mongoose.connect(process.env.DB_MONGO,
    { useNewUrlParser: true, useUnifiedTopology: true ,'useFindAndModify': false})
    .then((err) => {
        const server = app.listen(port);
        const io = require('./socket').init(server);
        io.on('connection', socket => {
            // console.log('Client Connected');
        })
        console.log(`Server running in port ${port}`)
    })
    .catch(err => console.log(err));