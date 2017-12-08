var mysql = require("mysql");
var inquirer = require("inquirer");

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

    inquirer
        .prompt({


            name: 'menu',
            type: 'list',
            message: "What would you like to do?",
            choices: [
                'View Products for sale',
                'View low inventory',
                'Add inventory',
                'Add new product'
            ]



        }).then(function(answer) {

            if (answer.menu == "View Products for sale") {

                displayProducts();
                connection.end();

            }

            else if (answer.menu == "View low inventory") {

                lowInventory();
                connection.end();
            }

            else if (answer.menu == "Add inventory") {

                addInventory();

            }

            else if (answer.menu == "Add new product") {

                addProduct();



            }


        })

}

function displayProducts() {

    connection.query("SELECT * FROM products", function(err, results) {

        if (err) throw err;

        for (var i = 0; i < results.length; i++) {

            console.log("[id " + results[i].item_id + ']: ' + results[i].product_name + " $" + results[i].price + ' (Quantity: ' + results[i].quantity + ')');


        }


    })


}

function lowInventory() {

    connection.query('SELECT * FROM products WHERE quantity <= 5', function(err, results) {

        if (err) throw err;

        for (var i = 0; i < results.length; i++) {

            console.log("There is only " + results[i].quantity + ' ' + results[i].product_name + "'s left in inventory")
        }

    })
}

function addInventory() {

    displayProducts() + '\n';

    inquirer
        .prompt([

            {
                name: "choice",
                type: "input",
                message: "Select the id number of the product you would like to update in inventory!",
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
                message: 'How many units would you like to add to the inventory?',
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;

                }
            }
        ])
        .then(function(answer) {

            connection.query(
                "UPDATE bamazon_db.products SET ? WHERE ?", [
                    { quantity: parseInt(answer.quantity) },
                    {
                        item_id: parseInt(answer.choice)
                    }

                ],
                function(error) {

                    if (error) throw error;

                    console.log("Inventory has been updated!")
                    connection.end();
                }

            )

        })

}


function addProduct() {

    inquirer
        .prompt([

            {
                name: "managerProduct",
                type: "input",
                message: "What product would you like to add to Bamazon?",
            },

            {
                name: 'managerDept',
                type: 'input',
                message: 'In what department does this product belong?',
            },
            {
                name: 'managerPrice',
                type: 'input',
                message: 'What is the price per unit of this product?',
            },
            {
                name: 'managerQuantity',
                type: 'input',
                message: 'How many units of this product do want in inventory?',
            }
        ])
        .then(function(answer) {

            var query = "INSERT INTO bamazon_db.products (product_name, department_name, price, quantity) VALUES (?,?,?,?)";

            connection.query(query, [answer.managerProduct, answer.managerDept, parseInt(answer.managerPrice), parseInt(answer.managerQuantity)], function(err, result) {

                if (err) throw err;

                console.log("You're product was successfully added!")
                connection.end();

            })

        })

}
