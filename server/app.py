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


# ✅ Students API
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


class StudentByIDResource(Resource):
    def get(self, student_id):
        """Retrieve a student by ID"""
        student = Student.query.get(student_id)
        if not student:
            return {"error": "Student not found"}, 404
        return jsonify(student.to_dict())

    def patch(self, student_id):
        """Update student details"""
        student = Student.query.get(student_id)
        if not student:
            return {"error": "Student not found"}, 404

        data = request.get_json()
        student.name = data.get("name", student.name)
        student.age = data.get("age", student.age)

        db.session.commit()
        return jsonify(student.to_dict())

    def delete(self, student_id):
        """Delete a student"""
        student = Student.query.get(student_id)
        if not student:
            return {"error": "Student not found"}, 404

        db.session.delete(student)
        db.session.commit()
        return {"message": "Student deleted successfully"}, 200


# ✅ Enrollments API
class EnrollmentsResource(Resource):
    def get(self):
        """Retrieve all enrollments"""
        enrollments = Enrollment.query.all()
        return jsonify([enrollment.to_dict() for enrollment in enrollments])

    def post(self):
        """Create a new enrollment"""
        data = request.get_json()
        student = Student.query.get(data.get("student_id"))
        unit = Unit.query.get(data.get("unit_id"))

        if not student or not unit:
            return {"error": "Invalid student or unit ID"}, 400

        new_enrollment = Enrollment(
            student_id=student.id,
            unit_id=unit.id,
            enrollment_date=data.get("enrollment_date"),
            grades=data.get("grades", None),
        )

        db.session.add(new_enrollment)
        db.session.commit()
        return jsonify(new_enrollment.to_dict()), 201


class EnrollmentByIDResource(Resource):
    def get(self, enrollment_id):
        """Retrieve an enrollment by ID"""
        enrollment = Enrollment.query.get(enrollment_id)
        if not enrollment:
            return {"error": "Enrollment not found"}, 404
        return jsonify(enrollment.to_dict())

    def patch(self, enrollment_id):
        """Update enrollment details"""
        enrollment = Enrollment.query.get(enrollment_id)
        if not enrollment:
            return {"error": "Enrollment not found"}, 404

        data = request.get_json()
        enrollment.grades = data.get("grades", enrollment.grades)
        db.session.commit()
        return jsonify(enrollment.to_dict())

    def delete(self, enrollment_id):
        """Delete an enrollment"""
        enrollment = Enrollment.query.get(enrollment_id)
        if not enrollment:
            return {"error": "Enrollment not found"}, 404

        db.session.delete(enrollment)
        db.session.commit()
        return {"message": "Enrollment deleted successfully"}, 200


# ✅ Units API
class UnitsResource(Resource):
    def get(self):
        """Retrieve all units"""
        units = Unit.query.all()
        return jsonify([unit.to_dict() for unit in units])


# ✅ Instructors API
class InstructorsResource(Resource):
    def get(self):
        """Retrieve all instructors"""
        instructors = Instructor.query.all()
        return jsonify([instructor.to_dict() for instructor in instructors])


# ✅ Departments API
class DepartmentsResource(Resource):
    def get(self):
        """Retrieve all departments"""
        departments = Department.query.all()
        return jsonify([department.to_dict() for department in departments])


# ✅ Register API Endpoints
api.add_resource(StudentsResource, "/students")
api.add_resource(StudentByIDResource, "/students/<int:student_id>")
api.add_resource(EnrollmentsResource, "/enrollments")
api.add_resource(EnrollmentByIDResource, "/enrollments/<int:enrollment_id>")
api.add_resource(UnitsResource, "/units")
api.add_resource(InstructorsResource, "/instructors")
api.add_resource(DepartmentsResource, "/departments")


# ✅ Default Route
@app.route("/")
def index():
    return "<h1>Student Enrollment System</h1>"


# ✅ Run the App
if __name__ == "__main__":
    app.run(port=5555, debug=True)
