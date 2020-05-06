from flask import Flask, Blueprint, request
import psycopg2

fce = Blueprint('fetchCandidateExperiences', __name__)

@fce.route("/api/fetchCandidateExperiences", methods=["GET"])
def fetchCandidateExperiences():
    try:
        database = psycopg2.connect(user = "postgres", password = "htrvvC56nb02kqtA", host= "34.66.114.193", port = "5432", database = "recruitfindwork")
        if database:
            cursor = database.cursor()
            response = dict()

            token = request.cookies.get('token')

            if token == None:
                error = "User Not Authenticated!"
                response['error'] = error
                raise Exception(response)

            cursor.execute(f"""SELECT user_id FROM public."Personal Information" WHERE token='{token}'""")

            currentUserId = cursor.fetchone()[0]

            if currentUserId:
                cursor.execute(f"""SELECT experience_id, role_title, description, start_date, end_date, present, is_deleted FROM public."Candidate Experiences" WHERE user_id={currentUserId} AND is_deleted={False}""")
                queryResult = cursor.fetchall()

                if len(queryResult) != 0:
                    print("in hiay!")
                    if len(queryResult) == 1:
                        experienceId1 = queryResult[0][0]
                        cursor.execute(f"""SELECT role_title, description, start_date, end_date, present, is_deleted FROM public."Candidate Experiences" WHERE experience_id={experienceId1}""")
                        queryResultFromExperienceId = cursor.fetchall()
                        constructExperienceResponse(response, queryResultFromExperienceId[0], '1')

                        cursor.execute(f"""SELECT role_title, description, start_date, end_date, present, is_deleted FROM public."Candidate Experiences" WHERE user_id={currentUserId} AND is_deleted={True}""")
                        queryResultForDeletedLinks = cursor.fetchall()
                        constructExperienceResponse(response, queryResultForDeletedLinks[0], '2')
                        constructExperienceResponse(response, queryResultForDeletedLinks[1], '3')
                        constructExperienceResponse(response, queryResultForDeletedLinks[2], '4')
                        constructExperienceResponse(response, queryResultForDeletedLinks[3], '5')
                    elif len(queryResult) == 2:
                        experienceId1 = queryResult[0][0]
                        experienceId2 = queryResult[1][0]
                        cursor.execute(f"""SELECT role_title, description, start_date, end_date, present, is_deleted FROM public."Candidate Experiences" WHERE experience_id={experienceId1} OR experience_id={experienceId2}""")
                        queryResultFromExperienceId = cursor.fetchall()
                        constructExperienceResponse(response, queryResultFromExperienceId[0], '1')
                        constructExperienceResponse(response, queryResultFromExperienceId[1], '2')

                        cursor.execute(f"""SELECT role_title, description, start_date, end_date, present, is_deleted FROM public."Candidate Experiences" WHERE user_id={currentUserId} AND is_deleted={True}""")
                        queryResultForDeletedLinks = cursor.fetchall()
                        constructExperienceResponse(response, queryResultForDeletedLinks[0], '3')
                        constructExperienceResponse(response, queryResultForDeletedLinks[1], '4')
                        constructExperienceResponse(response, queryResultForDeletedLinks[2], '5')
                    elif len(queryResult) == 3:
                        experienceId1 = queryResult[0][0]
                        experienceId2 = queryResult[1][0]
                        experienceId3 = queryResult[2][0]
                        cursor.execute(f"""SELECT role_title, description, start_date, end_date, present, is_deleted FROM public."Candidate Experiences" WHERE experience_id={experienceId1} OR experience_id={experienceId2} OR experience_id={experienceId3}""")
                        queryResultFromExperienceId = cursor.fetchall()
                        constructExperienceResponse(response, queryResultFromExperienceId[0], '1')
                        constructExperienceResponse(response, queryResultFromExperienceId[1], '2')
                        constructExperienceResponse(response, queryResultFromExperienceId[2], '3')

                        cursor.execute(f"""SELECT role_title, description, start_date, end_date, present, is_deleted FROM public."Candidate Experiences" WHERE user_id={currentUserId} AND is_deleted={True}""")
                        queryResultForDeletedLinks = cursor.fetchall()
                        constructExperienceResponse(response, queryResultForDeletedLinks[0], '4')
                        constructExperienceResponse(response, queryResultForDeletedLinks[1], '5')
                    elif len(queryResult) == 4:
                        
                        experienceId1 = queryResult[0][0]
                        experienceId2 = queryResult[1][0]
                        experienceId3 = queryResult[2][0]
                        experienceId4 = queryResult[3][0]
                        cursor.execute(f"""SELECT role_title, description, start_date, end_date, present, is_deleted FROM public."Candidate Experiences" WHERE experience_id={experienceId1} OR experience_id={experienceId2} OR experience_id={experienceId3} OR experience_id={experienceId4}""")
                        queryResultFromExperienceId = cursor.fetchall()
                        
                        constructExperienceResponse(response, queryResultFromExperienceId[0], '1')
                        constructExperienceResponse(response, queryResultFromExperienceId[1], '2')
                        constructExperienceResponse(response, queryResultFromExperienceId[2], '3')
                        constructExperienceResponse(response, queryResultFromExperienceId[3], '4')

                        cursor.execute(f"""SELECT role_title, description, start_date, end_date, present, is_deleted FROM public."Candidate Experiences" WHERE user_id={currentUserId} AND is_deleted={True}""")
                        queryResultForDeletedLinks = cursor.fetchall()
                        constructExperienceResponse(response, queryResultForDeletedLinks[0], '5')
                    else:
                        constructExperienceResponse(response, queryResult[0], '1')
                        constructExperienceResponse(response, queryResult[1], '2')
                        constructExperienceResponse(response, queryResult[2], '3')
                        constructExperienceResponse(response, queryResult[3], '4')
                        constructExperienceResponse(response, queryResult[4], '5')

                    response['status'] = True
                    response['status_info'] = 'Candidate Experiences Fetched Successfully'
                else:
                    error = "Experiences No Longer Exist!"
                    response['error'] = error
                    raise Exception(response)
            else:
                error = "Invalid Token!"
                response['error'] = error
                raise Exception(response)
        else:
            error = "Connection To Database Failed!"
            response['error'] = error
            raise Exception(response)
    except Exception:
        return response, 400
    
    return response

def constructExperienceResponse(resObj, currRow, itemId):
    role_title = 'role_title_' + itemId
    description = 'description_' + itemId
    start_date =  'start_date_' + itemId
    end_date = 'end_date_' + itemId
    present = 'present_' + itemId
    is_deleted = 'is_deleted_' + itemId

    resObj[role_title] = currRow[0]
    resObj[description] = currRow[1]
    resObj[start_date] = currRow[2]
    resObj[end_date] = currRow[3]
    resObj[present] = currRow[4]
    resObj[is_deleted] = currRow[5]