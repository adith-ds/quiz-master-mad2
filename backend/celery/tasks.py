from celery import shared_task
import flask_excel
from backend.models import Scores, User, Quiz
from backend.celery.mails import send_daily_email, send_report


@shared_task(ignore_results = False)
def create_csv(id):
    data = Scores.query.filter_by(u_id = id).all()
    res = [{"Attempted Quiz Name":S.q_name, "Duration":S.attempt_time, "Score Obtained":S.obtained_score, "Total":S.total_score} for S in data]


    csv_out = flask_excel.make_response_from_records(records=res, file_type='csv')

    file_path = f'./backend/celery/user_downloads/{id}.csv'
    with open(file_path, 'wb') as file:
        file.write(csv_out.data)

    return file_path


@shared_task(ignore_results = True)
def daily_email():
    users = User.query.filter(User.id != 1).all()
    for user in users:
        completed_quiz_ids = [score.q_id for score in Scores.query.filter_by(u_id=user.id).all()]
        all_quizzes = Quiz.query.all()
        quizzes = [quiz for quiz in all_quizzes if quiz.id not in completed_quiz_ids]
        if quizzes:
            send_daily_email(user.id)


@shared_task(ignore_results = True)
def monthly_email():
    users = User.query.filter(User.id != 1).all()
    for user in users:
        send_report(user.id)





