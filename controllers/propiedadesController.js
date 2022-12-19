

const admin = (req, res) => {
  
    res.render('propiedades/admin', {
        pagina: 'Mis Propiedades', 
        barra: true
    })
}

const crearPropiedad = (req, res) =>{
    res.render('propiedades/crear-propiedad', {
        pagina: 'Crear Propiedad',
        barra: true
    })
}


export {
    admin, 
    crearPropiedad
}