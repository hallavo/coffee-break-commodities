# coffee-break-commodities

This is a simple app for keeping track of the use of various foods, drinks and household items stored in the office kitchen of an imaginary IT company. 


## Install

Build and deploy the service by running this command in the project root directory:

```
docker-compose up
```


## Usage
Log in at: http://localhost:3000/.


## API

##### /api/events
* POST
    * Create new event (for example a 'take' event). Responds with the id of the created event.
    * No parameters
    * Example request data content: `{"username": "senior-office-gnome", "eventtype":"take", "eventtime":"2022-05-01T16:00", "amount": 1, "product": "Energiapatukka"}`
    * Example response: `201 Created {eventid: 5}`

##### /api/usage/:from/:to
* GET
    * Get a list of the product names and amounts that have been taken in a given time range
    * Parameters:
        * `from` beginning of the time range in ISO 8601 format: yyyy-MM-ddTHH:mm:ssZ
        * `to` end of the time range in ISO 8601 format: yyyy-MM-ddTHH:mm:ssZ
    * Example URL: http://localhost:3000/api/usage/2022-05-01T12:00/2023-05-02T23:30
    * Example response: `200 OK [{"product":"Hedelmä","sum":"6"},{"product":"Kolmioleipä","sum":"4"}]`
##### /api/users
* GET
    * Get a list of all users and their information
    * No parameters
    * Example response: `200 OK [{"userid":1,"username":"senior-office-gnome","email":"gnome@itcompany.com","name":"Senior Office Gnome","phone":"1234567890"},{"userid":2,"username":"junior-office-gnome","email":"jrgnome@itcompany.com","name":"Junior Office Gnome","phone":"0987654321"}]`
* POST
    * Create new user. Responds with the id of the created user.
    * No parameters
    * Example request data content: `{"username": "newuser", "email": "newuser@email.com", "name": "New User", "phone": "123"}`
    * Example response: `201 Created {"userid":1}`
##### /api/users/:userId
* GET
    * Get the information of a single user
    * Parameters:
        * `userId` user identifier, an integer
    * Example response: `200 OK {"userid":1,"username":"senior-office-gnome","email":"gnome@itcompany.com","name":"Senior Office Gnome","phone":"1234567890"}`
* PUT
    * Update the information of a single user
    * Parameters:
        * `userId` user identifier, an integer
    * Example response: `200 OK` 
##### /api/product-stats
* GET
    * Get a list of the users who have taken products along with the respective amounts
    * No parameters
    * Example response: `200 OK [{"username":"junior-office-gnome","product":"Hedelmä","sum":"5"},{"username":"senior-office-gnome","product":"Kolmioleipä","sum":"4"},{"username":"senior-office-gnome","product":"Hedelmä","sum":"1"}]`


## License

coffee-break-commodities is [MIT Licensed](http://opensource.org/licenses/MIT).

