from flask import current_app as app
from backend.models import Subject, Chapter, Quiz, Question, Scores, Role, User, db
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
    
    subs = Subject.query.all()
    if not subs:
        newsub = Subject(name = 'Maths', desc = 'numbers and stuff')
        db.session.add(newsub)
        db.session.commit()
        newchap = Chapter(name = 'Geometry', desc = 'shapes and whatnot', s_id = newsub.id)
        db.session.add(newchap)
        db.session.commit()
        newquiz = Quiz(name = 'Polygons 1', desc = 'simple quiz about shapes', time = '5:00', c_id = newchap.id)
        db.session.add(newquiz)
        db.session.commit()
        newques1 = Question(statement = 'which shape has 4 sides', op1 = 'circle', op2 = 'triangle', op3 = 'pentagon', op4 = 'square', ans = '4', q_id = newquiz.id)
        newques2 = Question(statement = 'which shape has 5 sides', op1 = 'circle', op2 = 'triangle', op3 = 'pentagon', op4 = 'square', ans = '3', q_id = newquiz.id)
        db.session.add(newques1)
        db.session.add(newques2)
        db.session.commit()





    

    db.session.commit()