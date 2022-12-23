# mini-project

Mini project - "Tyler's Recipe buddy"

R1 Home page 
 
R1A "index.js" is the home page and displays links to other pages on the site, displays name at the top

R1B: Users can navigate back to the home page at the top of the page after clicking on of the pages

R2 About page

R2A: about.ejs, A description of the web app including the developer name at the the bottom, displays link to home page

R3 Register page:

R3A: register.ejs, A form is displayed to users asking for first name, last name, email, username and password which is then collected and passed to the database. 
Password is stored as a hashed password (hashedPassword) and is only displayed to the user upon registration. 

Validation is used on each form for proper user handling, eg notEmpty(), isEmail(), isLength

R3B: A message is displayed if it was a success

R4  Login page

R4A: login.ejs, a form displaying the following items: username and password. Link is displayed to home page. 

R4B: if the user details are found in the database, users are redirected to "loggedin.ejs", a seperate page displaying "Congratulations! You are logged in." with a link to return to the home page. Users are logged in if and only if both the username and password is correct

R4C: If login is unsuccessful, users are redirected with a message saying whether their username or password is correct.

Validation used on username and password forms

R5 Logout page

logout.ejs, Users can easily logout with a message upon successful logout

R6 Add food page

R6A addrecipe.ejs, can only be accessed after logging in, displays a form to users with the values: name, typical values, unit, carbs, fat, protein, salt, sugar. Displays a link to home page

Users can input a value in each field to add to the database

R6B: Recipes are stored in the database

R6C: Displays a message once user has submitted with a list of all values inputted by the user

R7 serach food page

R7A: search.ejs, A form is displaiyed to users with only one field which is the name of the recipe. Displays a link to home page

R7B: Keyword is passed into database and returns results releveant to the keyword. If found, a table is returned of the relevant information. eg. searching "chic" will return chicken and its fields

R7C: Users do not have to search for the complete word, the web app will return results relevant to the keyword used (see R7B)

R8: Upate food page, only available to logged-in users

R8A: update.ejs, A search food form with only one field which is the name of the recipe. Displays a link to the home page.

R8B: If food is found, user is redirected to "updaterecipe.ejs" and data related to the food is returned in forms so that users can update each field. Once user has changed fields and selected "Update recipe", data is passed to the database and changed accordingly. 

R9 List food page

R9A: Displays a list of all recipes in the database and a link to the homepage. 

R8B: Recipes are displayed in a tabular format, using custom table styling on lines 44-47 in "main.css"

R10: API

Basic API displays all recipes and their respective fields in a JSON format. 

R11

Form validation has been used on most of the website, using methods like notEmpty(), isEmail(), isAlpha(), isLength, isFloat()


ER Diagram: 
![image](https://user-images.githubusercontent.com/98770602/209377538-ce2873f1-13f2-432d-80c1-4221bd457b53.png)
