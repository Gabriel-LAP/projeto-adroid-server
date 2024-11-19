import Hours from '../models/Hour.js'
import { validateHour } from '../middlewares/validateHour.js'


class hourController {
    // Método estático que lista todos os serviços
    static listAllHours = (req, res) => {
        // Busca todos os documentos na coleção Services
        Hours.find()
            .populate('professional', 'name')
            // Executa a query e retorna uma Promise
            .exec().then((hour) => {
                // Retorna status 200 (OK) e os serviços em formato JSON
                res.status(200).json(hour)
            })
    }

    // Método estático que busca um serviço específico pelo ID
    static listHourById = (req, res) => {
        // Extrai o ID dos parâmetros da requisição
        const id = req.params.id;

        // Busca um documento pelo ID na coleção Services
        Hours.findById(id)
            .populate('professional', 'name')
            // Executa a query
            .exec()
            // Se encontrar o documento, retorna status 200 e os dados em JSON
            .then((hour) => {
                res.status(200).json(hour)
            })
            // Se houver erro, retorna status 400 (Bad Request) com mensagem de erro
            .catch((err) => {
                res.status(400).send({ message: `${err.message} - Id do horári não localizado.` })
            })
    }

    // Método estático que busca serviços pelo nome
    static listHourByDay = (req, res) => {
        // Extrai o nome dos parâmetros de consulta (query string)
        const day = req.query.day;

        // Busca documentos que correspondam ao nome fornecido
        Hours.find({ 'day': day })
            .populate('professional', 'name')
            // Executa a query
            .exec()
            // Se encontrar documentos, retorna status 200 e os dados em JSON
            .then((hour) => {
                res.status(200).json(hour)
            })
            // Se houver erro, retorna status 400 (Bad Request) com mensagem de erro
            .catch((err) => {
                res.status(400).send({ message: `${err.message} - Nome do serviço não localizado.` })
            })
    }

    // Método estático assíncrono para registrar um novo serviço
    static async registerHour(req, res) {
        // Desestrutura os dados necessários do corpo da requisição
        // Define 'Agendado' como valor padrão para status se não for fornecido
        const {
            day,    // Referência ao tipo de serviço a ser realizado
            begin,    // Método de pagamento escolhido
            end,           // Valor do serviço
            customer,         // ID do cliente que solicitou o serviço
            professional,     // ID do profissional que realizará o serviço
            
            typeOfService, // Status do serviço (padrão: 'Agendado')
            creationDate,    // Data em que o serviço foi registrado
            
        } = req.body;

        // Valida os dados recebidos usando o middleware de validação
        const validationErrors = validateHour(req.body);
        // Se houver erros de validação, retorna status 422 (Unprocessable Entity) com os erros
        if (validationErrors.length > 0) {
            // Retorna status 422 (Unprocessable Entity) com lista de erros
            return res.status(422).json({ errors: validationErrors });
        }

        // Cria uma nova instância do modelo Services com os dados validados
        const hour = new Hours({
            day,    // Referência ao tipo de serviço a ser realizado
            begin,    // Método de pagamento escolhido
            end,           // Valor do serviço
            professional,     // ID do profissional que realizará o serviço
            typeOfService, // Status do serviço (padrão: 'Agendado')
            creationDate,    // Data em que o serviço foi registrado
        });

        try {
            // Tenta salvar o novo serviço no banco de dados
            await hour.save().then((hour) => {
                // Se sucesso, retorna status 201 (Created) e os dados do serviço criado
                res.status(201);
                res.send(hour.toJSON());
            });
        } catch (err) {
            // Se houver erro ao salvar, retorna status 500 (Internal Server Error) com mensagem
            return res
                .status(500)
                .send({ message: `${err.message} - falha ao cadastrar horário.` });
        }
    }

    // Método estático para atualizar um serviço existente
    static updateHour = (req, res) => {
        // Extrai o ID dos parâmetros da requisição
        const id = req.params.id;

        // Busca e atualiza o documento pelo ID usando o operador $set do MongoDB
        // O operador $set atualiza apenas os campos fornecidos no req.body
        Hours.findByIdAndUpdate(id, { $set: req.body })
            // Se a atualização for bem-sucedida
            .then((hour) => {
                // Retorna status 200 (OK) com mensagem de sucesso e o serviço atualizado
                res.status(200).send({ message: 'Horário atualizado com sucesso', hour })
            })
            // Se houver erro, retorna status 500 (Internal Server Error) com mensagem
            .catch((err) => {
                res.status(500).send({ message: err.message })
            })
    }

    // Método estático para deletar um serviço
    static deleteHour = (req, res) => {
        // Extrai o ID dos parâmetros da requisição
        const id = req.params.id;

        // Busca e deleta o documento pelo ID
        Hours.findByIdAndDelete(id)
            // Se a deleção for bem-sucedida
            .then((hour) => {
                // Retorna status 200 (OK) com mensagem de sucesso
                res.status(200).send({ message: 'Horário removida com sucesso' })
            })
            // Se houver erro, retorna status 500 (Internal Server Error) com mensagem
            .catch((err) => {
                res.status(500).send({ message: err.message })
            })
    }
}

export default hourController