const AdminRoute = require('../Routes/adminRoute');
const GalleryRoute = require('../Routes/GalleryRoute');
const TeamMemberRoute = require('../Routes/TeamMemberRoute');

const MountRoutes = (app)=>{
app.use('/assiutmotorsport/api/admin', AdminRoute);
app.use('/assiutmotorsport/api/gallery', GalleryRoute);
app.use('/assiutmotorsport/api/teammember', TeamMemberRoute);
};

module.exports = MountRoutes;