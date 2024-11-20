const express = require("express");
const mysql = require("mysql");

const app = express();

app.use(express.urlencoded({ extended: false}));
app.use(express.static(__dirname));

const PORT =3000;

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
      console.log("Connected");
    }
});

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


app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});