const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;

// Esquema para almacenar usuarios en MongoDB
 const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Middleware para encriptar la contraseña antes de guardar el usuario
userSchema.pre('save', function(next) {
    if (!this.isNew || this.isModified('password')) {
        const document = this;

        bcrypt.hash(document.password, saltRounds, (err, hashedPassword) => {
            if (err) {
                next(err);
            } else {
                document.password = hashedPassword;
                next();
            }
        });
    }else{
        next();
    }

});

userSchema.methods.isCorrectPassword = function(password, callback) {
    bcrypt.compare(password, this.password, (err, same) => {
        if (err) {
            callback(err);
        } else {
            callback(err, same);
        }
    });
};

module.exports = mongoose.model('User', userSchema);