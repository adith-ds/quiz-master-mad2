from flask import current_app as app, jsonify, render_template,  request, send_file
from flask_security import auth_required, verify_password, hash_password
from backend.models import User, db
from backend.celery.tasks import create_csv
from celery.result import AsyncResult

datastore = app.security.datastore
cache = app.cache

@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')


@app.route('/get-celery-data/<id>', methods=['GET'])
def getdata(id):
    result = AsyncResult(id)
    if result.ready():
        return {'result' : result.result}, 200
    else:
        return {'message' : 'task not complete'}, 405

@app.route('/make-csv/<uid>', methods=['GET'])
def make_csv(uid):
    task = create_csv.delay(uid)
    return{"task_id" : task.id}, 200

@app.route('/get-csv/<id>', methods=['GET'])
def get_csv(id):
    result = AsyncResult(id)
    if result.ready():
        return send_file(result.result), 200
    else:
        return {'message' : 'task not complete'}, 405



@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message" : "no email or password"}), 404
    
    user = datastore.find_user(email = email)

    if not user:
        return jsonify({"message" : "invalid email"}), 404
    
    if verify_password(password, user.password):
        return jsonify({'token' : user.get_auth_token(), 'email' : user.email, 'role' : user.roles[0].name, 'id' : user.id})
    
    return jsonify({'message' : 'wrong password'}), 400

@app.route('/adminlogin', methods=['POST'])
def adminlogin():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message" : "no email or password"}), 404
    
    user = datastore.find_user(email = email)

    if not user:
        return jsonify({"message" : "invalid email"}), 404
    
    if user.roles[0].name != 'admin':
        return jsonify({"message" : "admin only, please use main login"}), 401
    
    if verify_password(password, user.password):
        return jsonify({'token' : user.get_auth_token(), 'email' : user.email, 'role' : user.roles[0].name, 'id' : user.id})
    
    return jsonify({'message' : 'wrong password'}), 400

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    email = data.get('email')
    password = data.get('password')
    username = data.get('username')
    dob = data.get('dob')




    if not (email and password and username and dob):
        return jsonify({"message" : "insufficient data provided"}), 404
    
    user = datastore.find_user(email = email)

    if user:
        return jsonify({"message" : "account already exists"}), 400
    
    try :
        datastore.create_user(email = email, password = hash_password(password), username = username, dob = dob, roles = ['user'], active = True)
        db.session.commit()
        return jsonify({"message" : "user created successfully"}), 200
    except:
        db.session.rollback()
        return jsonify({"message" : "error creating user"}), 400



