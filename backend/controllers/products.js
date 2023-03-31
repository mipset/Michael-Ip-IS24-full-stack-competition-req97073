const fs = require('fs');

// All functions to handle product requests are held here

exports.getProductList = async (req, res, next) => {
  try {
    let productList = JSON.parse(fs.readFileSync('./backend/sampleData.json').toString())
    if (!productList) {
      throw 404;
    }
    res.status(200).json({ message: "Product List successfully retrieved", productList: productList });
  }
  catch (e) {
    console.log(e);
    if (e == 404) {
      res.status(404).json("Could not find product list");
      return;
    }
    res.status(500).json('Failed to get Product List');
  }
}

exports.getOneProduct = async (req, res, next) => {
  try {
    if (!req.params.productId || isNaN(req.params.productId)) {
      throw 400;
    }
    let productList = JSON.parse(fs.readFileSync('./backend/sampleData.json').toString())
    let oneProduct = productList[productList.findIndex(product => product.productId == req.params.productId)]
    if (!oneProduct) {
      res.status(404).json("Could not find product with productId: " + req.params.productId);
      return;
    }
    res.status(200).json({ message: "One Product successfully retrieved", product: oneProduct });
  }
  catch (e) {
    console.log(e);
    if (e == 400) {
      res.status(400).json("Invalid ProductID");
      return;
    }
    res.status(500).json('Failed to get Product List');
  }
}


exports.addProduct = async (req, res, next) => {
  try {
    if (!req.params.productId || isNaN(req.params.productId)) {
      throw 400;
    }
    if (req.params.productId != req.body.productId){
      throw 422;
    }
    let productList = JSON.parse(fs.readFileSync('./backend/sampleData.json').toString());
    if (productList[productList.findIndex(product => product.productId == req.params.productId)]) {
      throw 409;
    }
    productList.push(req.body);
    fs.writeFile('./backend/sampleData.json', JSON.stringify(productList), err => {
      if (err) {
        console.error(err);
      }
    })
    res.status(200).json("Successfully saved new product")
  } catch (e) {
    console.log(e);
    if (e == 400) {
      res.status(400).json("Invalid ProductID");
      return;
    }
    if (e == 409) {
      res.status(409).json("ProductID already exists");
      return;
    }
    if (e == 422){
      res.status(422).json("Unprocessable content, Body/Param Mismatch");
      return;
    }
    res.status(500).json({ message: "Something went wrong with saving new product", error: e });
  }

}

exports.editProduct = async (req, res, next) => {
  try {
    if (!req.params.productId || isNaN(req.params.productId)) {
      throw 400;
    }
    if (req.params.productId != req.body.productId){
      throw 422;
    }
    const editProduct = req.body;
    let productList = JSON.parse(fs.readFileSync('./backend/sampleData.json').toString());
    if (!productList[productList.findIndex(product => product.productId == req.params.productId)]) {
      throw 404;
    }
    productList[productList.findIndex(product => product.productId == req.params.productId)] = editProduct;
    fs.writeFile('./backend/sampleData.json', JSON.stringify(productList), err => {
      if (err) {
        console.error(err);
      }
    })
    res.status(200).json("Successfully edited productId: " + req.params.productId)
  } catch (e) {
    console.log(e);
    if (e == 400) {
      res.status(400).json("Invalid ProductID");
      return;
    }
    if (e == 404) {
      res.status(404).json("Could not find product with productId: " + req.params.productId);
      return;
    }
    if (e == 422){
      res.status(422).json("Unprocessable content, Body/Param Mismatch");
      return;
    }
    res.status(500).json({ message: "Something went wrong with saving edit of productId: " + req.params.productId, error: e });
  }
}

exports.deleteProduct = async (req, res, next) => {
  try {
    if (!req.params.productId || isNaN(req.params.productId)) {
      throw 400;
    }
    let productList = JSON.parse(fs.readFileSync('./backend/sampleData.json').toString());
    if (!productList[productList.findIndex(product => product.productId == req.params.productId)]) {
      throw 404;
    }
    productList.splice((productList.findIndex(product => product.productId == req.params.productId)), 1);
    fs.writeFile('./backend/sampleData.json', JSON.stringify(productList), err => {
      if (err) {
        console.error(err);
      }
    })
    res.status(200).json("Successfully deleted productId: " + req.params.productId)
  } catch (e) {
    console.log(e);
    if (e == 400) {
      res.status(400).json("Invalid ProductID");
      return;
    }
    if (e == 404) {
      res.status(404).json("Could not find product with productId: " + req.params.productId);
      return;
    }
    res.status(500).json({ message: "Something went wrong with deleting productId: " + req.params.productId, error: e });
  }
}
