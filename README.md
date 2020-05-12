This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000/?roomId=global-channel&userId=ht&locale=en](http://localhost:3000/?roomId=global-channel&userId=test&locale=en) to view it in the browser.

## Project Structure

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
Contains logic to handle all chat life cycle as shown in [Example](http://examplelink.com). Uses `APP_ID` and `APP_SECRET` for demo app and exposes following two dispatch  methods for components
##### `fizzConnect` 
This method connects with fizz server and handles all socket events, and dispatches respective state update actions according
##### `sendMessage`
Publish a message and update states.

##### Rest of methods
The remaining actionCreators `connected`, `disconnected` , `messagesFetched`, `messagePublished`, `messageUpdated`, `messageDeleted`, `sendingMessage`, `sendingMessageFailure` are called from respective socket event handlers (registered when called `fizzConnect`)

#### `uiReducer.js`
Updating state with respect to old for all corresponding actions in `redux/actions.js`


<br><br/>

*When all above done*

### `npm run build`

When all done. Simply run this command and see the content of the `build` folder.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

