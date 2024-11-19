import mongoose from 'mongoose';

const hourSchema = new mongoose.Schema(
    {
        day: {
            type: [Number], required: true,
        },
        begin: {
            type: String, required: true,
        },
        end: {
            type: String, required: true,
        },
        professional: { 
            type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true 
        },
        createdAt: {
            type: Date, default: Date.now,
        },
    }
);

const Hour = mongoose.model('hours', hourSchema);

export default Hour;