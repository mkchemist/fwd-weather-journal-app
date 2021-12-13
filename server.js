const express = require('express')
const app = express();
const bodyParser = require("body-parser")
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())
app.use(express.static("website"));

// listening port
const port = 3000;
projectData = {};


app.post('/add', function(req, res) {
    projectData = req.body;
    res.send(JSON.stringify({
        code: 200,
        message: 'data posted'
    }))
})

app.get('/data', function(req, res) {
    res.send(JSON.stringify(projectData))
})


app.listen(port, listenCallback);

// function invokes when app start listening
function listenCallback() {
    console.log(`Server start on http://127.0.0.1:${port}`)
}
