const express = require('express')
const mysql = require('mysql')

//pass: Ga@5xIfjxWVFbmVT
//create connection

var db = mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database : process.env.database,
    port:process.env.port,
    connectionLimit : 10


});

// let pool = mysql.createPool(db);

// pool.on('connection', function (_conn) {
//     if (_conn) {
//         logger.info('Connected the database via threadId %d!!', _conn.threadId);
//         _conn.query('SET SESSION auto_increment_increment=1');
//     }
// });


// const db = mysql.createConnection({
//     host: "localhost",
//     user: "styleisland",
//     password: "Ga@5xIfjxWVFbmVT",
//     database : "styleisland",
//     port:"3306"

// })

// var db  = mysql.createPool({
//     connectionLimit : 10,
//     host: "localhost",
//     user: "styleisland",
//     password: "Ga@5xIfjxWVFbmVT",
//     database : "styleisland",
//     port:"3306"
//   });
  








const app = express()

app.get('/hello', function (req, res) {
    res.send('Hello Style Island');
 })

app.get("/getskudetails",(req,res) => {
    var skuString = "'" +  req.query.skuID + "'";
    var dbQyery = "Select sspd.name productName,sspa.name sizes, ssp.id, ssp.price,ssp.sku from sc_shop_product ssp, sc_shop_product_description sspd,sc_shop_product_attribute sspa where ssp.id = sspd.product_id AND ssp.id= sspa.product_id AND sspd.product_id=sspa.product_id AND ssp.sku=" + skuString
    console.log("hello DB query is",dbQyery);

    db.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id ' + connection.threadId);
        connection.query(dbQyery, (err, rows) => {
            connection.release(); // return the connection to pool
            if(err) throw err;

            if(rows.length >0){
                var sizeAttr=[]
                for(var i=0; i < rows.length ; i++){
    
                   sizeAttr.push(rows[i].sizes)
                }
    

                var ResponeDict= rows[0];
    
                ResponeDict.sizes= sizeAttr;
                return res.status(200).send(ResponeDict)
    
            }
            else{
                return res.status(404).send("no data found")
            }

        });
    });
});


//get categories

app.get("/getCategories",(req,res) => {
    var dbQyery = "Select * from sc_shop_category_description"
    console.log("hello DB query is",dbQyery);

    db.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id ' + connection.threadId);
        connection.query(dbQyery, (err, rows) => {
            connection.release(); // return the connection to pool
            if(err) throw err;

            if(rows.length >0){
              

              var arrayCollections = [
                {
                    "category_id": 122,
                    "lang": "en",
                    "title": "Schiffli Saga",
                    "keyword": null,
                    "description": null
                },                
            
                {
                    "category_id": 122,
                    "lang": "en",
                    "title": "Prints Magic",
                    "keyword": null,
                    "description": null
                },                
            
                {
                    "category_id": 122,
                    "lang": "en",
                    "title": "Black & White Story",
                    "keyword": null,
                    "description": null
                },                
            
                {
                    "category_id": 122,
                    "lang": "en",
                    "title": "Fabulous Florals",
                    "keyword": null,
                    "description": null
                },                
            
                {
                    "category_id": 122,
                    "lang": "en",
                    "title": "Glam Edit",
                    "keyword": null,
                    "description": null
                },                
            
                {
                    "category_id": 122,
                    "lang": "en",
                    "title": "Stripe Story",
                    "keyword": null,
                    "description": null
                },                
            
                {
                    "category_id": 122,
                    "lang": "en",
                    "title": "Be Boho",
                    "keyword": null,
                    "description": null
                },                
            
                {
                    "category_id": 122,
                    "lang": "en",
                    "title": "Romantic Feels",
                    "keyword": null,
                    "description": null
                },                
            
                {
                    "category_id": 122,
                    "lang": "en",
                    "title": "Ruffle & Frills",
                    "keyword": null,
                    "description": null
                },                
            
                {
                    "category_id": 122,
                    "lang": "en",
                    "title": "Hot Picks",
                    "keyword": null,
                    "description": null
                },                
            
                {
                    "category_id": 122,
                    "lang": "en",
                    "title": "Work in Style",
                    "keyword": null,
                    "description": null
                },                
            
                {
                    "category_id": 122,
                    "lang": "en",
                    "title": "Play Date",
                    "keyword": null,
                    "description": null
                }
              ];                
              
              var Responsedict = {
                "Categories":rows,
                "Collections":arrayCollections

              }; // create an empty array
              return res.status(200).send(Responsedict)
    
            }
            else{
                return res.status(404).send("no data found")
            }

        });
    });
});


//get Data for Product Listing

app.get("/getProductListing",(req,res) => {
    
        var skuString = "'" +  req.query.categoryID + "'";
        var dbQyery = "SELECT sc_shop_product_category.product_id, sc_shop_product_description.name,sc_shop_product.price, sc_shop_product.image from sc_shop_product_category JOIN sc_shop_product_description ON sc_shop_product_category.product_id = sc_shop_product_description.product_id JOIN sc_shop_product ON sc_shop_product_description.product_id = sc_shop_product.id where sc_shop_product_category.category_id=" + skuString;
        // var dbQyery = "SELECT" + "${ req.query.size }" + "from productinventory where sku= ";
        console.log("the quer s",dbQyery)
        
    db.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id ' + connection.threadId);
        connection.query(dbQyery, (err, rows) => {
            connection.release(); // return the connection to pool
            if(err) throw err;

            if(rows.length >0){
                return res.status(200).send(rows)
    
            }
            else{
                return res.status(404).send("no data found")
            }
    

        });
    });



});



//Fectch Inventory Details
app.get("/getinventory",(req,res) => {
    var arraySizes= ["XS_size","S_size"," M_size", "L_size","XL_size","XXL_size"]
    if(arraySizes.includes(req.query.size)){
        console.log("hello inventory", req.query);
        var skuString = "'" +  req.query.skuID + "'";
        var dbQyery = "SELECT " + req.query.size + " from productinventory where sku=" + skuString;
        // var dbQyery = "SELECT" + "${ req.query.size }" + "from productinventory where sku= ";

        
    db.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id ' + connection.threadId);
        connection.query(dbQyery, (err, rows) => {
            connection.release(); // return the connection to pool
            if(err) throw err;

            if(rows.length >0){
                return res.status(200).send(rows)
    
            }
            else{
                return res.status(404).send("no data found")
            }
    

        });
    });

}
else{
    return res.status(404).send("enter valid size")


}
});






const port = process.env.SYSTEM_PORT || 8080

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
