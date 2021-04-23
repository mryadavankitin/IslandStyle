const express = require('express')
const mysql = require('mysql')

//pass: Ga@5xIfjxWVFbmVT
//create connection
const db = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database : process.env.database,
    port:process.env.port

})

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



function handleDisconnect() {
    connection = mysql.createConnection(db); // Recreate the connection, since
                                                    // the old one cannot be reused.
  
    connection.connect(function(err) {              // The server is either down
      if(err) {                                     // or restarting (takes a while sometimes).
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
      }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
      console.log('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
        handleDisconnect();                         // lost due to either server restart, or a
      } else {                                      // connnection idle timeout (the wait_timeout
        throw err;                                  // server variable configures this)
      }
    });
  }




//connect to mySQL

db.connect(err =>{

    console.log("db host", process.env.host)
    console.log("db password", process.env.password)

    if(err){
        handleDisconnect();

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