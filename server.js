var express = require("express");
var app = express();

app.get('/', (req, res, next)=> {
    res.send('Hello Lovely World')
})

// Routes
const dataRouter = require('./routes/data')
app.use('/data', dataRouter)

app.listen(4000, () => {
 console.log("Server running on port 4000: http://localhost:4000/");
});