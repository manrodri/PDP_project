const express = require('express');
const { check } = require('express-validator');

const usersControllers = require('../controllers/users-controllers');

const router = express.Router();

// routes
router.get('/', usersControllers.getUsers);

router.post('/signup', [
    check('password').isLength({min: 8}).bail(), check('password').not().isEmpty(),
    // check('password').
    // matches("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[]:;<>,.?/~_+-=|\\]).{8,32}$")
    // todo: find regex for password validation.
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail()
], usersControllers.signUp); // careful here with route order

router.post('/login', usersControllers.login) // careful here with route order

router.get('/:uId', usersControllers.getUserById);

router.patch('/:uId', [
    check('password').isLength({min: 8}).bail(), check('password').not().isEmpty(),
    // check('password').
    // matches("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[]:;<>,.?/~_+-=|]).{8,32}$"),
    // todo: find regex for password validation.
    check('name').not().isEmpty()
], usersControllers.updateUser);

router.delete("/:uId", usersControllers.deleteUser);

module.exports = router;