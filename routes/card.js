var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Card = require('../models/card');

// ==========================================
// Obtener Card por ID
// ==========================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Card.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, card) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar card',
                    errors: err
                });
            }
            if (!card) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El card con el id ' + id + 'no existe',
                    errors: { message: 'No existe un card con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                card: card
            });
        })
})



// ==========================================
// Obtener todos los cardes
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.params.desde || 0;
    desde = Number(desde);

    Card.find({})
        .skip(desde)
        .limit(5)
        .exec(
            (err, cardes) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando card',
                        errors: err
                    });
                }

                Card.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        cardes: cardes,
                        total: conteo
                    });
                })

            });
});


// ==========================================
// Actualizar Card
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Card.findById(id, (err, card) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar card',
                errors: err
            });
        }

        if (!card) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El card con el id ' + id + ' no existe',
                errors: { message: 'No existe un card con ese ID' }
            });
        }


        card.nombre = body.nombre;
        card.usuario = req.usuario._id;

        card.save((err, cardGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar card',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                card: cardGuardado
            });

        });

    });

});




// ==========================================
// Crear un nuevo card
// ==========================================
app.post('/', (req, res) => {

    var body = req.body;

    var card = new Card({
        description: body.description,
        header: body.header,
        summary: body.summary
    });

    card.save((err, cardGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear card',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            card: cardGuardado
        });


    });

});



// ============================================
//   Borrar un card por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Card.findByIdAndRemove(id, (err, cardBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar card',
                errors: err
            });
        }

        if (!cardBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un card con ese id',
                errors: { message: 'No existe un card con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            card: cardBorrado
        });

    });

});


module.exports = app;