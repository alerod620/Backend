const jwt = require('jsonwebtoken');

module.exports= {
    validateRegister: (req, res, next) => {
        
        // username min length 3
        if (!req.body.correo || req.body.correo.length < 13) {
            return res.status(400).send({
            msg: 'El correo debe tener una longitud mínima de 3 caracteres'
        });
      }
        // password min 6 chars
        if (!req.body.password || req.body.password.length < 6) {
            return res.status(400).send({
            msg: 'La contraseña debe tener una longitud mínima de 6 caracteres'
            });
        }
        // password (repeat) does not match
        /*
        if ( !req.body.password_repeat ||  req.body.password != req.body.password_repeat ) {
            return res.status(400).send({
            msg: 'Both passwords must match'
            });
        }
        */
        next();
    }
}