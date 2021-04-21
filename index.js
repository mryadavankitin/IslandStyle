const express = require('express')
const mysql = require('mysql')

//pass: Ga@5xIfjxWVFbmVT
//create connection
// const db = mysql.createConnection({
//     host: process.env.host,
//     user: process.env.user,
//     password: process.env.password,
//     database : process.env.database,
//     port:process.env.port

// })

const db = mysql.createConnection({
    host: "localhost",
    user: "styleisland",
    password: "Ga@5xIfjxWVFbmVT",
    database : "styleisland",
    port:"3306"

})

//connect to mySQL

db.connect(err =>{

    console.log("db host", process.env.host)
    console.log("db password", process.env.password)

    if(err){
        
        throw err

    }
console.log("my sql connected")
})

const app = express()

app.get("/getskudetails",(req,res) => {

    
    var skuString = "'" +  req.query.skuID + "'";
    var dbQyery = "Select sspd.name productName,sspa.name sizes, ssp.id, ssp.price,ssp.sku from sc_shop_product ssp, sc_shop_product_description sspd,sc_shop_product_attribute sspa where ssp.id = sspd.product_id AND ssp.id= sspa.product_id AND sspd.product_id=sspa.product_id AND ssp.sku=" + skuString
    console.log("hello DB query is",dbQyery);
    db.query(dbQyery, (err, rows) => {
        if(err) throw err;
        console.log('The data from users table are: \n', rows);
        // db.end();
        if(rows.length >0){
            var sizeAttr=[]
            for(var i=0; i < rows.length ; i++){

               sizeAttr.push(rows[i].sizes)
            }

            var ResponeDict= rows[0];
            console.log("sixe att above", ResponeDict)

            ResponeDict.sizes= sizeAttr;
            console.log("sixe att", ResponeDict)
            return res.status(200).send(ResponeDict)

        }
        else{
            return res.status(404).send("no data found")
        }

    
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
    console.log("hello query",dbQyery);

    db.query(dbQyery, (err, rows) => {
        if(err) throw err;
        console.log('The data from users table are: \n', rows);
        // db.end();
        if(rows.length >0){
            return res.status(200).send(rows)

        }
        else{
            return res.status(404).send("no data found")
        }

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

// app.set("port", process.env.SYSTEM_PORT || 8080);

// http.createServer(app).listen(app.get('port'), function() {
//     console.log('Server is running at port' + process.env.SYSTEM_PORT);

// });



// app.listen(process.env.SYSTEM_PORT, () => {
// });