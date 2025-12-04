
import express from "express";
import cors from "cors";
import {leerColores,crearColor,borrarColor} from "./datos.js";

const servidor = express();
const PORT = process.env.PORT || 3000;

servidor.use(cors());

servidor.use(express.json());

servidor.use("/pruebas", express.static("./pruebas"));

servidor.get("/colores", async (peticion,respuesta) => {
    try{

        let colores = await leerColores();

        respuesta.json(colores);

    }catch(error){
        respuesta.status(500);
        respuesta.json({ error : "error en el servidor" });    
    }
});

servidor.post("/colores/nuevo", async (peticion,respuesta,siguiente) => {
    let {r,g,b} = peticion.body;

    let valores = [r,g,b].map( n => n.toString() );

    let valido = true;

    let i = 0;

    while(valido && i < 3){
        valido = /^[0-9]{1,3}$/.test(valores[i]) && Number(valores[i]) <= 255;
        valores[i] = Number(valores[i]);
        i++;
    }


    if(!valido){
        return siguiente(true);
    }

    try{

        let [r,g,b] = valores;

        let id = await crearColor({r,g,b});

        respuesta.status(201);

        respuesta.json({id});

    }catch(error){
        respuesta.status(500);
        respuesta.json({ error : "error en el servidor" });    
    }

});


servidor.delete("/colores/borrar/:id", async (peticion,respuesta,siguiente) => {

    let {id} = peticion.params;

    
    // validación del hash hexadecimal de mongo --> 24 caracteres números y letras
    if(!/^[0-9a-f]{24}$/.test(id)){
        return siguiente();
    }
    
    try{

        let cantidad = await borrarColor(id);

        if(!cantidad){
            return siguiente();
        }

        respuesta.status(204);

        respuesta.send("");

    }catch(error){
        respuesta.status(500);
        respuesta.json({ error : "error en el servidor" });    
    }

});


servidor.use((error,peticion,respuesta,siguiente) => {
    respuesta.status(400);
    respuesta.json({ error : "error en la petición" });
});

servidor.use((peticion,respuesta) => {
    respuesta.status(404);
    respuesta.json({ error : "recurso no encontrado" });
});

servidor.listen(PORT, () => {
    console.log("Servidor iniciado en puerto " + PORT);
});
