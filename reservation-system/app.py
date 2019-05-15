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

#TODO
#makes sure all fields have been filled out
def validCreateAccount(rf):
    if not rf['username'] or not rf['password']:
        return False
    return True




@app.route('/')
def index():
    return render_template('index.html')

#TODO
@app.route('/api/signup/', methods=['POST'])
def signUp():
    #send new user data to the database
    #send them to homepage
    #take data from the request form, add it to database and commit it
    #should check if username is already taken? 
    if not validCreateAccount(request.form):
        session['createAccountMessage']='One or more fields contain missing or invalid information.'
        return redirect(url_for('login'))
    #check if the user already exists in the database
    username = request.form['username'].strip().lower()
    if Users.query.filter(Users.username==username).first() is not None:
        session['createAccountMessage'] = 'Sorry, that username is already taken'
        return redirect(url_for('login'))
    #check that the profile picture file is actually an image
    else:
        #getting data to add to the user profile database
        password = request.form['password'].strip()
        #creating unique profile picture name for the picture they gave us
        #add data to this user
        newUser = Users(username=username, password=password, computer_ID = 0, email=request.form['email'])
        db.session.add(newUser)
        db.session.commit()
        session['username'] = request.form['username']
        return render_template('app.html', username=session['username'])

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
        
	 

@app.route('/reserve/')
def reserve():
    return 0

@app.route('/deleteReservation/')
def deleteReservation():
    return 0
	
if __name__ == '__main__':
	app.run()
