# quiz-master-mad2
This is a simple quiz application for the MAD2 project

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
