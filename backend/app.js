const path = require("path");	// pathing shipped with nodeJS. construct path thats safe to run on any OS
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const swaggerUi = require('swagger-ui-express');
const openApiDocumentation = require('./openapi_3.json');
const productRoutes = require("./routes/products");


// basic expressJS setup to set backend server parameters
app.set('trust proxy', true)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// error handler for bad JSON. Above bodyParser will reject invalid JSON's
app.use((err,req,res,next)=>{
  if (err){
    res.status(400).json("Bad JSON");
  }else{
    next();
  }
})

//For single program application. Angular folder is built into backend. Can operate as single or two program application
app.use("/", express.static(path.join(__dirname, "angular")));	// single program application, load angular folder index

// below headers only needed for two program application. Not needed if running as single program but left in just incase
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');	// sets what headers the domain can request
  res.setHeader('Access-Control-Allow-Methods', "GET, POST, PATCH, PUT, DELETE, OPTIONS");	//Allows which http requests may be sent
  next();
})

app.use("/api/products", productRoutes); //Basic route for /api/products to the express file
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocumentation)); //Route for swagger
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "angular", "index.html"));	// if no route is found, send index.html (redirect to homepage)
});





module.exports = app;
