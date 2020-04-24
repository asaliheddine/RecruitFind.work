from flask import Flask, Blueprint, request
import psycopg2
from passlib.hash import argon2
import bcrypt

database = psycopg2.connect(user = "postgres", password = "htrvvC56nb02kqtA", host= "34.66.114.193", port = "5432", database = "recruitfindwork")

#creates a cursor object to execute PostgreSQL commands via python
cursor = database.cursor()

ce = Blueprint('candidateExperiences', __name__)

@ce.route("/api/candidateExperiences", methods=["POST"])
def setCandidateExperiences():
    response = dict()
    data = request.get_json()

    token = request.cookies.get('token')
    print("this is the token from broswer: ", token)

    roleTitle1 = data['role_title_1']
    description1 = data['description_1']
    startDate1 = data['start_date_1']
    endDate1 = data['end_date_1']
    present1 = data['present_1']

    roleTitle2 = data['role_title_2']
    description2 = data['description_2']
    startDate2 = data['start_date_2']
    endDate2 = data['end_date_2']
    present2 = data['present_2']

    roleTitle3 = data['role_title_3']
    description3 = data['description_3']
    startDate3 = data['start_date_3']
    endDate3 = data['end_date_3']
    present3 = data['present_3']

    roleTitle4 = data['role_title_4']
    description4 = data['description_4']
    startDate4 = data['start_date_4']
    endDate4 = data['end_date_4']
    present4 = data['present_4']

    roleTitle5 = data['role_title_5']
    description5 = data['description_5']
    startDate5 = data['start_date_5']
    endDate5 = data['end_date_5']
    present5 = data['present_5']
    
    cursor.execute(f"""SELECT user_id FROM public."Personal Information" WHERE token='{token}'""")

    currentUserId = cursor.fetchone()[0]
    print("this is the user's id: ", currentUserId)

    if currentUserId:
        cursor.execute(f"""INSERT INTO public."Candidate Experiences" (user_id, role_title, description, start_date, end_date, present, is_deleted) VALUES ('{currentUserId}', '{roleTitle1}', '{description1}', '{startDate1}', '{endDate1}', '{present1}', '{False}')""")
        database.commit()
        cursor.execute(f"""INSERT INTO public."Candidate Experiences" (user_id, role_title, description, start_date, end_date, present, is_deleted) VALUES ('{currentUserId}', '{roleTitle2}', '{description2}', '{startDate2}', '{endDate2}', '{present2}', '{False}')""")
        database.commit()
        cursor.execute(f"""INSERT INTO public."Candidate Experiences" (user_id, role_title, description, start_date, end_date, present, is_deleted) VALUES ('{currentUserId}', '{roleTitle3}', '{description3}', '{startDate3}', '{endDate3}', '{present3}', '{False}')""")
        database.commit()
        cursor.execute(f"""INSERT INTO public."Candidate Experiences" (user_id, role_title, description, start_date, end_date, present, is_deleted) VALUES ('{currentUserId}', '{roleTitle4}', '{description4}', '{startDate4}', '{endDate4}', '{present4}', '{False}')""")
        database.commit()
        cursor.execute(f"""INSERT INTO public."Candidate Experiences" (user_id, role_title, description, start_date, end_date, present, is_deleted) VALUES ('{currentUserId}', '{roleTitle5}', '{description5}', '{startDate5}', '{endDate5}', '{present5}', '{False}')""")
        database.commit()
        response['status'] = True
        response['status_info'] = 'Candidate Experiences Stored Successfully'
    else:
        response['status'] = False
        response['status_info'] = 'Invalid token!'
    
    return response