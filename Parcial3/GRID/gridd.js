const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json()); 

let data = [
  { id: 1, name: 'Angel Navila', email: 'Nav@example.com' },
  { id: 2, name: 'Daniel Osvaldo', email: 'Dan@example.com' }
];


app.get('/api/data', (req, res) => {
  res.json(data);
});


app.post('/api/data', (req, res) => {
  const { id, name, email } = req.body;
  if (id && name && email) {
    data.push({ id, name, email });
    res.status(201).json({ message: 'Se agregaron los datos correctamente' });
  } else {
    res.status(400).json({ message: 'Formato erroneo' });
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Puerto en  ${PORT}`);
});
