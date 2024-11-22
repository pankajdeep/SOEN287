const express = require("express");
const mysql = require("mysql");

const app = express();

app.use(express.urlencoded({ extended: false}));
app.use(express.static(__dirname));

const PORT =3000;


// FOR TESTING (SESSION) // TO REMOVE LATER
// const session = require("express-session");
// app.use(session({secret: "a-secret-key-to-encrypt-session-data" }));

// app.get("/setSession", (request, response) => {
//     request.session.clientID = "ID1234";
//     response.send("Session set with clientID: " + request.session.clientID);
// });

// app.get("/getSession", (request, response) => {
//     const clientID= request.session.clientID;
//     response.send(clientID  || "Not session found");
// });

// MySQL configuration to use my database
const db = mysql.createConnection({
    host: "localhost", // Use the address of your MySQL server
    user: "root", // Use your username in MySQL for this database
    password: "", // Use your password on MySQL server for this database
    database: "soen287", // use the name of your DB
});

db.connect((err) => {
    if (err) {
      console.log("Error connecting to database:", err); // to remove err later
    } else {
      console.log("Connected to MySQL");
    }
});

// FOR TESTING (HARD CODED CLIENT) TO REMOVE LATER
app.get("/addClient", (request, response) => {
    let client = {
        clientID: "ID1234",
        firstName: "Jotaro",
        lastName: "Joestar",
        email: "jotarojoe@gmail.com",
        password: "iLoveKakyoin123",
        address: "123 cherry street",
        phoneNumber: "6666666666"
    };

    // Define a SQL query
    let sqlStatement = "INSERT INTO clientInfo SET ?";
    db.query(sqlStatement, client, (err, result) => {
        if (err) {
            response.send("Could not insert a new record!");
        }
        else {
            response.send("Record inserted successfully!");
        }
    });
});


// app.post("/updateProfile", (request, response) => {
//     if (!request.session.clientID) {
//         return response.status(401).send("No session found.");
//     }

//     const clientID = request.session.clientID;

//     let client = {};
//     if (request.body.firstName) client.firstName = request.body.firstName;
//     if (request.body.lastName) client.lastName = request.body.lastName;
//     if (request.body.newEmail) client.email = request.body.newEmail;
//     if (request.body.phoneNumber) client.phoneNumber = request.body.phoneNumber;
//     if (request.body.newPassword) client.password = request.body.newPassword;

//     if (Object.keys(client).length === 0) {
//         return response.send("No updates provided.");
//     }

//     const sql = "UPDATE clientInfo SET ? WHERE clientID = ?";
    
//     db.query(sql, [client, clientID], (err, result) => {
//         if (err) {
//             return response.send("Could not update the client: " + err);
//         }
//         response.send("Profile updated successfully!");
//     });
// });
































app.post('/profileAction', (req, res) => {
  const { email, password, firstName, lastName, newEmail, phoneNumber, newPassword, action } = req.body;

  // Step 1: Authenticate user
  const authQuery = 'SELECT clientID FROM clientInfo WHERE email = ? AND password = ?';
  db.query(authQuery, [email, password], (err, results) => {
      if (err) return res.status(500).send('Error authenticating user.');
      if (results.length === 0) return res.status(401).send('Invalid email or password.');

      const clientID = results[0].clientID;

      if (action === 'update') {
          // Handle update logic
          const updates = [];
          const values = [];

          if (firstName) {
              updates.push('firstName = ?');
              values.push(firstName);
          }
          if (lastName) {
              updates.push('lastName = ?');
              values.push(lastName);
          }
          if (newEmail) {
              updates.push('email = ?');
              values.push(newEmail);
          }
          if (phoneNumber) {
              updates.push('phoneNumber = ?');
              values.push(phoneNumber);
          }
          if (newPassword) {
              updates.push('password = ?');
              values.push(newPassword);
          }

          if (updates.length > 0) {
              values.push(clientID);
              const updateQuery = `UPDATE clientInfo SET ${updates.join(', ')} WHERE clientID = ?`;
              db.query(updateQuery, values, (err) => {
                  if (err) return res.status(500).send('Error updating profile.');
                  res.send('Profile updated successfully!');
              });
          } else {
              res.send('No updates provided.');
          }
      } else if (action === 'delete') {
          // Handle delete logic
          const deleteQuery = 'DELETE FROM clientInfo WHERE clientID = ?';
          db.query(deleteQuery, [clientID], (err) => {
              if (err) return res.status(500).send('Error deleting account.');
              res.send('Account deleted successfully!');
          });
      } else {
          res.status(400).send('Invalid action.');
      }
  });
});

app.post('/addService', (req, res) => {
  const { clientID, service, date, address, size } = req.body;  // Extract the data from the request body

  // Input validation (optional, but recommended)
  if (!clientID || !service || !date || !address || !size) {
      return res.status(400).send('All fields are required.');
  }

  // Insert the new service into the database
  const insertQuery = `
      INSERT INTO activeServices (clientID, service, date, address, size) 
      VALUES (?, ?, ?, ?, ?)
  `;

  // Insert the service with the provided clientID
  db.query(insertQuery, [clientID, service, date, address, size], (err, result) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Error adding service.');
      }
      
      // Send a success message if insertion was successful
      res.send('Service booked successfully!');
  });
});

app.post('/cancelService', (req, res) => {
  const { clientID, service, date, address, size } = req.body;  // Extract data from the request body

  // Input validation (optional, but recommended)
  if (!clientID || !service || !date || !address || !size) {
      return res.status(400).send('All fields are required.');
  }

  // SQL query to check if the service exists for the specific client
  const checkQuery = `
      SELECT * FROM activeServices
      WHERE clientID = ? AND service = ? AND date = ? AND address = ? AND size = ?
  `;

  // Check if the service exists for the given client
  db.query(checkQuery, [clientID, service, date, address, size], (err, result) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Error checking service existence.');
      }

      // If no service matches, return a message saying the service is not found
      if (result.length === 0) {
          return res.status(404).send('No matching service found to cancel.');
      }

      // If the service exists, proceed to delete it
      const deleteQuery = `
          DELETE FROM activeServices
          WHERE clientID = ? AND service = ? AND date = ? AND address = ? AND size = ?
      `;

      // Delete the service from the database
      db.query(deleteQuery, [clientID, service, date, address, size], (err, result) => {
          if (err) {
              console.error(err);
              return res.status(500).send('Error canceling the service.');
          }

          // Check if any row was affected
          if (result.affectedRows > 0) {
              res.send('Service canceled successfully!');
          } else {
              res.status(404).send('No matching service found to cancel.');
          }
      });
  });
});




app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});