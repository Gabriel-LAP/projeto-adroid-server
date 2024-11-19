// Importa o modelo de usuários do arquivo user.js
import users from "../models/user.js";

// Método estático para acessar rota privada com informações do usuário
const acessPrivateRoute = async (req, res) => {
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

export {acessPrivateRoute}