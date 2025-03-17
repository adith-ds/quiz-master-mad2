from flask import jsonify, request, current_app as app
from flask_restful import Api, Resource, fields, marshal_with, marshal
from flask_security import auth_required, current_user
from backend.models import Subject, Chapter, Quiz, Question, Scores, Role, User, db

api = Api(prefix='/api')

subfield = {
    'id' : fields.Integer,
    'name' : fields.String,
    'desc' : fields.String,
}


class SubjectAPI(Resource):
    
    
    @auth_required('token')
    def get(self):
        subs = Subject.query.all()
        if not subs:
            return {"message" : "no subjects created"}, 404
        return marshal(subs, subfield)
    
    @auth_required('token')
    def post(self):
        data = request.get_json()
        name = data.get('name')
        desc = data.get('desc')

        try:
            sub = Subject(name = name, desc = desc)
            db.session.add(sub)
            db.session.commit()
            return {"message" : "subject added successfully"}, 200
        except:
            db.session.rollback()
            return {"message" : "failed to add subject"}, 400
    
    @auth_required('token')
    def delete(self, id):
        try:
            sub = Subject.query.get(id)
            db.session.delete(sub)
            db.session.commit()
            return {"message" : "subject deleted successfully"}, 200
        except:
            db.session.rollback()
            return {"message" : "could not delete subject"}, 400
    
api.add_resource(SubjectAPI, '/subjects', '/subjects/<int:id>')


chapterfields = {
    'id' : fields.Integer,
    'name' : fields.String,
    'desc' : fields.String,
    's_id' : fields.Integer,
}



class ChapterAPI(Resource):

    @auth_required('token')
    def get(self, id):
        chapters = Chapter.query.filter_by(s_id=id).all()
        if not chapters:
            return {"message" : "no chapters created"}, 404
        return marshal(chapters, chapterfields)
    
    @auth_required('token')
    def post(self, id):
        data = request.get_json()
        name = data.get('name')
        desc = data.get('desc')

        try:
            chap = Chapter(name = name, desc = desc, s_id = id)
            db.session.add(chap)
            db.session.commit()
            return {"message" : "chapter added successfully"}, 200
        except:
            db.session.rollback()
            return {"message" : "failed to add chapter"}, 400
    
    @auth_required('token')
    def delete(self, id):
        try:
            chap = Chapter.query.get(id)
            db.session.delete(chap)
            db.session.commit()
            return {"message" : "chapter deleted successfully"}, 200
        except:
            db.session.rollback()
            return {"message" : "could not delete chapter"}, 400




api.add_resource(ChapterAPI, '/chapters/<int:id>')

quizfields = {
    'id' : fields.Integer,
    'name' : fields.String,
    'date' : fields.String,
    'time' : fields.String,
    'desc' : fields.String,
    'c_id' : fields.Integer,
}

class QuizAPI(Resource):

    @auth_required('token')
    def get(self, id):
        quizzes = Quiz.query.filter_by(c_id=id).all()
        if not quizzes:
            return {"message" : "no quizzes created"}, 404
        return marshal(quizzes, quizfields)
    
    @auth_required('token')
    def post(self, id):
        data = request.get_json()
        name = data.get('name')
        desc = data.get('desc')
        time = data.get('time')

        try:
            quiz = Quiz(name = name, desc = desc, c_id = id, time = time)
            db.session.add(quiz)
            db.session.commit()
            return {"message" : "quiz added successfully", "id" : quiz.id }, 200
        except:
            db.session.rollback()
            return {"message" : "failed to add quiz"}, 400


    


api.add_resource(QuizAPI, '/quizzes/<int:id>')

questionfields = {
    'id' : fields.Integer,
    'statement' : fields.String,
    'op1' : fields.String,
    'op2' : fields.String,
    'op3' : fields.String,
    'op4' : fields.String,
    'ans' : fields.String,
}

class QuestionAPI(Resource):

    @auth_required('token')
    def post(self, id):
        data = request.get_json()
        statement = data.get('statement')
        op1 = data.get('op1')
        op2 = data.get('op2')
        op3 = data.get('op3')
        op4 = data.get('op4')
        ans = data.get('ans')
        try:
            ques = Question(statement = statement, op1 = op1, op2 = op2, op3 = op3, op4 = op4, ans = ans, q_id = id)
            db.session.add(ques)
            db.session.commit()
            return {"message" : "question added successfully"}, 200
        except:
            db.session.rollback()
            return {"message" : "failed to add question"}, 400
    
    @auth_required('token')
    def get(self, id):
        quiz = Quiz.query.get(id)
        if quiz:
            return marshal(quiz.questions, questionfields)
        return {"message" : "no questions added"}, 400

        


api.add_resource(QuestionAPI, '/questions/<int:id>') 



class ByIdAPI(Resource):

    def get(self, id):
        type = request.args.get('type')
        if type == 'subject':
            subject = Subject.query.filter_by(id=id).one()
            if not subject:
                return {"message" : "subject not found"}, 404
            return marshal(subject, subfield)
        if type == 'chapter':
            chapter = Chapter.query.filter_by(id=id).one()
            if not chapter:
                return {"message" : "chapter not found"}, 404
            return marshal(chapter, chapterfields)
        return {"message" : "please provide content type"}
    
api.add_resource(ByIdAPI, '/byid/<int:id>')





