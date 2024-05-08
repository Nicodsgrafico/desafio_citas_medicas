import express from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import _ from 'lodash';
import path from 'path';

const app = express();
const PORT = 3000;
let usuarios = [];
const __dirname = path.resolve();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

app.use(/bootstrap/, express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));


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

        //Se crea objeto con los datos del usuario
        const usuarioregistrado = {
            firstName: userData.name.first,
            lastName: userData.name.last,
            gender: userData.gender,
            id: id,
            timestamp: timestamp,
        }
        //Se agrega el usuario a la lista de usuarios
        usuarios.push(usuarioregistrado);
        //Se redirecciona a la ruta de usuarios
        res.redirect('/usuarios');

        //Si no se logra obtener datos del usuario se redirecciona a la ruta principal 
    }).catch((error) => {
        console.log(error);
        res.redirect('/');
    })
})

// Ruta para consultar usuarios
app.get('/usuarios', (req, res) => {
    // Separar los usuarios por genero
const [hombres, mujeres] = _.partition(usuarios, { gender: 'male' });
// Función para generar una lista HTML de usuarios
function generarListaUsuarios(usuarios) {
    return `
<ul style="list-style: none;">
    ${usuarios.map(usuario =>  `<li class="list-group-item">Nombre: ${usuario.firstName} Apellido: ${usuario.lastName} ID: ${usuario.id} Timestamp: ${usuario.timestamp}</li>`).join('\n')}
</ul>
`;
}

// Generar la respuesta HTML con las listas de hombres y mujeres
const respuestaHTML = `
<h2>Hombres</h2>
${generarListaUsuarios(hombres)}
<h2>Mujeres</h2>
${generarListaUsuarios(mujeres)}
`;

// Enviar la respuesta HTML al cliente
res.send(respuestaHTML+'Registrar nuevo usuario: <a href="/registrar">Registrar</a>');
});