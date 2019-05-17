from flask import abort, Flask, json, redirect,\
    render_template, request, Response, url_for, session, jsonify
from werkzeug.utils import secure_filename
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = app.config['SECRET_KEY']
db = SQLAlchemy(app)


# Import any SQLAlchemy model classes you wish.
from models import Users, Computers

"""
VALIDATORS
"""
# validate login information/request
def validLogin(rf):
    #if username or password doesnt exist in the request form, fail
    if not rf['user'] or not rf['pass']:
        return False
    #check username and password in database
    p = Users.query.filter(Users.username == rf['user']).first()
    if p is not None and p.password == rf['pass']:
        return True
    else:
        return False

def validReserve(rf):
    if not (rf['computer_ID'] and rf['checkout_time'] and rf['reservation_end_time']):
        return False
    comp = Computers.query.filter(Computers.computer_ID==rf['computer_ID']).first()
    if comp.availability == 0:
        #TODO if availability is false, check if the reservation end time has passed
        return False
    else:
        return True
"""
ROUTES TO GO TO
"""
@app.route('/')
def index():
    return render_template('index.html')


"""
API ROUTES
"""
@app.route('/api/signup/', methods=['POST'])
def signUp():
    #send new user data to the database
    #take data from the request form, add it to database and commit it
    #should check if username is already taken? 
    if not rf['user'] or not rf['pass']:
        return 'fail'

    username = request.form['user'].strip().lower()
    if Users.query.filter(Users.username==username).first() is not None:
        #username taken
        return 'fail'
				
    else:
        #getting data to add to the user profile database
        password = request.form['pass'].strip()
        #creating unique profile picture name for the picture they gave us
        #add data to this user
        newUser = Users(username=username, password=password, computer_ID = 0, email=request.form['email'])
        db.session.add(newUser)
        db.session.commit()
        session['user'] = request.form['user']
        return 'ok'


@app.route('/api/login/', methods=['POST'])
def login():
    try:
        if validLogin(request.form):
            #they are authenticated
            session['user']=request.form['user']
            return 'ok'
        else:
            #invalid login
            return 'fail'
    except Exception as e:
        print("Error with client logging in:")
        print("----------------")
        print(e)
        print("----------------")

@app.route('/api/logout/', methods=['POST'])
def logout():
    try:
        del session['user']
        return 'ok'
    except Exception as e:
        print("Error with client logging out:")
        print("----------------")
        print(e)
        print("----------------")
        return 'fail'
	 
@app.route('/api/computerInfo/', methods=['POST'])
def info():
    computers = Computers.query.filter().all()
    return jsonify(computers)
    

@app.route('/api/reserve/')
def reserve():
    if not session['user'] or not validReserve(request.form):
        return 'fail'
    try:
        username = session['user']
        user = Users.query.filter(Users.username==username).first()
        user.computer_ID = request.form[computer_ID]
        #TODO
        #change computer availability, checkout_time and reservation_end_time
        #add and commit db changes
        return 'ok'
    except Exception as e:
        print("Error with client reserving computer")
        print("----------------")
        print(e)
        print("----------------")
        return 'fail'

@app.route('/api/deleteReservation/')
def deleteReservation():
    try:
        if not request.form['computer_ID']:
            return 'fail'
        user = Users.query.filter(Users.computer_ID==rf['computer_ID']).first()
        comp = Computers.query.filter(Computers.computer_ID==rf['computer_ID']).first()
        if (user is None) or (comp is None) or (user.username != session['user']):
            return 'fail'
        user.computer_ID = 0
        comp.checkout_time = 0
        comp.reservaion_end_time = 0
        comp.availability = 1
        db.session.commit()
    except Exception as e:
        print("Error with client removing reservation")
        print("----------------")
        print(e)
        print("----------------")
        return 'fail'

	
if __name__ == '__main__':
	app.run()
