const { model } = require('mongoose');

const express = require('express');

const bcript = require('bcrypt');
const _ = require('underscore');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/auth');
const Usuario = require('../models/usuario');

const app = express();


//==============================
// Mostrar todos los usuarios
//==============================
app.get('/usuario', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.desde || 0;
    limite= Number(limite);

    Usuario.find({status: true},'nombre email role status google img')
            .skip(desde)
            .limit(limite)
            .exec((err, usuarios) => {
                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }  

                Usuario.count({status:true}, (err, conteo) => {

                    res.json({
                        ok: true,
                        usuarios,
                        total_users: conteo
                    });
                });
            });
});
 
//==============================
// Crear un nuevo usuario
//==============================
app.post('/usuario', [verificaToken, verificaAdmin_Role], (req, res) => {
    
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcript.hashSync( body.password, 10 ),
        role: body.role
    });

    usuario.save( (err, usuarioDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    }); 
});


//===============================
// Modificar un usuario existente
//===============================
app.put('/usuario/:id', [verificaToken, verificaAdmin_Role],(req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre','email','img','role','status']);

    Usuario.findOneAndUpdate(id, body,{ new: true, runValidators:true }, (err, usuarioDB) =>{

        if(err){
             return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

//==============================
// Eliminar un usuario
//==============================
app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    
    let id = req.params.id; 

    // ==================================================== 
    // ======= Borrado fisico de usuario de la BBDD =======
    // ====================================================
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    // =================================================== 
    // ======= Desactivacion de usuario en la BBDD =======
    // ===================================================
    let cambiaEstado ={
        status:false
    };

    Usuario.findOneAndUpdate(id, cambiaEstado, {new: true}, (err, usuarioBorrado) => {

        if(err){
            return res.status(400).json({
               ok: false,
               err
           });
        }
        if( !usuarioBorrado ){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Usuario no encontrado'
                }
            });
        }
       res.json({
           ok: true,
           usuario: usuarioBorrado
       });
    });
});

module.exports = app;