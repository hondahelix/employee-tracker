//Content Managment Systems (CMS)
var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password7",
  database: "employee_trackerDB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    start();
});

// home screen how to fix scrowling issue in inquirer
function start(){
    inquirer.prompt({
        name: "homeScreen",
        type: "list",
        message: "What would you like to do?",
        choices: [
        "View All Employies By Department", 
        "View All Employees By Manager",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "View All Roles",
        "EXIT"]
      }).then(function(answer){
        switch(answer.homeScreen){
            case "View All Employies By Department":
                viewAllByDepartment();
                break;
            case "View All Employees By Manager":
                break;
            case "Add Employee":
                break;
            case "Remove Employee":
                break;
            case "Update Employee Role":
                break;
            case "Update Employee Manager":
                break;
            case "View All Roles":
                break;
            default:
                connection.end();
        }
      });
};

function viewAllByDepartment(){
    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;
        console.table(res);
        connection.end();
      });
};