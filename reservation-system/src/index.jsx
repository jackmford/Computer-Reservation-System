import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Login extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        tempuser: null,
        temppass: null,
        username: null,
        password: null,
      };
    }

    //This isn't usable right now but could be useful in the future.
    login(){
      this.setState({
        username: this.state.tempuser,
        password: this.state.temppass,
      });
    }

    //This isn't usable right now but could be useful int he future.
    logout(){
      this.setState({
        username: null,
        password: null,
      });
    }

    render() {
      let loginElms = [];
      let buttons = [];      
      if(this.state.username === null){
        loginElms.push(<input type="text" className="username" placeholder="username" id="user" onChange={e => this.setState({ tempuser: e.target.value })}  />);
        loginElms.push(<input type="text" className="password" placeholder="password" id="pass"onChange={e => this.setState({ temppass: e.target.value })} />);
        buttons.push(<input type="button" value="Login" onClick={e => this.setState({ username: this.state.tempuser, password: this.state.temppass})} />);
      } else {
        loginElms.push(<p>{this.state.username}</p>);
        buttons.push(<input type="button" value="Logout" onClick={e => this.setState({ username: null, password: null})}  />);
      }

        return (
            <div>
              <div className="homepage">
                {loginElms}
                {buttons}
              </div>
            </div>
        );
    }
}

ReactDOM.render( <Login />, document.getElementById( "homepage" ) );
