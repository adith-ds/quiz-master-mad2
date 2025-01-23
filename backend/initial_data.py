from flask import current_app as app
from backend.models import db
from flask_security import SQLAlchemyUserDatastore, hash_password

with app.app_context():
    db.create_all()

    userdatastore : SQLAlchemyUserDatastore = app.security.datastore

    userdatastore.find_or_create_role(name = 'admin', description = 'superuser')
    userdatastore.find_or_create_role(name = 'user', description = 'general user')

    if (not userdatastore.find_user(email = 'admin@quizhub.in')):
        userdatastore.create_user(email = 'admin@quizhub.in', password = hash_password('pass'), roles = ['admin'] )
    if (not userdatastore.find_user(email = 'dummy@example.com')):
        userdatastore.create_user(email = 'dummy@example.com', password = hash_password('pass'), username = 'dummy', dob = '1970-01-01', roles = ['user'] ) # for testing

    db.session.commit()