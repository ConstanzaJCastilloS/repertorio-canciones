const express = require("express");
const fs = require("fs");
const app = express();
const cors = require("cors");
const path = require("path");

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../front/index.html"));
});



// GET 
app.get("/canciones", (req, res) => {
  try {
    const data = fs.readFileSync("repertorio.json", "utf-8");
    const canciones = JSON.parse(data);
    res.json(canciones);
  } catch (error) {
    res.status(500).json({ error: "Error al leer el archivo" });
  }
});

// POST 
app.post("/canciones", (req, res) => {
  const { id, titulo, artista, tono } = req.body;

  if (!id || !titulo || !artista || !tono) {
    return res.status(400).send("Faltan datos");
  }

  try {
    const data = fs.readFileSync("repertorio.json", "utf-8");
    const canciones = JSON.parse(data);
    
  
    const existe = canciones.some(c => c.id == id);
    if (existe) {
      return res.status(400).send("Ya existe una canción con ese ID");
    }
    
    canciones.push(req.body);
    fs.writeFileSync("repertorio.json", JSON.stringify(canciones, null, 2));
    res.status(201).send("Canción agregada");
  } catch (error) {
    res.status(500).send("Error al procesar la solicitud");
  }
});

// PUT 
app.put("/canciones/:id", (req, res) => {
  const { id } = req.params;
  const nuevaData = req.body;

  try {
    const data = fs.readFileSync("repertorio.json", "utf-8");
    let canciones = JSON.parse(data);

    const index = canciones.findIndex((c) => c.id == id);

    if (index === -1) {
      return res.status(404).send("Canción no encontrada");
    }

    canciones[index] = nuevaData;
    fs.writeFileSync("repertorio.json", JSON.stringify(canciones, null, 2));
    res.send("Canción actualizada");
  } catch (error) {
    res.status(500).send("Error al procesar la solicitud");
  }
});

// DELETE 
app.delete("/canciones/:id", (req, res) => {
  const { id } = req.params;

  try {
    const data = fs.readFileSync("repertorio.json", "utf-8");
    let canciones = JSON.parse(data);

    const nuevaLista = canciones.filter((c) => c.id != id);

    if (canciones.length === nuevaLista.length) {
      return res.status(404).send("Canción no encontrada");
    }

    fs.writeFileSync("repertorio.json", JSON.stringify(nuevaLista, null, 2));
    res.send("Canción eliminada");
  } catch (error) {
    res.status(500).send("Error al procesar la solicitud");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en http://localhost:" + PORT);
});