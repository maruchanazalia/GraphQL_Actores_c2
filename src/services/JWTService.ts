import 'dotenv/config';
import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';

const secret = process.env.SECRET_WORD || 'secretospuersecre';
export function verifyJWT (token: string) {

    try {
        jwt.verify(token, secret)
        return null
        
    } catch(e: any){
        console.log(e)
        throw new GraphQLError('USUARIO NO AUTENTICADO', {

        extensions: {

          code: 'UNAUTHENTICATED',

          http: { status: 401 },

        },
    })
    }
        
    
}

export const obtnertoken =async (token: string): Promise<any> => {
    let data=null;
   jwt.verify(token, secret, (err, decoded) => {
         if(err){
        
         }else{
              data=decoded
         }
   })
   

    return data;
}
export function createJWT(payload:any) {

    const token = jwt.sign(payload, secret)
    return token

}