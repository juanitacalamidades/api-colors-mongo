import dotenv from "dotenv"
dotenv.config();
//----------------
import { MongoClient, ObjectId } from "mongodb";

function conectar(){
    return  MongoClient.connect(process.env.DB_CONNECTION);
}

export function leerColores(){
    let conexion = null;
    return new Promise((ok,ko) => {


        conectar()
        .then(conexionPromesa => {
            conexion = conexionPromesa;

            const coleccion = conexion.db("colores").collection("colores");
            
            return coleccion.find({}).toArray()
        })
        .then(colores => {
                conexion.close();

                ok(colores.map(({_id,r,g,b}) => {
                    let id = _id;

                    return {id,r,g,b};
                }));
        })
        .catch(error => {
            if(conexion){
                conexion.close();
            }
            ko({error : "error en la petición"});
        })
      
    });
}

export function crearColor(color){ //{r,g,b}
    let conexion = null;

    return new Promise((ok,ko) => {
        conectar()
        .then(conexionPromesa => {
            conexion = conexionPromesa;
            const coleccion = conexion.db("colores").collection("colores");

            return coleccion.insertOne(color)
        })
        .then( ({insertedId}) => {
            conexion.close();
            // console.log(resultado);
            ok(insertedId)
        })
        .catch(error => {
            if(conexion){
                conexion.close();
            }
            ko({error : "error al insertar los datos"})
        })
    });
}


export function borrarColor(id){
    let conexion = null;

    return new Promise((ok,ko) => {
        conectar()
        .then(conexionPromesa => {
            conexion = conexionPromesa;
            const coleccion = conexion.db("colores").collection("colores");

            return coleccion.deleteOne({ _id : new ObjectId(id) })
        })
        .then( ({deletedCount}) => {
            conexion.close();
            ok(deletedCount);
        })
        .catch(error => {
            if(conexion){
                conexion.close();
            }
            ko({error : "error al insertar los datos"})
        })
    });
}


// Pruebas


leerColores()
.then(x => console.log(x))
.catch(error => console.log(error))

// crearColor({ r : 0, g : 10, b : 0 })
// .then(x => console.log(x))
// .catch(error => console.log(error))

//  borrarColor('684177dfc51f5d9f93279c41')
//  .then(x => console.log(x))
//  .catch(x => console.log(x))

