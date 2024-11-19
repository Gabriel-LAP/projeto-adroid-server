// Importa o modelo de usuários do arquivo user.js
import users from "../models/user.js";

// Importa o bcrypt para criptografia de senhas
import bcrypt from "bcrypt";

// Importa o jsonwebtoken para geração e verificação de tokens JWT
import jwt from "jsonwebtoken";

// Importa a função de validação de usuário do middleware
import { validateUser } from '../middlewares/validateUser.js';

class UserController {

    // Método estático para listar todos os usuários cadastrados no sistema
    static listAllUsers = (req, res) => {
        // Usa o método find() do mongoose sem filtros para retornar todos os documentos
        users.find()
            // Executa a query e retorna uma Promise
            .exec().then((users) => {
                // Retorna status 200 (OK) e os usuários em formato JSON
                res.status(200).json(users)
            })
    }

    // Método para buscar um usuário específico pelo ID
    static listUsersById = (req, res) => {
        // Extrai o ID dos parâmetros da requisição
        const id = req.params.id;

        // Busca o usuário no banco de dados pelo ID
        users.findById(id)
            .exec() // Executa a query
            .then((user) => {
                // Se encontrado, retorna o usuário com status 200 (OK)
                res.status(200).json(user)
            })
            .catch((err) => {
                // Se houver erro, retorna status 400 (Bad Request) com mensagem de erro
                res.status(400).send({ message: `${err.message} - Id do usuário não localizado.` })
            })
    }

    // Método estático para buscar usuários pelo CPF
    static listUsersByCpf = (req, res) => {
        // Extrai o CPF do corpo da requisição
        const cpf = req.body.cpf;

        // Busca usuários no banco de dados que correspondam ao CPF informado
        users.find({ cpf: cpf })
            .exec() // Executa a query
            .then((user) => {
                // Se encontrado, retorna o(s) usuário(s) com status 200 (OK)
                res.status(200).json(user)
            })
            .catch((err) => {
                // Se houver erro, retorna status 400 (Bad Request) com mensagem de erro
                res.status(400).send({ message: `${err.message} - CPF do Cliente não localizado.` })
            })
    }

    // Método estático para buscar usuários pelo nome
    static listUserByName = (req, res) => {
        // Extrai o nome dos parâmetros da query da URL
        const name = req.query.name;

        // Busca usuários no banco de dados que correspondam ao nome informado
        users.find({ 'name': name })
            .exec() // Executa a query
            .then((client) => {
                // Se encontrado, retorna o(s) usuário(s) com status 200 (OK)
                res.status(200).json(client)
            })
            .catch((err) => {
                // Se houver erro, retorna status 400 (Bad Request) com mensagem de erro
                res.status(400).send({ message: `${err.message} - Nome do usuário não localizado.` })
            })
    }

    // Método estático para buscar usuários por cidade
    static listUsersByCity = (req, res) => {
        // Extrai o nome da cidade dos parâmetros da query da URL
        const city = req.query.city

        // Busca usuários no banco de dados que correspondam à cidade informada
        users.find({ 'city': city })
            .then((users) => {
                // Se encontrado, retorna o(s) usuário(s) com status 200 (OK)
                res.status(200).json(users)
            })
            .catch((err) => {
                // Se houver erro, retorna status 500 (Erro Interno do Servidor) com mensagem de erro
                res.status(500).send({ message: err.message })
            })
    }

    static async registerUser(req, res) {
        // Extrai todos os campos necessários do corpo da requisição usando desestruturação
        const {
            name,           // Nome do usuário
            email,          // Email do usuário (usado para login)
            password,       // Senha do usuário (será criptografada)
            confirmPassword,// Confirmação da senha para validação
            cpf,           // CPF do usuário
            phone,         // Telefone de contato
            address, 
            number,       // Endereço do usuário
            zipCode,       // CEP do endereço
            city,          // Cidade do usuário
            state,         // Estado do usuário
            type          // Tipo de usuário (ex: admin, cliente, etc)
        } = req.body;

        // Valida os dados do usuário usando a função validateUser
        // Se houver erros, retorna status 422 com a lista de erros
        const validationErrors = validateUser(req.body, confirmPassword);
        if (validationErrors.length > 0) {
            return res.status(422).json({ errors: validationErrors });
        }

        // Verifica se já existe um usuário com o mesmo email
        const userExists = await users.findOne({ email: email });
        if (userExists) {
            return res
                .status(422)
                .json({ msg: "Por favor, utilize outro e-mail!" });
        }

        // Gera o salt e faz o hash da senha para armazenamento seguro
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        // Cria uma nova instância do modelo de usuário com os dados fornecidos
        const user = new users({
            name,
            email,
            password: passwordHash, // Armazena a senha já criptografada
            cpf,
            phone,
            address,
            number,
            zipCode,
            city,
            state,
            type,
        });

        try {
            // Tenta salvar o novo usuário no banco de dados
            // Se bem sucedido, retorna status 201 (Created) com os dados do usuário
            await user.save().then((user) => {
                res.status(201);
                res.send(user.toJSON());
            });
        } catch (err) {
            // Se houver erro ao salvar, retorna status 500 com mensagem de erro
            return res
                .status(500)
                .send({ message: `${err.message} - falha ao cadastrar usuário.` });
        }
    }

    // Método estático para mudar a senha de um usuário
    static async changePassword(req, res) {
        // Extrai as senhas do corpo da requisição
        const { currentPassword, newPassword, confirmNewPassword } = req.body;

        // Verifica se os campos obrigatórios foram preenchidos
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            return res.status(422).json({ errors: [{ msg: "Por favor, preencha todos os campos." }] });
        }

