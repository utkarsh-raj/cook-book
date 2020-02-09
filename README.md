# cook-book
The simple solution for the best and most delicious recepies

Please visit https://afternoon-eyrie-98835.herokuapp.com for the live version

The features incorporated are:
- Multi user authentication system
  - Users can login and signup
  - Users will be redirected to the login page if the password is wrong
  - The app can simultaneously handle multiple operations
- Searching
  - We can search for the recepies
  - Name of the recepie or the ingredient used can be the criterion for searching
  - Shows the list of all matching recepies according to the search term
- Details page
  - Once the user clicks on Learn More about the recepie, she is directed to a page where she can see the name, image, description, steps and the ingredients utilised to prepare the dish 
  - The user can get the option to edit the recepies she has authored from this page
- Create, Read and Update
  - Once the user signs up and logs in, she can add her own recepies, edit the recepies and update the recepies as well

The technologies utilised are:
- Node.js - for the backend
- Express.js - as the backend framework
- EJS - as the templating engine
- Bootstrap 3 - as the frontend library
- MongoDB - the database engine
- MongoDB Atlas - the cloud database service
- Heroku - for online cloud deployment (https://afternoon-eyrie-98835.herokuapp.com)
- Git and Github - for Version Control

(Also, for building the application locally, you will require MongoDB Access credentials, which can be obtained for free for a Development Based Plan from https://www.mongodb.com/cloud/atlas: for the demo of the running application please refer the stated link)

If you want to build the application locally:
1. Make sure you have node.js installed, to test it run node -v or npm -v on your cmd/terminal. 
2. If node is not installed then, download the installer from https://nodejs.org/en/download/ 
3. Then run the following commands from your cmd/terminal. 
	- ```git clone https://github.com/utkarsh-raj/cook-book.git``` 
	- ```cd cook-book``` 
	- ```npm install``` - To install all the dependencies. 
	- ```node app.js``` - to launch the application.
4. Open localhost:8090 in your browser to view the app running.

Assumptions:
  - All the recepies have no more or no less than 4 ingredients. This can be made dynamic but has been restricted for the purposes of demonstration 
  - The application can only handle a limited amount of traffic right now, as much as is possible by the free plan of Heroku Server
