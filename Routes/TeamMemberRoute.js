const express = require('express');

const { createTeamMember ,
        updateNonImages ,
        updateSingleImage,
        getAllTeamMembers,
        getOneTeamMember,
        deleteTeamMember ,
        uploadMiddleware,
        handleSingleFileUpload} = require('../Controllers/TeamMemberController');

const {createTeamMemberValidator,
      updateTeamMemberValidator ,
      deleteTeamMemberValidator,
      getTeamMemberValidator} = require('../utils/Validators/TeamMemberValidator');

const {protect} = require('../Controllers/AdminAuthController');

const router = express.Router();

router.get('/', getAllTeamMembers);
router.get('/:id', getTeamMemberValidator , getOneTeamMember);
router.post('/createTeamMember', protect ,uploadMiddleware , handleSingleFileUpload , createTeamMemberValidator, createTeamMember);
router.put('/updateNonImages/:id', protect , updateTeamMemberValidator, updateNonImages);
router.put('/updateTeamMemberProfileImage/:id', protect , uploadMiddleware , handleSingleFileUpload , updateTeamMemberValidator, updateSingleImage);
router.delete('/deleteTeamMember/:id', protect , deleteTeamMemberValidator, deleteTeamMember);

module.exports = router;