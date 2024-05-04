const express = require('express');
const router = express.Router();
const { getZoneController, idCheckController } = require('../controllers');
const { dataGame } = require('../utils/data');
const _ = require('lodash');

const routes = [
   {
      method: 'GET',
      path: '/',
      controller: (req, res) => {
         const newDataGame = dataGame.map((item) => {
            return {
               name: item.name,
               slug: item.slug,
               endpoint: `/api/game/${item.slug}`,
               query: `?id=xxxx${item.isZone ? '&zone=xxx' : ''}`,
               hasZoneId: item.isZone ? true : false,
               listZoneId: item.dropdown ? `/api/game/get-zone/${item.slug}` : null,
            };
         });

         return res.json({
            name: 'Cek Data Game',
            author: 'Bagusok',
            data: _.orderBy(newDataGame, ['name'], ['asc']),
         });
      },
   },
   {
      method: 'GET',
      path: '/game/:game',
      controller: idCheckController,
   },
   {
      method: 'GET',
      path: '/game/get-zone/:game',
      controller: getZoneController,
   },
];

// Menetapkan rute menggunakan objek
routes.forEach((route) => {
   const { method, path, controller } = route;
   console.log(`Menambahkan route ${method} ${path}`);
   router[method.toLowerCase()](path, controller);
});

module.exports = router;
