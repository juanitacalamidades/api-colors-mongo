import dotenv from "dotenv"
dotenv.config();
//----------------
import { MongoClient, ObjectId } from "mongodb";

// function conectar(){
//     return  MongoClient.connect(process.env.DB_CONNECTION);
// }

const client = new MongoClient(process.env.DB_CONNECTION);

async function conectar() {
  if (!client.topology) {
    await client.connect();
  }
  return client;
}

export async function leerColores() {
  const conexion = await conectar();
  const coleccion = conexion.db("colores").collection("colores");

  const docs = await coleccion.find({}).toArray();

  return docs.map(({ _id, r, g, b }) => ({
    id: _id,
    r,
    g,
    b
  }));
}


// export function leerColores(){
//     let conexion = null;
//     return new Promise((ok,ko) => {


//         conectar()
//         .then(conexionPromesa => {
//             conexion = conexionPromesa;

//             const coleccion = conexion.db("colores").collection("colores");
            
//             return coleccion.find({}).toArray()
//         })
//         .then(colores => {
//                 conexion.close();

//                 ok(colores.map(({_id,r,g,b}) => {
//                     let id = _id;

//                     return {id,r,g,b};
//                 }));
//         })
//         .catch(error => {
//             if(conexion){
//                 conexion.close();
//             }
//             ko({error : "error en la petición"});
//         })
      
//     });
// }

export async function crearColor(color) {
  const conexion = await conectar();
  const coleccion = conexion.db("colores").collection("colores");

  const { insertedId } = await coleccion.insertOne(color);
  return insertedId;
}


// export function crearColor(color){ //{r,g,b}
//     let conexion = null;

//     return new Promise((ok,ko) => {
//         conectar()
//         .then(conexionPromesa => {
//             conexion = conexionPromesa;
//             const coleccion = conexion.db("colores").collection("colores");

//             return coleccion.insertOne(color)
//         })
//         .then( ({insertedId}) => {
//             conexion.close();
//             // console.log(resultado);
//             ok(insertedId)
//         })
//         .catch(error => {
//             if(conexion){
//                 conexion.close();
//             }
//             ko({error : "error al insertar los datos"})
//         })
//     });
// }

export async function borrarColor(id) {
  const conexion = await conectar();
  const coleccion = conexion.db("colores").collection("colores");

  const { deletedCount } = await coleccion.deleteOne({ _id: new ObjectId(id) });
  return deletedCount;
}

// export function borrarColor(id){
//     let conexion = null;

//     return new Promise((ok,ko) => {
//         conectar()
//         .then(conexionPromesa => {
//             conexion = conexionPromesa;
//             const coleccion = conexion.db("colores").collection("colores");

//             return coleccion.deleteOne({ _id : new ObjectId(id) })
//         })
//         .then( ({deletedCount}) => {
//             conexion.close();
//             ok(deletedCount);
//         })
//         .catch(error => {
//             if(conexion){
//                 conexion.close();
//             }
//             ko({error : "error al insertar los datos"})
//         })
//     });
// }


// Pruebas


// leerColores()
// .then(x => console.log(x))
// .catch(error => console.log(error))

// crearColor({ r : 0, g : 10, b : 0 })
// .then(x => console.log(x))
// .catch(error => console.log(error))

//  borrarColor('684177dfc51f5d9f93279c41')
//  .then(x => console.log(x))
//  .catch(x => console.log(x))

