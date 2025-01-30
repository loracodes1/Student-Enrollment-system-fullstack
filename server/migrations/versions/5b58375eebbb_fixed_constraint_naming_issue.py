"""Fixed constraint naming issue

Revision ID: 5b58375eebbb
Revises: 028f2f7b8f72
Create Date: 2025-01-30 21:16:21.282069

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5b58375eebbb'
down_revision = '028f2f7b8f72'
branch_labels = None
depends_on = None


def upgrade():
    # ### Fix: Explicitly name unique constraints ###
    with op.batch_alter_table('departments', schema=None) as batch_op:
        batch_op.create_unique_constraint("uq_departments_name", ['name'])

    with op.batch_alter_table('enrollments', schema=None) as batch_op:
        batch_op.alter_column('student_id',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.alter_column('unit_id',
               existing_type=sa.INTEGER(),
               nullable=False)

    with op.batch_alter_table('instructors', schema=None) as batch_op:
        batch_op.alter_column('department_id',
               existing_type=sa.INTEGER(),
               nullable=False)

    with op.batch_alter_table('units', schema=None) as batch_op:
        batch_op.alter_column('instructor_id',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.create_unique_constraint("uq_units_title", ['title'])  # Fixed


def downgrade():
    # ### Fix: Explicitly drop constraints using correct names ###
    with op.batch_alter_table('units', schema=None) as batch_op:
        batch_op.drop_constraint("uq_units_title", type_='unique')
        batch_op.alter_column('instructor_id',
               existing_type=sa.INTEGER(),
               nullable=True)

    with op.batch_alter_table('instructors', schema=None) as batch_op:
        batch_op.alter_column('department_id',
               existing_type=sa.INTEGER(),
               nullable=True)

    with op.batch_alter_table('enrollments', schema=None) as batch_op:
        batch_op.alter_column('unit_id',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.alter_column('student_id',
               existing_type=sa.INTEGER(),
               nullable=True)

    with op.batch_alter_table('departments', schema=None) as batch_op:
        batch_op.drop_constraint("uq_departments_name", type_='unique')  # Fixed

