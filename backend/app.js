const path = require("path");	// pathing shipped with nodeJS. construct path thats safe to run on any OS
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const swaggerUi = require('swagger-ui-express');
const openApiDocumentation = require('./openapi_3.json');

const productRoutes = require("./routes/products");

app.set('trust proxy', true)
app.use(bodyParser.urlencoded({ extended: true })); // supports only default features in the url encoding
app.use(bodyParser.json());
app.use((err,req,res,next)=>{
  if (err){
    res.status(400).json("Bad JSON");
  }else{
    next();
  }
})
app.use("/", express.static(path.join(__dirname, "angular")));	// single program application, load angular folder index

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');		// sets which domains are allowed to access our resources. here, app may sent request to all domains and they can access our resources
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');	// sets what headers the domain can request along with default headers. request may have these extra headers
  res.setHeader('Access-Control-Allow-Methods', "GET, POST, PATCH, PUT, DELETE, OPTIONS");	//Allows which http requests may be sent. OPTIONS checks if post request is valid.
  next();
})

app.use("/api/products", productRoutes);
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocumentation));
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "angular", "index.html"));	// if no route is found, send index.html
});





module.exports = app;
