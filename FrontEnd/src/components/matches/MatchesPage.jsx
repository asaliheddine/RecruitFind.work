import React from 'react';
import Button from '@material-ui/core/Button';
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';

import MatchInfoModal from './../match_info_modal/MatchInfoModal'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper1: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    backgroundColor: '#EFEFE8',
    height: '1%',
    width: '100%',
    position: 'absolute',
    left: '-0.7%'
  },

  paper2: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: '1%',
    width: '48.32%',
    left: '0%',
    top: '10.9%',
    position: 'absolute',
    
  },
  paper3: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: '1%',
    width: '50%',
    left: '50%',
    top: '10.9%',
    position: 'absolute'
    
  },
  columns: {
    textAlign: "center"
  },
  div: {
    height: '20em',
     overflowY: 'auto',
  },
}));

const MatchesPage = (props) => {
  const classes = useStyles();
  const { matches, status } = props;
  const [ matchState, setMatchState ] = React.useState({});
  const [ isRecruiter, setIsRecruiter ] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleOpen = async (match) => {
    setOpen(true);
    setMatchState(match);
  };
  
  const handleClose = () => {
    setOpen(false);
  };

  const handleAccept = async (match_id) => {
  
    const match_id_obj = {
      "match_id": match_id
    }
  
    const acceptMatchResponse = await fetch('/api/acceptMatch', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'PUT',
      body: JSON.stringify(match_id_obj)
    });
  
    const status = acceptMatchResponse.status;
  
    if(status === 400 || status === 500){
      console.log("400 or 500 error")
    }
    else{
      console.log("successfully set match")
      document.location.reload();
    }
  }

  const handleReject = async (match_id) => {
  
    const match_id_obj = {
      "match_id": match_id
    }
  
    const rejectMatchResponse = await fetch('/api/rejectMatch', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'PUT',
      body: JSON.stringify(match_id_obj)
    });
  
    const status = rejectMatchResponse.status;
  
    if(status === 400 || status === 500){
      console.log("400 or 500 error")
    }
    else{
      document.location.reload();
    }
  }  

  return (
    <div className={classes.root}>
      <br/>
      <br/>
      <br/>
    
      <Grid container>
        <Grid item xs={12}>
          <Paper className={classes.paper1}>MATCHES</Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <div className={classes.paper2} style={{backgroundColor: '#990000'}}>PENDING</div>
        </Grid>
        <Grid item xs={12} sm={6}>
          <div className={classes.paper3} style={{backgroundColor: '#D0F0C0'}}>ACCEPTED</div>
        </Grid>
        <Grid item xs={12} sm={6} style={{backgroundColor: '#990000', left: '0%', position: 'absolute', top: '15.25%', width: '50%', height: 1000}}>
          {/* handles rendering of pending matches */}
          {
              (matches.status_info === "Candidate Has No Matches At This Time!" || Object.keys(matches).length === 0)
              ? <p key={1} style={{position: 'absolute', top: '32%', left: '37%', fontWeight: 'bold', fontSize: 30}}>No Pending Matches</p>
              : Object.keys(matches).map((match, i) => {
              
              const match_id = matches[match].match_id;
              const match_status = matches[match].match_status;
              const title = matches[match].query_info[0];
              const description = matches[match].query_info[1];
              const salary = matches[match].query_info[2];
              const date = matches[match].query_info[3];
              const recruiter_email = matches[match].recruiter_info ? matches[match].recruiter_info[0] : matches[match].candidate_info[0];
              const recruiter_firstName = matches[match].recruiter_info ? matches[match].recruiter_info[1] : matches[match].candidate_info[1]; 
              const recruiter_lastName = matches[match].recruiter_info ? matches[match].recruiter_info[2] : matches[match].candidate_info[2];
              const skills = matches[match].skills;

              return(match_status === "PENDING" ? 
                <Card key = {match_id} style={{width: '50%', position: 'absolute', left: '24%', alignItems: 'center'}}>
                  <CardContent >
                    <Typography style={{textAlign: 'center'}}> {'You matched with '}{recruiter_firstName}{" "}{recruiter_lastName}</Typography>
                    <br />
                    <Typography style={{textAlign: 'center'}}> {'Role: '}{title}</Typography>
                    <br />
                    <Typography style={{textAlign: 'center'}}> {'Description: '}{description}</Typography>
                    <br />
                    <Typography style={{textAlign: 'center'}}> {'Matched skills: '}{skills.join(', ')}</Typography>
                  </CardContent>
                  
                  <CardActions>
                    {
                      status==='candidate'
                      ? <div>
                          <Button onClick={() => handleAccept(match_id)} size="small">Accept</Button>
                          <Button onClick={() => handleReject(match_id)} size="small">Reject</Button>
                        </div>
                      : null
                    }
                    <Button style={{float: "right"}} onClick={() => handleOpen(matches[match])} size="small">More Info</Button>
                  </CardActions>
                </Card> : null
              )
            })
          }
          
        </Grid>
        <Grid item xs={12} sm={6} style={{backgroundColor: '#D0F0C0', left: '50%', position: 'absolute', top: '15.25%', width: '50%', height: 1000}}>
          {/* Handles rendering of accepted matches */}
          {
              (matches.status_info === "Candidate Has No Matches At This Time!" || Object.keys(matches).length === 0)
              ? <p key={1} style={{position: 'absolute', top: '32%', left: '38.5%', fontWeight: 'bold', fontSize: 30}}>No Accepted Matches</p>
              : Object.keys(matches).map((match, i) => {
                  const match_id = matches[match].match_id;
                  const match_status = matches[match].match_status;
                  const title = matches[match].query_info[0];
                  const description = matches[match].query_info[1];
                  const salary = matches[match].query_info[2];
                  const date = matches[match].query_info[3];
                  const recruiter_email = matches[match].recruiter_info ? matches[match].recruiter_info[0] : matches[match].candidate_info[0];
                  const recruiter_firstName = matches[match].recruiter_info ? matches[match].recruiter_info[1] : matches[match].candidate_info[1];
                  const recruiter_lastName = matches[match].recruiter_info ? matches[match].recruiter_info[2] : matches[match].candidate_info[2];
                  const skills = matches[match].skills;

                  //lmao it works
                  // console.log(match_id + match_status + title + description+
                  //   salary + date + recruiter_email+recruiter_firstName+recruiter_lastName+skills);

              return(match_status === "ACCEPTED" ? 
                <Card key = {match_id} style={{width: '50%', position: 'absolute', left: '27%', alignItems: 'center'}}>
                  <CardContent>
                    <Typography style={{textAlign: 'center'}} > {'You matched with '}{recruiter_firstName}{" "}{recruiter_lastName}</Typography>
                    <br />
                    <Typography style={{textAlign: 'center'}}> {'Role: '}{title}</Typography>
                    <br />
                    <Typography style={{textAlign: 'center'}}> {'Description: '}{description}</Typography>
                    <br />
                    <Typography style={{textAlign: 'center'}}> {'Skills: '}{skills.join(', ')}</Typography>
                    <br />
                    <Typography style={{textAlign: 'center'}}> {'Contact: '}{recruiter_email}</Typography>
                  </CardContent>
                  
                  <CardActions>
                  <Button onClick={() => handleOpen(matches[match])} size="small">More Info</Button>
                  </CardActions>
                </Card> : null
              )
            }//end map
          )
          }
        </Grid>
      </Grid>
      {open ? <MatchInfoModal open={open} close={handleClose} isrecruiter={isRecruiter} matches={matchState} status={status}/> : null}
    </div>
  )
}

export default MatchesPage;
