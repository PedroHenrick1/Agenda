const { prisma } = require ('../controllers/usersControllers');
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