const express = require('express');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const { jsPDF } = require("jspdf");
const app = express();
const port = 7000;


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

app.post('/Formulario/', upload.single('archivo'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('Error: No se recibió ningún archivo.');
    }

    const imagePath = path.join(folder, req.file.filename);
    const pdfPath = path.join(pdfFolder, `${req.file.filename}.pdf`);

    try {
        const doc = new jsPDF();
        
        doc.text("Se subio la imagen", 10, 10);
        
        const imageData = fs.readFileSync(imagePath).toString('base64');
        doc.addImage(`data:image/jpeg;base64,${imageData}`, "JPEG", 10, 20, 180, 160); 

        doc.save(pdfPath);

        res.setHeader('Content-Type', 'application/pdf');
        res.sendFile(pdfPath);

    } catch (error) {
        console.error("Error al generar el PDF:", error);
        res.status(500).send("Error al generar el PDF");
    }
});


app.use('/archivos', express.static(folder));
app.use('/archivosgen', express.static(pdfFolder));

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});