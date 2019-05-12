# Run with:
# FLASK_ENV=development flask run --host=0.0.0.0

from flask import abort, Flask, json, redirect, render_template, request, Response, url_for, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = app.config['SECRET_KEY']
db = SQLAlchemy(app)
