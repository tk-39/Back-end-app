//Module needed for hashing the password
const bcrypt = require('bcrypt');
//Module needed for the validator
const { check, validationResult } = require('express-validator');
const request = require('request');

module.exports = function(app, shopData) {
    
    const redirectLogin = (req, res, next) => {
        if (!req.session.userId ) {
        res.redirect('./login')
        } else { next (); }
    } 
    
    // Handle our routes
    app.get('/',function(req,res){ //home Page
        res.render('index.ejs', shopData)
    });
    app.get('/about', function(req,res){ //about Page
        res.render('about.ejs', shopData);
    });
    app.get('/search', function(req,res){ //search Page
        res.render("search.ejs", shopData);
    }); 

    app.get('/addrecipe', redirectLogin,  function (req, res) { //addRecipe Page
        res.render('addrecipe.ejs', shopData);
     });
 
     app.get('/update', redirectLogin,  function (req, res) { //update Page
        res.render('update.ejs', shopData);
     });
    app.get('/delete', redirectLogin, function(req,res) {    //Delete Page
        res.render("delete.ejs", shopData);
    })

    app.get('/login', function (req,res) {   // Login Page
        res.render('login.ejs', shopData);                                                                     
    });   

    app.get('/register', function (req,res) { //Register Page
        res.render('register.ejs', shopData);                                                                     
    });    
     // API page for listing all recipes in a JSON format using an sqlquery to query the database
    app.get('/api-list', function (req,res) {
        // Query database to get all the books
        let sqlquery = "SELECT * FROM recipes";

        db.query(sqlquery, (err, result) => {
        
         if (err) {
            res.redirect('./');
    }

        res.json(result)

        });
    });
    
    
    

//Search page - Select * from recipes where recipe_name will return resutls depending on the keyword used "%"
    app.get('/search-result', function (req, res) {
      
        //searching in the database
        let sqlquery = "SELECT * FROM recipes WHERE recipe_name LIKE '%" + req.query.keyword + "%'"; // query database to get all recipes
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, shopData, {availableRecipes:result}); 
            console.log(newData)
            res.render("list.ejs", newData) 
         });      
    });
  

    //registered page, isEmail is a function used to validate the form input as an email address 
    //The isLength function will only allow users to register if their password is longer than 7 characters
    app.post('/registered', [check('email').isEmail()], 
                        [check('password').isLength({min: 8, max: 50})],
                        [check('first').notEmpty()],
                        [check('last').notEmpty()],
                        [check('username').notEmpty()], function (req,res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.redirect('./register'); }
    
        else {
    // saving data in database
    const saltRounds = 10;
    const plainPassword = req.body.password;
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        // Store hashed password in your database.
        if (err) {
            return console.error(err.message);
        }

        //storing in database
        let sqlquery = "INSERT INTO users(username, firstname, lastname, email, hashedPassword) VALUES (?,?,?,?,?)";

        //Sanitising each field using req.sanitize
        let newrecord = [req.sanitize(req.body.username),
                         req.sanitize(req.body.first),
                         req.sanitize(req.body.last),
                         req.sanitize(req.body.email), hashedPassword];

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return console.error(err.message);
            }
            else{
            let newData = Object.assign({}, shopData, {newUser:newrecord});
            res.render('registered.ejs',newData)
            }
        });
     })
    }
});

//logged in 
app.get('/login',function(req,res){
    // Saves user session, given log in is successful
    req.session.userId = req.sanitize(req.body.username); 
    res.render("loggedin.ejs", shopData);
});

