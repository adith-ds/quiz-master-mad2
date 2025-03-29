# quiz-master-mad2
This is a simple quiz application for the MAD2 project

# Virtual Environment
## Creation
python3 -m venv .venv
## activation
source .venv/bin/activate
## deactivation 
deactivate

# Steps to use
## installing dependencies
pip install -r requirements.txt

## running the app
python3 app.py

## starting celery 
 celery -A app:celery_app worker -l INFO

## starting celery beat 
 celery -A app:celery_app beat -l INFO

## starting mailhog
 ~/go/bin/MailHog (must be installed on system)
