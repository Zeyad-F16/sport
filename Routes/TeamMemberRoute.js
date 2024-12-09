const express = require('express');

const { createTeamMember , updateTeamMember ,deleteTeamMember , uploadTeamMemberImage ,resizeImage} = require('../Controllers/TeamMemberController');

const {createTeamMemberValidator, updateTeamMemberValidator , deleteTeamMemberValidator} = require('../utils/Validators/TeamMemberValidator');

const {protect} = require('../Controllers/AdminAuthController');

const router = express.Router();

router.post('/createTeamMember', protect , uploadTeamMemberImage , resizeImage  , createTeamMemberValidator, createTeamMember);
router.put('/updateTeamMember/:id', protect , uploadTeamMemberImage , resizeImage  , updateTeamMemberValidator, updateTeamMember);
router.delete('/deleteTeamMember/:id', protect , deleteTeamMemberValidator, deleteTeamMember);

module.exports = router;