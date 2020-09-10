module.exports.noLogin = (req, res, next) => {
    if (req.session.registeredId) {
        res.redirect("/welcome");
    } else {
        next();
    }
};

// module.exports.noSignature = (req, res, next) => {
//     if (!req.session.allow) {
//         res.redirect("/welcome");
//     } else {
//         next();
//     }
// };

// module.exports.isSignature = (req, res, next) => {
//     if (req.session.allow) {
 //       res.redirect("/thanks");
//     } else {
//         next();
//     }
// };
// const noLogin = (req, res, next) => {
//     if(req.session.userId) {
//         res.redirect("/welcome");
//     }else {
//         next();
//     }
// };