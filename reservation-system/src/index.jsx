import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class ComputerReservation extends React.Component{
    constructor(props){
      super(props);
      this.state = {
		computer: super.chosenComputer,
		times = [],
		};
    }
    
    render(){
		return(

		);
    }

}

class ComputerView extends React.Component{
    constructor(props){
      super(props);
      this.state = {
		user: super.username,
		computers = [],
		chosenComputer: null,
		};
    }

    render(){
		return(

		);
    }
}

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
			var formData = new FormData(document.querySelector('#login-form'));
			window.fetch('/api/login',{
				method: 'POST',
				body: formData,
})
			.then(result => result.text())
			.then(
				(result) => {
					if (result === 'ok'){
						this.props.onLogin();
				}
					else {
						alert('Not authenticated.');
				}
			},
				(error) => {
					alert('General login error.');
				},
	
			);

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
				loginElms.push(<form id = "login-form">)
        loginElms.push(<input type="text" className="username" placeholder="username" name="user"  onChange={e => this.setState({ tempuser: e.target.value })}  />);
        loginElms.push(<input type="text" className="password" placeholder="password" name="pass" onChange={e => this.setState({ temppass: e.target.value })} />);
        buttons.push(<button type="submit" value="Login" onClick={e => evt.preventDefault(); this.login(); this.setState({ username: this.state.tempuser, password: this.state.temppass})} />);
        buttons.push(<button type="submit" value="Sign Up!" onClick={e => evt.preventDefault(); this.signUp(); />);
				loginElms.push(</form>)
      } else {
				loginElms.push(<p>{this.state.username}</p>);
        buttons.push(<button type="submit" value="Logout" onClick={e => this.setState({ username: null, password: null})} />);
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
