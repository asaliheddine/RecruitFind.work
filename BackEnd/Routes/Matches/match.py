from flask import Flask, Blueprint, request, make_response
import psycopg2
import traceback
from flask_login import current_user, login_user, logout_user, login_required

mat = Blueprint('match', __name__)

@mat.route("/api/match", methods=["POST"])
@login_required
def storeQuery():
    try:
        database = psycopg2.connect(user = "postgres", password = "htrvvC56nb02kqtA", host= "34.66.114.193", port = "5432", database = "recruitfindwork")
        if database:
            cursor = database.cursor()
            response = dict()
            data = request.get_json()

            if current_user.is_authenticated:
                candidateEmail = data['candidate_email']

                if len(candidateEmail) == 0:
                    error = "Candidate Email Needs Value!"
                    response["error"] = error
                    raise Exception(response)

                queryId = data['query_id']
                
                currentRecruiterId = current_user.get_id()

                cursor.execute(f"""SELECT user_id FROM public."Personal Information" WHERE email='{candidateEmail}'""")
                
                candidateId = cursor.fetchone()[0]


                status = 'PENDING'

                if currentRecruiterId:
                    cursor.execute(f"""INSERT INTO public."Matches" (candidate_id, recruiter_id, status, query_id, is_viewed, is_recruiter_deleted, is_candidate_deleted) VALUES ({candidateId}, {currentRecruiterId}, '{status}', {queryId}, {False}, {False}, {False})""")
                    database.commit()
                    
                    response['status'] = True
                    response['status_info'] = 'Match Created Successfully!'
                
        else:
            error = "Connection To Database Failed!"
            response['error'] = error
            raise Exception(response)

    except Exception:
        print(traceback.format_exc())
        return response, 400
    return response