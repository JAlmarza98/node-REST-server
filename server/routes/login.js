const express = require('express');

const bcript = require('bcrypt');
const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuario');

const app = express();

//==============================
// Login normal
//==============================
app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({email: body.email},(err,usuarioDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        
        //Comprobar email
        if( !usuarioDB ){
            return res.status(400).json({
                ok: false,
                err:{
                    message:'Usuario o contraseña incorrectos'
                }
            });
        }

        //Comprobar password
        if( !bcript.compareSync(body.password, usuarioDB.password )){            
            return res.status(400).json({
                ok: false,
                err:{
                    message:'Usuario o contraseña incorrectos'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        },process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN} )

        res.json({
            ok:true,
            usuario: usuarioDB,
            token
        })
    })
});

//Configuraciones de Google
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    
    return{
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

//==============================
// Login Google Sing-In
//==============================
app.post('/google', async (req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch ( e => {
            return res.status(403).json({
                ok:false,
                err: e
            })
        })

    Usuario.findOne({email: googleUser.email},(err,usuarioDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( usuarioDB ){
            //Comprobar si el usuario existe pero no se registro con google
            if(usuarioDB.google === false){
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe usar su autenticacion normal'
                    }
                });
            }else{  //Si existe y se registro con google se le renueva el token
                let token = jwt.sign({
                    usuario: usuarioDB
                },process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN});
        
                return res.json({
                    ok:true,
                    usuario: usuarioDB,
                    token
                });
            }
        }else{
            //Si el usuario no existe en la BBDD
            let usuario = new Usuario();

            usuario.nombre = googleUser.name;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = '😊'; //nunca va a hacer match

            usuario.save( (err, usuarioDB) => {
                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };

                let token = jwt.sign({
                    usuario: usuarioDB
                },process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN} )
        
                return res.json({
                    ok:true,
                    usuario: usuarioDB,
                    token
                })
            })
        }
    })
});


module.exports = app;