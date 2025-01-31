const { PrismaClient } = require('@prisma/client');
const express = require('express');
const prisma = new PrismaClient();
const { findUserByEmail, findUserById } = require ('../services/user.services');
const { addRefreshToWhiteList,
        findRefreshToken,
        deleteRefreshTokenById,
        revokeToken } = require ('../services/auth.services');
const { generateTokens } = require('../services/jwt');
const bcrypt = require('bcrypt');

exports.createUser = async (req,res) => {
    try {
        const {firstName, lastName, email, password} = req.body;
        console.log(firstName);

        if (!firstName || !lastName || !email || !password) {
            res.status(400);
            throw new Error ('Você esqueceu de algum campo, volte e preencha todos os campos');
        }

        const existingUser = await findUserByEmail (email);
        
        if (existingUser) {
            res.status(400);
            throw new Error('Email já existente');
        }

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

                const { accessToken, refreshToken } =  generateTokens(user);
                await addRefreshToWhiteList({refreshToken, userId: user.id });
                res.status(200).json({user, accessToken, refreshToken});
            });
        });

    } catch(err) {
        console.log(err);
    }
    
}

exports.loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        console.log(email);
        console.log(password);
        
        
        if (!email || !password) {
            res.status(400);
            throw new Error ('Você esqueceu de algum campo, volte e preencha todos os campos');
        }

        const existingUser = await findUserByEmail (email);
        
        if (!existingUser) {
            res.status(400);
            throw new Error('Email não existente');
        }

        const validPassword = await bcrypt.compare(password, existingUser.password);

        if (!validPassword) {
            res.status(403);
            throw new Error ('Email ou senha inválida');
        }

        const { accessToken, refreshToken } =  generateTokens(existingUser);
        await addRefreshToWhiteList({refreshToken, userId: existingUser.id });

        res.status(200).json({accessToken, refreshToken});

    } catch (err) {
        console.log(err);
    }
}


