from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from config import db

# ✅ Department Model (One-to-Many: Departments → Instructors)
class Department(db.Model, SerializerMixin):
    __tablename__ = 'departments'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    # Relationships
    instructors = db.relationship("Instructor", back_populates="department")

    # Serialization Rules
    serialize_rules = ("-instructors.department",)


# ✅ Instructor Model (One-to-Many: Instructors → Units)
class Instructor(db.Model, SerializerMixin):
    __tablename__ = 'instructors'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    # Foreign Key & Relationship with Department
    department_id = db.Column(db.Integer, db.ForeignKey("departments.id"))
    department = db.relationship("Department", back_populates="instructors")

    # Relationship with Units (One-to-Many)
    units = db.relationship("Unit", back_populates="instructor")

    # Serialization Rules
    serialize_rules = ("-units.instructor", "-department.instructors")


# ✅ Unit Model (One-to-Many: Units → Enrollments)
class Unit(db.Model, SerializerMixin):
    __tablename__ = 'units'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    # Foreign Key & Relationship with Instructor
    instructor_id = db.Column(db.Integer, db.ForeignKey("instructors.id"))
    instructor = db.relationship("Instructor", back_populates="units")

    # Relationship with Enrollments (Many-to-Many via enrollments table)
    enrollments = db.relationship("Enrollment", back_populates="unit", cascade="all, delete-orphan")
    students = association_proxy("enrollments", "student")

    # Serialization Rules
    serialize_rules = ("-instructor.units", "-enrollments.unit")


# ✅ Student Model (One-to-Many: Students → Enrollments)
class Student(db.Model, SerializerMixin):
    __tablename__ = 'students'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    age = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    # Relationship with Enrollments (Many-to-Many via enrollments table)
    enrollments = db.relationship("Enrollment", back_populates="student", cascade="all, delete-orphan")
    units = association_proxy("enrollments", "unit")

    # Serialization Rules
    serialize_rules = ("-enrollments.student",)


# ✅ Enrollment Model (Many-to-Many: Students ↔ Units)
class Enrollment(db.Model, SerializerMixin):
    __tablename__ = 'enrollments'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("students.id"))
    unit_id = db.Column(db.Integer, db.ForeignKey("units.id"))
    enrollment_date = db.Column(db.Date, nullable=False)
    grades = db.Column(db.Float, nullable=True)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    # Relationships
    student = db.relationship("Student", back_populates="enrollments")
    unit = db.relationship("Unit", back_populates="enrollments")

    # Serialization Rules
    serialize_rules = ("-student.enrollments", "-unit.enrollments")
