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

exports.loginUser = async (req, res, next) => {
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
        next(err);
    }
}

exports.refreshT =  async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        console.log(refreshToken);

        if(!refreshToken) {
            res.status(400);
            throw new Error ('Refresh token ausente');
        }

        const savedRefreshToken = await findRefreshToken(refreshToken);
        console.log(savedRefreshToken);
        

        if (!savedRefreshToken || savedRefreshToken.revoked === true || Date.now() >= savedRefreshToken.expireAt.getTime()) {
            res.status(401);
            throw new Error('Não autorizado');
        }

        const user = await findUserById(savedRefreshToken.userId);

        if (!user) {
            res.status(401);
            throw new Error ('Não autorizado');
        }

        await deleteRefreshTokenById(savedRefreshToken.userId);

        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

        await addRefreshToWhiteList({refreshToken: newRefreshToken, userId: user.id});

        res.json({
            accessToken, refreshToken: newRefreshToken,
        });

    } catch (err) {
        next(err)
    }
}

exports.revokeRefreshToken = async (res, req, next) => {
    try {
        const {userId} = req.body;
        await revokeToken(userId);
        res.json({message: `Tokens revoked for user with id #${userId}`});
    }catch (err) {
        next(err);
    }
}

exports.profile = async (res, req, next) => {
    try {
        const { userId } = req.payload;
        const user = await findUserById(userId);
        delete user.password;
        res.json(user);
    }catch (err) {
        next(err);
    }
}


