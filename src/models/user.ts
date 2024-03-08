import db from '../db.config';

export default interface User {
    id: number;
    name: string;
    username: string;
    password: string;
}

export async function getUser(username: string): Promise<User | null> {
    try {
        
        const [user]: any = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
        return user[0];
    } catch (error: any) {
        console.error(error);
        return null;
    }
}
