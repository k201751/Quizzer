const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Endpoint to add user credentials
app.post('/addUser', (req, res) => {
    const { username, password } = req.body;

    // Read the current credentials
    fs.readFile('credentials.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send("Error reading file.");
        }

        const credentials = JSON.parse(data);
        credentials.users.push({ username, password });

        // Write the updated credentials back to the file
        fs.writeFile('credentials.json', JSON.stringify(credentials, null, 2), (err) => {
            if (err) {
                return res.status(500).send("Error writing file.");
            }
            res.send("User added successfully!");
        });
    });
});

// Endpoint to verify user credentials
app.post('/signin', (req, res) => {
    const { username, password } = req.body;
    console.log('recieved!!')
    // Read the current credentials
    fs.readFile('credentials.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send("Error reading file.");
        }

        const credentials = JSON.parse(data);
        const user = credentials.users.find(u => u.username === username && u.password === password);

        if (user) {
            res.send("Sign-in successful!");
        } else {
            res.status(401).send("Invalid username or password.");
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
