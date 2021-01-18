
const jwt = require('jsonwebtoken');

// ==========================================
// Verificar Token
// ==========================================

let verificaToken = ( req, res, next ) =>{

    let token = req.get('Authorization');

    jwt.verify( token, process.env.SEED , (err, decoded) => {
        if (err){
            return res.status(401).json({
                ok:false,
                err:{
                    name: 'JsonWebTokenError',
                    message:'invalid token'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};

// ==========================================
// Verificar AdminRole
// ==========================================

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;
    
    if(usuario.role !='ADMIN_ROLE'){
        return res.status(401).json({
            ok:false,
            err:{
                message:'No posees permisos para realizar esta accion'
            }
        });
    }

    next();
;}

module.exports = {
    verificaToken,
    verificaAdmin_Role
}