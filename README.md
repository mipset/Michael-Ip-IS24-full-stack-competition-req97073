# Michael-Ip's submission for citz-imb-full-stack-code-challenge-req97073
## Thank you for the opportunity and I hope my solution meets your expectations. 
### For my solution, I used Angular and Angular Materials framework built in typescript for my front end. My backend is utilizing NodeJS and ExpressJS.


## Installations
### Base Setup
`npm install`

## Run Environment
### Front end has been built so that this works as a single program application. In your terminal run: 
```npm run start:server```
### Program can be accessed through: 
```http://localhost:3000/```
### Documentation can be accessed through:
```http://localhost:3000/api/api-docs```



## Solution
When reviewing the 5 provided User Stories, it made most sense for me to utilize Angular Materials which provides many functionalities that are not overly complicated to implement while covering all the required cases. All 3 user stories and 2 bonus stories have been covered and incorporated into my solution.
- User Story 1: All columns fit on the page, titles visible and total number of products provided.
- User Story 2: Adding a new product generates a new ID that will not collide with existing ID. All fields must be answered to saved. User will be alerted of which fields are missing (if any).
- User Story 3: Ability to edit individual product rows and a save button is provided. User will be alerted if changes are made and not saved.
- User Story 4: When filtering Scrum Master, table will dynamically update and total products will also update. Input field provides dynamically generate auto-complete.
- User Story 5: When filtering Developers, table will dynamically update and total products will also update. Input field provides dynamically generate auto-complete.

### Front End
Front end is utilizing Reactive Forms and Observables to observe state change through filtering, adding and editing of products. Data is loaded via from the backend automatically when the page is initialized. RESTful API calls are managed from a service componenent. Adding and Editing are optimisically updated as data changes are sent to the back. 

### Back End
Back end is using NodeJS and ExpressJS to route RESTful API calls. Data is saved to a local JSON file that will read and write with changes made (Adding and Editing) so that these changes persist through page refreshes and application reloads. Whenever put,post or delete requests are made, there will be appropriate response codes sent to the front.

### JSON Model
There is premade data proivded with 40 unique products utilizing the model as per the competition guide.
```
{
    "productId": "Value"
    "productName": "Value",
    "productOwnerName": "Value",
    "developers": [
      "Value",
      "Value"
    ],
    "scrumMasterName": "Value",
    "startDate": "YYYY/mm/DD",
    "methodology": "Value"
}
```

### Swagger API Documentation
Swagger documentation is available at the requested endpoint. Appropriate Error code and responses are given with different conditions.
`http://localhost:3000/api/api-docs`

### Additional Implementation
- Expansion panels for editing which allows for easy comparison of old and new entries before you save.
- Added Sanitation check using Regex to text inputs to ensure data being sent to the back is clean (text only, no dropping tables here).
- Robust Error handling to ensure server response to bad requests properly without crashing.
- Pagination of table with multiple table sizes.
- I worked hard to ensure best coding practices as well as anticipating common pitfalls in data handling.

### Thank you again for your consideration
