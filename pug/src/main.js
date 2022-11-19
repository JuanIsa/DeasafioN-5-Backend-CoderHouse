'use strict';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Contenedor from './resources/handlerFiles.js';
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT || 8080;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))


app.set('views', './src/views');
app.set('view engine', 'pug');

const archivo = new Contenedor('productos.txt');

app.post('/productos', (req, res) => {
    archivo.save(req.body).then(() => res.redirect('/'));
})

app.get('/productos', (req, res) => {
    archivo.getAll().then(datafile => {
        let renderConditional = true;
        if (datafile.length === 0) renderConditional = false;
        res.render('tabla', { datafile, renderConditional });
    });
});


app.get('*', (req, res) => {
    res.status(404).send('<h1>Recurso no encontrado</h1>');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto: ${PORT}.`);
});