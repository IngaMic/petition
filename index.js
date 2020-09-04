const express = require("express");
const db = require("./db.js");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
//const cookieParser = require("cookie-parser");
const cookieSession = require('cookie-session');
const csurf = require('csurf');
const app = express();
const hbSet = handlebars.create({
    // helpers: {
    //     //
    // },
});
//////////////////// don't change under: ///////////////////
app.engine("handlebars", hbSet.engine);
app.set("view engine", "handlebars");
app.use(cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 14
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(csurf());
////////////// against clickjactking & csrf: //////////////
app.use(function (req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    res.setHeader("x-frame-options", "deny");
    next();
});
/////////////////////////////////////////////////////////
app.use((req, res, next) => {
    if (!req.session.allow && req.url !== "/welcome") {
        //res.cookieSession("url", req.url);
        res.redirect("/welcome");
    } else {
        next();
    }
});
app.get("/", (req, res) => {
    req.session.cumin = "Hello, cumin";
    console.log("Slash route, req.session", req.session);
    res.redirect("/welcome");
});
app.use(express.static("./public"));
app.get("/welcome", (req, res) => {
    res.render("welcome", {
        layout: "main",
    }); //continue with canvas in public/script.js
    // must be done with express - handlebars:
    // res.send(`
    // <h2>Hello! Would you like to sign our petition?</h2>
    //     <form method='POST' style="display: flex; flex-direction: column; justify-content: space-between; width: 40%; height: 50%;">
    //         <input type='text' name='firstname' placeholder='First Name' autocomplete='off'>
    //         <input type='text' name='lastname' placeholder='Last Name' autocomplete='off'>
    //         <div>
    //             <input type="checkbox" name="accept">
    //         </div>
    //         <button name="submit"> Submit </submit>
    //     </form>
    // `);
});
app.post("/welcome", (req, res) => {
    const { first, last, signature, accept } = req.body;
    if (accept === "on") {
        req.session.allow = true;
        //res.cookieSession("allow", true);
        //have to redirect to thanks
        res.redirect("/thanks");
        //     res.send(`
        // <h2>People who joined the petition :</h2>
        //  <ul>
        //  <li>smth</li>
        //  </ul>
        //  <button name="look"> Take a look! </submit>
        // `);

    } else {
        res.send(`<h1> Content Unavailable ✋🏻</h1>`);
        //res.redirect(req.cookies.url);
    }
});

app.get("/thanks", (req, res) => {

    //console.log("get request to /thanks route happened");
    if (req.session.allow = true) {
        res.render("thanks", {
            layout: "main",
        });
        console.log("I'm in a /thanks get at a moment and the cookie is set")
        // res.cookieSession("allow", true);
        // res.redirect("./signers");

        //req.session.look = true
        if (look = "on") {
            res.redirect("/signers");
        }
    } else {
        res.send(`
        <h1> Content Unavailable ✋🏻</h1>`);
        res.redirect("/");
    }
});
//app.post("/thanks",(req, res)=> {});//if interested in names will click the button
app.get("/signers", (req, res) => {
    if (req.session.allow = true && req.session.look) {
        res.render("signers", {
            layout: "main",
        });
        //     res.send(`
        // <h2>People who joined the petition :</h2>
        //  <ul>
        //  <li>names names names</li>
        //  </ul>
        // `);
    } else {
        res.send(`<h1> Content Unavailable ✋🏻</h1>`);
        res.redirect("/");
    }
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









