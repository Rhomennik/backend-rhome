var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Departamentos = require('../models/departamentos');

// ==========================================
// Obtener Departamentos por ID
// ==========================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Departamentos.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, departamentos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar departamentos',
                    errors: err
                });
            }
            if (!departamentos) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El departamentos con el id ' + id + 'no existe',
                    errors: { message: 'No existe un departamentos con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                departamentos: departamentos
            });
        })
})



// ==========================================
// Obtener todos los departamentoses
// ==========================================
app.get('/desde/:desde/', (req, res, next) => {

    var desde = req.params.desde || 0;
    desde = Number(desde);

    Departamentos.find({})
        .skip(desde)
        .limit(20)
        .populate('player')
        .exec(
            (err, departamentoses) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando departamentos',
                        errors: err
                    });
                }

                Departamentos.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        departamentoses: departamentoses,
                        total: conteo
                    });
                })

            });
});


// ==========================================
// Actualizar Departamentos
// ==========================================
app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Departamentos.findById(id, (err, departamentos) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar departamentos',
                errors: err
            });
        }

        if (!departamentos) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El departamentos con el id ' + id + ' no existe',
                errors: { message: 'No existe un departamentos con ese ID' }
            });
        }


        //    departamentos.nombre = body.nombre;
        //    departamentos.numero = req.numero;
        departamentos.player = body.player;

        departamentos.save((err, departamentosGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar departamentos',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                departamentos: departamentosGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo departamentos
// ==========================================
app.post('/', (req, res) => {

    var body = req.body;

    var departamentos = new Departamentos({
        nombre: body.nombre,
        numero: body.numero,
        player: body.player

    });

    departamentos.save((err, departamentosGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear departamentos',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            departamentos: departamentosGuardado
        });


    });

});


// ============================================
//   Borrar un departamentos por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Departamentos.findByIdAndRemove(id, (err, departamentosBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar departamentos',
                errors: err
            });
        }

        if (!departamentosBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un departamentos con ese id',
                errors: { message: 'No existe un departamentos con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            departamentos: departamentosBorrado
        });

    });

});


module.exports = app;