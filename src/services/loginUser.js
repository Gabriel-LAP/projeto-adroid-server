// Importa o modelo de usuários do arquivo user.js
import users from "../models/user.js";
import clients from "../models/Client.js";

// Importa o bcrypt para criptografia de senhas
import bcrypt from "bcrypt";

// Importa o jsonwebtoken para geração e verificação de tokens JWT
import jwt from "jsonwebtoken";

// Método estático para autenticar um usuário no sistema
    const loginUser = async (req, res) => {
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

        // Busca o usuário ou cliente no banco de dados pelo email
        const userOrClient = await users.findOne({ email }) || await clients.findOne({ email })
        // console.log(userOrClient)
        // console.log('-----',email, password)

        // Verifica se o usuário ou cliente existe
        if (!userOrClient) {
            return res.status(404).json({ msg: "Usuário ou cliente não encontrado!" });
        }

        // Verifica se a senha está correta comparando com o hash armazenado
        const checkPassword = await bcrypt.compare(password, userOrClient.password);

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
                    id: userOrClient._id,
                },
                secret
            );

            // Retorna sucesso com o token gerado
            res.status(200).json({ msg: "Autenticação realizada com sucesso!", token, userOrClient });
        } catch (error) {
            // Em caso de erro na geração do token, retorna erro 500
            res.status(500).json({ msg: error });
        }
    }

    export {loginUser}