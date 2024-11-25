const express = require('express');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const { jsPDF } = require("jspdf");
const app = express();
const port = 3000;
const { body, validationResult } = require('express-validator');
const mysql = require('mysql2');



const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Programacion28',
    database: 'Pasteleria_db'
});


db.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        process.exit(1);
    }
    console.log('Conexión exitosa a la base de datos');
});





app.use(cors());

const folder = path.join(__dirname, 'archivos');
const pdfFolder = path.join(__dirname, 'archivosgen');
if (!fs.existsSync(folder)) fs.mkdirSync(folder);
if (!fs.existsSync(pdfFolder)) fs.mkdirSync(pdfFolder);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, folder),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });

app.post('/FormPasteleria/',
    upload.single('archivo'),
    [
        
        body('nombre')
            .notEmpty()
            .withMessage('El campo nombre es obligatorio.')
            .isLength({ max: 50 })
            .withMessage('El nombre debe tener menos de 50 caracteres.'),
    ],
    async (req, res) => {
       
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json('Error: No se recibio ningun nombre.');
        }

      
        if (!req.file) {
            return res.status(400).send('Error: No se recibio ningun archivo.');
        }

        const id = req.body.id; 
        const nombre = req.body.nombre; 
        const Cant = req.body.Cantidad;
        const Sabor = req.body.Sabor;  
        const Descripcion = req.body.Descripcion; 
        const Precio = req.body.Precio; 
        const imagePath = path.join(folder, req.file.filename);
        const pdfFilename = `${nombre}-${req.file.filename}.pdf`; 
        const pdfPath = path.join(pdfFolder, pdfFilename);

        try {


            const doc = new jsPDF();
            doc.text(`Id: ${id}`, 10, 10); 
            doc.text(`Tipo de Pastel: ${nombre}`, 10, 20); 
            doc.text(`Cantidad: ${Cant}`, 10, 30);
            doc.text(`Sabor: ${Sabor}`, 10, 40);
            doc.text(`Descripcion: ${Descripcion}`, 10, 50);
            doc.text(`Precio: ${Precio}`, 10, 60);

            const imageData = fs.readFileSync(imagePath).toString('base64');
            doc.addImage(`data:image/jpeg;base64,${imageData}`, "JPEG", 10, 80, 180, 160); 
            doc.save(pdfPath);

            res.setHeader('Content-Type', 'application/pdf');
            res.sendFile(pdfPath);

        } catch (error) {
            console.error("Error al generar el PDF:", error);
            res.status(500).send("Error al generar el PDF");
        }
    }
);

app.get('/pedido/:id', (req, res) => {
    const id = req.params.id;
    const query = "SELECT id, tipoPastel AS tipo, cantidad, sabor, descripcion, Precio FROM Pedido WHERE id = ?";
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener el pedido:', err);
            return res.status(500).send('Error al obtener el pedido');
        }
        if (results.length === 0) {
            return res.status(404).send('Pedido no encontrado');
        }
        res.json(results[0]); // Devuelve solo el pedido encontrado
    });
});


app.use('/archivos', express.static(folder));
app.use('/archivosgen', express.static(pdfFolder));

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});