# Sample Javascript React Redux

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Run the project

In the project directory, install dependencies and start project by running

- `npm install`

- `npm start`

App would start in development mode.

Open [http://localhost:3000/?roomId=global-channel&userId=ht&locale=en](http://localhost:3000/?roomId=global-channel&userId=test&locale=en) to view it in the browser.

# Project Structure

The project has minimal structure as following
```
.
└── src
    ├── index.js                 
    ├── App.js                   
    ├── App.css                  
    ├── components
    │   ├── Input.js            
    │   └── Messages             
    └── redux
        ├── actions.js           
        ├── actionsCreators.js
        ├── reducers 
        |   └── index.js            
        │   └── uiReducer.js         
        └── store.js
```

Starting with `src/index.js` the code is simple to navigate. Important files that contains major logic chunk are following

#### `redux/actions.js`:  
Contains all actions that would be dispatched.

#### `redux/actionCreators`:
Contains logic to handle all chat life cycle as shown in [Example](https://docs.fizz.io/javascript/). Uses `APP_ID` and `APP_SECRET` for demo app and exposes following two dispatch  methods for components
##### `fizzConnect` 
Connect with fizz server and handles all socket events, and dispatch respective state update actions.
##### `sendMessage`
Publish a message and update respective states.

##### Rest of methods
The remaining actionCreators `connected`, `disconnected` , `messagesFetched`, `messagePublished`, `messageUpdated`, `messageDeleted`, `sendingMessage`, `sendingMessageFailure` are called from respective socket event handlers (registered when called `fizzConnect`)

#### `uiReducer.js`
Updating state with respect to old for all corresponding actions in `redux/actions.js`


# Deployment
`npm run build`

When all done. Simply run this command and see the content of the `build` folder.<br />


Your app is ready to be deployed! See the [standard react help guides for deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.





