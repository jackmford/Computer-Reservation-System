from flask import abort, Flask, json, redirect,\
    render_template, request, Response, url_for, session, jsonify
from werkzeug.utils import secure_filename
from flask_sqlalchemy import SQLAlchemy
from _thread import start_new_thread
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
UPDATE db in 30 second intervals
"""
def updateDB():
    while True:
        try:
            computers = Computers.query.filter(Computers.availability==0).all()
            t = time.time()
            for computer in computers:
                if computer.reservation_end_time <= t:
                    user = Users.query.filter(Users.username==computer.reserved_by).first()
                    user.computer_ID=0
                    computer.availability = 1
                    computer.checkout_time = 0
                    computer.reservation_end_time = 0
                    computer.reserved_by = ''
            db.session.commit()
        except Exception as e:
            print("Error with updating db")
            print("----------------")
            print(e)
            print("----------------")
        time.sleep(30)
    return

"""
VALIDATORS
"""
# validate login information/request
def validLogin(rf):
    #if username or password doesnt exist in the request form, fail
    if not rf['user'] or not rf['pass']:
        return False
    #check username and password in database
    username = rf['user'].strip().lower()
    password = rf['pass'].strip()
    p = Users.query.filter(Users.username == username).first()
    if p is not None and p.password == password:
        return True
    else:
        return False

def validReserve(rf):
    #make sure they have the form data
    if not (session['user'] and rf['computer_ID'] and rf['reservation_time']):
        return False
    #make sure they sent a valid time
    elif int(rf['reservation_time']) not in [2,4,12,24]:
        return False

    #check that the user does not already have a computer reserved
    user = Users.query.filter(Users.username==session['user']).first()
    t=time.time()
    if user.computer_ID != 0:
        comp = Computers.query.filter(Computers.computer_ID==user.computer_ID).first()
        if comp.reservation_end_time > t:
            return False

    #check if the computer the user wants is already reserved
    comp = Computers.query.filter(Computers.computer_ID==int(rf['computer_ID'])).first()
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
            user = request.form['user'].strip().lower()
            session['user']=user
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
    comps = Computers.query.order_by(Computers.computer_ID).all()
    computers = list(map(lambda c: c.serialize(), comps))
    return jsonify(computers)

@app.route('/api/user/', methods=['POST'])
def user():
    user = Users.query.filter(Users.username==session['user']).first()
    userCompID = user.computer_ID
    return str(userCompID)
    

@app.route('/api/reserve/', methods=['POST'])
def reserve():
    if not validReserve(request.form):
        return 'fail'
    try:
        #grab the user and computer from the db
        user = Users.query.filter(Users.username==session['user']).first()
        comp = Computers.query.filter(Computers.computer_ID==request.form['computer_ID']).first()
        resTime = int(request.form['reservation_time'])
        compID = int(request.form['computer_ID'])

        #figure out how long for the reservation
        #time for addTime is hours * 60min/hr * 60sec/min
        t=time.time()
        addTime = resTime * 60 * 60
        addTime = addTime + t

        user.computer_ID = compID
        comp.availability = 0
        comp.checkout_time = t
        comp.reservation_end_time = addTime
        comp.reserved_by = user.username
        db.session.commit()
        return 'ok'
    except Exception as e:
        print("Error with client reserving computer")
        print("----------------")
        print(e)
        print("----------------")
        return 'fail'

@app.route('/api/deleteReservation/', methods=['POST'])
def deleteReservation():
    try:
        if not request.form['computer_ID']:
            return 'fail'

        compID = int(request.form['computer_ID'])
        user = Users.query.filter(Users.computer_ID==compID).first()
        comp = Computers.query.filter(Computers.computer_ID==compID).first()

        #check if there exists a user with that c_ID
        #check that the user is the same one as the one who is logged in
        if (user is None) or (comp is None) or (user.username != session['user']):
            return 'fail'

        #update info
        user.computer_ID = 0
        comp.checkout_time = 0
        comp.reservaion_end_time = 0
        comp.availability = 1
        comp.reserved_by = ''
        db.session.commit()
        return 'ok'
    except Exception as e:
        print("Error with client removing reservation")
        print("----------------")
        print(e)
        print("----------------")
        return 'fail'

	
if __name__ == '__main__':
    start_new_thread(updateDB, ())
    app.run()
