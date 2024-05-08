import express from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import _ from 'lodash';

const app = express();
const PORT = 3000;
let usuarios = [];

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})



app.get('/', (req, res) => {
    res.send('Hola, para registrar un usuario use la ruta /registrar o haga click aqui: <a href="/registrar">Registrar</a>');   
})
//Ruta para registrar un usuario
app.get('/registrar', (req, res) => {

    //Se obtiene usuario aleatorio
    axios.get('https://randomuser.me/api').then((data) => {

        //Se todos los datos del usuario
        const userData = data.data.results[0];
        //Se crea id aleatorio con uuid
        const id = uuidv4();
        //Se crea timestamp con moment
        const timestamp = moment().locale('es').format('MMMM Do YYYY, h:mm:ss a');

         const usuarioregistrado = {
            firstName: userData.name.first,
            lastName: userData.name.last,
            id: id,
            timestamp : timestamp,
        }
        usuarios.push(usuarioregistrado);
        
//Si no se logra obtener datos del usuario se redirecciona a la ruta principal 
}).catch((error) => {
    console.log(error);
    res.redirect('/');
})
})

app.get('/usuarios', (req, res) => {
    res.send(usuarios);
})