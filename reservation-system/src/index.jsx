import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Modal from 'react-awesome-modal';

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
		show: false,
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
		showModal(){
			console.log('showing modal');
			this.setState({show: true});
		}

		hideModal(){
			console.log('closing modal');
			this.setState({show: false});
		}

    render(){
		let pcs = [];
		
	    this.state.computers.map((computer, index) => {
		//this is really bad because im just changing the color for now.
        //If the computer id is equal to the userID then its reserved by them
        //So they will be able to update their reservation or remove their reservation.

		//If the computer availability is 1 then it is free so it can be reserved by anybody
		//if not then it is reserved so we will display it as such and with who reserved it.
	      if(computer.computer_ID !== this.state.computer_ID){
		    if(computer.availability === 1) {
              pcs.push(<div className="freecomputer">
		        <div>Computer Availability: {computer.availability}</div>
		        <div>Computer ID: {computer.computer_ID}</div>
		        <div>Computer Checkout Time: {computer.checkout_time}</div>
		        <div>Computer Reservation End Time: {computer.reservation_end_time}</div>
							<input type="button" value="Open" onClick={() => this.showModal()} />
                <Modal visible={this.state.show} width="400" height="300" effect="fadeInUp" onClickAway={() => this.hideModal()}>
                    <div>
                        <h1>Title</h1>
                        <p>Some Contents</p>
												<input type="button" value="Reserve" onClick={() => this.hideModal()} />
                    </div>
                </Modal>
              </div>)
             } else {
              pcs.push(<div className="takencomputer">
		        <div>Computer Availability: {computer.availability}</div>
		        <div>Computer ID: {computer.computer_ID}</div>
		        <div>Computer Checkout Time: {computer.checkout_time}</div>
		        <div>Computer Reservation End Time: {computer.reservation_end_time}</div>
						<input type="button" value="Open" onClick={() => this.showModal()} />
                <Modal visible={this.state.show} width="400" height="300" effect="fadeInUp" onClickAway={() => this.hideModal()}>
                    <div>
                        <h1>Title</h1>
                        <p>Some Contents</p>
												<input type="button" value="Reserve" onClick={() => this.hideModal()} />
			
                    </div>
                </Modal>
              </div>)
             }
	      } else {
            pcs.push(<div className="mycomputer">
		      <div>Computer Availability: {computer.availability}</div>
		      <div>Computer ID: {computer.computer_ID}</div>
		      <div>Computer Checkout Time: {computer.checkout_time}</div>
		      <div>Computer Reservation End Time: {computer.reservation_end_time}</div>
					<input type="button" value="Open" onClick={() => this.showModal()} />
                <Modal visible={this.state.show} width="400" height="300" effect="fadeInUp" onClickAway={() => this.hideModal()}>
                    <div>
                        <h1>Title</h1>
                        <p>Some Contents</p>
												<input type="button" value="Reserve" onClick={() => this.hideModal()} />
                    </div>
                </Modal>
		      </div>)
		  }
	    });
		return(
		  <div className="computerview">
		    {pcs}
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
