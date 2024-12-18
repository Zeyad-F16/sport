const express = require('express');

const { createGellary ,
         updateNonImages,
         uploadGellaryImagesMiddleware,
         handleFileUploads,
         updateToAddNewImages,
         deleteSingleImage ,
         getOneGellary,
        getAllGellary,
        deleteGallery
                     } = require('../Controllers/GellaryController');

const {createGellaryValidator ,
     updateGellaryValidator ,
      deleteGellaryValidator,
     getGellaryValidator} = require('../utils/Validators/GellaryValidator');

const {protect} = require('../Controllers/AdminAuthController');

const router = express.Router();

router.get('/', getAllGellary);

router.get('/:id',getGellaryValidator , getOneGellary);

router.post('/createGellary', protect , uploadGellaryImagesMiddleware, handleFileUploads, createGellaryValidator, createGellary );

router.put('/updateNonImages/:id', protect , updateGellaryValidator, updateNonImages);

router.put('/addNewImages/:id', protect , uploadGellaryImagesMiddleware, handleFileUploads, updateGellaryValidator, updateToAddNewImages );

router.delete('/deleteSingleImage/:id', protect , deleteGellaryValidator, deleteSingleImage);

router.delete('/deleteGallery/:id', protect , deleteGellaryValidator, deleteGallery);

module.exports = router;