from flask import Flask, Blueprint, request
import psycopg2
from passlib.hash import argon2
import bcrypt
from flask_login import current_user, login_user, logout_user, login_required
import os

ucp = Blueprint('updateCandidateProfileInfo', __name__)

@ucp.route("/api/updateCandidateProfileInfo", methods=["PUT"])
@login_required
def updateCandidateProfileInfo():
    try:
        database = psycopg2.connect(user = "bylinkvsjtfdia", password = "b441303bb98c6533e96fa5c476852dcc067180f3a036d5bde62d61e9c5f19d5f", host= os.getenv('DATABASE_IP', "172.17.0.1") , port = "5432", database = "dauhmnvct04jp4")
        if database:
            cursor = database.cursor()
            response = dict()
            data = request.get_json()

            if current_user.is_authenticated():

                candidateSchool = data['candidate_school']
                candidateHighestLevelOfEducation = data['candidate_highest_level_of_education']
                candidateDescription = data['candidate_description']
                candidateCurrentPosition = data['candidate_current_position']
                
                nameOfInterest1 = data['name_of_interest_1']
                isDeleted1 = data['is_deleted_1']
                nameOfInterest2 = data['name_of_interest_2']
                isDeleted2 = data['is_deleted_2']
                nameOfInterest3 = data['name_of_interest_3']
                isDeleted3 = data['is_deleted_3']
                
                currentUserId = current_user.get_id()

                if currentUserId:
                    cursor.execute(f"""SELECT interest_id FROM public."Candidate Interests" WHERE user_id = '{currentUserId}'""")
                    queryResult = cursor.fetchall()
                
                    cursor.execute(f"""UPDATE public."Candidate Information" SET user_id={currentUserId}, candidate_school='{candidateSchool}', candidate_highest_level_of_education='{candidateHighestLevelOfEducation}', candidate_description='{candidateDescription}', candidate_current_position='{candidateCurrentPosition}', is_candidate_profile_deleted={False} WHERE user_id={currentUserId}""")
                    database.commit()
                    cursor.execute(f"""UPDATE public."Candidate Interests" SET user_id={currentUserId}, name_of_interest='{nameOfInterest1}', is_deleted={isDeleted1} WHERE interest_id={queryResult[0][0]}""")
                    database.commit()
                    cursor.execute(f"""UPDATE public."Candidate Interests" SET user_id={currentUserId}, name_of_interest='{nameOfInterest2}', is_deleted={isDeleted2} WHERE interest_id={queryResult[1][0]}""")
                    database.commit()
                    cursor.execute(f"""UPDATE public."Candidate Interests" SET user_id={currentUserId}, name_of_interest='{nameOfInterest3}', is_deleted={isDeleted3} WHERE interest_id={queryResult[2][0]}""")
                    database.commit()
                    response['status'] = True
                    response['status_info'] = 'Candidate Profile Info Updated Successfully'
        else:
            error = "Connection To Database Failed!"
            response['error'] = error
            raise Exception(response)
    except Exception:
        return response, 400
    
    return response
