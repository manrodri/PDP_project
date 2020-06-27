const {uuid} = require('uuidv4');

const HttpError = require('../models/http-error');


// DUMMY_USERS

let DUMMY_USERS = [
    {
        id: 'u1',
        name: "Manuel Rodriguez",
        email: "manuel@example.com",
        password: "password123"
    }
];

// controllers

const getUsers = ((req, res, next) => {
    res.status(200).json({users: DUMMY_USERS});
});

const getUserById = ((req, res, next) => {
    const userId = req.params.uId;
    const user = DUMMY_USERS.find(u => {
        return u.id === userId;
    });

    if (!user) {
        return next(new HttpError("Could not find an user for the provided id", 404));
    }

    res.status(200).json({user: user});  // {trade: trade}
});


const signUp = ((req, res, next) => {
    const {name, email, password } = req.body;
    const hasUser = DUMMY_USERS.find(u => u.email === email);
    if(hasUser){
        throw new HttpError("User already exists, please login", 422);
    }
    const newUser =  {
        id: uuid(),
        name,
        email,
        password
    }

    DUMMY_USERS.push(newUser);
    res.status(201).json({user: newUser})

});

const login = ((req, res, next) => {
    const {email, password} = req.body;
    const identifiedUser = DUMMY_USERS.find(u => u.email === email);
    if(!identifiedUser || identifiedUser.password !== password){
        throw new HttpError("Could not identified user, username or password are incorrect")
    }
    res.status(200).json({message: "user logged in!"})


});

const updateUser = ((req, res, next) => {
    const {name, password}  = req.body;
    const userId = req.params.uId;

    const updatedUser = {...DUMMY_USERS.find(u => u.id === userId)};
    const userIndex = DUMMY_USERS.findIndex(u => u.id === userId);

    updatedUser.name = name;
    updatedUser.password = password;

    DUMMY_USERS[userIndex] = updatedUser;
    res.status(201).json({user: updatedUser});
});


const deleteUser = ((req, res, next) => {
    const userId = req.params.uId;
    DUMMY_USERS = DUMMY_USERS.filter(user => user.id !== userId)
    res.status(200).json({});
});

exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.signUp = signUp;
exports.login = login;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;

