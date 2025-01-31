const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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