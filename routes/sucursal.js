var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Sucursal = require('../models/sucursal');
// Date atual
var date = require('date-and-time');


module.exports = app;

// ==========================================
// Obtener todos los sucursals
// ==========================================
app.get('/:desde/', (req, res, next) => {

    var desde = req.params.desde || 0;
    desde = Number(desde);

    Sucursal.find({})
        .skip(desde)
        .limit(5)
        .populate('departamentos')
        .populate('player')
        .exec(
            (err, sucursals) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando sucursal',
                        errors: err
                    });
                }

                Sucursal.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: [true, 'desde'],
                        sucursals: sucursals,
                        total: conteo
                    });

                })

            });
});

// ==========================================
// Obtener sucursal por ID
// ==========================================
app.get('/id/:id', (req, res) => {
    var id = req.params.id;
    Sucursal.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, sucursal) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar sucursal',
                    errors: err
                });
            }
            if (!sucursal) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El sucursal con el id ' + id + 'no existe',
                    errors: { message: 'No existe un sucursal con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                sucursal: sucursal
            });
        })
})

// ==========================================
// Actualizar sucursal
// ==========================================
app.put('/:id', (req, res) => {
    var id = req.params.id;
    var body = req.body;
    // Date atual
    let now = new Date();


    Sucursal.findById(id, (err, sucursal) => {


        if (err) {
            return res.status(500).json({
                ok: [true, 'desde Actualizar Sucursal'],
                mensaje: 'Error al buscar sucursal',
                errors: err
            });
        }

        if (!sucursal) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El sucursal con el id ' + id + ' no existe',
                errors: { message: 'No existe un sucursal con ese ID' }
            });
        }


        sucursal.nombre = body.nombre;
        sucursal.lat = body.lat;
        sucursal.long = body.long;
        sucursal.telefono = body.telefono;
        sucursal.vpn = body.vpn;
        sucursal.ippublico = body.ippublico;
        sucursal.departamentos = body.departamentos;
        sucursal.unico = body.departamentos;

        sucursal.save((err, sucursalGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar sucursal',
                    errors: err
                });
            }


            res.status(200).json({
                ok: true,
                sucursal: sucursalGuardado
            });

        });

    });

});


// ==========================================
// Crear un nuevo sucursal
// ==========================================
app.post('/', (req, res) => {

    var body = req.body;

    var sucursal = new Sucursal({
        nombre: body.nombre,
        long: body.long,
        lat: body.lat,
        telefono: body.telefono,
        vpn: body.vpn,
        ippublico: body.ippublico,
        departamentos: body.departamentos,
        unico: body.departamentos
    });

    sucursal.save((err, sucursalGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear sucursal',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            sucursal: sucursalGuardado,
            sucursaltoken: req.sucursal
        });


    });

});


// ============================================
//   Borrar un sucursal por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Sucursal.findByIdAndRemove(id, (err, sucursalBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar sucursal',
                errors: err
            });
        }

        if (!sucursalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un sucursal con ese id',
                errors: { message: 'No existe un sucursal con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            sucursal: sucursalBorrado
        });

    });

});

module.exports = app;