from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from config import db

### DEPARTMENT MODEL ###
class Department(db.Model, SerializerMixin):
    __tablename__ = 'departments'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    # Relationships
    instructors = db.relationship("Instructor", back_populates="department", cascade="all, delete-orphan")

    # Serialization Rules
    serialize_rules = ("-instructors.department",)

    def __repr__(self):
        return f"<Department {self.name}>"

### INSTRUCTOR MODEL ###
class Instructor(db.Model, SerializerMixin):
    __tablename__ = 'instructors'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    # Foreign Key & Relationship with Department
    department_id = db.Column(db.Integer, db.ForeignKey("departments.id"), nullable=False)
    department = db.relationship("Department", back_populates="instructors")

    # Relationship with Units (One-to-Many)
    units = db.relationship("Unit", back_populates="instructor", cascade="all, delete-orphan")

    # Serialization Rules
    serialize_rules = ("-units.instructor", "-department.instructors")

    def __repr__(self):
        return f"<Instructor {self.name} - {self.email}>"

### UNIT MODEL ###
class Unit(db.Model, SerializerMixin):
    __tablename__ = 'units'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False, unique=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    # Foreign Key & Relationship with Instructor
    instructor_id = db.Column(db.Integer, db.ForeignKey("instructors.id"), nullable=False)
    instructor = db.relationship("Instructor", back_populates="units")

    # Relationship with Enrollments (Many-to-Many)
    enrollments = db.relationship("Enrollment", back_populates="unit", cascade="all, delete-orphan")
    students = association_proxy("enrollments", "student")

    # Serialization Rules
    serialize_rules = ("-instructor.units", "-enrollments.unit")

    def __repr__(self):
        return f"<Unit {self.title}>"

### STUDENT MODEL ###
class Student(db.Model, SerializerMixin):
    __tablename__ = 'students'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    age = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    # Relationship with Enrollments (Many-to-Many)
    enrollments = db.relationship("Enrollment", back_populates="student", cascade="all, delete-orphan")
    units = association_proxy("enrollments", "unit")

    # Serialization Rules
    serialize_rules = ("-enrollments.student",)

    def __repr__(self):
        return f"<Student {self.name}, Age {self.age}>"

### ENROLLMENT MODEL ###
class Enrollment(db.Model, SerializerMixin):
    __tablename__ = 'enrollments'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("students.id"), nullable=False)
    unit_id = db.Column(db.Integer, db.ForeignKey("units.id"), nullable=False)
    enrollment_date = db.Column(db.Date, nullable=False)
    grades = db.Column(db.Float, nullable=True)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    # Relationships
    student = db.relationship("Student", back_populates="enrollments")
    unit = db.relationship("Unit", back_populates="enrollments")

    # Serialization Rules
    serialize_rules = ("-student.enrollments", "-unit.enrollments")

    def __repr__(self):
        return f"<Enrollment Student {self.student_id} -> Unit {self.unit_id}>"
