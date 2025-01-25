const express = require('express');
const app = express();
const routes = require('./routes');
const senha = 'pedro123';
const bcrypt = require('bcrypt');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(routes);


const hashPassword = (password) => {
    bcrypt.genSalt(10, (err, salt)=>{
        if(err){
            console.log('erro no salt', salt);
        }
        bcrypt.hash(password, salt, (err, hash) =>{
            if (err) {
                console.log('erro ao finalizar encriptacao', err);
                return
            }
            console.log('Hash da senha', hash);
    
            bcrypt.compare(senha, hash, (err, res)=>{
                if(err){
                    console.log('erro no compare', err);
                }

                console.log('Essa senha é igual?', res);
            })
        });
    });
}

hashPassword(senha);

app.listen(3000, ()=>{
    console.log('Servidor rodando');
});
