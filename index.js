const express = require("express");
const app = express();
//var path = require('path');
const db = require("./db.js");
const handlebars = require("express-handlebars");
//const bodyParser = require("body-parser");
//const cookieParser = require("cookie-parser");
const cookieSession = require('cookie-session');
const csurf = require('csurf');

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
    //console.log("Slash route, req.session", req.session);
    res.redirect("/welcome");
});
app.use((req, res, next) => {
    if (!req.session.allow && req.url !== "/welcome") {
        res.redirect("/welcome");
    } else {
        next();
    }
});

app.get("/welcome", (req, res) => {
    if (req.session.allow) {
        res.redirect("/thanks");
    } else {
        res.render("welcome", {
            layout: "main",
        });
    }
});
var empty = "";
var signatureId;
var first;
var last;
var signature;
app.post("/welcome", (req, res) => {
    //const { first, last, signature } = req.body; //bug here
    first = req.body["first"];
    last = req.body["last"];
    signature = req.body["signature"];
    //none of these can be empty:
    if (first === empty || last === empty || signature === empty) {
        console.log("Not logging the data");
        //a helper or err key to "/welcome" with warning
        res.render("welcome", {
            layout: "main",
            err: "Please try again",
        });
        // res.send(`
        // <h1> Uh oh, please try again! ✋🏻</h1>
        // `);

    } else {
        //console.log("I'm here, first last", first, last);
        db.addInfo(first, last, signature).then((result) => {
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
    //console.log("get request to /thanks route happened");
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
    db.getList().then((info) => {
        let list = info.rows;
        //console.log("my list here:", list);
        res.render("signers", {
            list,
        });
    }).catch((err) => { console.log("err in getting list", err) });
});




app.listen(8080, () => console.log("petition server is running..."));

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









