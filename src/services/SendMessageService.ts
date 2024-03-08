import dotenv from 'dotenv';
dotenv.config();

export function sendMessage(id:any){
    const weebhook = process.env.WEBHOOK ?? "";
    
    const data = {
        content: `Nuevo user registrado, ID: ${id}`
    };

    fetch(weebhook, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(data => {
        console.log('Mensaje enviado a DS');
    })
    .catch(error => {
        console.error('Error al enviar el mensaje a DS:', error);
    });
}