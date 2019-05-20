import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class ComputerReservation extends React.Component{
    constructor(props){
      super(props);
      this.state = {
		computer: super.chosenComputer,
		times: [],
		};
    }
    
    render(){
		return(
		  <div className="homepage">
		  </div>
		);
    }

}

class ComputerView extends React.Component{
    constructor(props){
      super(props);
      this.state = {
		computer_ID: null,
		computers: [],
		chosenComputer: null,
		};

		window.fetch('/api/computerInfo/',{
				method: 'POST',
		}).then(response => response.json())
		  .then(data => {
		    this.setState({
				computers: data,
		    });
		})
		  .catch(error => alert('error'));
		
		window.fetch('/api/user/',{
				method: 'POST',
		}).then(response => response.json())
		  .then(data => {
		    this.setState({
				computer_ID: data,
		    });
		})
		  .catch(error => alert('error'));
    }

    render(){
		let pcs = [];
		console.log(this.state.computer_ID);
		return(
		  <div className="computerview">
		    {this.state.computers.map((computer, index) => (
		      <div className="computer">
			    <div>Computer Availability: {computer.availability}</div>
		    	<div>Computer ID: {computer.computer_ID}</div>
		    	<div>Computer Checkout Time: {computer.checkout_time}</div>
		    	<div>Computer Reservation End Time: {computer.reservation_end_time}</div>
		      </div>
            ))}
		  </div>
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
			window.fetch('/api/login/',{
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

		signUp() {
			var formData = new FormData(document.querySelector('#signup-form'));
			window.fetch('/api/signup/',{
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
      let signInButton = [];      
			let signUpElms = [];
			let signUpButton = [];
				loginElms.push(<form id = "login-form">
						<img src="../static/img/transparent-computer-screen.png" alt="computerSreen" className="icon"></img>
						<h3 id="title">HPVC Reservations</h3>
						<br></br>
        		<input type="text" className="username" placeholder="username" name="user" onChange={e => this.setState({ tempuser: e.target.value })} />
						<br></br>
        		<input type="password" className="password" placeholder="password" name="pass"onChange={e => this.setState({ temppass: e.target.value })} />
						</form>);
						<br></br>
        signInButton.push(<button className="signButton" type="submit" value="Login" onClick={(e) =>{ e.preventDefault(); this.login(); }}>Sign In! </button>);

				signUpElms.push(
				<div>
    		<a href="#signup" data-toggle="collapse"><h6>Sign Up</h6></a>
    		<div id="signup" className="collapse">
				<form id = "signup-form">
        <input type="text" className="username" placeholder="username" name="user"onChange={e => this.setState({ tempuser: e.target.value })} />
				<br></br>
        <input type="password" className="password" placeholder="password" name="pass" onChange={e => this.setState({ temppass: e.target.value })} />
				<br></br>
        <input type="text" className="email" placeholder="email" name="email" onChange={e => this.setState({ temppass: e.target.value })} />
				</form>
				<br></br>
        <button className="signButton" type="submit" value="Sign Up!" onClick={(e) =>{ e.preventDefault(); this.signUp();}}>Sign Up! </button>
				</div>
				</div>);


        return (
					<div>
						<div className="homepage">
							{loginElms}
							{signInButton}
							{signUpElms}
						</div>
					</div>
        );
    }
}


class App extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			view: 'login'
		};
	}
	
	onLogin() {
		this.setState({
			view: 'ComputerView'
		});
	}
	
	render() {
		let component = (this.state.view === 'login')
			? <Login onLogin={() => this.onLogin()} />
			: <ComputerView />;
		
		return(
			<div className="app">
				{component}
			</div>
		);
	}
}


ReactDOM.render( <App />, document.getElementById( "homepage" ) );
