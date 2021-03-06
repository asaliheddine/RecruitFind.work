from flask import Flask, Blueprint, render_template, send_from_directory
import psycopg2
from flask_login import current_user, login_user, logout_user, login_required, LoginManager
import os

#Connection Route
from Routes.Connections.connection import connect

#Authentication Routes
from Routes.Authentication.register import reg
from Routes.Authentication.login import log, User
from Routes.Authentication.logout import logout
from Routes.Authentication.status import stat

#Recruiter Routes
from Routes.Recruiter.recruiterProfile import rp
from Routes.Recruiter.fetchRecruiterProfile import frp
from Routes.Recruiter.updateRecruiterProfileInfo import urp
from Routes.Recruiter.deleteRecruiterProfileInfo import drp
from Routes.Recruiter.fetchRecruiterPersonalInformation import frpi

#Candidate Routes

#Candidate Profile Routes
from Routes.Candidate.candidateProfile import cp
from Routes.Candidate.updateCandidateProfileInfo import ucp
from Routes.Candidate.fetchCandidateProfileInfo import fcp
from Routes.Candidate.deleteCandidateProfile import dcp
from Routes.Candidate.deleteCandidateInterests import dci
from Routes.Candidate.fetchCandidatePersonalInformation import fcpi
from Routes.Candidate.fetchCandidatePage import fcpage

#Candidate Link Routes
from Routes.Candidate.Links.candidateLinks import cl
from Routes.Candidate.Links.updateCandidateLinks import ucl
from Routes.Candidate.Links.fetchCandidateLinks import fcl
from Routes.Candidate.Links.deleteCandidateLinks import dcl

#Candidate Experience Routes
from Routes.Candidate.Experiences.candidateExperiences import ce
from Routes.Candidate.Experiences.updateCandidateExperiences import uce
from Routes.Candidate.Experiences.fetchCandidateExperiences import fce
from Routes.Candidate.Experiences.deleteCandidateExperiences import dce

#Candidate Skill Routes
from Routes.Candidate.Skills.candidateSkills import cs
from Routes.Candidate.Skills.deleteCandidateSkill import dcs
from Routes.Candidate.Skills.fetchCandidateSkills import fcs

#Query Routes
from Routes.Queries.query import qry
from Routes.Queries.computeQuery import cptQry
from Routes.Queries.fetchQueries import fqrys
from Routes.Queries.deleteQuery import dQry

#Match Routes
from Routes.Matches.match import mat
from Routes.Matches.fetchCandidateMatches import fcm
from Routes.Matches.fetchRecruiterMatches import frm
from Routes.Matches.acceptMatch import acm
from Routes.Matches.rejectMatch import rm

app = Flask(__name__, static_folder='build')
app.secret_key = b'Y\xf7\xec\xe3m\x99r\x19A\x9d*l[\xdd\xa1\xf9\xe7P\x8a\x88\xd7\x067<'
authenticationManager = LoginManager(app)

#Connection Blueprint
app.register_blueprint(connect)

##Authentication BluePrints
app.register_blueprint(reg)
app.register_blueprint(log)
app.register_blueprint(logout)
app.register_blueprint(stat)

#Recruiter Blueprints
app.register_blueprint(rp)
app.register_blueprint(frp)
app.register_blueprint(urp)
app.register_blueprint(drp)
app.register_blueprint(frpi)

#Candidate Blueprints

#Candidate Profile Blueprints
app.register_blueprint(cp)
app.register_blueprint(ucp)
app.register_blueprint(fcp)
app.register_blueprint(dci)
app.register_blueprint(dcp)
app.register_blueprint(fcpi)
app.register_blueprint(fcpage)

#Candidate Link Blueprints
app.register_blueprint(cl)
app.register_blueprint(ucl)
app.register_blueprint(fcl)
app.register_blueprint(dcl)

#Candidate Experience Blueprints
app.register_blueprint(ce)
app.register_blueprint(uce)
app.register_blueprint(fce)
app.register_blueprint(dce)

#Candidate Skill Blueprints
app.register_blueprint(cs)
app.register_blueprint(dcs)
app.register_blueprint(fcs)

#Query Blueprints
app.register_blueprint(qry)
app.register_blueprint(cptQry)
app.register_blueprint(fqrys)
app.register_blueprint(dQry)

#Match Blueprints
app.register_blueprint(mat)
app.register_blueprint(fcm)
app.register_blueprint(frm)
app.register_blueprint(acm)
app.register_blueprint(rm)


if __name__ == '__main__':
    app.run(debug=True)

@authenticationManager.user_loader
def load_user(id):
    try:
        database = psycopg2.connect(user = "bylinkvsjtfdia", password = "b441303bb98c6533e96fa5c476852dcc067180f3a036d5bde62d61e9c5f19d5f", host= os.getenv('DATABASE_IP', "172.17.0.1") , port = "5432", database = "dauhmnvct04jp4")
        if database:
            response = dict()
            cursor = database.cursor()
            cursor.execute(f"""SELECT user_id from public."Personal Information" WHERE email='{id}'""")
            result = cursor.fetchone()
            
            if result == None:
                return None
            else:
                return User(result[0])
        else:
            error = "Connection To Database Failed!"
            response['error'] = error
            raise Exception(response)
    except Exception:
        return response, 400



@app.route('/', defaults={'path': ''}, methods=['GET']) 
@app.route('/<path:path>')
def index(path):     
    if path != "" and os.path.exists(app.static_folder + '/' + path):         
        return send_from_directory(app.static_folder, path)     
    return send_from_directory(app.static_folder, 'index.html')



