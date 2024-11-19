// Importa o middleware de validação para tipos de serviço
import { validateTypeOfService } from '../middlewares/validateTypeOfService.js'

// Importa o modelo TypeOfService que define a estrutura dos dados no banco
import TypeOfService from '../models/TypeOfService.js'

class TypeOfServiceController {
    
    static listAllTypesOfService = (req, res) => {
        // Busca todos os documentos na coleção TypesOfService
        TypeOfService.find()
            // Executa a query e retorna uma Promise
            .exec().then((typeOfService) => {
                // Retorna status 200 (OK) e os tipos de serviço em formato JSON
                res.status(200).json(typeOfService)
            })
    }

    // Método estático que busca um tipo de serviço específico pelo ID
    static listTypeOfServiceById = (req, res) => {
        // Extrai o ID dos parâmetros da requisição
        const id = req.params.id;
        

        // Busca um documento pelo ID na coleção TypesOfService
        TypeOfService.findById(id)
            // Executa a query
            .exec()
            // Se encontrar o documento, retorna status 200 e os dados em JSON
            .then((typeOfService) => {
                res.status(200).json(typeOfService)
            })
            // Se houver erro, retorna status 400 (Bad Request) com mensagem de erro
            .catch((err) => {
                res.status(400).send({ message: `${err.message} - Id da peça não localizado.` })
            })
    }

    // Método estático que busca tipos de serviço pelo nome
    static listTypeOfServiceByName = (req, res) => {
        // Extrai o nome do corpo da requisição
        const name = req.query.name;

        // Busca documentos que correspondam ao nome fornecido
        TypeOfService.find({ 'name': name })
            // Executa a query
            .exec()
            // Se encontrar documentos, retorna status 200 e os dados em JSON
            .then((typeOfService) => {
                res.status(200).json(typeOfService)

            })
            // Se houver erro, retorna status 400 (Bad Request) com mensagem de erro
            .catch((err) => {
                res.status(400).send({ message: `${err.message} - Serviço não localizado.` })
            })
    }

    // Método estático assíncrono para registrar um novo tipo de serviço
    static async registerTypeOfService(req, res) {
        // Desestrutura os dados necessários do corpo da requisição
        const {
            name,
            price,
            description,
        } = req.body;

        // Valida os dados recebidos usando o middleware de validação
        const validationErrors = validateTypeOfService(req.body);
        // Se houver erros de validação, retorna status 422 (Unprocessable Entity) com os erros
        if (validationErrors.length > 0) {
            return res.status(422).json({ errors: validationErrors });
        }

        // Cria uma nova instância do modelo TypeOfService com os dados validados
        const typeOfService = new TypeOfService({
            name,
            price,
            description,
        });

        try {
            // Tenta salvar o novo tipo de serviço no banco de dados
            await typeOfService.save().then((typeOfService) => {
                // Se sucesso, retorna status 201 (Created) e os dados do serviço criado
                res.status(201);
                res.send(typeOfService.toJSON());
            });
        } catch (err) {
            // Se houver erro ao salvar, retorna status 500 (Internal Server Error) com mensagem
            return res
                .status(500)
                .send({ message: `${err.message} - falha ao cadastrar peça.` });
        }
    }

    // Método estático para atualizar um tipo de serviço existente
   static updateTypeOfService = (req, res) => {
       // Extrai o ID dos parâmetros da requisição
       const id = req.params.id;
       // console.log('Parematro:',req.params)
       // console.log('Corpo da requisição:',req.body)
   
       // Busca e atualiza o documento pelo ID usando o operador $set do MongoDB
       TypeOfService.findByIdAndUpdate(id, { $set: req.body })
           // Se a atualização for bem-sucedida
           .then((typeOfService) => {
               res.status(200).send({ message: 'Peça atualizado com sucesso', typeOfService })
               // console.log(typeOfService)
           })
           // Se houver erro, retorna status 500 (Internal Server Error) com mensagem
           .catch((err) => {
               res.status(500).send({ message: err.message })
           })
   }

    // Método estático para deletar um tipo de serviço
    static deleteTypeOfService = (req, res) => {
        // Extrai o ID dos parâmetros da requisição
        const id = req.params.id;

        // Busca e deleta o documento pelo ID
        TypeOfService.findByIdAndDelete(id)
            // Se a deleção for bem-sucedida
            .then((typeOfService) => {
                // Retorna status 200 (OK) com mensagem de sucesso
                console.log(typeOfService)
                res.status(200).send({ message: 'Peça removida com sucesso' })
            })
            // Se houver erro, retorna status 500 (Internal Server Error) com mensagem
            .catch((err) => {
                res.status(500).send({ message: err.message })
            })
    }
}

export default TypeOfServiceController