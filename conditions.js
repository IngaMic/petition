module.exports.noLogin = (req, res, next) => {
    if (req.session.registeredId) {
        res.redirect("/welcome");
    } else {
        next();
    }
};
module.exports.notProfiled = (req, res, next) => {
    if (req.session.profiled) {
        res.redirect("/welcome");
    } else {
        next();
    }
};

module.exports.notSigned = (req, res, next) => {
    if (req.session.allow || req.session.signedId) {
        res.redirect("/thanks");
    } else {
        next();
    }
};

module.exports.signatureOn = (req, res, next) => {
    if (!req.session.allow) {
        res.redirect("/welcome");
    } else {
        next();
    }
};
