const express = require('express');
const path = require('path');
const app = express();

console.log(__dirname);
console.log(__filename);

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended:true}));



app.post('/Formulario', (req, res) => {
  console.log(req.body);
  res.send('Hola ' + req.body.Nombre);
});




const port = 1000;

app.listen(port, () => {
  console.log('Hola Mundo desde el Port ' + port);
});
