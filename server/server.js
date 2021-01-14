require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
 
app.use(bodyParser.json());

app.use( require('./routes/usuario'));

mongoose.connect( process.env.URLDB, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}, (err, res) => {

    if( err ) throw err;

    console.log('Base de datos ONLINE');
});


app.listen(process.env.PORT, () => console.log(`Servidor desplegado en el puerto ${process.env.PORT}`));