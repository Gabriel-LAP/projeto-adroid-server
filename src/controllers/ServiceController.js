// Importa o modelo Services que define a estrutura dos serviços no banco de dados
import Services from '../models/Service.js'

// Importa a função de validação que será usada como middleware para validar os dados dos serviços
import { validateService } from '../middlewares/validateService.js'


class ServiceController {
    
    // Método estático que lista todos os serviços
    static listAllServices = (req, res) => {
        
        // Busca todos os documentos na coleção Services
        Services.find()
            .populate('customer', 'name')
            .populate('professional', 'name')
            // Popula o campo 'hour' trazendo apenas os campos 'day' e 'begin', O valor 1 indica que o campo deve ser incluído na resposta. O valor 0 indica que o campo deve ser excluído da resposta.
            .populate('hour', { day: 1, begin: 1 })
            .populate('typeOfService', { name: 1, price: 1 })
            // Executa a query e retorna uma Promise
            .exec().then((service) => {
                res.status(200).json(service)
            })
    }

    // Método estático que busca um serviço específico pelo ID
    static listServiceById = (req, res) => {
        // Extrai o ID dos parâmetros da requisição
        const id = req.params.id;

        // Busca um documento pelo ID na coleção Services
        Services.findById(id)
            // Popula o campo 'owner' trazendo apenas o campo 'name' do documento relacionado
            .populate('customer', 'name')
            // Executa a query
            .exec()
            // Se encontrar o documento, retorna status 200 e os dados em JSON
            .then((service) => {
                res.status(200).json(service)
            })
            // Se houver erro, retorna status 400 (Bad Request) com mensagem de erro
            .catch((err) => {
                res.status(400).send({ message: `${err.message} - Id da ordem não localizado.` })
            })
    }

    // Método estático que busca serviços pelo nome
    static listServiceByName = (req, res) => {
        // Extrai o nome dos parâmetros de consulta (query string)
        const name = req.query.name;

        // Busca documentos que correspondam ao nome fornecido
        Services.find({ 'name': name })
            // Executa a query
            .exec()
            // Se encontrar documentos, retorna status 200 e os dados em JSON
            .then((client) => {
                res.status(200).json(client)
            })
            // Se houver erro, retorna status 400 (Bad Request) com mensagem de erro
            .catch((err) => {
                res.status(400).send({ message: `${err.message} - Nome do serviço não localizado.` })
            })
    }

    // Método estático que busca serviços pelo status
    static listServiceByStatus = (req, res) => {
        // Extrai o status do corpo da requisição
        const status = req.body.status;

        // Busca documentos que correspondam ao status fornecido
        Services.find({ status: status })
            // Popula o campo 'owner' trazendo apenas o campo 'name' do documento relacionado
            .populate('customer', 'name')
            // Executa a query
            .exec()
            // Se encontrar documentos, retorna status 200 e os dados em JSON
            .then((service) => {
                res.status(200).json(service)
            })
            // Se houver erro, retorna status 400 (Bad Request) com mensagem de erro
            .catch((err) => {
                res.status(400).send({ message: `${err.message} - Ordem não localizada.` })
            })
    }

    // Método estático assíncrono para registrar um novo serviço
    static async registerService(req, res) {
        // Desestrutura os dados necessários do corpo da requisição
        // Define 'Agendado' como valor padrão para status se não for fornecido
        const {
            typeOfService,    // Referência ao tipo de serviço a ser realizado
            customer,         // ID do cliente que solicitou o serviço
            professional,     // ID do profissional que realizará o serviço
            hour,
            paymentMethod,    // Método de pagamento escolhido
            price,           // Valor do serviço
            status, // Status do serviço (padrão: 'Agendado')
            creationDate,    // Data em que o serviço foi registrado
            completionDate  // Data em que o serviço foi finalizado
        } = req.body;
        // console.log(req.body)
        // Valida os dados recebidos usando o middleware de validação
        const validationErrors = validateService(req.body);
        // Se houver erros de validação, retorna status 422 (Unprocessable Entity) com os erros
        if (validationErrors.length > 0) {
            // Retorna status 422 (Unprocessable Entity) com lista de erros
            return res.status(422).json({ errors: validationErrors });
        }

        // Cria uma nova instância do modelo Services com os dados validados
        const service = new Services({
            typeOfService,    // Referência ao tipo de serviço a ser realizado
            customer,         // ID do cliente que solicitou o serviço
            professional,     // ID do profissional que realizará o serviço
            hour,
            paymentMethod,    // Método de pagamento escolhido
            price,           // Valor do serviço
            status,          // Status do serviço (padrão: 'Agendado')
            creationDate,    // Data em que o serviço foi registrado
            completionDate  // Data em que o serviço foi finalizado
        });

        try {
            // Tenta salvar o novo serviço no banco de dados
            await service.save().then((service) => {
                // Se sucesso, retorna status 201 (Created) e os dados do serviço criado
                res.status(201);
                res.send(service.toJSON());
            });
        } catch (err) {
            // Se houver erro ao salvar, retorna status 500 (Internal Server Error) com mensagem
            return res
                .status(500)
                .send({ message: `${err.message} - falha ao cadastrar ordem.` });
        }
    }

    // Método estático para atualizar um serviço existente
    static updateService = (req, res) => {
        // Extrai o ID dos parâmetros da requisição
        const id = req.params.id;
        console.log(req.body)
        // Busca e atualiza o documento pelo ID usando o operador $set do MongoDB
        // O operador $set atualiza apenas os campos fornecidos no req.body
        Services.findByIdAndUpdate(id, { $set: req.body })
            // Se a atualização for bem-sucedida
            .then((service) => {
                // Retorna status 200 (OK) com mensagem de sucesso e o serviço atualizado
                res.status(200).send({ message: 'Ordem atualizado com sucesso', service })
            })
            // Se houver erro, retorna status 500 (Internal Server Error) com mensagem
            .catch((err) => {
                res.status(500).send({ message: err.message })
            })
    }

    // Método estático para deletar um serviço
    static deleteService = (req, res) => {
        // Extrai o ID dos parâmetros da requisição
        const id = req.params.id;

        // Busca e deleta o documento pelo ID
        Services.findByIdAndDelete(id)
            // Se a deleção for bem-sucedida
            .then((service) => {
                // Retorna status 200 (OK) com mensagem de sucesso
                res.status(200).send({ message: 'Ordem removida com sucesso', service })
            })
            // Se houver erro, retorna status 500 (Internal Server Error) com mensagem
            .catch((err) => {
                res.status(500).send({ message: err.message })
            })
    }
}

export default ServiceController