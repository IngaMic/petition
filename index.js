const express = require("express");
const app = express();
const db = require("./db");
const handlebars = require("express-handlebars");
const cookieParser = require("cookie-parser");
const hbSet = handlebars.create({
    // helpers: {
    //     //
    // },
});
app.engine("handlebars", hbSet.engine);
app.set("view engine", "handlebars");
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    if (!req.cookies.allow && req.url !== "/welcome") {
        res.cookie("url", req.url);
        res.redirect("/welcome");
    } else {
        next();
    }
});
app.get("/", (req, res) => { res.redirect("/welcome"); });
app.use(express.static("./public"));
app.get("/welcome", (req, res) => {
    // res.render("welcome", {
    //     layout: "main",
    // }); //continue with canvas in public/script.js
    // must be done with express - handlebars:
    res.send(`
    <h2>Hello! Would you like to sign our petition?</h2>
        <form method='POST' style="display: flex; flex-direction: column; justify-content: space-between; width: 40%; height: 50%;">
            <input type='text' name='firstname' placeholder='First Name' autocomplete='off'>
            <input type='text' name='lastname' placeholder='Last Name' autocomplete='off'>
            <div>
                <input type="checkbox" name="accept">
            </div>
            <button name="submit"> Submit </submit>
        </form>
    `);
});
app.post("/welcome", (req, res) => {
    const { firstname, lastname, accept, submit } = req.body;
    if (submit) {
        res.cookie("allow", true);
        //have to redirect to thanks
        res.send(`
    <h2>People who joined the petition :</h2>
     <ul>
     <li>smth</li>
     </ul>
     <button name="look"> Take a look! </submit>
    `);

    } else {
        res.send(`<h1> Content Unavailable ✋🏻</h1>`);
        //res.redirect(req.cookies.url);
    }
});

app.get("/thanks", (req, res) => {
    // res.render("thanks", {
    //     layout: "main",
    // });
    //console.log("get request to /thanks route happened");
    if (accept === "on") {
        res.cookie("allow", true);
        res.redirect(req.cookies.url);
    } else {
        res.send(`
        <h1> Content Unavailable ✋🏻</h1>`);
        res.redirect("/");
    }
});
//app.post("/thanks",(req, res)=> {});//if interested in names will click the button
app.get("/signers", (req, res) => {
    // res.render("signers", {
    //     layout: "main",
    // });
    if (allow === true) {
        res.send(`
    <h2>People who joined the petition :</h2>
     <ul>
     <li>names names names</li>
     </ul>
    `);
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









