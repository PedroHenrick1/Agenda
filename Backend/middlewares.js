function isAuthenticated (req, res, next) {
    const { authorization } =  req.headers;

    console.log(authorization);
    

    if (!authorization) {
        res.status(401);
        throw new Error('Não autorizado')
    }

    try {
        const token = authorization.split(' ')[1];
        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.payload = payload;
    }catch (err) {
        res.status(401);
        if (err.name === 'TokenExpiredError') {
            throw new Error(err.name);
        }

        throw new Error('Não autorizado');
    }

    return next();
}

module.exports = {
    isAuthenticated
}