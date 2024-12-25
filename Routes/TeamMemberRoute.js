const express = require('express');

const { createTeamMember ,
        updateTextData ,
        updateProfileImage,
        getAllTeamMembers,
        getOneTeamMember,
        deleteTeamMember ,
        uploadProfileImage,
        handleSingleFileUpload} = require('../Controllers/TeamMemberController');

const {createTeamMemberValidator,
      updateTeamMemberValidator ,
      deleteTeamMemberValidator,
      getTeamMemberValidator} = require('../utils/Validators/TeamMemberValidator');

const {protect} = require('../Controllers/AdminAuthController');

const router = express.Router();

router.get('/', getAllTeamMembers);

router.get('/:id', getTeamMemberValidator , getOneTeamMember);

router.post('/createTeamMember', protect ,
                      uploadProfileImage ,
                  handleSingleFileUpload ,
               createTeamMemberValidator ,
                        createTeamMember);

router.put('/updateTextData/:id', protect ,
                 updateTeamMemberValidator,
                           updateTextData);

router.put('/updateTeamMemberProfileImage/:id', protect ,
                                     uploadProfileImage ,
                                 handleSingleFileUpload ,
                               updateTeamMemberValidator,
                                     updateProfileImage);

router.delete('/deleteTeamMember/:id', protect ,
                      deleteTeamMemberValidator,
                              deleteTeamMember);

module.exports = router;