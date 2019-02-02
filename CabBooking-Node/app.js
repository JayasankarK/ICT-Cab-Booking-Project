const express = require("express");
const bodyParser = require("body-parser");
var app = express();

var { Users } = require('./employeeModels');
var { CabHistory } = require('./cabHistoryModels');
var { mongoose } = require('./mongoose_db');

app.use(bodyParser.json());

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

// For CORS,Pgm Line no 12 to 29    from https://github.com/anishpdm/ExpressApi.git
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//Add employee
app.post('/adduser', (req, res) => {
    var user = new Users({
        name: req.body.name,
        empid: req.body.empid,
        password: req.body.password,
        mobno: req.body.mobno,
        emailid: req.body.emailid
    });

    user.save().then((result) => {
        res.send(result);
    },
        (error) => {
            res.status(400).send(error);
        }
    );
});

//Authenticate user
app.get('/validateuser/:empid/:password', (req, res) => {
    var empid = req.params.empid;
    var password = req.params.password;
    var dbPass;
    Users.find({ "empid": empid }).then((data) => {
        if (!data) {
            return res.status(400).send();

        }
        if (data.length > 0) {

            dbPass = data[0].password;
            if (password == dbPass) {
                res.send({
                    mapid:data[0]._id,
                    name:data[0].name,
                    empid:data[0].empid,
                    mobno:data[0].mobno,
                    emailid:data[0].emailid,
                    isValid: true
                });
            }
            else {
                res.send({
                    isValid: false
                });
            }
        }
        else {
            res.send({
                isValid: false
            });
        }

        // res.send(isValid);
    }).catch((error) => {
        console.log(error);
        res.status(400).send();
    })
});

// Book cab  
app.post('/bookcab',(req,res)=>{
    var cab = new CabHistory({
        mapid: req.body.mapid,
        name: req.body.name,
        empid: req.body.empid,
        address: req.body.address,
        time: req.body.time,
        date: req.body.date
       
    });
    cab.save().then((doc)=>{
        res.send(doc);
       },(error)=>{
           res.status(400).send(error); 
       } )
    
    });

//Get ALL cab history
app.get('/cabhistory', (req, res) => {
    var mapid = req.params.mapid;
    // CabHistory.find({ "mapid": mapid }).sort({"date":-1,"time":-1}).then((data) => {
        CabHistory.find().sort({"date":-1,"time":-1}).then((data) => {
        if (!data) {
            return res.status(400).send();

        }
        res.send(data);

    }).catch((error) => {
        console.log(error);
        res.status(400).send();
    })
});

//Get booked cab history
app.get('/cabhistory/:mapid', (req, res) => {
    var mapid = req.params.mapid;
    // CabHistory.find({ "mapid": mapid }).sort({"date":-1,"time":-1}).then((data) => {
        CabHistory.find({ "mapid": mapid }).sort({"date":-1,"time":-1}).then((data) => {
        if (!data) {
            console.log("error");
            return res.status(400).send();

        }
        res.send(data);

    }).catch((error) => {
        console.log(error);
        res.status(400).send();
    })
});

//Edit booked cab history
app.put('/cabhistory/:bookid', (req, res) => {
    // var cab = new CabHistory({
    //     address: req.body.address,
    //     time: req.body.time,
    //     date: req.body.date
    // });
    var bookid = req.params.bookid;
    var address = req.body.address;
    var time = req.body.time;
    var date = req.body.date;

    CabHistory.update({ "_id": bookid }, { $set: { "date": date, "address": address, "time": time } }).then((result) => {
        res.send(result);
    },
        (error) => {
            res.status(400).send(error);
        }
    );
});

//Delete cab history
app.delete('/cabhistory/:bookid', (req, res) => {
    var bookid = req.params.bookid;
    CabHistory.remove({ "_id": bookid }).then((result) => {
        res.send(result);
    },
        (error) => {
            res.status(400).send(error);
        }).catch((error) => {
            console.log(error);
            res.status(400).send();
        });
});

app.listen(port, () => {
    console.log("Server started with port "+port);
});