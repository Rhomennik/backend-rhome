var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Radio = require('../models/radio');

// ==========================================
// Obtener Radio por ID
// ==========================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Radio.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, radio) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar radio',
                    errors: err
                });
            }
            if (!radio) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El radio con el id ' + id + 'no existe',
                    errors: { message: 'No existe un radio con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                radio: radio
            });
        })
})



// ==========================================
// Obtener todos los radioes
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.params.desde || 0;
    desde = Number(desde);

    Radio.find({})
        .skip(desde)
        .limit(5)
        .populate('card')
        .exec(
            (err, radioes) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando radio',
                        errors: err
                    });
                }

                Radio.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        radioes: radioes,
                        total: conteo
                    });
                })

            });
});


// ==========================================
// Actualizar Radio
// ==========================================
app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Radio.findById(id, (err, radio) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar radio',
                errors: err
            });
        }

        if (!radio) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El radio con el id ' + id + ' no existe',
                errors: { message: 'No existe un radio con ese ID' }
            });
        }


        radio.card = body.card;
        radio.name = body.name;
        if (radio.position === null) {
            console.log('af')
        } else {
            radio.position = req.body.position;

        }

        radio.save((err, radioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar radio',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                radio: radioGuardado
            });

        });

    });

});



// ==========================================
// Criar  radio
// ==========================================
app.post('/', (req, res) => {

    var body = req.body;

    var radio = new Radio({
        card: body.card,
        name: body.name,
        position: req.body.position.split(',')
    });

    radio.save((err, radioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error em criar radio',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            radio: radioGuardado
        });


    });

});


// ============================================
//   Borrar un radio por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Radio.findByIdAndRemove(id, (err, radioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar radio',
                errors: err
            });
        }

        if (!radioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un radio con ese id',
                errors: { message: 'No existe un radio con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            radio: radioBorrado
        });

    });

});


module.exports = app;