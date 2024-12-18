const AdminRoute = require('../Routes/adminRoute');
const GellaryRoute = require('../Routes/GellaryRoute');
const TeamMemberRoute = require('../Routes/TeamMemberRoute');

const MountRoutes = (app)=>{
app.use('/assiutmotorsport/api/admin', AdminRoute);
app.use('/assiutmotorsport/api/gellary', GellaryRoute);
app.use('/assiutmotorsport/api/teammember', TeamMemberRoute);
};

module.exports = MountRoutes;