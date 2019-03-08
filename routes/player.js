var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Player = require('../models/player');

// ==========================================
// Obtener Player por ID
// ==========================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Player.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, player) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar player',
                    errors: err
                });
            }
            if (!player) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El player con el id ' + id + 'no existe',
                    errors: { message: 'No existe un player con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                player: player
            });
        })
})



// ==========================================
// Obtener todos los player
// ==========================================
app.get('/desde/:desde/', (req, res, next) => {

    var desde = req.params.desde || 0;
    desde = Number(desde);

    Player.find({})
        .skip(desde)
        .limit(20)
        .exec(
            (err, player) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando player',
                        errors: err
                    });
                }

                Player.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        player: player,
                        total: conteo
                    });
                })

            });
});


// ==========================================
// Actualizar Player
// ==========================================
app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Player.findById(id, (err, player) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar player',
                errors: err
            });
        }

        if (!player) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El player con el id ' + id + ' no existe',
                errors: { message: 'No existe un player con ese ID' }
            });
        }


        player.nombre = body.nombre;
        player.url = body.url;
        player.detalles = body.detalles;

        player.save((err, playerGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar player',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                player: playerGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo player
// ==========================================
app.post('/', (req, res) => {

    var body = req.body;

    var player = new Player({
        nombre: body.nombre,
        url: body.url,
        detalles: body.detalles
    });

    player.save((err, playerGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear player',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            player: playerGuardado
        });


    });

});


// ============================================
//   Borrar un player por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Player.findByIdAndRemove(id, (err, playerBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar player',
                errors: err
            });
        }

        if (!playerBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un player con ese id',
                errors: { message: 'No existe un player con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            player: playerBorrado
        });

    });

});


module.exports = app;