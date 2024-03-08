import db from '../db.config'
import { createJWT, obtnertoken, verifyJWT } from '../services/JWTService';
import { createID } from '../services/CreateIDService';
import { hashPassword, validatePassword } from '../services/EncryptPasswordService';
import { sendMessage } from '../services/SendMessageService';
import { getUser } from '../models/user'; 
import axios from 'axios';


const login = async (__:void, args: any, context: any) => {
  try{  

    // const token = context.headers.authorization
    // const error = verifyJWT(token)
    // if(error)
    // throw error
    const {tel, password} = args

    const client = await getUser(tel)
    console.log(client)
    if(client && await validatePassword(password,client.password)){
      const id=client.id
      const usernames=client.username
      return createJWT({id,usernames})
    } 
    
    return 'usuario o contrasena incorrecto'

  } catch (e: any){
    console.log(e.message)
    return e
  }
}

const getAllUsers = async (__: void, args: any, context: any) => {
  try {
    const token = context.headers.authorization;
    const error = verifyJWT(token);
    if (error) throw error;

    const [users]: any = await db.execute("SELECT * FROM users");
    return users;

  } catch (error: any) {
    console.error(error);
    return error;
  }
};


const getUserByID = async (__: void, args: any, context: any) => {
  try {
    const token = context.headers.authorization;
    const error = verifyJWT(token);
    if (error) throw error;

    const { id } = args;
    const [users]: any = await db.execute("SELECT * FROM users WHERE id = ?", [id]);

    return Array.isArray(users) ? users[0] : null;

  } catch (error: any) {
    console.error(error);
    return error;
  }
};



//Mutaciones
const registerUser = async (__: void, args: any, context: any) => {
  try {
    const token = context.headers.authorization;
    const error = verifyJWT(token);
    if (error) throw error;

    const auxPassword = args.password;
    const idUser = createID();
    const encryptPassword = await hashPassword(auxPassword);

    const user = {
      id: idUser,
      name: args.name,
      username: args.username,
      password: encryptPassword
    };

    const result = await db.query("INSERT INTO users (id, name, username, password) VALUES (?, ?, ?, ?)",
      [user.id, user.name, user.username, user.password]);

    sendMessage(user.id);
    
    console.log(result);
    return user;
  } catch (error: any) {
    console.error(error);
    return error;
  }
}

const deleteUserByID = async (__: void, args: any, context: any) => {
  try {
    const token = context.headers.authorization;
    const error = verifyJWT(token);
    if (error) throw error;

    const { id } = args;
    const [result]: any = await db.execute("DELETE FROM users WHERE id = ?", [id]);

    if (result.affectedRows === 1) {
      // Si se eliminó correctamente
      postOFAxios("deleteUserByID", { success: true, message: "Usuario eliminado exitosamente" })
      return { success: true, message: "Usuario eliminado exitosamente" };
    } else {
      // Si no se encontró el usuario
      return { success: false, message: "No se encontró el usuario" };
    }

  } catch (error: any) {
    console.error(error);
    return { success: false, message: "Error al eliminar el usuario" };
  }
};

const addWebHook=async(_:any,{urlApi,type}:any,context:any)=>{
  const token = context.headers.authorization;
  const data=await obtnertoken(token)
  if(data){
   try{
       const {id}=data
       const result=await db.query(`insert into movieWebHoksEvent(id,url,type) values(?,?,?) `,[id,urlApi,type])
       return "agreagdo correctamente"
   }catch(e:any){
    console.log(e.message)
    throw new Error("Erro al agregar webhook")
   }
  } 
  throw new Error("No esta logeado")
 
}

export const postOFAxios=async(type:String,payload:any)=>{
       let [result]:Array<any>=await db.query("select * from moviewebhoksevent")
       result.map(async(x:any)=>{
         if(x.type==type){
          await axios.post(x.url,{...payload,type:type})
         }
       })
      
}



export default {
  //querys
    login,
    getAllUsers,
    getUserByID,
    //muta
    registerUser,
    deleteUserByID,
    addWebHook
 
}