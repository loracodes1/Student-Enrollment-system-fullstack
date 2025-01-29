#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import db, Department,Enrollment, Instructor,Student, Unit   

# Views go here!

@app.route('/')
def index():
    return '<h1>Student Enrollment System</h1>'


if __name__ == '__main__':
    app.run(port=5555, debug=True)

