const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/stuff');
const auth = require('../middleware/auth');

router.post('/', auth, saucesCtrl.createSauce);
router.put('/:id', auth, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.get('/', auth, saucesCtrl.getAllSauce);

module.exports = router;