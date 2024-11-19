function validateTypeOfService(order) {
    const errors = [];
    const requiredFields = [
        { field: "name", message: "O nome do serviço é obrigatório!" },
        { field: "price", message: "O preço do serviço é obrigatório!" },
        { field: "description", message: "A descrição do serviço é obrigatório!" },

    ];

    requiredFields.forEach((field) => {
        if (!order[field.field]) {
            errors.push(field.message);
        }
    });

    return errors;
}

export { validateTypeOfService };
