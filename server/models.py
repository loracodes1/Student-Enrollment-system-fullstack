from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from config import db
from datetime import datetime


# Student Model
class Student(db.Model, SerializerMixin):
    __tablename__ = 'students'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # One-to-many relationship with Enrollment
    enrollments = db.relationship('Enrollment', backref='student', lazy=True)

    # Adding SerializerMixin for easy JSON serialization
    def __init__(self, name, age, email):
        self.name = name
        self.age = age
        self.email = email


class Course(db.Model, SerializerMixin):
    __tablename__ = 'courses'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # One-to-many relationship with Enrollment
    enrollments = db.relationship('Enrollment', backref='course', lazy=True)

    # Adding SerializerMixin for easy JSON serialization
    def __init__(self, title):
        self.title = title


# Enrollment Model
class Enrollment(db.Model, SerializerMixin):
    __tablename__ = 'enrollments'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    student_id = db.Coumn(db.Integer, db.ForeignKey('students.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    enrollment_date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Many-to-one relationships
    student = db.relationship('Student', backref='enrollments', lazy=True)
    course = db.relationship('Course', backref='enrollments', lazy=True)

    # Adding SerializerMixin for easy JSON serialization
    def __init__(self, student_id, course_id, enrollment_date=None):
        self.student_id = student_id
        self.course_id = course_id
        self.enrollment_date = enrollment_date or datetime.utcnow()


# Example of a Many-to-Many relationship with Association Proxy
class StudentCourseAssociation(db.Model):
    __tablename__ = 'student_course_association'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)

    student = db.relationship('Student', backref='course_associations')
    course = db.relationship('Course', backref='student_associations')

    # Using association_proxy to simplify access to both sides of the relationship
    student_name = association_proxy('student', 'name')
    course_title = association_proxy('course', 'title')

    def __init__(self, student_id, course_id):
        self.student_id = student_id
        self.course_id = course_id



