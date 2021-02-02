
const express = require('express');

const {verificaToken, verificaAdmin_Role} = require('../middlewares/auth');

const app = express();

const Producto = require('../models/producto');

//==============================
// Mostrar todos los productos
//==============================
app.get('/producto', verificaToken, (req, res) => {
    
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({disponible:true}, 'nombre precioUni descripcion categoria usuario' )
            .skip(desde)
            .limit(5)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .exec((err, productos) => {

                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                Producto.count({disponible:true}, (err, conteo) => {
                    res.json({
                        ok: true,
                        productos,
                        total_products: conteo
                    });
                });
            });
});

//==============================
// Mostrar un producto por ID
//==============================
app.get('/producto/:id', verificaToken, (req, res) => {
    
    let id = req.params.id;

    Producto.findById(id)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .exec((err, productoDB) => {

                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                if(!productoDB){
                    return res.status(400).json({
                        ok: false,
                        err:{
                            message:'El ID no existe'
                        }
                    });
                }

                res.json({
                    ok: true,
                    producto: productoDB
                });
    });

});

//==============================
// Buscar productos
//==============================
app.get('/productos/buscar/:termino', verificaToken, (req,res)=>{

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({nombre: regex})
            .populate('categoria', 'descripcion')
            .exec((err, productos) => {

                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    producto: productos
                });
            });
});

//==============================
// Crear un producto
//==============================
app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });
});

//==============================
// Modificar un producto
//==============================
app.put('/producto/:id', verificaToken, (req, res) => {
    //grabar usuario
    //grabar categoria

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err:{
                    message:'El producto no existe'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardo) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardo
            });
        });
    });
});

//==============================
// Eliminar un producto
//==============================
app.delete('/producto/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    
    let id = req.params.id;

    let cambiaEstado ={
        disponible: false
    };

    Producto.findOneAndUpdate(id, cambiaEstado, {new: true}, (err, productoBorrado) => {

        if(err){
            return res.status(400).json({
               ok: false,
               err
           });
        }
        if( !productoBorrado ){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Producto no encontrado'
                }
            });
        }
       res.json({
           ok: true,
           producto: productoBorrado
       });
    });
});

module.exports = app;