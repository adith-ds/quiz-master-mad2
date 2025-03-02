from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin
import datetime

db = SQLAlchemy()

class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    fs_uniquifier = db.Column(db.String, unique=True, nullable=False)
    active = db.Column(db.Boolean, default = True)
    roles = db.Relationship('Role', backref = 'bearers', secondary='user_roles')
    
    username = db.Column(db.String)
    dob = db.Column(db.String)





class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String, unique = True, nullable  = False)
    description = db.Column(db.String, nullable = False)

class UserRoles(db.Model):
    __tablename__ = 'user_roles'
    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))




class Subject(db.Model):
    __tablename__ = 'subject'
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String, nullable  = False, unique=True)
    desc = db.Column(db.Text, nullable  = False)
    chapters = db.relationship('Chapter', backref=db.backref('subject', lazy=True))



class Chapter(db.Model):
    __tablename__ = 'chapter'
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String, nullable  = False, unique=True)
    desc = db.Column(db.Text, nullable  = False)
    s_id = db.Column(db.Integer, db.ForeignKey('subject.id'))
    quizzes = db.relationship('Quiz', backref=db.backref('chapter', lazy=True))


class Quiz(db.Model):
    __tablename__ = 'quiz'
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String, unique=True)
    date = db.Column(db.DateTime, default = datetime.datetime.now())
    time = db.Column(db.String)
    desc = db.Column(db.Text, nullable  = False)
    c_id = db.Column(db.Integer, db.ForeignKey('chapter.id'))
    questions = db.relationship('Question', backref=db.backref('quiz', lazy=True))


class Question(db.Model):
    __tablename__ = 'question'
    id = db.Column(db.Integer, primary_key = True)
    q_id = db.Column(db.Integer, db.ForeignKey('quiz.id'))
    statement = db.Column(db.String)
    op1 = db.Column(db.String)
    op2 = db.Column(db.String)
    op3 = db.Column(db.String)
    op4 = db.Column(db.String)
    ans = db.Column(db.String)


class Scores(db.Model):
    __tablename__ = 'scores'
    id = db.Column(db.Integer, primary_key = True)
    q_id = db.Column(db.Integer, db.ForeignKey('quiz.id'))
    u_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    attempt_time = db.Column(db.String)
    total_score = db.Column(db.Integer)

