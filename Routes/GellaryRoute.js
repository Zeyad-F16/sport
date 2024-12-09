const express = require('express');

const { createGellary  , uploadGellaryImage , resizeGellaryImages, updateGellary , deleteGellary} = require('../Controllers/GellaryController');

const {createGellaryValidator , updateGellaryValidator , deleteGellaryValidator} = require('../utils/Validators/GellaryValidator');

const {protect} = require('../Controllers/AdminAuthController');

const router = express.Router();

router.post('/createGellary', protect , uploadGellaryImage , resizeGellaryImages  , createGellaryValidator, createGellary);
router.put('/updateGellary/:id', protect , uploadGellaryImage , resizeGellaryImages  , updateGellaryValidator, updateGellary);
router.delete('/deleteGellary/:id', protect , deleteGellaryValidator, deleteGellary);

module.exports = router;