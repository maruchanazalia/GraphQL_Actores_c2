import * as bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

export async function hashPassword(password: string){
    const auxSaltRounds = process.env.SALT_ROUNDS;
    const saltRounds = Number(auxSaltRounds);

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

export async function validatePassword(password: string, passwordFound: string){
    const validate = await bcrypt.compare(password, passwordFound);
    if(validate){
        return true;
    }else{
        return false;
    }
}