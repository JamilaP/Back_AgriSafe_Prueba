exports.formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0];
};

exports.generateRandomId = () => {
    return Math.random().toString(36).substr(2, 9);
};