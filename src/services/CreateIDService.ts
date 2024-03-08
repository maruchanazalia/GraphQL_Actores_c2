import { v4 as uuidv4 } from "uuid";

export function createID(){
    try {
        const newID = uuidv4();
        return newID;
    } catch (error) {
        console.log(error);
        return null;
    }
}