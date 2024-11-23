const express = require("express");
const mysql = require("mysql");
const session = require("express-session");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname));
app.use(session({secret: "a-secret-key-yo-encrypt-session-data"}));
app.use(express.json()); // For JSON data
app.use(express.urlencoded({ extended: true })); // For form data

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Ensure views are in the correct folder


// MySQL Configuration
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "soen287",
});

db.connect((err) => {
  if (err) {
    console.log("Error connecting to database:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

// Setting the session
app.get("/setSession", (request, response) => {
  request.session.clientID = "17"; // Hardcoded for now
  response.send("Session set with clientID: " + request.session.clientID);
});

// Add a Client (FOR TESTING, TO REMOVE LATER)
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

  db.query(sql, [clientID], (err, results) => {
    if (err) {
      console.error("Error fetching services:", err);
      return response.status(500).send("Error fetching services.");
    }

    // Render the EJS template with the fetched services
    response.render("Client_Cancel_Services", { services: results });
  });
});


app.post("/cancelService", (request, response) => {
  const clientID = request.session.clientID;

  if (!clientID) {
    return response.status(401).send("No session found. Please log in.");
  }

  const selectedServices = request.body.selectedServices; // Expecting an array of strings
  if (!selectedServices || selectedServices.length === 0) {
    return response.status(400).send("No services selected.");
  }

  const sqlDelete = "DELETE FROM activeServices WHERE clientID = ? AND appointmentID = ? AND service = ? AND date = ? AND price = ? AND address = ?";

  selectedServices.forEach(item => {
    const [appointmentID, service, date, price, address] = item.split("_");

    db.query(sqlDelete, [clientID, appointmentID, service, date, price, address], (err, result) => {
      if (err) {
        console.error("Error canceling service:", err);
        return response.status(500).send("Error canceling selected services.");
      }
    });
  });

  response.redirect("/cancelService"); // Redirect after deletion (after the loop ends)
});



// Fill the service options in the form
app.get("/addService", (request, response) => {
  const sql = "SELECT name FROM businessProvidedServices";
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching services:", err);
      return response.status(500).send("Error fetching services.");
    }

    response.render("Client_Book_Services", { services: results });
  });
});


// Book a service
app.post("/addService", (request, response) => {
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


// Display client name in sidebar (dashboard)
app.get("/dashboard", (request, response) => {
  const clientID = request.session.clientID;
  // GET SERVICE ARRAYS HERE

  if (!clientID) {
    return response.status(401).send("No session found. Please log in.");
  }

  let sql = "SELECT firstName, lastName FROM clientInfo WHERE clientID = ?";
   
  db.query(sql, [clientID], (err, result) => {
    if (err) {
      return response.status(500).send("Could not retrieve data from the table.");
    }
    if (result.length > 0) {
      const userName = `${result[0].firstName} ${result[0].lastName}`;
      response.render("client_dashboard", { userName }); // ADD SERVICE ARRAYS HERE
    } else {
      response.render("Client_Dashboard", { userName: "Guest" }); // ADD SERVICE ARRAYS HERE
    }
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
  const sqlServices = "SELECT service FROM activeServices WHERE clientID = ?";

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



// Display client name in sidebar (receipt)
app.get("/receipt", (request, response) => {
  const clientID = request.session.clientID;

  if (!clientID) {
    return response.status(401).send("No session found. Please log in.");
  }

  let sql = "SELECT firstName, lastName FROM clientInfo WHERE clientID = ?";
   
  db.query(sql, [clientID], (err, result) => {
    if (err) {
      return response.status(500).send("Could not retrieve data from the table.");
    }
    if (result.length > 0) {
      const userName = `${result[0].firstName} ${result[0].lastName}`;
      response.render("Client_Receipt", { userName });
    } else {
      response.render("Client_Receipt", { userName: "Guest" });
    }
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
    

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});