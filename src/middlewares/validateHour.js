function validateHour(part) {
    const errors = [];
    const requiredFields = [
        { field: "day", message: "A data é obrigatória!" },
        { field: "begin", message: "O horário do início do serviço é obrigatório!" },
        { field: "end", message: "O horário do fim do serviço é obrigatório!" },
        { field: "professional", message: "O profissional é obrigatório!" },

    ];

    requiredFields.forEach((field) => {
        if (!part[field.field]) {
            errors.push(field.message);
        }
    });

    return errors;
}

export { validateHour };
