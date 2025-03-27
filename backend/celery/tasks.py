from celery import shared_task
import flask_excel
from backend.models import Scores


@shared_task(ignore_results = False)
def create_csv(id):
    data = Scores.query.filter_by(u_id = id).all()
    res = [{"Attempted Quiz Name":S.q_name, "Duration":S.attempt_time, "Score Obtained":S.obtained_score, "Total":S.total_score} for S in data]


    csv_out = flask_excel.make_response_from_records(records=res, file_type='csv')

    file_path = f'./backend/celery/user_downloads/{id}.csv'
    with open(file_path, 'wb') as file:
        file.write(csv_out.data)

    return file_path






