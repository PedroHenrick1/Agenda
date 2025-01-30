const { prisma } = require('../controllers/usersControllers');

function findUserByEmail(email) {
    return prisma.user.findUnique({
        where: {
            email,
        }
    });
}

function findUserById(id) {
    return prisma.user.findUnique({
        where: {
            id,
        }
    });
}

module.exports = {
    findUserByEmail, findUserById,
};