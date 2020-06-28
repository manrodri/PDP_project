const {validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password');
    } catch (err) {
        const error = new HttpError(
            'Fetching users failed, please try again later.',
            500
        );
        return next(error);
    }
    res.json({users: users.map(user => user.toObject({ getters: true }))});
};

const signUp = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors)
        return next(new HttpError("Invalid input passed, please check your data", 422))
    }
    const {name, email, password, trades } = req.body;

    let existingUser;
    try {
        await User.findOne({ email: email })
    } catch (err) {
        console.log(err)
        const error = new HttpError("Creating trade failed, please try again", 500);
        return next(error)
    }
    if(existingUser){
        return next(new HttpError("User exists already, please login", 422));
    }

    const newUser = new User({
        name,
        email,
        password,  // todo: encrypt password
        trades // todo: link user and trades
    });
    
    try {
        await newUser.save();
    } catch (e) {
        console.log(e)
        const error = new HttpError("Creating trade failed, please try again", 501);
        return next(error)
    }

    res.status(201).json({trade: newUser.toObject({ getters: true })});
}

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email })
    } catch (err) {
        console.log(err)
        const error = new HttpError("Login failed, please try again", 500);
        return next(error)
    }

    if(!existingUser || existingUser.password !== password){
        const error = new HttpError("Invalid username or credential, please try again", 401);
        return next(error);
    }

    res.json({message: "User logged in!"})
}

exports.signUp = signUp;
exports.login = login;
exports.getUsers = getUsers;