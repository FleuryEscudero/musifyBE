'use strict'



function pruebas(req, res) {
    res.status(200).send({
        menssage: 'Esta ruta es de prueba en mi api restful con mongo y node de musify'
    });
};


module.exports = {
    pruebas
        }