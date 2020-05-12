import React from 'react';
import './App.css';
import Messages from './components/Messages';
import Input from './components/Input';

//Redux Stuff
import {fizzConnect} from './redux/actionsCreators';
import { connect } from 'react-redux';


class App extends React.Component {

  componentDidMount() {
    const { userId, locale } = this.props;
    this.props.fizzConnect( userId, locale);
  }

  render () {
    const { locale, roomId, userId } = this.props;
    return (
      (roomId.length > 0 && userId.length > 0) 
      ? 
        <div className="App">
          <Messages locale={locale} roomId={roomId} sessionUserId={userId}  />
          <Input {...{ locale, roomId, userId } } />
        </div>
      :
        <div>
          Please check url parameters for <b>roomId</b> and <b>userId</b>
        </div>
    );
  }
}
const mapStateToProps = (state) => {
  const location = window.location || { search: '' };
  const urlParams = new URLSearchParams(location.search);

  const roomId = urlParams.get('roomId') || '';
  const userId = urlParams.get('userId') || '';
  const locale = urlParams.get('locale') || 'en';
  return {
    UI: state.UI,
    roomId, locale, userId
  }
};

export default connect(
  mapStateToProps,
  { fizzConnect }
)(App);




// export default App;
