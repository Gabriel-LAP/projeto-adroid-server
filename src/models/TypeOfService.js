import mongoose from 'mongoose'

const typeOfServiceSchema = new mongoose.Schema(
    {
        id: { type: String },
        name: { type: String, required: true },
        price: { type: Number, required: true, decimal2: true },
        description: { type: String, required: true },

    }
)

const typeOfServices = mongoose.model('typeOfServices', typeOfServiceSchema);

export default typeOfServices 