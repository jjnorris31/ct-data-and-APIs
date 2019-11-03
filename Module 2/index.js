const express = require('express');
const Datastore = require('nedb');

const app = express();

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