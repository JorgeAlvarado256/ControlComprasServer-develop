// const express = require('express');
const { Estado } = require('../models/EstadoModel');

exports.obtenerEstadoPedido = async (req, res) => {
    try{
        const estados = await Estado.findAll(
        //     {
        //     where:{tipo_estado: 'PEDIDO'}
        // }
        );
    
        if (!estados) {
            return res.status(401).json({ message: 'No hay estados' });
        }
        res.status(200).json(estados);
    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: 'Error al buscar Estados. ERROR:' + error });
    }
}