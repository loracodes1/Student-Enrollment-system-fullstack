#!/usr/bin/env python3

# Standard library imports
from random import randint, sample, uniform
from datetime import datetime

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Department, Instructor, Unit, Student, Enrollment

fake = Faker()

if __name__ == '__main__':
    with app.app_context():
        print("Starting seed process...")

        # Step 1: Clear existing data
        print(" Resetting database...")
        db.session.query(Enrollment).delete()
        db.session.query(Unit).delete()
        db.session.query(Instructor).delete()
        db.session.query(Student).delete()
        db.session.query(Department).delete()
        db.session.commit()

        # Step 2: Seed Departments
        department_names = ["Computer Science", "Mathematics", "Physics", "Biology", "History"]
        departments = [Department(name=name) for name in department_names]
        db.session.add_all(departments)
        db.session.commit()
        print(f"Seeded {len(departments)} departments")

        # Step 3: Seed Instructors (Assigned to Departments)
        instructors = [
            Instructor(
                name=fake.name(),
                email=fake.unique.email(),
                department_id=sample(departments, 1)[0].id
            ) for _ in range(10)
        ]
        db.session.add_all(instructors)
        db.session.commit()
        print(f"Seeded {len(instructors)} instructors")

        # Step 4: Seed Units (Assigned to Instructors)
        unit_titles = ["Data Structures", "Calculus", "Linear Algebra", "Quantum Mechanics", "Genetics", "World History"]
        units = [
            Unit(
                title=title,
                instructor_id=sample(instructors, 1)[0].id
            ) for title in unit_titles
        ]
        db.session.add_all(units)
        db.session.commit()
        print(f" Seeded {len(units)} units")

        #  Step 5: Seed Students
        students = [
            Student(
                name=fake.name(),
                age=randint(18, 30)  # Random age between 18 and 30
            ) for _ in range(20)
        ]
        db.session.add_all(students)
        db.session.commit()
        print(f"Seeded {len(students)} students")

        # Step 6: Seed Enrollments (Students Enrolling in 1-3 Units)
        units = Unit.query.all()  # Re-fetch units to avoid DetachedInstanceError
        students = Student.query.all()  # Re-fetch students to ensure they're in session

        enrollments = []
        for student in students:
            num_enrollments = randint(1, 3)  # Each student enrolls in 1-3 units
            enrolled_units = sample(units, num_enrollments)  # Pick unique units

            for unit in enrolled_units:
                enrollment = Enrollment(
                    student_id=student.id,
                    unit_id=unit.id,
                    enrollment_date=fake.date_between(start_date="-1y", end_date="today"),
                    grades=round(uniform(50, 100), 2)  # Random grade between 50 and 100
                )
                enrollments.append(enrollment)

        db.session.add_all(enrollments)
        db.session.commit()
        print(f"Seeded {len(enrollments)} enrollments")

        print(" Database seeding complete!")