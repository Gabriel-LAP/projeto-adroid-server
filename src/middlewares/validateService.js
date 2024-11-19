function validateService(part) {
    const errors = [];
    const requiredFields = [
        { field: "customer", message: "O cliente é obrigatório!" },
        { field: "price", message: "O preço do serviço é obrigatório!" },
        { field: "professional", message: "O Funcionário é obrigatório!" },
        { field: "hour", message: "O horário do serviço é obrigatório!" },
        { field: "typeOfService", message: "O tipo de serviço é obrigatório!" },
        { field: "paymentMethod", message: "O método de pagamento é obrigatório!" }

    ];

    requiredFields.forEach((field) => {
        if (!part[field.field]) {
            errors.push(field.message);
        }
    });

    return errors;
}

export { validateService };
