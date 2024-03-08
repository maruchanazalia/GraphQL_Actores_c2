import db from "../db.config";
import { verifyJWT } from "../services/JWTService";
import { createID } from "../services/CreateIDService";
import { postOFAxios } from "./userController";

const getAllActors = async (__: void, args: any, context: any) => {
  try {
    const token = context.headers.authorization;
    const error = verifyJWT(token);
    if (error) throw error;

    const { page, limit } = args;
       
    let actors;
    if (page && limit) {
      const offset = (page - 1) * limit;
      const sql = `SELECT * FROM actors LIMIT ${limit} OFFSET ${offset}`;
      [actors] = await db.execute(sql);
    } else {
      [actors] = await db.execute("SELECT * FROM actors");
    }
    
    return actors;
    
  } catch (error: any) {
    console.log(error);
    return error;
  }
};



const getActorByID = async (__: void, args: any, context: any) => {
  try {
    const token = context.headers.authorization;
    const error = verifyJWT(token);
    if (error) throw error;

    const { id } = args;
    const [actors] = await db.execute("SELECT * FROM actors WHERE id = ?", [id]);
    
    return Array.isArray(actors) ? actors[0] : null;

  } catch (error: any) {
    console.log(error);
    return error;
  }
};

const getActorByName = async (__: void, args: any, context: any) => {
  try {
    const token = context.headers.authorization;
    const error = verifyJWT(token);
    if (error) throw error;

    const { name } = args;
    const [actors] = await db.execute("SELECT * FROM actors WHERE name = ?", [name]);
    
    return Array.isArray(actors) ? actors[0] : null;

  } catch (error: any) {
    console.log(error);
    return error;
  }
};

const getActorByMovie = async (__: void, args: any, context: any) => {
  try {
    const token = context.headers.authorization;
    const error = verifyJWT(token);
    if (error) throw error;

    const { movie } = args;
    const [actors] = await db.execute("SELECT * FROM actors WHERE movies LIKE ?", [`%${movie}%`]);
    
    return Array.isArray(actors) ? actors[0] : null;

  } catch (error: any) {
    console.log(error);
    return error;
  }
};

const getActorsByMovieABC = async (__: void, args: any, context: any) => {
  try {
    const token = context.headers.authorization;
    const error = verifyJWT(token);
    if (error) throw error;

    const { page, limit } = args;
    const offset = (page - 1) * limit;

    let actors;
    if (page && limit) {
      const sql = `SELECT * FROM actors ORDER BY name ASC LIMIT ${limit} OFFSET ${offset}`;
      [actors] = await db.execute(sql);
    } else {
      [actors] = await db.execute("SELECT * FROM actors ORDER BY nombre ASC");
    }
    
    return actors;

  } catch (error: any) {
    console.log(error);
    return error;
  }
};




//Mutaciones
const createActor = async (__: void, args: any, context: any) => {
  try {
    const actor = {
      name: args.name,
      birthday: args.birthday,
      movies: args.movies
    };

    const result = await db.query("INSERT INTO actors (name, birthday, movies) VALUES (?,?,?)",
      [actor.name, actor.birthday, actor.movies]);
    
    postOFAxios("createActor", { success: true, message: "Usuario agregado exitosamente" , actor });

    return actor;
  } catch (error: any) {
    console.log(error);
    return error;
  }
};


const deleteActor = async (__: void, args: any, context: any) => {
  try {
  
    const token = context.headers.authorization;
    const error = verifyJWT(token);
    if (error) throw error;

    const { id } = args;

    const result = await db.query("DELETE FROM actors WHERE id = ?", [id]);
    postOFAxios("createActor", { success: true, message: `Actor with ID ${id} deleted successfully.` })
    return { success: true, message: `Actor with ID ${id} deleted successfully.` };
  } catch (error: any) {
    console.log(error);
    return error;
  }
};

const updateActor = async (__: void, args: any, context: any) => {
  try {
    const token = context.headers.authorization;
    const error = verifyJWT(token);
    if (error) throw error;

    const { id, name, birthday, movies } = args;
    const result = await db.query(
      "UPDATE actors SET name = ?, birthday = ?, movies = ? WHERE id = ?",
      [name, birthday, movies, id]
    );

    if (result) {
      postOFAxios("updateActor", {
        success: true,
        message: "Actor updated successfully"
      })
      return {
        success: true,
        message: "Actor updated successfully"
      };
    } else {
      return {
        success: false,
        message: "Failed to update actor"
      };
    }
  } catch (e: any) {
    console.log(e);
    return e;
  }
};

const deleteAllActors = async (__: void, args: any, context: any) => {
  try {
    const token = context.headers.authorization;
    const error = verifyJWT(token);
    if (error) throw error;

    const result = await db.query("DELETE FROM actors");
    postOFAxios("deleteAllActors", { success: true, message: "All actors deleted successfully." })
    return { success: true, message: "All actors deleted successfully." };
  } catch (error: any) {
    console.log(error);
    return error;
  }
};

const deleteActorsByRange = async (__: void, args: any, context: any) => {
  try {
    const token = context.headers.authorization;
    const error = verifyJWT(token);
    if (error) throw error;

    const { startId, endId } = args;

    const result = await db.query("DELETE FROM actors WHERE id BETWEEN ? AND ?", [startId, endId]);
    postOFAxios("deleteActorsByRange",  { success: true, message: `Actors with IDs between ${startId} and ${endId} deleted successfully.` })
    return { success: true, message: `Actors with IDs between ${startId} and ${endId} deleted successfully.` };
  } catch (error: any) {
    console.log(error);
    return error;
  }
};





export default {
  //querys
  getAllActors,//paginacion
  getActorByID,
  getActorByName,
  getActorByMovie,
  getActorsByMovieABC,// paginacion

  //muta
  createActor,
  deleteActor,
  updateActor,
  deleteAllActors,
  deleteActorsByRange


   
}
