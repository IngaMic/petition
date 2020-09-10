const express = require("express");
const app = express();
//var path = require('path');
const db = require("./db.js");
const bc = require("./bc.js");
const handlebars = require("express-handlebars");
//const bodyParser = require("body-parser");
//const cookieParser = require("cookie-parser");
const cookieSession = require('cookie-session');
const csurf = require('csurf');
const { hash } = require("bcryptjs");

const hbSet = handlebars.create({
    helpers: {
        message() {
            `Thank you for joining us ${first}!
            We hope you had fun signing!   `
        }
    },
});
//////////////////// don't change under: ///////////////////
app.engine("handlebars", handlebars());

app.set("view engine", "handlebars");
app.set('views', __dirname + '/views');
app.use(cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 14
}));
app.use(express.urlencoded({ extended: false }));
//app.use(bodyParser.urlencoded({ extended: false }));

app.use(csurf());
////////////// against clickjactking & csrf: //////////////
app.use(function (req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    res.setHeader("x-frame-options", "deny");
    next();
});
/////////////////////////////////////////////////////////

app.use(express.static(__dirname + "/public"));
app.get("/", (req, res) => {
    res.redirect("/registration");
});
// app.use((req, res, next) => {
//     if (!req.session.allow && req.url !== "/registration" && req.url !== "/login" && req.url !== "/profile" && req.url !== "/thanks" && req.url !== "/welcome") {
//         res.redirect("/registration");
//     } else {
//         next();
//     }
// });
var empty = "";
var signatureId;
var first;
var last;
var email;
var password;
var signature;
var age;
var city;
var url;

app.get("/registration", (req, res) => { //noLogin
    if (req.session.allow) {
        res.redirect("/thanks");
    }
    res.render("registration", {
        layout: "main",
    });
});

app.post("/registration", (req, res) => { //noLogin
    first = req.body["first"];
    last = req.body["last"];
    email = req.body["email"];
    password = req.body["password"];
    //console.log("password", password);
    bc.hash(password).then((result) => {
        req.body.password = result;
        password = req.body.password
        //console.log("password", password);
        if (first === empty || last === empty || email === empty || password === empty) {
            console.log("Not logging the registration data / empty");
            res.render("registration", {
                layout: "main",
                err: "Please try again",
            });
        } else {
            console.log("I'm here, first last email", first, last, email, password);
            db.registerInfo(first, last, email, password).then((result) => {
                var userid = result.rows[0].id;
                console.log("userid", userid);
                req.session.registeredId = userid; //registeredId
                req.session.loged = true;
                req.session.registered = true;
                if (req.session.allow) {
                    res.redirect("/thanks");
                } else {
                    res.redirect("/profile");
                }
            }).catch((err) => {

                console.log("trouble with inserting registration data", err); //getting error: relation "usersdata" does not exist
            });
        };
    }).catch((err) => console.log("hash() didn't work", err));
});
app.get("/login", (req, res) => { //noLogin
    res.render("login", {
        layout: "main",
    });
});
app.post("/login", (req, res) => { //noLogin
    let logPassword = req.body.password;
    let logemail = req.body.email;
    db.getLogin(logemail).then((result) => {
        if (result) {
            //console.log("result", result);
            let usersId = result.rows[0].id
            req.session.registeredId = usersId;
            let pass = result.rows[0].password;
            bc.compare(logPassword, pass).then((info) => {
                console.log("info from compare", info);
                if (info) {
                    /////////////////////////////////////////////////////////
                    ///////////////////////////////////////////////////////////
                    req.session.loged = true;
                    res.redirect("/profile");
                } else {
                    res.render("login", {
                        layout: "main",
                        err: "Please try again",
                    });
                }
            }).catch((err) => console.log("err in compare", err));
        } else { // no result
            res.render("login", {
                layout: "main",
                err: "Please try again",
            });
        };
    }).catch((err) => { console.log("err in getLogin", err) }); // sort err in getLogin TypeError: Cannot read property 'id' of undefined
});
app.get("/profile", (req, res) => {
    if (req.session.registeredId) {
        res.render("profile", {
            layout: "main",
        });
    }
});
app.post("/profile", (req, res) => {
    age = req.body["age"];
    city = req.body["city"];
    url = req.body["url"];
    //need to be cautious with url, add http or https
    if (url !== empty && !url.startsWith("http://") || !url.startsWith("https://")) {
        url = "https://" + url;
        console.log("url after if statement :", url);
    }
    user_id = req.session.registeredId;
    console.log("user_id post profile", user_id);
    db.addProfile(age || null, city || null, url || null, user_id).then(() => {
        res.redirect("/welcome");
        //console.log(result);
        /////////////////////////////////////////////////
        //after registration->profile is not redirecting to /welcome and not throwing the err
        //after login->profile is redirecting to /registration

    }).catch((err) => {
        console.log("trouble with inserting profile data", err);
    });
});
// const noLogin = (req, res, next) => {
//     if(req.session.userId) {
//         res.redirect("/welcome");
//     }else {
//         next();
//     }
// };
app.get("/welcome", (req, res) => {
    if (req.session.allow) {
        res.redirect("/thanks");
    } else {
        res.render("welcome", {
            layout: "main",
        });
    }
});
app.post("/welcome", (req, res) => {
    // first = req.body["first"];
    // last = req.body["last"];
    signature = req.body["signature"];
    userid = req.session.registeredId;
    if (signature === empty) {
        console.log("No signature");
        res.render("welcome", {
            layout: "main",
            err: "Please try again",
        });
    } else {
        //console.log("I'm here, first last", first, last);
        db.addInfo(signature, userid).then((result) => {
            signatureId = result.rows[0].id;
            req.session.signedId = signatureId;
            req.session.allow = true;
            res.redirect("/thanks");
        }).catch((err) => {
            console.log("trouble with inserting data", err)
        });
    };
});

app.get("/thanks", (req, res) => {
    db.getSignature(req.session.signedId).then((result) => {
        db.getInfo().then((info) => {
            //the amount will be the number of table-rows
            let amount = info.rows.length;
            //console.log("amount of users", amount);
            let usersSignature = result.rows[0].signature;
            res.render("thanks", {
                usersSignature,
                amount: amount,
            });
        });
    }).catch((err) => { console.log("err in getSignature", err) });
});

app.get("/signers", (req, res) => {
    db.getProfile().then((info) => {
        let list = info.rows;
        console.log("my list here:", list);
        res.render("signers", {
            layout: "main",
            list,
        });
    }).catch((err) => { console.log("err in getting list", err) });
});
app.get("/signers/:city", (req, res) => {
    //hint hint, need to remember req.params
    let city = req.params.city;
    //console.log("req.params.city", req.params.city) //logs right
    db.getCity(city).then((result) => {
        console.log(result);
        let allFromThisCity = result.rows;
        console.log("allFromThisCity :", allFromThisCity);
        res.render("signers", {
            layour: "main",
            allFromThisCity,
        });
    });
});


app.listen(process.env.PORT || 8080, () => console.log("petition server is running..."));

///////////////////////////////////////////////////////
////////////////////CLASS NOTES///////////////////////
// app.get("cities", (req, res) => {
//     db.getCities().then((results) => {
//         console.log("results", results);
//     }).catch(err => {
//         console.log("err in getCities", err);
//     })
// });
// app.post("/add-city", (req, res) => {
//     db.addCity("Quito", 1000, "Equador").then(() => {
//         console.log("yay that worked");
//     }).catch((err) => {
//         console.log("err in addCity", err);
//     })
// })
///////////////////////////////////////////////////////////









