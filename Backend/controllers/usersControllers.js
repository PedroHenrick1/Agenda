const { PrismaClient } = require('@prisma/client');
const express = require('express');
const prisma = new PrismaClient();

exports.createUser = async (req,res) => {
    const bcrypt = require('bcrypt');
    const {firstName, lastName, email, password} = req.body;
    console.log(req.body.firstName);
    bcrypt.genSalt(10, (err,salt) => {   
        if (err) {
            console.log('erro no salt', err);
        }
        bcrypt.hash(req.body.password, salt, async(err, hash) =>{
            if(err){
                console.log('Erro ao encriptar');
            }
            const user = await prisma.user.create({
                data: {
                    firstName, 
                    lastName,
                    email,
                    password: hash
                },
            });
            res.status(200).json(user);
        });
    });
}

exports.loginUser = async (req, res) => {
    
}


module.exports = {prisma};

