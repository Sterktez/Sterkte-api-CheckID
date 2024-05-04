const { dataGame } = require('../utils/data');
const {
   codashopServices,
   duniaGamesServices,
   au2mobileServices,
   roGlobalServices,
   bosBosGameServices,
} = require('../services');

const idCheckController = async (req, res) => {
   const slug = req.params.game;
   const { id, zone } = req.query;

   const game = dataGame.find((item) => item.slug === slug);
   if (!game) return res.status(404).json({ status: false, message: 'Game not found' });
   if (!id) return res.status(400).json({ status: false, message: 'ID is required' });
   if (game.isZone && !zone) return res.status(400).json({ status: false, message: 'Zone is required' });

   switch (game.provider) {
      case 'codashop':
         const getCoda = await codashopServices(game, id, zone);
         return res.status(getCoda.code).json(getCoda);
         break;
      case 'duniagames':
         const getDg = await duniaGamesServices(game, id, zone);
         return res.status(getDg.code).json(getDg);
         break;
      case 'au2mobile':
         const getAu = await au2mobileServices(game, id, zone);
         return res.status(getAu.code).json(getAu);
         break;
      case 'roglobal':
         const getRo = await roGlobalServices(game, id, zone);
         return res.status(getRo.code).json(getRo);
         break;
      case 'bosbosgame':
         const checkBosBos = await bosBosGameServices(game, id, zone);
         return res.status(checkBosBos.code).json(checkBosBos);
         break;
      default:
         return res.status(400).json({ status: false, message: 'Provider not found' });
   }
};

module.exports = idCheckController;
