const express = require('express');
const fs = require('fs');
const router = express.Router();

const PATH_ROUTES = __dirname;

const removeExtension = (fileName) => {
    return fileName.split('.').shift();
}

fs.readdirSync(PATH_ROUTES).filter( (file) => {

    const fileName = removeExtension(file);
    if (fileName !== 'index') {
        router.use(`/${fileName}`, require(`./${file}`));
    }

});


module.exports = router;