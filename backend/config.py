class config():
    DEBUG = False
    SQL_ALCHEMY_TRACK_MODIFICATIONS = False

class localconfig(config):
    SQLALCHEMY_DATABASE_URI = 'sqlite:///mydata.sqlite3'
    DEBUG = True
    SECURITY_PASSWORD_HASH = 'bcrypt'
    SECURITY_PASSWORD_SALT = 'longtextsample'
    SECRET_KEY = 'secret'
    WTF_CSRF_ENABLED = False
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'auth-token'

