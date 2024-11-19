import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
    {
        id: { type: String },
        name: { type: String, required: true },
        phone: { type: Number, required: true },
        type: { type: String, default: 'cliente' },
        password: { type: String, required: true },
        email: { type: String, required: true },

    }

);

const clients = mongoose.model('clients', clientSchema);

export default clients;