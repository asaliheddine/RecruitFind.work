from flask import Flask, Blueprint, request
import psycopg2
from flask_login import current_user, login_user, logout_user, login_required
import os

dcl = Blueprint('deleteCandidateLinks', __name__)

@dcl.route("/api/deleteCandidateLinks", methods=["PUT"])
@login_required
def deleteCandidateLinks():
    try:
        database = psycopg2.connect(user = "bylinkvsjtfdia", password = "b441303bb98c6533e96fa5c476852dcc067180f3a036d5bde62d61e9c5f19d5f", host= os.getenv('DATABASE_IP', "172.17.0.1") , port = "5432", database = "dauhmnvct04jp4")
        if database:
            cursor = database.cursor()
            response = dict()
            data = request.get_json()

            if current_user.is_authenticated():

                isDeleted1 = data['is_deleted_1']
                isDeleted2 = data['is_deleted_2']
                isDeleted3 = data['is_deleted_3']

                currentUserId = current_user.get_id()

                if currentUserId:
                    cursor.execute(f"""SELECT link_id FROM public."Candidate Links" WHERE user_id = '{currentUserId}'""")
                    queryResult = cursor.fetchall()

                    cursor.execute(f"""UPDATE public."Candidate Links" SET is_deleted='{isDeleted1}' WHERE link_id={queryResult[0][0]}""")
                    database.commit()
                    cursor.execute(f"""UPDATE public."Candidate Links" SET is_deleted='{isDeleted2}' WHERE link_id={queryResult[1][0]}""")
                    database.commit()
                    cursor.execute(f"""UPDATE public."Candidate Links" SET is_deleted='{isDeleted3}' WHERE link_id={queryResult[2][0]}""")
                    database.commit()
                    response['status'] = True
                    response['status_info'] = 'The Appropriate Candidate Links Were Deleted Successfully'
                
        else:
            error = "Connection To Database Failed!"
            response['error'] = error
            raise Exception(response)
    except Exception:
        return response, 400

    return response