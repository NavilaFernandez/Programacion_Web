const express = require('express');
const app = express();
app.use(express.json());
app.use(express.text());



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/administracion', (req,res) => {
  console.log(req.query);
  res.send('Servidor contestando a peticion GET');
});

app.get('/maestros', (req,res) => {
  console.log(req.body);
  res.send('Servidor contestando a peticion GET');
});

app.get('/estudiantes/:carrera', (req,res) => {
  console.log(req.params.carrera);
  console.log(req.query.control);
  res.send('Servidor contestando a peticion GET');
});

app.listen(3000, () => {
  console.log('Hola Mundo desde el Port ' + port);
});
