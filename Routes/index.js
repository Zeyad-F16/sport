const AdminRoute = require('../Routes/adminRoute');
const GellaryRoute = require('../Routes/GellaryRoute');
const TeamMemberRoute = require('../Routes/TeamMemberRoute');

const MountRoutes = (app)=>{
app.use('/assiutmotorsport/api/admin', AdminRoute);
app.use('/assiutmotorsport/api/admin', GellaryRoute);
app.use('/assiutmotorsport/api/admin', TeamMemberRoute);
};

module.exports = MountRoutes;