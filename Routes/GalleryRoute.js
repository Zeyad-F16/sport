const express = require('express');

const { createGallery ,
         updateTextData,
         uploadCoverImageMiddleware,
         uploadGalleryImagesMiddleware,
         handleFileUploads,
         updateToAddNewImages,
         updateSingleImage,
         handleSingleFileUpload,
         deleteSingleImage ,
         getOneGallery,
         getAllGallery,
         deleteGallery
                     } = require('../Controllers/GalleryController');


const {createGalleryValidator ,
       updateGalleryValidator ,
        deleteGalleryValidator,
           getGalleryValidator} = require('../utils/Validators/GalleryValidator');

const {protect} = require('../Controllers/AdminAuthController');

const router = express.Router();

router.get('/', getAllGallery);

router.get('/:id',getGalleryValidator , getOneGallery);

router.post('/createGallery', protect ,
            uploadCoverImageMiddleware,
                handleSingleFileUpload,
                createGalleryValidator,
                        createGallery);

                        
router.put('/updateCoverImage/:id', protect ,
               uploadCoverImageMiddleware,
                   handleSingleFileUpload,
                   updateGalleryValidator,
                       updateSingleImage);


router.put('/updateTextData/:id', protect ,
                    updateGalleryValidator,
                           updateTextData);


router.put('/uploadGalleryImages/:id',  protect ,
                   uploadGalleryImagesMiddleware,
                              handleFileUploads ,
                          updateGalleryValidator,
                           updateToAddNewImages);


router.delete('/deleteSingleImage/:id', protect ,
                          deleteGalleryValidator,
                              deleteSingleImage);


router.delete('/deleteGallery/:id', protect ,
                      deleteGalleryValidator,
                              deleteGallery);

module.exports = router;