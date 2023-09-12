const handleHttpError = (res, message, code) => {
    res.status(code);
    const data = {
        status: code,
        message
    };
    res.send(data);
}

module.exports = {handleHttpError};