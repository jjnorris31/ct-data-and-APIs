const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
const app = express();
require('dotenv').config();

console.log(process.env);
const api_key = process.env.API_KEY;

app.listen(3000, () => {
    console.log('listening at 3000');
});

const database = new Datastore('database.db');
database.loadDatabase(); // cargando la base de datos de NeDB

app.use(express.static('public')); // añadiendo la capacidad de manejar archivos estáticos
app.use(express.json('1mb')); // añadiendo la capacidad de utilizar el formato JSON

// indicando que se va a enviar cierta información para crear un recurso
app.post('/api', (request, response) => {
    console.log('I got a request!');
    console.log(request.body);
    
    const timestamp = Date.now();
    database.timestamp = timestamp;
    database.insert(request.body);
    response.json({
        status: 'Success',
        timestamp: timestamp,
        payload: request.body.fruit,
        latitude: request.body.lat,
        longitude: request.body.lon
    });
});

app.get('/api', (request, response) => {
    database.find({}, (err, data) => {
        if (err) {
            response.end();
            return;
        }
    
        response.json(data);
    })
})

app.get('/weather/:latlon', async (request, response) => {
    const latlon = request.params.latlon.split(',');
    const apiUrl = `https://api.darksky.net/forecast/${api_key}/${latlon[0]},${latlon[1]}`
    const airUrl = `https://api.openaq.org/v1/latest?${latlon[0]},${latlon[1]}?radius=2500`
    const responseW = await fetch(apiUrl);
    const responseA = await fetch(airUrl);
    const jsonW = await responseW.json();
    const jsonA = await responseA.json();
    const data = {
        weather: jsonW,
        air: jsonA
    }
    response.json(data);
})