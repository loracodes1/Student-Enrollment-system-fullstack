#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, jsonify
from flask_restful import Api, Resource
from flask_cors import CORS

# Local imports
from config import app, db
from models import Department, Enrollment, Instructor, Student, Unit

# Enable CORS for frontend communication
CORS(app)

# Initialize Flask-RESTful API
api = Api(app)


#  Students API
class StudentsResource(Resource):
    def get(self):
        """Retrieve all students"""
        students = Student.query.all()
        return jsonify([student.to_dict() for student in students])

    def post(self):
        """Create a new student"""
        data = request.get_json()
        if not data.get("name") or not data.get("age"):
            return {"error": "Missing required fields"}, 400

        new_student = Student(name=data["name"], age=data["age"])
        db.session.add(new_student)
        db.session.commit()
        return jsonify(new_student.to_dict()), 201
