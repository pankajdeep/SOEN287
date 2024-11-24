const express = require("express");
const session = require("express-session");
const mysql= require("mysql");

const app = express();

app.use(session({
    secret: 'secret'
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname));

const PORT=5000;

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password:"",
    database:"soen287"
});
db.connect((err) => {
    if (err) {
        console.log("Error connecting to DB");
    } else {
        console.log("Connected");
    }
});
app.get("/LandingPage",(req,res)=>{
    //Check if the database is empty
    let sqlstatement="SELECT * FROM BUSINESSINFO";
    let searchforid = db.query(sqlstatement,(err,result)=>{
        if(result.length==0){

        }
    });
    //If databse empty, make default business info and don't insert it
    //Find the first business in the table as default

    //Will display first one found

    //will change this later to ejs
    res.sendFile(__dirname+"/LandingPage.html")
});
app.get("/Signinchoice",(req,res)=>{
    req.session.warning="";
    res.sendFile(__dirname+"/signinchoice.html");
})

//Done
app.get("/Login",(req,res)=>{
    let tempwarning = "";
    if(req.session.warning){
        tempwarning = req.session.warning;
    }
    let sqlstatement="SELECT * FROM BUSINESSINFO";
    let searchforid = db.query(sqlstatement,(err,result)=>{
        if(err){
            res.send("Could not get database");
        }else{
            if(result.length==0){
                //Add default
                let businessinfo={
                    companyName: "The Pristine Clean",
                    logo: "logo.png"
                };

                res.render("login.ejs",{ BusinessInfo: businessinfo ,Warning: tempwarning});
                req.session.warning="";
            }
            else{
                //Will have if condition to use first one if none given
                if(req.session.businessID){
                    businessinfos = result.filter(function(value,index,array){
                        return ((result[index].ID===req.session.businessID));
                    });
                    if(businessinfos.length>0){
                        let businessinfo={
                            companyName: businessinfos[0].companyName,
                            logo: businessinfos[0].logo
                        };

                        res.render("login.ejs",{ BusinessInfo: businessinfo ,Warning: tempwarning});
                        req.session.warning="";
                    }else{
                        res.send("Could not find Business Info with given ID");
                    }
                }
                else{
                    tempInfo = result[0];
                    
                    let businessinfo={
                        companyName: tempInfo.companyName,
                        logo: tempInfo.logo
                    };

                    //Change into ejs
                    res.render("login.ejs",{ BusinessInfo: businessinfo ,Warning: tempwarning});
                    req.session.warning="";
                }
            }
        }
    });
})
//Done
app.post("/CheckClientLogin",(req,res)=>{
    let Client ={
        email: req.body.email,
        password: req.body.password
    };

    let sqlstatement="SELECT * FROM CLIENTINFO";
    let searchforid = db.query(sqlstatement,(err,result)=>{
        if(err){
            res.send("Could not get database");
        }
        else{
            ClientFinder = result.filter(function(value,index,array){
                return ((result[index].email===Client.email)&&(result[index].password===Client.password));
            });
            if(ClientFinder.length>0){
                req.session.clientID = ClientFinder[0].clientID;

                //Change to redirect to Emy stuff
                res.sendFile(__dirname+"/Client_Dashboard.html");
            }else{
                req.session.warning = "*Email or password was incorrect*";
                res.redirect("/Login");
            }
        }
    })
})

