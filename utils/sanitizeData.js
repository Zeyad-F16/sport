exports.sanitizeAdminData = function (admin) {
    return {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
    };
  };