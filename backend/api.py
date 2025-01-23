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
    
api.add_resource(SubjectAPI, '/subjects')


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
    


api.add_resource(ChapterAPI, '/chapters/<int:id>')






