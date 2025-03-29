import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from jinja2 import Template
from backend.models import User, Scores, Quiz
from datetime import datetime, timedelta


SMTP_SERVER = "localhost"
SMTP_PORT = 1025
SENDER_EMAIL = "quizzy@example"
SENDER_PASSWORD = ''

def send_daily_email(user_id):
    user = User.query.get(user_id)
    completed_quiz_ids = [score.q_id for score in Scores.query.filter_by(u_id=user_id).all()]
    all_quizzes = Quiz.query.all()
    quizzes = [quiz for quiz in all_quizzes if quiz.id not in completed_quiz_ids]
    msg = MIMEMultipart()
    msg['To'] = user.email
    msg['Subject'] = 'Daily Reminder'
    msg['From'] = SENDER_EMAIL
    temp = """
    <style>
    table, th, td {
    border: 1px solid white;
    border-collapse: collapse;
    }
    th, td {
    background-color: #7bed8e;
    }
    </style>
    <h1>Hello {{ user.username }}!</h1>
    <h3>We noticed you have not attempted a few quizzes, why dont you check them out!</h3>
    <table>
    <tr>
    <th>Quiz name</th>
    <th>Description</th>
    </tr>
    {% for quiz in quizzes %}
    <tr>
    <td>{{ quiz.name }}</td>
    <td>{{ quiz.desc }}</td>
    </tr>
    {% endfor %}
    </table>
    <p>Stay quizzin</p>
    """
    template = Template(temp)
    content = template.render(user=user, quizzes=quizzes)

    msg.attach(MIMEText(content, 'html'))
    
    with smtplib.SMTP(host=SMTP_SERVER, port=SMTP_PORT) as client:
        client.send_message(msg)
        client.quit()



def send_report(user_id):
    thirty_days_ago = datetime.now() - timedelta(days=31)
    user = User.query.get(user_id)
    scores = Scores.query.filter(Scores.u_id == user_id, Scores.attempt_date >= thirty_days_ago).all()
    msg = MIMEMultipart()
    msg['To'] = user.email
    msg['Subject'] = 'Monthly Report'
    msg['From'] = SENDER_EMAIL
    temp = """
    <style>
    table, th, td {
    border: 1px solid white;
    border-collapse: collapse;
    }
    th, td {
    background-color: #7bed8e;
    }
    </style>
    <h1>Monthly progress report</h1>
    {% if scores %}
    <h3>These are the scores for quizzes you attempted this month</h3>
    <table>
    <tr>
    <th>Quiz name</th>
    <th>Date of attempt</th>
    <th>Time taken</th>
    <th>Obtained score</th>
    <th>Total score</th>
    </tr>
    {% for s in scores %}
    <tr>
    <td>{{ s.q_name }}</td>
    <td>{{ s.attempt_date }}</td>
    <td>{{ s.attempt_time }}</td>
    <td>{{ s.obtained_score }}</td>
    <td>{{ s.total_score }}</td>
    </tr>
    {% endfor %}
    </table>
    <p>Keep up the work!</p>
    {% else %}
    <p>No quizzes attempted recently :&#40;</p>
    {% endif %}
    """
    template = Template(temp)
    content = template.render(scores=scores)
    msg.attach(MIMEText(content, 'html'))
    
    with smtplib.SMTP(host=SMTP_SERVER, port=SMTP_PORT) as client:
        client.send_message(msg)
        client.quit()





