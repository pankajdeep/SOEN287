const express = require("express");
const session = require("express-session");
const path = require("path");
const multer = require('multer');
const mysql= require("mysql");

const app = express();
app.set('view engine', 'ejs');
app.use(session({
    secret: 'secret'
}));
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname));
app.set("views", path.join(__dirname, "views")); // Ensure views are in the correct folder
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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "Images/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

app.get("/",(req,res)=>{
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
                res.redirect("/date");
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

                //Change to redirect to Hugo stuff
                res.redirect("/businessprofile");
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
                        res.redirect("/date");
                    }
                });
            }

        }
    });
})
//_______________________________________________HUGO PART_____________________________________

app.get('/businessprofile', (req, res) => {
    const id = req.session.businessID;
    const query = 'SELECT * FROM businessinfo WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching:', err);
            res.status(500).send('Error fetching data.');
        }
        else {
            res.render('businessprofile.ejs', {businessinfo: results}); // Pass data to EJS
        }
    });
});

app.get('/modifyservices', (req, res) => {

    const query = 'SELECT * FROM businessprovidedservices';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching:', err);
            res.status(500).send('Error fetching data.');
        }
        else {
            res.render('modifyservices', {businessprovidedservices: results}); // Pass data to EJS
        }
    });
});

app.get('/history', (req, res) => {
    const query = 'SELECT clients.firstName, clients.lastName, clients.email, clients.password, clients.address AS client_address, clients.phoneNumber, actives.appointmentID, actives.date, actives.time, actives.service, actives.address AS active_address, actives.price, actives.paid FROM clientinfo AS clients INNER JOIN activeservices AS actives ON clients.clientID = actives.clientID';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching:', err);
            res.status(500).send('Error fetching data.');
        }
        else {
            res.render('history', {clients: results}); // Pass data to EJS
        }
    });
});

app.get('/receipts', (req, res) => {

    const query = 'SELECT * FROM activeservices';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching:', err);
            res.status(500).send('Error fetching data.');
        }
        else {
            res.render('receipts', {activeservices: results}); // Pass data to EJS
        }
    });
});

// Inserting & updating data
app.post('/updatebusinessinfo', upload.single('profile-logo-file'), (req, res) => {
    const { name, email, phone_number, location, company_description} = req.body;
    
    const logo = req.file.originalname;

    const query = 'UPDATE businessinfo SET companyName = ?, email = ?, phoneNumber = ?, location = ?, companyDescription = ?, logo = ? WHERE ID = ?';
    db.query(query, [name, email, phone_number, location, company_description, logo, req.session.businessID], (err, result) => {
        if (err) {
            console.error('Error uploading data: ', err);
            res.status(500).send('Error uploading data.');
        } else {
            console.log('Business info updated: ', result);
            res.redirect('/businessprofile');
        }
    });
});

// Adding services 
app.post('/addservice', (req, res) => {
    const { serviceName, serviceDescription, price } = req.body;

    const query = 'INSERT INTO businessprovidedservices (name, description, price) VALUES (?, ?, ?)';
    db.query(query, [serviceName, serviceDescription, price], (err, result) => {
        if (err) {
            console.error('Error adding service: ', err);
            res.status(500).send('Error saving data to the database.');
        }
        else {
            console.log('Service added: ', result);
            res.redirect('/modifyservices');
        }
    });
});

// Delete services 
app.post('/deleteservice/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM businessprovidedservices WHERE serviceID = ?';

    db.query(query, [id], (err, result) => {
        if (err) throw err;
        console.log(`Deleted row with ID: ${id}`);
        res.redirect('/modifyservices');
    });
});

// Update services 
app.post('/updateservice/:id', (req, res) => {
    const serviceId = req.params.id;
    const { serviceName, serviceDescription, price } = req.body;

    const query = 'UPDATE businessprovidedservices SET name = ?, description = ?, price = ? WHERE serviceID = ?';
    db.query(query, [serviceName, serviceDescription, price, serviceId], (err, result) => {
        if (err) {
            console.error('Error updating service: ', err);
            res.status(500).json({ success: true, message: err.message });
        }
        res.redirect('/modifyservices');
    });
});


//________________________________________________END HUGO PART__________________________________
//______________________________________________EMYWATSONANDKATIE________________________________

