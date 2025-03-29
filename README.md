# quiz-master-mad2
This is a simple quiz application for the MAD2 project

# Virtual Environment
## Creation
python3 -m venv .venv
## activation
source .venv/bin/activate
## deactivation
deactivate

# redis activation
sudo systemctl status redis-server (to check)
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Steps to use
## changing interpreter
click ctrl+shift+p and select the venv as python interpreter (ensure all terminals have this set)

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
 celery -A app:celery_app worker -l INFO

## starting celery beat 
 celery -A app:celery_app beat -l INFO

## starting mailhog
 ~/go/bin/MailHog (must be installed on system)
