const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { hashToken } = require ('./hashToken');

function addRefreshToWhiteList ({refreshToken, userId}) {
    return prisma.refreshToken.create({
        data: {
            hashedToken: hashToken(refreshToken),
            userId,
            expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
        },
    });
};

function findRefreshToken(token) {
    return prisma.refreshToken.findUnique({
        where: {
            hashedToken: hashToken(token),
        },
        
    }, hashedToken);
    
}

function deleteRefreshTokenById(id) {
    return prisma.refreshToken.update({
        where: {
            id,
        },
        data: {
            revoked: true,
        }
    });
}

function revokeToken(userId) {
    return prisma.refreshToken.updateMany({
        where: {
            userId,
        },
        data: {
            revoked: true,
        },
    });
}

module.exports =  {
    addRefreshToWhiteList,
    findRefreshToken,
    deleteRefreshTokenById,
    revokeToken,
}


