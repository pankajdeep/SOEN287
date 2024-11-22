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
  request.session.clientID = "13"; // Hardcoded for now
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
  };

  let sqlStatement = "INSERT INTO clientInfo SET ?";
  let query = db.query(sqlStatement, client, (err, result) => {
    if (err) {
      response.send("Could not insert a new record!");
    } else {
      response.send("Record inserted successfully!");
    }
  });
});

// Update Profile in the databse
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
});

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

    // Clear the session
    request.session.message = "Your account has been deleted";
    request.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return response.status(500).send("Could not destroy session.");
      }
      response.redirect("/settings");
    });
  });
});


// Display client name in sidebar (dashboard)
app.get("/dashboard", (request, response) => {
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
      response.render("client_dashboard", { userName });
    } else {
      response.render("Client_Dashboard", { userName: "Guest" });
    }
  });
});


// Display client name in sidebar (book service)
app.get("/book", (request, response) => {
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
      response.render("Client_Book_Services", { userName });
    } else {
      response.render("Client_Book_Services", { userName: "Guest" });
    }
  });
});


// Display client name in sidebar (cancel service)
app.get("/cancel", (request, response) => {
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
      response.render("Client_Cancel_Services", { userName });
    } else {
      response.render("Client_Cancel_Services", { userName: "Guest" });
    }
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

  if (!clientID) {
    response.render("Client_Settings", { userName: "Guest", message: "" });
  }

  let sql = "SELECT firstName, lastName FROM clientInfo WHERE clientID = ?";
   
  db.query(sql, [clientID], (err, result) => {
    if (err) {
      return response.status(500).send("Could not retrieve data from the table.");
    }
    
    const message = request.query.message || "";
    if (result.length > 0) {
      const userName = `${result[0].firstName} ${result[0].lastName}`;
      response.render("Client_Settings", { userName, message });
    } else {
      response.render("Client_Settings", { userName: "Guest", message}); // message is initially empty
    }
  });
});


app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`);
});