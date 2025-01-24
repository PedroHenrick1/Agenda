const express = require('express');
const app = express();
const routes = require('./routes');
const senha = 'pedro123';

app.use(routes);

const hashPassword = (password) => {
    const bcrypt = require('bcrypt');
    bcrypt.genSalt(10, (err,salt) => {
        if(err) {
            console.log('erro ao gerar salt: ', err);
            return
        }  
    });

    bcrypt.hash(password, 10, (err, hash) =>{
        if (err) {
            console.log('erro ao finalizar encriptacao', err);
            return
        }
        console.log('Hash da senha', err);
    });
}

hashPassword(senha);

app.listen(3000, ()=>{
    console.log('Servidor rodando');
});