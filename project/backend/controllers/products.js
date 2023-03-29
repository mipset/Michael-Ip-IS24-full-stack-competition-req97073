const fs = require('fs');

exports.getProductList = async (req,res,next) =>{
  try{
    let productList = JSON.parse(fs.readFileSync('./backend/sampleData.json').toString())
    res.status(200).json({message: "Product List successfully retrieved", productList: productList});
  }
  catch(e){
    console.log(e);
    res.status(500).json('Failed to get Product List');
  }
}

exports.addProduct = async (req,res,next)=>{
  try{
    let productList = JSON.parse(fs.readFileSync('./backend/sampleData.json').toString());
    productList.push(req.body);
    fs.writeFile('./backend/sampleData.json', JSON.stringify(productList), err=>{
      if (err){
        console.error(err);
      }
    })
    res.status(200).json("Successfully saved new product")
  }catch(e){
    console.log(e);
    res.status(500).json({message: "Something went wrong with saving new product", error: e});
  }

}

exports.editProduct = async (req,res,next)=>{
  try{
    const editProduct = req.body;
    let productList = JSON.parse(fs.readFileSync('./backend/sampleData.json').toString());
    productList[productList.findIndex(product => product.productId == req.params.productId)] = editProduct;
    fs.writeFile('./backend/sampleData.json', JSON.stringify(productList), err=>{
      if (err){
        console.error(err);
      }
    })
    res.status(200).json("Successfully edited productId: " + req.params.productId)
  }catch(e){
    console.log(e);
    res.status(500).json({message: "Something went wrong with saving edit of productId: " + req.params.productId, error: e});

  }
}

exports.deleteProduct = async (req,res,next)=>{
  try{
    let productList = JSON.parse(fs.readFileSync('./backend/sampleData.json').toString());
    productList.splice((productList.findIndex(product => product.productId == req.params.productId)),1);
    fs.writeFile('./backend/sampleData.json', JSON.stringify(productList), err=>{
      if (err){
        console.error(err);
      }
    })
    res.status(200).json("Successfully deleted productId: " + req.params.productId)
  }catch(e){
    console.log(e);
    res.status(500).json({message: "Something went wrong with deleting productId: " + req.params.productId, error: e});

  }
}