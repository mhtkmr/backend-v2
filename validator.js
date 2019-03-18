const validateEmail = email => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

const validateUsername = username => {
    const re = /^[a-zA-Z][a-zA-Z0-9\-_]{6,25}$/;
    return re.test(username);
};
const validatePassword = password => {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,64}$/;
    return re.test(password)
}

module.exports = {
    validateEmail,
    validateUsername,
    validatePassword
};