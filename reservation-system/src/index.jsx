import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Modal from 'react-awesome-modal';
import ReactTimeout from 'react-timeout'

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
		clickedID: null,
		show: false,
		timer: true,
		};
			
			
			this.getComputerInfo = this.getComputerInfo.bind(this);
			this.getComputerInfo();
    }

		getComputerInfo(){

		console.log(this.state.timer);
		if(this.state.timer === true){
			console.log('rerendering');
			window.fetch('/api/computerInfo/',{
					method: 'POST',
			}).then(response => response.json())
		  	.then(data => {
		    	this.setState({
					computers: data,
		    	});
			})
		  .catch(error => console.log("didn't repull data"));

		window.fetch('/api/user/',{
				method: 'POST',
		}).then(response => response.json())
		  .then(data => {
		    this.setState({
				computer_ID: data,
		    });
		})
		  .catch(error => console.log("didn't repull data"));

			setTimeout(this.getComputerInfo, 30000);
		}
		}


		showModal(){
			console.log('showing modal');
			this.setState({show: true});
		}

		hideModal(){
			console.log('closing modal');
			this.setState({show: false});
		}

		reserve() {
			var formData = new FormData();
			var h = '#';
			var c = document.querySelector('#reservation-computer').value;
			console.log('reservation computer');
			console.log(c);
			var time = document.querySelector('#reservation-time').value;
			console.log('reservation time');
			console.log(time);
			
			formData.append('computer_ID', c);
			formData.append('reservation_time', time);
			
			for (var value of formData.values()){
				console.log(value);
			}
			for (var key of formData.keys()){
				console.log(key);
			}
			
			window.fetch('/api/reserve/',{
				method: 'POST',
				body: formData,
			})
			.then(result => result.text())
			.then(
				(result) => {
					if (result === 'ok'){
						//update here 
						this.getComputerInfo();
				}
					else {
						alert('Reservation not available');
				}
			},
				(error) => {
					alert('General reservation error.');
				},
	
			);
			
		}

		remove() {
			var formData = new FormData();
			formData.append('computer_ID', this.state.computer_ID);
			console.log('deleting');
			console.log(this.state.computer_ID);
			
			window.fetch('/api/deleteReservation/',{
				method: 'POST',
				body: formData,
			})
			.then(result => result.text())
			.then(
				(result) => {
					if (result === 'ok'){
						this.getComputerInfo();
					}
					else {
						alert('Deletion not availabe.');
					}
			},
				(error) => {
					alert('General delete error.');
				},
			);
		}
		
		logout() {
			
			console.log('setting to false')
			this.setState({
				timer: false,
			});
			window.fetch('/api/logout/',{
				method: 'POST',
			})
			.then(result => result.text())
			.then(
				(result) => {
					if (result === 'ok'){
						this.props.onLogout();
				}
					else {
						alert('Not deleted.');
				}
			},
				(error) => {
					alert('General logout error.');
				},
	
			);

      this.setState({
        username: '',
        password: '',
      });
    }

    render(){
		let pcs = [];
		let btn = [];
		let log = [];

	    this.state.computers.map((computer, index) => {
			console.log(computer.computer_ID);
		//this is really bad because im just changing the color for now.
        //If the computer id is equal to the userID then its reserved by them
        //So they will be able to update their reservation or remove their reservation.

		//If the computer availability is 1 then it is free so it can be reserved by anybody
		//if not then it is reserved so we will display it as such and with who reserved it.
	    //  if(computer.computer_ID !== this.state.computer_ID){

		    if(computer.availability === 1) {
              pcs.push(<div className="freecomputer">
		        <div>Available</div>
		        <div>Computer ID: {computer.computer_ID}</div>
		        <div>Computer Checkout Time: {computer.checkout_time}</div>
		        <div>Reservation End Time: {computer.reservation_end_time}</div>
              </div>)
             } 
							else if (computer.computer_ID === this.state.computer_ID) {
						
						//calculating actual hours instead of seconds like in app.py
						var d = new Date(computer.checkout_time*1000);
						var hours = d.getHours();
						var minutes = "0" + d.getMinutes();
						var seconds = "0" + d.getSeconds();
						var t = hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
						console.log(t)
						var de = new Date(computer.reservation_end_time*1000);
						var deHours = de.getHours();
						var deMin = "0" + de.getMinutes();
						var deSec = "0" + de.getSeconds();
						var te = deHours + ":" + deMin.substr(-2) + ":" + deSec.substr(-2);
						console.log(te)

            pcs.push(<div className="mycomputer">
		      <div>Reserved</div>
		      <div>Computer ID: {computer.computer_ID}</div>
		      <div>Computer Checkout Time: {t}</div>
		      <div>Reservation End Time: {te}</div>
					<div>Reserved by: {computer.reserved_by} </div>
					<input className="removeBtn" type="button" value="End Reservation" onClick={() => this.remove()} />
		      </div>)
								
							}
							else {

							//calculating actual hours instead of seconds like in app.py
							var d = new Date(computer.checkout_time*1000);
							var hours = d.getHours();
							var minutes = "0" + d.getMinutes();
							var seconds = "0" + d.getSeconds();
							var t = hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);
							console.log(t)
							var de = new Date(computer.reservation_end_time*1000);
							var deHours = de.getHours();
							var deMin = "0" + de.getMinutes();
							var deSec = "0" + de.getSeconds();
							var te = deHours + ":" + deMin.substr(-2) + ":" + deSec.substr(-2);
							console.log(te)

              pcs.push(<div className="takencomputer">
		        <div>Reserved</div>
		      	<div>Computer ID: {computer.computer_ID}</div>
		        <div>Computer Checkout Time: {t}</div>
		        <div>Reservation End Time: {te}</div>
						<div>Reserved by: {computer.reserved_by} </div>
              </div>)
             }
	    });
		btn.push(<div className="reserveBtn">
							<input className="reservationBtn" type="button" value="Make Reservation" onClick={() => this.showModal()} />
								<br></br>
                <Modal className="mod" visible={this.state.show} width="400" height="300" effect="fadeInUp" onClickAway={() => this.hideModal()}>
                    <div>
											<form id="reservation-form">
												<h6>Reservation Length</h6>
												<select id="reservation-time" name="reservation_time">
													<option value="2">2 Hours</option>
													<option value="4">4 Hours</option>
													<option value="12">12 Hours</option>
													<option value="24">24 Hours</option>
												</select>
												<br></br>
												<h6>Computer ID</h6>
												<select id="reservation-computer">
													<option value="1">1</option>
													<option value="2">2</option>
													<option value="3">3</option>
													<option value="4">4</option>
													<option value="5">5</option>
													<option value="6">6</option>
													<option value="7">7</option>
													<option value="8">8</option>
												</select>
												<br></br>
												<input className="reservationBtn" type="button" value="Reserve" onClick={() =>{ this.reserve(); this.hideModal();}} />
											</form>
                    </div>
                </Modal>
							</div>)

		log.push(
				<div id="logDiv">
					<img src="../static/img/transparent-computer-screen.png" alt="computerSreen" id="logoutIcon"></img>
					<input className="logoutBtn" type="button" value="Logout" onClick={() => this.logout()} />
				</div>)
		return(
			<div>
				{log}
		  	<div className="computerview">
		    	{pcs}
		  	</div>
				{btn}
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
	
	onLogout() {
		this.setState({
			view: 'login'
		});
	}
	
	render() {
		let component = (this.state.view === 'login')
			? <Login onLogin={() => this.onLogin()} />
			: <ComputerView onLogout={() => this.onLogout()} />;
		
		return(
			<div className="app">
				{component}
			</div>
		);
	}
}


ReactDOM.render( <App />, document.getElementById( "homepage" ) );