app.get("/addClient", (request, response) => {
    const client = {
      firstName: "Jotaro",
      lastName: "Joestar",
      email: "jotarojoe@gmail.com",
      password: "iLoveKakyoin123",
      address: "123 cherry street",
      phoneNumber: "6666666666",
      date: "2024-11-30" //Same name as get
    };
  
    let sqlStatement = "INSERT INTO clientInfo SET ?";
    let query = db.query(sqlStatement, client, (err, result) => {
      if (err) {
        response.send("Could not insert a new client :(");
      } else {
        response.send("New client inserted successfully :D");
      }
    });
  });
  
  
  // Add first service as an admin (FOR TESTING, TO REMOVE LATER)
  app.get("/addProvidedService1", (request, response) => {
    const providedService = {
      name: "Regular interior cleaning",
      description: "imma clean your insides ;)",
      price: "50$"
    };
  
    let sqlStatement = "INSERT INTO businessProvidedServices SET ?";
    db.query(sqlStatement, providedService, (err, result) => {
      if (err) {
        response.send("Could not insert a new provided service :(");
      } else {
        response.send("New provided service inserted successfully :D");
      }
    });
  });
  
  // Add second service as an admin (FOR TESTING, TO REMOVE LATER)
  app.get("/addProvidedService2", (request, response) => {
    const providedService = {
      name: "Major interior cleaning",
      description: "imma MAJOR clean your insides ;)",
      price: "100$"
    };
  
    let sqlStatement = "INSERT INTO businessProvidedServices SET ?";
    db.query(sqlStatement, providedService, (err, result) => {
      if (err) {
        response.send("Could not insert a new provided service :(");
      } else {
        response.send("New provided service inserted successfully :D");
      }
    });
  });
  
  
  // Update profile
  app.post("/updateProfile", (request, response) => {
    const clientID = request.session.clientID;
  
    if (!clientID) {
      return response.status(401).send("No session found. Please log in.");
    }
  
    const client = {};
    if (request.body.firstName) client.firstName = request.body.firstName;
    if (request.body.lastName) client.lastName = request.body.lastName;
    if (request.body.newEmail) client.email = request.body.newEmail;
    if (request.body.phoneNumber) client.phoneNumber = request.body.phoneNumber;
    if (request.body.address) client.address = request.body.address;
    if (request.body.newPassword) client.password = request.body.newPassword;
  
    if (Object.keys(client).length === 0) {
      return response.send("No updates provided.");
    }
  
    const sql = "UPDATE clientInfo SET ? WHERE clientID = ?";
    db.query(sql, [client, clientID], (err, result) => {
      if (err) {
        return response.send("Could not update the client: " + err);
      }
      
      let sqlUser = "SELECT firstName, lastName FROM clientInfo WHERE clientID = ?";
      db.query(sqlUser, [clientID], (err, result) => {
        if (err) {
          return response.status(500).send("Could not retrieve updated user data.");
        }
        
        const userName = result.length > 0 ? `${result[0].firstName} ${result[0].lastName}` : "Guest";
        response.render("Client_Settings", {userName, message: "Your profile has been updated."});
      });
    });
  });//
  
  
  // Delete profile
  app.post("/deleteProfile", (request, response) => {
    const clientID = request.session.clientID;
  
    if (!clientID) {
      return response.status(401).send("No session found. Please log in.");
    }
  
    let sql = "DELETE FROM clientInfo WHERE clientID = ?";
    db.query(sql, [clientID], (err, result) => {
      if (err) {
        console.error("Error deleting profile:", err);
        return response.send(`Could not delete the client with ID = ${clientID} \n ${err}`);
      }
  
      const message = "Your account has been deleted.";
  
      // Clear the session
      request.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
          return response.status(500).send("Could not destroy session.");
        }
        response.render("Client_settings", {userName: "Guest", message});
      });
    });
  });
  
  
  // Delete a service
  app.get("/cancelService", (request, response) => {
    const clientID = request.session.clientID;
  
    if (!clientID) {
      return response.status(401).send("No session found. Please log in.");
    }
  
    const sql = "SELECT * FROM activeServices WHERE clientID = ?";
    const sqlUser = "SELECT firstName, lastName FROM clientInfo WHERE clientID = ?";
  
    db.query(sql, [clientID], (err, results) => {
      if (err) {
        console.error("Error fetching services:", err);
        return response.status(500).send("Error fetching services.");
      }
  
      db.query(sqlUser, [clientID], (err, result) => {
        if (err) {
          console.error("Error fetching user details:", err);
          return response.status(500).send("Error fetching user details.");
        };
  
      const userName = result.length > 0 
        ? `${result[0].firstName} ${result[0].lastName}` 
        : "Guest";
  
  
      console.log(results);
      // Render the EJS template with the fetched services
      response.render("Client_Cancel_Services", {userName, services: results, message: "Service successfully deleted."});
      });
    });
  });
  
  app.post("/deleteService", (request, response) => {
    const clientID = request.session.clientID;
  
    if (!clientID) {
      return response.status(401).send("No session found. Please log in.");
    }
  
    let selectedServices = request.body.selectedServices;
    console.log(request.body.selectedServices)
    if (!selectedServices) {
      return response.status(400).send("No services selected.");
    }
    if (!Array.isArray(selectedServices)) {
      selectedServices = [selectedServices]; // Convert single string to an array
    }
    console.log(selectedServices);
  
    const sqlDelete = "DELETE FROM activeServices WHERE clientID = ? AND appointmentID = ? AND service = ? AND date = ? AND price = ? AND address = ?";
  
    selectedServices.forEach(selectedService => {
      const [appointmentID, service, date, price, address] = selectedService.split("_");
  
      db.query(sqlDelete, [clientID, appointmentID, service, date, price, address], (err, result) => {
        if (err) {
          console.error("Error canceling service:", err);
          return response.status(500).send("Error canceling selected services.");
        }
      });
    });
  
    response.redirect("/cancelService");
  });
  
  
  // Paid and unpaid services
  app.get("/clientreceipts", (request, response) => {
    const clientID = request.session.clientID;
  
    if (!clientID) {
      return response.status(401).send("No session found. Please log in.");
    }
  
    const sql = "SELECT * FROM activeServices WHERE clientID = ?";
    const sqlUser = "SELECT firstName, lastName FROM clientInfo WHERE clientID = ?";
  
    db.query(sql, [clientID], (err, results) => {
      if (err) {
        console.error("Error fetching services:", err);
        return response.status(500).send("Error fetching services.");
      }
  
      db.query(sqlUser, [clientID], (err, result) => {
        if (err) {
          console.error("Error fetching user details:", err);
          return response.status(500).send("Error fetching user details.");
        };
  
      const userName = result.length > 0 
        ? `${result[0].firstName} ${result[0].lastName}` 
        : "Guest";
  
        const unpaidServices = [];
        const paidServices = [];
  
        results.forEach(service => {
          if (service.paid == 0) {
            unpaidServices.push(service);
          } else {
            paidServices.push(service);
          }
        });
  
      console.log(results);
      // Render the EJS template with the fetched services
      response.render("Client_Receipt", {userName, unpaidServices, paidServices});
      });
    });
  });
  
  
  app.post("/processedReceipts", (request, response) => {
    const clientID = request.session.clientID;
  
    if (!clientID) {
      return response.status(401).send("No session found. Please log in.");
    }
  
    let selectedServices = request.body.selectedServices;
  
    // Ensure selectedServices is always an array
    if (!selectedServices) {
      return response.status(400).send("No services selected.");
    }
    if (!Array.isArray(selectedServices)) {
      selectedServices = [selectedServices]; // Convert single string to array
    }
  
    console.log(selectedServices);
  
    const sqlUpdate = `
      UPDATE activeServices 
      SET paid = 1
      WHERE clientID = ? AND appointmentID = ? AND service = ? AND date = ? AND price = ? AND address = ?
    `;
  
    selectedServices.forEach((selectedService) => {
      const [appointmentID, service, date, price, address] = selectedService.split("_");
  
      db.query(sqlUpdate, [clientID, appointmentID, service, date, price, address], (err, result) => {
        if (err) {
          console.error("Error paying service:", err);
          return response.status(500).send("Error paying selected services.");
        }
      });
    });
  
    response.redirect("/clientreceipts");
  });
  
  
  
  // Fill the service options in the form to book
  app.get("/addClientService", (request, response) => {
    const sql = "SELECT name FROM businessProvidedServices";
    
    db.query(sql, (err, results) => {
      if (err) {
        console.error("Error fetching services:", err);
        return response.status(500).send("Error fetching services.");
      }
  
      response.render("Client_Book_Services", {services: results});
    });
  });
  
  
  // Book a service
  app.post("/addClientService", (request, response) => {
    const clientID = request.session.clientID;
    const { service, date, address } = request.body;
  
    if (!clientID) {
      return response.status(401).send("No session found. Please log in.");
    }
  
    const sqlPrice = "SELECT price FROM businessProvidedServices WHERE name = ?";
    db.query(sqlPrice, [service], (err, result) => {
      if (err) {
        console.error("Error fetching price:", err);
        return response.status(500).send("Error fetching service price.");
      }
  
      if (result.length === 0) {
        return response.status(400).send("Service not found.");
      }
  
      const price = result[0].price;
      const sqlInsert = "INSERT INTO activeServices (clientID, service, date, address, paid, price) VALUES (?, ?, ?, ?, ?, ?)";
      db.query(sqlInsert, [clientID, service, date, address, false, price], (err) => {
        if (err) {
          console.error("Error booking service:", err);
          return response.status(500).send("Booking failed.");
        }
  
        const sqlServices = "SELECT name FROM businessProvidedServices";
        db.query(sqlServices, (err, services) => {
          if (err) {
            console.error("Error fetching services:", err);
            return response.status(500).send("Error fetching services.");
          }
  
          const sqlUser = "SELECT firstName, lastName FROM clientInfo WHERE clientID = ?";
          db.query(sqlUser, [clientID], (err, result) => {
            if (err) {
              console.error("Error fetching user name:", err);
              return response.status(500).send("Error fetching user data.");
            }
  
            const userName = result.length > 0 ? `${result[0].firstName} ${result[0].lastName}` : "Guest";
            response.render("Client_Book_Services", {userName, services, message: "Service added successfully."});
          });
        });
      });
    });
  });
  
  
  // Display client name in sidebar (book service)
  app.get("/book", (request, response) => {
    const clientID = request.session.clientID;
    const message = request.query.message || "";
  
  
    if (!clientID) {
      return response.status(401).send("No session found. Please log in.");
    }
  
    let sql = "SELECT firstName, lastName FROM clientInfo WHERE clientID = ?";
    db.query(sql, [clientID], (err, result) => {
      if (err) {
        return response.status(500).send("Could not retrieve data from the table.");
      }
  
      const userName = result.length > 0 ? `${result[0].firstName} ${result[0].lastName}` : "Guest";
  
      sql = "SELECT name FROM businessProvidedServices";
      db.query(sql, (err, services) => {
        if (err) {
          console.error("Error fetching services:", err);
          return response.status(500).send("Error fetching services.");
        }
  
        response.render("Client_Book_Services", {userName, services, message});
      });
    });
  });
  
  
  // Display client name in sidebar (cancel service)
  app.get("/cancel", (request, response) => {
    const clientID = request.session.clientID;
  
    if (!clientID) {
      return response.status(401).send("No session found. Please log in.");
    }
  
    const sqlUser = "SELECT firstName, lastName FROM clientInfo WHERE clientID = ?";
    const sqlServices = "SELECT * FROM activeServices WHERE clientID = ?";
  
    db.query(sqlUser, [clientID], (err, userResult) => {
      if (err) {
        console.error("Error fetching user details:", err);
        return response.status(500).send("Could not retrieve user details.");
      }
  
      const userName = userResult.length > 0 
        ? `${userResult[0].firstName} ${userResult[0].lastName}` 
        : "Guest";
  
      db.query(sqlServices, [clientID], (err, serviceResults) => {
        if (err) {
          console.error("Error fetching services:", err);
          return response.status(500).send("Could not retrieve services.");
        }
  
        response.render("Client_Cancel_Services", {userName, services: serviceResults, message: null});
      });
    });
  });
  
  
  // Access to Client_Settings.ejs and Display client name in sidebar
  app.get("/settings", (request, response) => {
    const clientID = request.session.clientID;
    const message = request.query.message || "";
  
    if (!clientID) {
      response.render("Client_Settings", { userName: "Guest", message: "" });
    }
  
    let sql = "SELECT firstName, lastName FROM clientInfo WHERE clientID = ?";
     
    db.query(sql, [clientID], (err, result) => {
      if (err) {
        return response.status(500).send("Could not retrieve data from the table.");
      }
      
      if (result.length > 0) {
        const userName = `${result[0].firstName} ${result[0].lastName}`;
        response.render("Client_Settings", { userName, message });
      } else {
        response.render("Client_Settings", { userName: "Guest", message}); // message is initially empty
      }
    });
  });
  
  
  //getting dates from aactive service so that i can dynamically print the past /future appointments in ejs lol
  app.get("/date", (request, response) => {
    //const date = new date(request.session.date); // yyyy-mm-dd for exmaple 2024-11-30
    const clientID = request.session ? request.session.clientID : null; // Assuming clientID is stored in session
    if (!clientID) {
        response.status(400).send('Client ID not found in session');
        return;
    }
  
    db.query(
      'SELECT service, date FROM activeServices WHERE clientID = ?', //if you change the activeservice tavle here is some thingi you need to change
      [clientID],
      (error, results) => {
        if (error) {
          console.error('Error fetching services:', error);
          response.render("Client_Dashboard", { pastServices: [], futureServices: [] }); // To add  pastServices and futureServices in Client_Dashboard.ejs
          return;
        }
  
        const currentDate = new Date('2024-11-30');
        const pastServices = [];
        const futureServices = [];
  
        let sqlUser = "SELECT firstName, lastName FROM clientInfo WHERE clientID = ?";
        db.query(sqlUser, [clientID], (err, result) => {
        if (err) {
          return response.status(500).send("Could not retrieve updated user data.");
        }
        
        const userName = result.length > 0 ? `${result[0].firstName} ${result[0].lastName}` : "Guest";
  
        results.forEach(service => {
            const serviceDate = new Date(service.date);
            if (serviceDate < currentDate) {
              pastServices.push(service);
            } else {
              futureServices.push(service);
            }
        });
        
        response.render('Client_Dashboard', { pastServices, futureServices, userName }); // To add  pastServices and futureServices in Client_Dashboard.ejs
        });
      });
  });

//______________________________________________ENDEMYKATIE______________________________________

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});