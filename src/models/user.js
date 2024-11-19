import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        id: { type: String },
        name: { type: String, required: true },
        email: { type: String, required: true },
        cpf: { type: String, required: true },
        password: { type: String, required: true },
        phone: { type: Number, required: true },
        address: { type: String, required: true },
        number: { type: Number, required: true },
        zipCode: { type: Number, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        type: { type: String, default: 'funcionario' },

    }

);

const users = mongoose.model('users', userSchema);

export default users;