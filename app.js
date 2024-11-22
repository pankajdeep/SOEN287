const express = require("express");
const mysql = require("mysql");
const session = require("express-session");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(session({secret: "a-secret-key-yo-encrypt-session-data"}));

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
  request.session.clientID = "6"; // Hardcoded for now
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

// Update Profile
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
  if (request.body.newPassword) client.password = request.body.newPassword;

  if (Object.keys(client).length === 0) {
    return response.send("No updates provided.");
  }

  const sql = "UPDATE clientInfo SET ? WHERE clientID = ?";
  db.query(sql, [client, clientID], (err, result) => {
    if (err) {
      return response.send("Could not update the client: " + err);
    }
    response.send("Profile updated successfully!");
  });
});

app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`);
});