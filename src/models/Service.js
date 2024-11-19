import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
    {
        id: { type: String }, // ID do agendamento

        typeOfService: { type: mongoose.Schema.Types.ObjectId, ref: 'typeOfServices', required: true }, // Tipo de serviço, por exemplo, Corte, Barba, etc.

        customer: { type: mongoose.Schema.Types.ObjectId, ref: 'clients', required: true }, // Referência ao cliente que agendou

        professional: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }, // Referência ao barbeiro/profissional

        hour: { type: mongoose.Schema.Types.ObjectId, ref: 'hours', required: true }, // Referência ao horário
        
        paymentMethod: { type: String, required: true }, // Método de pagamento, ex: Pix, Cartão, etc.

        price: { type: Number, get: (v) => parseFloat(v).toFixed(2) }, // Preço do serviço

        status: { type: String, default: 'Agendado' }, // Status do agendamento

        creationDate: { type: Date, required: true, default: Date.now }, // Data e hora do agendamento
        
        completionDate: { type: Date }, // Data de conclusão do serviço
    }
);

const Service = mongoose.model('services', serviceSchema);

export default Service;
