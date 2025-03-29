from flask import jsonify, request, current_app as app
from flask_restful import Api, Resource, fields, marshal_with, marshal
from flask_security import auth_required, current_user
from backend.models import Subject, Chapter, Quiz, Question, Scores, Role, User, db
from sqlalchemy.sql import func

cache = app.cache
api = Api(prefix='/api')

subfield = {
    'id' : fields.Integer,
    'name' : fields.String,
    'desc' : fields.String,
}


class SubjectAPI(Resource):
    
    
    @auth_required('token')
    @cache.cached(timeout = 10)
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
    @cache.memoize(timeout = 10)
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
    @cache.memoize(timeout = 10)
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
    
    @auth_required('token')
    def delete(self, id):
        try:
            quiz = Quiz.query.get(id)
            db.session.delete(quiz)
            db.session.commit()
            return {"message" : "quiz deleted successfully"}, 200
        except:
            db.session.rollback()
            return {"message" : "could not delete quiz"}, 400



    


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
    @cache.memoize(timeout = 10)
    def get(self, id):
        quiz = Quiz.query.get(id)
        if quiz:
            return marshal(quiz.questions, questionfields)
        return {"message" : "no questions added"}, 400
    
    @auth_required('token')
    def delete(self, id):
        try:
            ques = Question.query.get(id)
            db.session.delete(ques)
            db.session.commit()
            return {"message" : "question deleted successfully"}, 200
        except:
            db.session.rollback()
            return {"message" : "could not delete question"}, 400

        


api.add_resource(QuestionAPI, '/questions/<int:id>') 

scorefields = {
    'id' : fields.Integer,
    'q_name' : fields.String,
    'q_id' : fields.String,
    'u_id' : fields.String,
    'attempt_time' : fields.Integer,
    'obtained_score' : fields.Integer,
    'total_score' : fields.Integer,
}

class ScoresAPI(Resource):

    @auth_required('token')
    def post(self):
        data = request.get_json()
        q_name = data.get('q_name')
        q_id = data.get('q_id')
        u_id = data.get('u_id')
        attempt_time = data.get('attempt_time')
        obtained_score = data.get('obtained_score')
        total_score = data.get('total_score')
        oldscore = Scores.query.filter_by(u_id = u_id, q_id = q_id).first()
        if oldscore:
            if oldscore.obtained_score >= obtained_score:
                return {"message" : "prior attempt is better"}, 200
            else:
                oldscore.attempt_time = attempt_time
                oldscore.obtained_score = obtained_score
                oldscore.total_score = total_score
                db.session.commit()
                return {"message" : "updated score"}, 200
        try:
            score = Scores(q_name = q_name, q_id = q_id, u_id = u_id, attempt_time = attempt_time, obtained_score = obtained_score, total_score = total_score)
            db.session.add(score)
            db.session.commit()
            return {"message" : "score added successfully"}, 200
        except:
            db.session.rollback()
            return {"message" : "failed to add score"}, 400
        

api.add_resource(ScoresAPI, '/scores') 


class ByIdAPI(Resource):
    @auth_required('token')
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
        if type == 'quiz':
            quiz = Quiz.query.filter_by(id=id).one()
            if not quiz:
                return {"message" : "quiz not found"}, 404
            return marshal(quiz, quizfields)
        if type == 'score':
            u_id = request.args.get('u_id')
            q_id = request.args.get('q_id')
            score = Scores.query.filter_by(u_id = u_id, q_id = q_id).first()
            if not score:
                return {"message" : "quiz not attempted yet"}, 404
            return marshal(score, scorefields)
        return {"message" : "please provide content type"}
    
api.add_resource(ByIdAPI, '/byid/<int:id>')


class StatisticsAPI(Resource):

    @auth_required('token')
    @cache.cached()
    def get(self):
        total_users = db.session.query(User).count()
        total_subjects = db.session.query(Subject).count()
        total_chapters = db.session.query(Chapter).count()
        total_quizzes = db.session.query(Quiz).count()

        quiz_performance = (
            db.session.query(
                Scores.q_name,
                func.avg(Scores.obtained_score / Scores.total_score).label("avg_score")
            )
            .group_by(Scores.q_name)
            .all()
        )
        quiz_performance = [{"name": q[0], "avg_score": round(q[1], 2)} for q in quiz_performance]

        user_performance = (
            db.session.query(
                User.username,
                func.avg(Scores.obtained_score / Scores.total_score).label("avg_score")
            )
            .join(Scores, Scores.u_id == User.id)
            .group_by(User.id)
            .order_by(func.avg(Scores.obtained_score / Scores.total_score).desc()) 
            .limit(10)  
            .all()
        )
        user_performance = [{"username": u[0], "avg_score": round(u[1], 2)} for u in user_performance]

        time_data = db.session.query(Scores.attempt_time).all()
        time_values = [float(t[0]) for t in time_data if t[0].replace(".", "", 1).isdigit()]  # Convert to float safely

        if time_values:
            mean_time = round(sum(time_values) / len(time_values), 2)
            median_time = round(sorted(time_values)[len(time_values) // 2], 2)
            mode_time = max(set(time_values), key=time_values.count)
        else:
            mean_time = median_time = mode_time = 0

        return {
            "users": total_users,
            "subjects": total_subjects,
            "chapters": total_chapters,
            "quizzes": total_quizzes,
            "quizPerformance": quiz_performance,
            "userPerformance": user_performance,
            "timeDistribution": [mean_time, median_time, mode_time]
        }, 200

api.add_resource(StatisticsAPI, "/statistics")

class UserStats(Resource):
    
    @auth_required('token')
    @cache.memoize(timeout = 10)
    def get(self, id):
        total_quizzes = Scores.query.filter_by(u_id = id).count()
        quiz_data = Scores.query.filter_by(u_id = id).all()
        performance = [{"name":S.q_name, "obtained_score":S.obtained_score, "total_score":S.total_score} for S in quiz_data]
        timetaken = [{"name":S.q_name, "time":S.attempt_time} for S in quiz_data]
        return {
            "quizzes_attempted":total_quizzes,
            "quizPerformance":performance,
            "timeTaken":timetaken
        }, 200
    
api.add_resource(UserStats, "/stats/<int:id>")

class Userlist(Resource):
    @auth_required('token')
    @cache.cached(timeout = 30)
    def get(self):
        users = User.query.filter(User.id != 1).all()
        userlist = [{"username":u.username, "email":u.email, "dob":u.dob} for u in users]
        return userlist, 200
    

api.add_resource(Userlist, "/userlist")