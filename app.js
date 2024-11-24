const express = require('express');
const multer = require('multer');
const session = require('express-session');
const mysql = require('mysql');
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from 'public' directory
app.use(express.static(__dirname));

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // For JSON data
app.use(session({
    secret: 'secret',
    //resave: false,
    //saveUninitialized: true,
    /*cookie: {
        maxAge: 60000
    }*/
}));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "",
    database: 'soen287',
    //port: 3308
});

db.connect((err) => {
    if (err) {
        console.log("Error connecting to database.");
    }
    else {
        console.log("Connected to database.");
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

//For removal
app.get("/setSession", (req, res) => {
    req.session.businessID = "1";
    res.send("Session set with ID: " + req.session.businessID);
});

// Routes to go to menu sections
app.get('/businessprofile', (req, res) => {
    const id = req.session.businessID;
    const query = 'SELECT * FROM businessinfo WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching:', err);
            res.status(500).send('Error fetching data.');
        }
        else {
            res.render('businessprofile', {businessinfo: results}); // Pass data to EJS
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})