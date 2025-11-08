const User = require("../models/User.js");

const getUser = async (req, res) => {
  try {
    console.log('Query params', req.query);
    const { name, email } = req.query;
    
    
    const query = {}
    if(name) query.name = new RegExp(name,'i');
    if(email) query.email = new RegExp(email,'i');

    console.log('MongoDB query:', query);
    
    const users = await User.find(query);

    const count = await User.countDocuments();

 res.status(200).json({
    message: 'Fetched users data successfully',
    data: users,
    count,

 })

  } catch (error) {
    console.error(error);
    res.status(500).json({
        message:'Server Error',
    })
  }
};


module.exports ={
    getUser
};