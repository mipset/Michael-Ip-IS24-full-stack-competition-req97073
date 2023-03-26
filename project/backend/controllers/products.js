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
