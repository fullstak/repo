var express = require("express");
var routes = require("../routes/routes");
var middleware = require("../middleware/middleware");
var app = express();


var port = process.env.PORT || 3000


middleware(app);
routes(app);



app.listen(port, function () {
  console.log('Example app listening on port '+port);
});
