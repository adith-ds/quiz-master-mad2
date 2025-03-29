from celery.schedules import crontab
from flask import current_app as app
from backend.celery.tasks import daily_email, monthly_email

celery_app = app.extensions['celery']

@celery_app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    #daily reminder
    sender.add_periodic_task(crontab(hour=18, minute=30), daily_email.s())
    #monthly report
    sender.add_periodic_task(crontab(day_of_month=29, hour=18, minute=59), monthly_email.s())

