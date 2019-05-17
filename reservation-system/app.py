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


@app.route('/')
def index():
    return render_template('index.html')

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
	 
@app.route('/api/computerInfo/', methods=['POST'])
def info():
    computers = Computers.query.filter().all()
    return jsonify(computers)
    

@app.route('/api/reserve/')
def reserve():
    return 0

@app.route('/api/deleteReservation/')
def deleteReservation():
    return 0
	
if __name__ == '__main__':
	app.run()
