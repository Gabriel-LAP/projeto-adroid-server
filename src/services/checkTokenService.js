// Importa o jsonwebtoken para geração e verificação de tokens JWT
import jwt from "jsonwebtoken";
// Método estático para verificar a validade do token JWT
 const checkToken = (req, res, next) => {
    // Obtém o cabeçalho de autorização da requisição
    const authHeader = req.headers["authorization"];
    // Extrai o token do cabeçalho (formato: "Bearer <token>")
    const token = authHeader && authHeader.split(" ")[1];

    // Se não houver token, retorna erro de acesso não autorizado
    if (!token) return res.status(401).json({ msg: "Acesso negado!" });

    try {
        // Obtém a chave secreta do ambiente
        const secret = process.env.SECRET;

        // Verifica se o token é válido usando a chave secreta
        jwt.verify(token, secret);

        // Se o token for válido, permite que a requisição continue
        next();
    } catch (err) {
        // Se o token for inválido, retorna erro 400
        res.status(400).json({ msg: "O Token é inválido!" });
    }
}

export{ checkToken }