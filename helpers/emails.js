import nodemailer from 'nodemailer';
const emailRegistro = async (datos) => {

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const { email, nombre, token } = datos

    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Confirma tu cuenta en BienesRaices.com',
        text: 'Confirma tu cuenta en BienesRaices.com',
        html: `
            <p> Hola ${nombre}, comprueba tu cuenta en BienesRaices.com </p>
            <p>
                Tu cuenta ya esta lista, solo debes confirmarla dando clic en el siguiente enlace:
                    <a href="${process.env.BACKEND_URL}:${process.env.PORT  ?? 3000 }/auth/confirmar/${token}">Confirmar Cuenta</a>
            </p>

            <p>
                Si tu no creaste la cuenta, ignora este mensaje
            </p>
        
        `
    })
}


const recuperarPasssword = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const { email, nombre, token } = datos

    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Reestablece tu Password',
        text: 'Reestablece tu Password en BienesRaices.com',
        html: `
            <p> Hola ${nombre}, haz solicitado una recuperacion de password </p>
            <p>
                Sigue el siguiente enlace para generar un nuevo password
                    <a href="${process.env.BACKEND_URL}:${process.env.PORT  ?? 3000 }/auth/recuperar-password/${token}">Reestablecer Password</a>
            </p>

            <p>
                Si tu no solicitaste el cambio de Password, puedes ignorar el mensaje
            </p>
        
        `
    })
}

export {
    emailRegistro,
    recuperarPasssword
}