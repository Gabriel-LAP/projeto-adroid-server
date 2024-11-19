// Função para validar os dados de um cliente
function validateClient(client, confirmPassword) {
    // Array para armazenar mensagens de erro
    const errors = [];
    // Campos obrigatórios que precisam ser validados
    const requiredFields = [
        { field: "name", message: "O nome é obrigatório!" },
        { field: "email", message: "O email é obrigatório!" },
        { field: "phone", message: "O telefone é obrigatório!" },
        { field: "password", message: "A senha é obrigatória!" }
    ];

    // Itera sobre os campos obrigatórios para verificar se estão presentes no objeto client
    requiredFields.forEach((field) => {
        // Se o campo não estiver presente, adiciona a mensagem de erro ao array
        if (!client[field.field]) {
            errors.push(field.message);
        }
    });

    if (client.password !== confirmPassword) {
        errors.push("A senha e a confirmação precisam ser iguais!");
    }

    // Retorna o array de erros (vazio se não houver erros)
    return errors;
}

// Exporta a função para uso em outros módulos
export { validateClient };
