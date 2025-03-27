class config():
    DEBUG = False
    SQL_ALCHEMY_TRACK_MODIFICATIONS = False

class localconfig(config):
    SQLALCHEMY_DATABASE_URI = 'sqlite:///mydata.sqlite3'
    DEBUG = True
    SECURITY_PASSWORD_HASH = 'bcrypt'
    SECURITY_PASSWORD_SALT = 'longtextsample'
    SECRET_KEY = 'secret'
    CACHE_TYPE = "RedisCache"
    CACHE_DEFAULT_TIMEOUT = 40
    CACHE_REDIS_PORT = 6379
    WTF_CSRF_ENABLED = False
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'auth-token'

