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
        "View All Employees",
        "View All Employees By Department", 
        "View All Employees By Manager",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "View All Roles",
        "EXIT"]
      }).then(function(answer){
        switch(answer.homeScreen){
            case "View All Employees":
                allEmployees();
                break;
            case "View All Employies By Department":
                viewAllByDepartment();
                break;
            case "View All Employees By Manager":
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Remove Employee":
                removeEmployee();
                break;
            case "Update Employee Role":
                break;
            case "View All Roles":
                break;
            default:
                connection.end();
        }
      });
};
// SELECT "list-of-columns"
// FROM table1,table2
function allEmployees(){
    var query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, employee.manager_id ";
    //JOIN employee.name ON employee.manager_id = employee.id
    query+= "FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ";
    connection.query(query, function(err, res) {
    if (err) throw err;
    //console.log(res);
    console.table(res);
    start();
    });
}

// function viewAllByDepartment(){
//     connection.query("SELECT * FROM department", function(err, res) {
//         if (err) throw err;
//         console.table(res);
//         connection.end();
//       });
// };
function addEmployee(){
    const nameOfEmployees = [];
    const role = [];
    connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err;
        for(var i = 0; i<res.length; i++){
            role.push(res[i].title);
        }
      });
      connection.query("SELECT * FROM employee", function(err, res) {
        if (err) throw err;
        for(var i = 0; i<res.length; i++){
            nameOfEmployees.push(res[i].first_name);
        }
      });
    inquirer.prompt([
    {
        type: "input",
        name: "newFirstName",
        message: "What is the employees first name?"
    },
    {
        type: "input",
        name: "newLastName",
        message: "What is the employees last name?"
    },
    {
        type: "list",
        name: "newRole",
        message: "What is the employees role?",
        choices: role
    },
    {
        type: "list",
        name: "employeesManager",
        message: "What is the employees manager?",
        choices: nameOfEmployees
    }
    ]).then(function(answers) {
        const employeeId = [];
        const roleId = [];
        console.log(answers);
        //console.log(answers.newRole);
        connection.query('SELECT * FROM employee WHERE first_name = ?',[answers.employeesManager],
        function(err, res) {
            // console.log(res[0].id);
            employeeId.push(res[0].id);
            connection.query('SELECT * FROM role WHERE title = ?',[answers.newRole],
            function(err, res) {
                // console.log(res[0].id);
                roleId.push(res[0].id);
                // console.log("------");
                // console.log(roleId[0]);
                // console.log(employeeId[0]);
                connection.query(
                    "INSERT INTO employee SET ?",
                    {
                      first_name: answers.newFirstName,
                      last_name: answers.newLastName,
                      role_id: roleId[0],
                      manager_id: employeeId[0]
                    },
                    function(err, res) {
                      console.log(" employee added!\n");
                      start();
                    }
                );   
            });
        });
    });
};

function removeEmployee(){
    var employeeNames = [];
    connection.query("SELECT * FROM employee", function(err, res) {
        if (err) throw err;
        for(var i = 0; i<res.length; i++){
            employeeNames.push(res[i].first_name);
        }
        inquirer.prompt([
        {
            type: "list",
            name: "delete",
            message: "what employee do you want to delete?",
            choices: employeeNames
        }
        ]).then(function(answers) {
            //need to figure out how to pass id
            console.log(answers.delete);
            connection.query(
                "DELETE FROM employee WHERE ?",
                {
                  first_name: answers.delete
                },
                function(err, res) {
                    console.log("employee removed!\n");
                    start();
                }
            );
        });
    });
};