//Logic for log in page, Username field cannot be empty + password must be a minimum of 8 like the register page
app.post('/log', [check('username').notEmpty()],
                 [check('password').isLength({min: 8, max: 50})], function(req,res){

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.redirect('./login'); }

        else {

    const plainPassword = req.sanitize(req.body.password);
    req.session.userId = req.sanitize(req.body.username);
    let sqlQuery = "SELECT * FROM users WHERE username='"+req.sanitize(req.body.username)+"'";


    db.query(sqlQuery, function (err, result) {
        console.log('result', result[0]);
        if(err) {
            return console.log(err.message);
        }
        if(result[0]==undefined){
            res.render('wrngusr.ejs',shopData);
        }
        else {
            console.log('result' ,result[0])
            let hashedPassword = result[0].hashedPassword;

            bcrypt.compare(plainPassword, hashedPassword, (err, result) => {
                if (err) {
                    return console.error(err.message);
                } else if (result===true) {
                    res.render('loggedin.ejs', shopData);

                } else {
                    res.render('wrngusr.ejs',shopData);
                }
            });
        }
    });
}
});

    //Logic for listing all recipes in the 'recipes' table
    
    app.get('/list', function(req, res) {
        let sqlquery = "SELECT *   FROM recipes"; // query database to get all recipes, SELECT * will select everything in the recipes table
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, shopData, {availableRecipes:result});
            console.log(newData)
            res.render("list.ejs", newData)
         });
    });

    // Logic for listing all users

    app.get('/listusers', redirectLogin, function(req, res) {
        let sqlquery = "SELECT * FROM users"; // query database to get all users

        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, shopData, {availableUsers:result});
            console.log(newData)
            res.render("listusers.ejs", newData)
         });
    });

    //Logic for adding recipes to the database, uses validation for user input and sanitization
     app.post('/recipeadded', function (req,res) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect('./'); }
        
            else {
           // saving data in database
           let sqlquery = "INSERT INTO recipes (recipe_name, values_per, unit, carbs, fat, protein, salt, sugar) VALUES (?,?,?,?,?,?,?,?)";
           // execute sql query
           let newrecord = [req.sanitize(req.body.recipe), req.sanitize(req.body.values),
                            req.sanitize(req.body.unit), req.sanitize(req.body.carbs), req.sanitize(req.body.fat),
                            req.sanitize(req.body.protein), req.sanitize(req.body.salt), req.sanitize(req.body.sugar)];
           db.query(sqlquery, newrecord, (err, result) => {
             if (err) {
               return console.error(err.message);
             }
             else
             res.send(' This recipe is added to database, name: '+ req.body.recipe + ' Values: '+ req.body.values +
             ' Unit: ' + req.body.unit +  ' Carbs: ' + req.body.carbs + ' Fat: ' + req.body.fat + ' Protein: ' + req.body.protein + 
             ' Salt: ' + req.body.salt + ' Sugar: ' + req.body.sugar);
             });
            }
       });    

       // Users will be redirected to update_recipe.ejs after submitting a keyword, refreshes page if recipe isn't found
       app.get('/updatedrecipe', function (req, res) {
        //searching in the database
        let sqlquery = "SELECT * FROM recipes WHERE recipe_name LIKE '%" + req.query.keyword + "%'"; // query database to get all recipes
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./'); 
            }
            let newData = Object.assign({}, shopData, {availableRecipes:result}); 
            console.log(newData)
            res.render("update_recipe.ejs", newData) 
         });        

    });

    // After entering values for relevant fields, database will be updated and display a message to the user of the new values
    app.post('/recipeUpdated', function (req, res) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect('./'); }
        
            else {
        let sqlquery = "UPDATE recipes SET recipe_name = ?, values_per = ?, unit = ?, carbs = ?, fat = ?, protein = ?, salt = ?, sugar = ? WHERE recipe_name = ?";
        // execute sql query
        let newrecord = [req.sanitize(req.body.recipe), req.sanitize(req.body.values),
                         req.sanitize(req.body.unit), req.sanitize(req.body.carbs), req.sanitize(req.body.fat),
                         req.sanitize(req.body.protein), req.sanitize(req.body.salt), req.sanitize(req.body.sugar),
                         req.sanitize(req.body.recipe)];
        
        if(req.body.submit = "update") {
            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                  return console.error(err.message);
                }
                else
                res.send(' This recipe has been updated, Recipe Name: '+ req.body.recipe + ' Values: '+ req.body.values +
                ' Unit: ' + req.body.unit +  ' Carbs: ' + req.body.carbs + ' Fat: ' + req.body.fat + ' Protein: ' + req.body.protein + 
                ' Salt: ' + req.body.salt + ' Sugar: ' + req.body.sugar);
                });
        }
    }
    });

        //Logic for deleting a recipe from the database
    // app.post('/deleteRecipe', function (req, res) {
    //     if(req.body.sumit = "Delete") {
    //     //searching in the database
    //     let sqlquery = "DELETE FROM recipes where recipe_name LIKE = ?" //Deletes the recipe depending on the name the user has given
    //     // execute sql query
    //     db.query(sqlquery, (err, result) => {
    //         if (err) {
    //             res.send("No relevant recipe was found"); 
    //         }
    //         let newData = Object.assign({}, shopData, {availableRecipes:result}); 
    //         console.log(newData)
    //         res.send("Recipe has been deleted") 
    //      });        
    //     }
    // });

    //Crashes website, couldn't find a fix ---------------------------------------------------------------

    
    //logout page, will allow the user to logout if they are logged in. 
    //Will send user to login page if they are not logged in
    app.get('/logout', redirectLogin, (req,res) => {
        req.session.destroy(err => {
        if (err) {
        return res.redirect('./')
        }
        // Render different page for logging out, more consistent with rest of the website's interface 
        res.render("logout.ejs", shopData)
        })
        })

}