app.post("/CheckBusinessLogin",(req,res)=>{

    let Business ={
        email: req.body.email,
        password: req.body.password
    };

    let sqlstatement="SELECT * FROM BUSINESSINFO";
    let searchforid = db.query(sqlstatement,(err,result)=>{
        if(err){
            res.send("Could not get database");
        }
        else{
            //filter to find matching emails
            BusinessFinder = result.filter(function(value,index,array){
                return ((result[index].email===Business.email)&&(result[index].password===Business.password));
            });
            if(BusinessFinder.length>0){
                req.session.businessID = BusinessFinder[0].ID;

                //Change to redirect to Emy stuff
                res.sendFile(__dirname+"/business_page.html");
            }else{
                req.session.warning = "*Email or password was incorrect*";
                res.redirect("/LoginBusiness");
            }
        }
    })
})
app.get("/LoginBusiness",(req,res)=>{

    let tempwarning = "";
    if(req.session.warning){
        tempwarning = req.session.warning;
    }
    let sqlstatement="SELECT * FROM BUSINESSINFO";
    let searchforid = db.query(sqlstatement,(err,result)=>{
        if(err){
            res.send("Could not get database");
        }else{
            if(result.length==0){
                //Add default
                let businessinfo={
                    companyName: "The Pristine Clean",
                    logo: "logo.png"
                };

                res.render("loginBusiness.ejs",{ BusinessInfo: businessinfo ,Warning: tempwarning});
                req.session.warning="";
            }
            else{
            //Will have if condition to use first one if none given
                if(req.session.businessID){
                    businessinfo = result.filter(function(value,index,array){
                        return ((result[index].ID===req.session.businessID));
                    });
                    if(businessinfos.length>0){
                        let businessinfo={
                            companyName: businessinfos[0].companyName,
                            logo: businessinfos[0].logo
                        };

                        res.render("login.ejs",{ BusinessInfo: businessinfo ,Warning: tempwarning});
                        req.session.warning="";
                    }else{
                        res.send("Could not find Business Info with given ID");
                    }
                }else{
                    tempInfo = result[0];

                    let businessinfo={
                        companyName: tempInfo.companyName,
                        logo: tempInfo.logo
                    };

                    //Change into ejs
                    res.render("loginBusiness.ejs",{ BusinessInfo: businessinfo ,Warning: tempwarning});
                    req.session.warning="";
                    //Else change to finding businessID from log in
                }
            }
        }
    });    
})


app.get("/Signup",(req,res)=>{
    let tempwarning = "";
    if(req.session.warning){
        tempwarning = req.session.warning;
    }
    let sqlstatement="SELECT * FROM BUSINESSINFO";
    let searchforid = db.query(sqlstatement,(err,result)=>{
        if(err){
            res.send("Could not get database");
        }else{
            if(result.length==0){
                //Add default
                let businessinfo={
                    companyName: "The Pristine Clean",
                    logo: "logo.png"
                };

                res.render("signup.ejs",{ BusinessInfo: businessinfo ,Warning: tempwarning});
                req.session.warning="";
            }
            else{
            //Will have if condition to use first one if none given
            tempInfo = result[0];

            let businessinfo={
                companyName: tempInfo.companyName,
                logo: tempInfo.logo
            };

            //Change into ejs
            res.render("signup.ejs",{ BusinessInfo: businessinfo ,Warning: tempwarning});
            req.session.warning="";
            //Else change to finding businessID from log in
            }
        }
    })
    
    //res.sendFile(__dirname+"/signup.html");
})



app.post("/SubmitClientInfo",(req,res)=>{
    
    let Client = {
        firstName: req.body.first_name,
        lastName: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        address: req.body.address,
        phoneNumber:req.body.phone
    };

    let sqlstatement="SELECT * FROM CLIENTINFO";
    let searchforid = db.query(sqlstatement,(err,result)=>{
        if(err){
            res.send("Could not get database");
        }
        else{
            //filter to find matching emails
            matchingarray = result.filter(function(value,index,array){
                return (result[index].email===Client.email);
            });
            if(matchingarray.length>0){
                //Send ejs of same thing but with error message
                req.session.warning = "*Email already in use*";
                res.redirect("/Signup");
            }else{
                sqlstatement="INSERT INTO ClientInfo SET ?";
                let query = db.query(sqlstatement,Client,(err,resultInsert)=>{
                    if(err){
                        res.send("Could not insert to record!");
                    }
                    else{
                        //Find the id and add it to session
                        req.session.clientID =resultInsert.insertId;
                        //Change to redirect to Emy stuff
                        res.sendFile(__dirname+"/Client_Dashboard.html");
                    }
                });
            }

        }
    });
})

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});