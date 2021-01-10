const express = require('express');
const { model } = require('mongoose');
const bcript = require('bcrypt');
const _ = require('underscore');

const app = express();
const Usuario = require('../models/usuario');

app.get('/usuario', function (req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.desde || 0;
    limite= Number(limite);

    Usuario.find({},'nombre email role status google img')
            .skip(desde)
            .limit(limite)
            .exec((err, usuarios) => {
                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }  

                Usuario.count({}, (err, conteo) => {

                    res.json({
                        ok: true,
                        usuarios,
                        total_users: conteo
                    });

                });
            })
});
 
app.post('/usuario', function (req, res) {
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
        })
    })
        
});

app.put('/usuario/:id', function (req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre','email','img','role','status'] );

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
        })
        
    })
});

app.delete('/usuario', function (req, res) {
    res.json('delete Usuario')
});

module.exports = app;