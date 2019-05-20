from flask import abort, Flask, json, redirect,\
    render_template, request, Response, url_for, session, jsonify
from werkzeug.utils import secure_filename
from flask_sqlalchemy import SQLAlchemy
import time
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
    #make sure they have the form data
    if not (session['user'] and rf['computer_ID'] and rf['reservation_time']):
        return False
    #make sure they sent a valid time
    elif rf['reservation_time'] not in [2,4,12,24]:
        return False

    #check that the user does not already have a computer reserved
    user = Users.query.filter(Users.username==session['user']).first()
    t=time.time()
    if user.computer_ID != 0:
        comp = Computers.query.filter(Computers.computer_ID==user.computer_ID).first()
        if comp.reservation_end_time > t:
            return False

    #check if the computer the user wants is already reserved
    comp = Computers.query.filter(Computers.computer_ID==rf['computer_ID']).first()
    if (comp is None):
        return False
    elif comp.availability == 0:
        if comp.reservation_end_time <= t:
            return True
        else:
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
    rf = request.form
    if not (rf['user'] and rf['pass'] and rf['email']):
        return 'fail'

    username = request.form['user'].strip().lower()
    if Users.query.filter(Users.username==username).first() is not None:
        #username taken
        return 'fail'
				
    else:
        #getting data to add to the user profile database
        password = request.form['pass'].strip()
        #add data to this user
        newUser = Users(username=username, password=password, computer_ID = 0, email=request.form['email'])
        db.session.add(newUser)
        db.session.commit()
        session['user'] = username
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
    computers = list(map(lambda c: c.serialize(), Computers.query.all()))
    return jsonify(computers)

@app.route('/api/user/', methods=['POST'])
def user():
    user = Users.query.filter(Users.username==session['user']).first()
    userCompID = user.computer_ID
    return str(userCompID)
    

@app.route('/api/reserve/')
def reserve():
    if not validReserve(request.form):
        return 'fail'
    try:
        #grab the user and computer from the db
        user = Users.query.filter(Users.username==session['user']).first()
        comp = Computers.query.filter(Computers.computer_ID==request.form['computer_ID']).first()

        #figure out how long for the reservation
        #time is hours * 60min/hr * 60sec/min
        t=time.time()
        addTime = request.form['reservation_time'] * 60 * 60
        addTime = addTime + t

        user.computer_ID = request.form['computer_ID']
        comp.availability = 0
        comp.checkout_time = t
        comp.reservation_end_time = addTime
        db.session.commit()
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
        comp = Computers.query.filter(Computers.computer_ID==request.form['computer_ID']).first()
        if (user is None) or (comp is None) or (user.username != session['user']):
            return 'fail'
        user.computer_ID = 0
        comp.checkout_time = 0
        comp.reservaion_end_time = 0
        comp.availability = 1
        db.session.commit()
        return 'ok'
    except Exception as e:
        print("Error with client removing reservation")
        print("----------------")
        print(e)
        print("----------------")
        return 'fail'

	
if __name__ == '__main__':
	app.run()
