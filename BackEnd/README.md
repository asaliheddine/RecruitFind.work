# Developer Steps To Run The BackEnd :computer:

Make sure you're in the BackEnd Directory
To ensure the virtual environment is set up appropriately on the correct OS run:
```
python3 -m venv venv
```
if you dont have the necessary package to set up the venv
it will tell you the command to run.

Now you must activate the venv. If you are using a UNIX-based OS, type this command:
```
source venv/bin/activate
```
If on Windows, type this command:
```
venv\Scripts\activate
```
If you want to leave the virtual environment type `deactivate`

You can install all the imports so run:
```
pip install -r requirements.txt 
```
When you install new imports and need to update the requirements.txt file you can run the command below, but it may include unecessary imports, so you might want to just directly add the package to the requirements.txt in a format `name==version#`:
```
pip freeze > requirements.txt
```
Be sure to be in the venv. If you aren't in the venv the pip freeze will install all
the python packages you have ever installed on the machine, when you only want the ones installed for this project.

If you want to double check the backend is connected and running well go to http://127.0.0.1:5000/api/connection it should display `You are now connected to database: recruitfindwork with version being PostgreSQL 11.6`

To test the database locally you need to connect to the GCP instance. First make sure youre IP is added to Google SQL.
Then run the command in slack
