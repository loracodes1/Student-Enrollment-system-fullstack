#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc, uniform
from datetime import datetime, timedelta

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Department, Instructor, Unit, Student, Enrollment

fake = Faker()

if __name__ == '__main__':
    with app.app_context():
        print("Starting seed process...")

        # Clear existing data to avoid duplicates
        db.session.query(Enrollment).delete()
        db.session.query(Unit).delete()
        db.session.query(Instructor).delete()
        db.session.query(Student).delete()
        db.session.query(Department).delete()
        db.session.commit()

        # ✅ Seed Departments
        departments = []
        department_names = ["Computer Science", "Mathematics", "Physics", "Biology", "History"]
        for name in department_names:
            department = Department(name=name)
            departments.append(department)
            db.session.add(department)

        db.session.commit()
        print(f"✅ Seeded {len(departments)} departments")

        # ✅ Seed Instructors
        instructors = []
        for _ in range(10):
            instructor = Instructor(
                name=fake.name(),
                email=fake.unique.email(),
                department_id=rc(departments).id
            )
            instructors.append(instructor)
            db.session.add(instructor)

        db.session.commit()
        print(f"✅ Seeded {len(instructors)} instructors")

        # ✅ Seed Units
        units = []
        unit_titles = ["Data Structures", "Calculus", "Linear Algebra", "Quantum Mechanics", "Genetics", "World History"]
        for title in unit_titles:
            unit = Unit(
                title=title,
                instructor_id=rc(instructors).id
            )
            units.append(unit)
            db.session.add(unit)

        db.session.commit()
        print(f"✅ Seeded {len(units)} units")

        # ✅ Seed Students
        students = []
        for _ in range(20):
            student = Student(
                name=fake.name(),
                age=randint(18, 30)  # Random age between 18 and 30
            )
            students.append(student)
            db.session.add(student)

        db.session.commit()
        print(f"✅ Seeded {len(students)} students")

        # ✅ Seed Enrollments (Many-to-Many Relationship)
        enrollments = []
        for student in students:
            num_enrollments = randint(1, 3)  # Each student enrolls in 1-3 units
            enrolled_units = rc(units, num_enrollments) if num_enrollments > 1 else [rc(units)]
            for unit in enrolled_units:
                enrollment = Enrollment(
                    student_id=student.id,
                    unit_id=unit.id,
                    enrollment_date=fake.date_between(start_date="-1y", end_date="today"),
                    grades=round(uniform(50, 100), 2)  # Random grade between 50 and 100
                )
                enrollments.append(enrollment)
                db.session.add(enrollment)

        db.session.commit()
        print(f"✅ Seeded {len(enrollments)} enrollments")

        print("🎉 Database seeding complete!")
