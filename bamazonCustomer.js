var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon_db"
});

connection.connect(function(err, result) {

    if (err) throw err;

    start();

});


function start() {

    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;

        for (var i = 0; i < results.length; i++) {

            console.log("[id " + results[i].item_id + ']: ' + results[i].product_name + " $" + results[i].price);

        }
        inquirer
            .prompt([

                {
                    name: "choice",
                    type: "input",
                    message: "Select the id number of the product you would like to purchase!",
                    validate: function(value) {
                        if (isNaN(value) === false) {

                            return true;
                        }
                        return false;
                    }
                },

                {
                    name: 'quantity',
                    type: 'input',
                    message: 'Quantity: ',
                    validate: function(value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;

                    }
                }
            ])
            .then(function(answer) {

                var query = "SELECT item_id, product_name, price, quantity FROM products WHERE ?";
                connection.query(query, { item_id: answer.choice }, function(err, res) {

                    if (err) throw err;

                    var available_stock = res[0].quantity;
                    var price_per_unit = res[0].price;

                    if (available_stock >= answer.quantity) {

                        purchase(price_per_unit, available_stock, answer.choice, answer.quantity);
                        connection.end();
                    }
                    else {

                        console.log("Not enough inventory!");
                        connection.end();

                    }




                });
            })




    })
}




function purchase(price, available_stock, selectedItem, selectedQuantity) {

    var updatedQuantity = available_stock - selectedQuantity;
    var totalPrice = price * selectedQuantity;

    var query = "UPDATE products SET ? WHERE ?";

    connection.query(query, [{ quantity: updatedQuantity }, { item_id: selectedItem }], function(err, res) {

            if (err) throw err;

            console.log("Your order has gone through!\n")

            console.log("Your total for this purchase is: $" + totalPrice);


        }


    )
};




//                 var usersItem;

//                 for (var i = 0; i < results.length; i++) {
//                     if (results[i].item_id == answer.choice) {

//                         usersItem = results[i];
//                     }
//                 }

//                   if (results[i].quantity < parseInt(answer.quantity)) {

//                     console.log("Insufficient quanity! sorry, check back again soon!")

//                 }

//             })

//                 console.log("\nYou've selected: \n")
//                 console.log(usersItem.item_id + ': ' + usersItem.product_name);

//     })
//     };
// }