        // Verifica se as senhas coincidem
        if (newPassword !== confirmNewPassword) {
            return res.status(422).json({ errors: [{ msg: "As novas senhas não coincidem." }] });
        }

        // Verifica o tamanho da senha
        if (newPassword.length < 6 || confirmNewPassword.length < 6) {
            return res.status(422).json({ errors: [{ msg: "A senha deve ter pelo menos 6 caracteres." }] });
        }

        // Busca o usuário pelo ID e verifica se a senha atual coincide com a senha armazenada
        const user = await users.findById('req.user.id');
        if (!user) {
            return res.status(404).json({ errors: [{ msg: "Usuário não encontrado." }] });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(422).json({ errors: [{ msg: "A senha atual não coincide com a senha armazenada." }] });
        }

        // Gera o salt e faz o hash da senha para armazenamento seguro
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        // Atualiza a senha do usuário no banco de dados
        user.password = passwordHash;
        await user.save();

        // Retorna status 200 com mensagem de sucesso
        res.status(200).send({ message: 'Senha alterada com sucesso!' });
    }

    // Método estático para atualizar os dados de um usuário existente
    static updateUser = (req, res) => {
        // Extrai o ID do usuário dos parâmetros da URL
        const id = req.params.id;

        // Busca o usuário pelo ID e atualiza com os dados enviados no corpo da requisição
        // O operador $set garante que apenas os campos enviados serão atualizados
        users.findByIdAndUpdate(id, { $set: req.body })
            .then((user) => {
                // Se a atualização for bem sucedida, retorna status 200 com mensagem de sucesso
                res.status(200).send({ message: 'Usuario atualizado com sucesso' })
            })
            .catch((err) => {
                // Se houver erro na atualização, retorna status 500 com a mensagem de erro
                res.status(500).send({ message: err.message })
            })
    }

    // Método estático para remover um usuário do sistema
    static deleteUser = (req, res) => {
        // Extrai o ID do usuário dos parâmetros da URL
        const id = req.params.id;

        // Busca o usuário pelo ID e o remove do banco de dados
        users.findByIdAndDelete(id)
            .then((user) => {
                // Se a remoção for bem sucedida, retorna status 200 com mensagem de sucesso
                res.status(200).send({ message: 'Usuario removido com sucesso' })
            })
            .catch((err) => {
                // Se houver erro na remoção, retorna status 500 com a mensagem de erro
                res.status(500).send({ message: err.message })
            })
    }

    // Método estático para autenticar um usuário no sistema
    static loginUser = async (req, res) => {
        // Extrai email e senha do corpo da requisição
        const { email, password } = req.body;

        // Validação do email
        if (!email) {
            return res.status(422).json({ msg: "O email é obrigatório!" });
        }

        // Validação da senha
        if (!password) {
            return res.status(422).json({ msg: "A senha é obrigatória!" });
        }

        // Busca o usuário no banco de dados pelo email
        const user = await users.findOne({ email })

        // Verifica se o usuário existe
        if (!user) {
            return res.status(404).json({ msg: "Usuário não encontrado!" });
        }

        // Verifica se a senha está correta comparando com o hash armazenado
        const checkPassword = await bcrypt.compare(password, user.password);

        // Se a senha estiver incorreta, retorna erro
        if (!checkPassword) {
            return res.status(422).json({ msg: "Senha inválida" });
        }

        try {
            // Obtém a chave secreta do ambiente
            const secret = process.env.SECRET;

            // Gera um token JWT contendo o ID do usuário
            const token = jwt.sign(
                {
                    id: user._id,
                },
                secret
            );

            // Retorna sucesso com o token gerado
            res.status(200).json({ msg: "Autenticação realizada com sucesso!", token });
        } catch (error) {
            // Em caso de erro na geração do token, retorna erro 500
            res.status(500).json({ msg: error });
        }
    }

    // // Método estático para verificar a validade do token JWT
    // static checkToken = (req, res, next) => {
    //     // Obtém o cabeçalho de autorização da requisição
    //     const authHeader = req.headers["authorization"];
    //     // Extrai o token do cabeçalho (formato: "Bearer <token>")
    //     const token = authHeader && authHeader.split(" ")[1];

    //     // Se não houver token, retorna erro de acesso não autorizado
    //     if (!token) return res.status(401).json({ msg: "Acesso negado!" });

    //     try {
    //         // Obtém a chave secreta do ambiente
    //         const secret = process.env.SECRET;

    //         // Verifica se o token é válido usando a chave secreta
    //         jwt.verify(token, secret);

    //         // Se o token for válido, permite que a requisição continue
    //         next();
    //     } catch (err) {
    //         // Se o token for inválido, retorna erro 400
    //         res.status(400).json({ msg: "O Token é inválido!" });
    //     }
    // }

    // Método estático para acessar rota privada com informações do usuário
    static acessPrivateRoute = async (req, res) => {
        // Extrai o ID do usuário dos parâmetros da requisição
        const id = req.params.id;

        // Busca o usuário pelo ID, excluindo o campo senha do resultado
        const user = await users.findById(id, "-password");

        // Se o usuário não for encontrado, retorna erro 404
        if (!user) {
            return res.status(404).json({ msg: "Usuário não encontrado!" });
        }

        // Retorna os dados do usuário em caso de sucesso
        res.status(200).json({ user });
    }

}

export default UserController