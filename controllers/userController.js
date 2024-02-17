const User = require('../models/userModel');

const getUserByUrl = async (req, res, next) => {
  try {
      // Split the URL by slashes and get the last part
      const url = req.originalUrl;
      const parts = url.split('/');
      const lastPart = parts[parts.length - 1];

      // Remove id= text
      const id = lastPart.replace("id=", '');

      // Find the board in the database
      const user = await User.findById(id);  

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      } else {
          res.user = user;
      }
  }
  catch (err) {
      res.status(500).json({ message: err.message });
  }
  next();
}

module.exports = {
  getUserByUrl,
}
