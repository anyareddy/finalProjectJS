var User = require('../models/user')

function getUsers() {
	return User.findAll();
}

module.exports = {
  getUsers
};
