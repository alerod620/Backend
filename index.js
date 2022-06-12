const express = require('express');
const app = express();
const cors = require('cors');

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(function (req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Contorl-Allow-Headers", "Origin, X-Requested-With, Content-Type  , Accept");
    next();
})

const router = require('./routes/router.js');
app.use('/api', router);

app.listen(PORT, () => console.log('Server running on port ' + PORT));