// Importa o modelo clients que define a estrutura dos clientes no banco de dados
import clients from '../models/Client.js'

// Importa o bcrypt para criptografia de senhas
import bcrypt from "bcrypt";

// Importa o jsonwebtoken para geração e verificação de tokens JWT
import jwt from "jsonwebtoken";

// Importa a função de validação que será usada como middleware para validar os dados dos clientes
import { validateClient } from '../middlewares/validateClient.js'

class ClientController {
    // Método estático que lista todos os clientes
    static listAllClients = (req, res) => {
        // Busca todos os documentos na coleção clients
        clients.find()
            // Executa a query e retorna uma Promise
            .exec().then((clients) => {
                // Retorna status 200 (OK) e os clientes em formato JSON
                res.status(200).json(clients)
            })
    }
    
    // Método estático para buscar um cliente específico pelo ID
    static listClientById = (req, res) => {
        // Extrai o ID dos parâmetros da requisição
        const id = req.params.id;

        // Busca um cliente no banco de dados pelo ID
        clients.findById(id)
            .exec() // Executa a query
            .then((client) => {
                // Se encontrado, retorna o cliente em formato JSON com status 200 (OK)
                res.status(200).json(client)
            })
            .catch((err) => {
                // Se houver erro ou ID não encontrado, retorna erro 400 (Bad Request)
                res.status(400).send({ message: `${err.message} - Id do Cliente não localizado.` })
            })
    }

    // Método estático para buscar clientes pelo número de telefone
    static listClientByPhone = (req, res) => {
        // Extrai o número de telefone dos parâmetros da requisição
        const phone = req.params.phone;

        // Busca clientes no banco de dados que correspondam ao número de telefone fornecido
        clients.find({ phone: phone })
            // Executa a query
            .exec()
            // Se encontrado, retorna o(s) cliente(s) em formato JSON com status 200 (OK)
            .then((client) => {
                res.status(200).json(client)
            })
            // Se houver erro, retorna erro 400 (Bad Request) com mensagem personalizada
            .catch((err) => {
                res.status(400).send({ message: `${err.message} - Telefone do Cliente não localizado.` })
            })
    }

    // Método estático para buscar clientes pelo nome
    static listClientByName = (req, res) => {
        // Extrai o nome do cliente dos parâmetros da query da URL
        const name = req.query.name;

        // Busca clientes no banco de dados que correspondam ao nome fornecido
        clients.find({ 'name': name })
            // Executa a query
            .exec()
            // Se encontrado, retorna o(s) cliente(s) em formato JSON com status 200 (OK)
            .then((client) => {
                res.status(200).json(client)
            })
            // Se houver erro, retorna erro 400 (Bad Request) com mensagem personalizada
            .catch((err) => {
                res.status(400).send({ message: `${err.message} - Nome do Cliente não localizado.` })
            })
    }

    // Método estático para registrar um novo cliente no sistema
    static async registerClient(req, res) {
        // Desestrutura os dados do corpo da requisição
        const {
            name,
            email,
            phone,
            password,       // Senha do cliente (será criptografada)
            confirmPassword,// Confirmação da senha para validação
        } = req.body;

        // Valida os dados do cliente usando o middleware de validação
        const validationErrors = validateClient(req.body, confirmPassword);
        if (validationErrors.length > 0) {
            // Se houver erros de validação, retorna status 422 (Unprocessable Entity)
            return res.status(422).json({ errors: validationErrors });
        }

        // Verifica se já existe um cliente com o mesmo email
        const clientExists = await clients.findOne({ email: email });
        if (clientExists) {
            // Se já existir, retorna erro 422 (Unprocessable Entity)
            return res
                .status(422)
                .json({ msg: "Cliente já cadastrado!" });
        }

        // Gera o salt e faz o hash da senha para armazenamento seguro
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        // Cria uma nova instância do modelo de cliente com os dados recebidos
        const client = new clients({
            name,
            email,
            phone,
            password: passwordHash, // Armazena a senha já criptografada
           
        });

        try {
            // Tenta salvar o novo cliente no banco de dados
            await client.save().then((client) => {
                // Se sucesso, retorna status 201 (Created) e os dados do cliente
                res.status(201);
                res.send(client.toJSON());
            });
        } catch (err) {
            // Se houver erro ao salvar, retorna status 500 (Internal Server Error)
            return res
                .status(500)
                .send({ message: `${err.message} - falha ao cadastrar cliente.` });
        }
    }

    // Método estático para atualizar os dados de um cliente
    static updateClient = (req, res) => {
        // Extrai o ID do cliente dos parâmetros da requisição
        const id = req.params.id;

        // Busca o cliente pelo ID e atualiza os dados com os novos valores fornecidos no corpo da requisição
        clients.findByIdAndUpdate(id, { $set: req.body })
            // Se a atualização for bem-sucedida, retorna status 200 (OK) com mensagem de sucesso
            .then((client) => {
                res.status(200).send({ message: 'Cliente atualizado com sucesso' })
            })
            // Se houver erro durante a atualização, retorna status 500 (Internal Server Error) com a mensagem de erro
            .catch((err) => {
                res.status(500).send({ message: err.message })
            })
    }

    // Método estático para remover um cliente do sistema
    static deleteClient = (req, res) => {
        // Extrai o ID do cliente dos parâmetros da requisição
        const id = req.params.id;

        // Busca o cliente pelo ID e o remove do banco de dados
        clients.findByIdAndDelete(id)
            // Se a remoção for bem-sucedida, retorna status 200 (OK) com mensagem de sucesso
            .then((client) => {
                res.status(200).send({ message: 'Cliente removido com sucesso' })
            })
            // Se houver erro durante a remoção, retorna status 500 (Internal Server Error) com a mensagem de erro
            .catch((err) => {
                res.status(500).send({ message: err.message })
            })
    }
}

export default ClientController