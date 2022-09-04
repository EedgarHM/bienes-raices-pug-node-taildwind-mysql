const formularioLogin = (req, res)=> {
    res.render('auth/login',{
        pagina : 'Iniciar Sesion'
    })
}


const formularioRegistro = (req, res) => {
    res.render('auth/registro',{

        // Sending data to view
        pagina : 'Crear Cuenta'
    })
}

const formularioRecuperacionPassword = (req, res) => {
    res.render('auth/recuperar-password',{

        // Sending data to view
        pagina : 'Recuperar Password'
    })
}


export {
    formularioLogin,
    formularioRegistro,
    formularioRecuperacionPassword
}