const express = require('express');
const path = require('path');
const multer = require('multer');
const app = express();

console.log(__dirname);
console.log(__filename);

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

const folder = path.join(__dirname, 'archivos');
const upload = multer({ dest: folder }); 

app.post('/Formulario', upload.single('archivo'), (req, res) => {
  console.log(req.body);
  res.send('Hola ' + req.body.Nombre);
});

const port = 2000;

app.listen(port, () => {
  console.log('Hola Mundo desde el Port ' + port);
});

