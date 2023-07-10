var express = require("express");
var app = express();

app.get('/', (rq, res, next)=> {
    res.send('Hello World')
})

app.put('/user', (req, res) => {
    res.send('Got a PUT request at /user')
  })

app.listen(4000, () => {
 console.log("Server running on port 4000: http://localhost:4000/");
});