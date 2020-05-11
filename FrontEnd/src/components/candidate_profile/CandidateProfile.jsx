import React, { Component } from 'react';
import NavigationBarCandidate from './navigation_bar_candidate/NavigationBarCandidate'
import { Redirect } from 'react-router-dom';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

class CandidateProfile extends Component {
  constructor(props){
    super(props)
    this.state = {
      didRegister: true,
      profileInterests: [],
      experiences: [],
      profileLinks: [],

      is_logged_in: true,

      candidate_current_position: "",
      candidate_description: "",
      candidate_highest_level_of_education: "",
      candidate_school: "",
      name_of_interest_1: "",
      name_of_interest_2: "",
      name_of_interest_3: "",
      interest_count: 1,

      link_count: 1,
      link_1: "",
      link_2: "",
      link_3: "",
      type_of_link_1: "",
      type_of_link_2: "",
      type_of_link_3: "",

      count: 1,
      check_state: false,
      description_1: "",
      description_2: "",
      description_3: "",
      description_4: "",
      description_5: "",
      end_date_1: "",
      end_date_2: "",
      end_date_3: "",
      end_date_4: "",
      end_date_5: "",
      present_1: false,
      present_2: false,
      present_3: false,
      present_4: false,
      present_5: false,
      role_title_1: "",
      role_title_2: "",
      role_title_3: "",
      role_title_4: "",
      role_title_5: "",
      start_date_1: "",
      start_date_2: "",
      start_date_3: "",
      start_date_4: "",
      start_date_5: "",

      skill_count:0,
      skills: [],
      old_skills: [],
      delete_skills: [],
      skill_1: "",
      skill_2: "",
      skill_3: "",
      skill_4: "",
      skill_5: "",
      skill_6: "",
      skill_7: "",
      skill_8: "",
      skill_9: "",
      skill_10: "",

      email: "",
      first_name: "",
      gender: "",
      last_name: "",
      personal_city: "",
      personal_country: "",
      personal_postal: 0,
      personal_state: "",
      personal_street_address: "",
      phone_number: "",
      status: "Candidate",

      // Edits
      skills_edit: false,
      experiences_edit: false,
      links_edit: false,
      candidate_edit: false,
    }
  }
  
  // in order to dynamizally create fields and options
  educationLevels = ['Some High School', 'High School Graduate/GED', 'Some College', "Associates Degree", "Bachelors Degree", "Masters Degree", "Doctoral or Professional Degree"]

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  } 

  // CANDIDATE PROFILE INFO ––––––––––––––––––
  fetchCandidateInfo = async () => {
    const response = await fetch('/api/fetchCandidateProfileInfo')
    const status = response.status;
    
    if(status >= 400) {
      const result = await response.json();
      console.log(result);
      if(result.error === 'Candidate Profile Does Not Exist!'){
        this.setState({
          didRegister: false
        })
      }
      else{
        this.setState({
          is_logged_in: false
        }, () => {(alert("There is an error in getting candidate porfile information"))});
      }
    } else {
      const result = await response.json();

      this.setState({
        candidate_current_position: result.candidate_current_position,
        candidate_description: result.candidate_description,
        candidate_highest_level_of_education: result.candidate_highest_level_of_education,
        candidate_school: result.candidate_school,
        name_of_interest_1: result.is_deleted_1,
        name_of_interest_2: result.is_deleted_2,
        name_of_interest_3: result.is_deleted_3,
      }, () => {
        //ensure object contianing number of interests is empty before pushing into it
        if(this.state.profileInterests){
          this.state.profileInterests = [];
        }
        // ensure we render appropriate number of interests in view
        this.checkNumberOfInterests();
      })
    }
  }

  fetchCandidatePersonalInfo = async () => {
    try{
      let response = await fetch('/api/fetchCandidatePersonalInformation', {
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'GET'
      });
      let status = response.status;
      let result = await response.json();
      if(status>= 400){
        throw Error(alert('There is an error in getting candidate Personal Information'))
      }else{
        console.log(result)
        const{email, first_name, gender, last_name, personal_city, personal_country ,personal_postal, personal_state, personal_street_address, phone_number} = result;
        this.setState({
          email:email,
          first_name: first_name,
          gender: gender,
          last_name: last_name,
          personal_city: personal_city,
          personal_country: personal_country,
          personal_postal: personal_postal,
          personal_state: personal_state,
          personal_street_address: personal_street_address,
          phone_number:phone_number,
        })
      }
    }catch(error){
      console.log(error);
    }
  }

  checkNumberOfInterests = () => {
    const temp = [];
    for(let i = 1; i < 4; i++) {
      if(this.state[`name_of_interest_${i}`].length > 0){
        temp.push(1);
      }
    }
    this.setState({
      profileInterests: temp
    })
  }

  // CANDIDATE EXPERIENCES –––––––––––––––––––
  fetchCandidateExperiences = async () => {
    const response = await fetch('/api/fetchCandidateExperiences');
    const status = response.status;

    if(status >= 400) {
      throw Error(alert('There is an error in getting candidate experiences information'))
    } else {
      const result = await response.json();
      for(let i = 1; i <= 5; i++){
        this.setState({
          [`description_${i}`]: result[`description_${i}`],
          [`end_date_${i}`]: result[`end_date_${i}`],
          [`present_${i}`]: result[`present_${i}`],
          [`role_title_${i}`]: result[`role_title_${i}`],
          [`start_date_${i}`]: result[`start_date_${i}`]
        })
      }
      //ensure object contianing number of experienes is empty before pushing into it
      if(this.state.experiences){
        this.state.experiences = [];
      }
      this.checkNumberOfExperiences();
    }
  }

  checkNumberOfExperiences =  () => {
    const temp = [];
    for(let i = 1; i < 6; i++) {
      if(this.state[`description_${i}`].length > 0){
        temp.push(1);
      }
    }
    this.setState({
      experiences: temp
    })
  }

  // Candidate Skills ––––––––––––––––––––––––
  fetchCandidateSkills = async () => {
    const response = await fetch ('/api/fetchCandidateSkills')
    const status = response.status;
    if(status >= 400){
      throw Error(alert('There is an error in getting candidate experiences information'));
    }
    else {
      if(this.state.skills){
        this.setState({
          skills: []
        })
      }
      this.setState({
        delete_skills: []
      })
      const result = await response.json();
      if(result.status_info === 'User Has No Skills!'){
        alert(result.status_info);
      }
      const values = Object.values(result);
      for(let i=1; i <= values.length/2; i++){
        this.setState({
          skills: [...this.state.skills, result[`skill_${i}`]]
        })
      }
    }
  }

  // Candidate Links –––––––––––––––––––––––––
  fetchCandidateLinks = async () => {
    const response = await fetch('/api/fetchCandidateLinks');
    const status = response.status;
    const result = await response.json();

    if(status >= 400){
      throw Error(result.error);
    } else {
      for(let i = 1; i < 4; i++){
        this.setState({
          [`link_${i}`]: result[`link_${i}`],
          [`type_of_link_${i}`]: result[`type_of_link_${i}`],
        })
      }
      //ensure object contianing number of links is empty before pushing into it
      if(this.state.profileLinks){
        this.state.profileLinks = [];
      }
      this.checkNumberOfLinks();
    }
  }

  checkNumberOfLinks = () =>{
    const temp = [];
    for(let i = 1; i < 4; i++) {
      if(this.state[`link_${i}`].length > 0){
        temp.push(1);
      }
    }
    this.setState({
      profileLinks: temp
    })
  }

  componentDidMount = async () => {
    try {
      await this.fetchCandidateInfo();
      await this.fetchCandidateLinks();
      await this.fetchCandidateExperiences();
      await this.fetchCandidateSkills();
      await this.fetchCandidatePersonalInfo();
      this.oldState = this.state;
    } catch(error) {
      console.log(error)
    }
  }

  // change from view to edit mode for specific section of the profile
  handleEditClick = (event) => {
    event.preventDefault();
    this.setState({
      [event.target.name]: !this.state[event.target.name],
    })
  }

  handleEditCancel = async (event) => {
    event.preventDefault();
    if(event.target.name === 'skills_edit') {
      this.fetchCandidateSkills();
    } else if(event.target.name === 'experiences_edit') {
      this.fetchCandidateExperiences();
    } else if(event.target.name === 'links_edit') {
      this.fetchCandidateLinks();
    } else if(event.target.name === 'candidate_edit') {
      this.fetchCandidateInfo();
    }
    this.setState({
      [event.target.name]: !this.state[event.target.name],
    })
  }

  renderEndDate = (number) => {
    let end_date= `end_date_${number}`;
    let present= `present_${number}`;
    if(this.state[present]){
      return (
        <div>
          <input type='checkbox' name={present} checked onClick={this.handleCheckBox}/>
          <label>Present</label>
        </div>
      )
    }
    else{
      return (
        <div className='unchecked'>
          <input type='date' name={end_date} onChange={this.handleChange}/>
          <br/>
          <input type='checkbox' name={present} onClick={this.handleCheckBox}/>
          <label>Present</label>
        </div>
      )
    }
  }

  renderViewEndDate = (number) => {
    let end_date= `end_date_${number}`;
    let present= `present_${number}`;
    if(this.state[present]){
      return (
        <div>Currently Working</div>
      )
    }
    else{
      return (
        <div className='unchecked'>
          <span> End Date: {this.state[end_date]}</span>
        </div>
      )
    }
  }
  
  handleCandidateProfileSubmission = async () => {
    const candidateProfile = {
      "candidate_school": this.state.candidate_school,
      "candidate_highest_level_of_education": this.state.candidate_highest_level_of_education,
      "candidate_description": this.state.candidate_description,
      "candidate_current_position": this.state.candidate_current_position,
      "is_candidate_profile_deleted": false,
      "name_of_interest_1": this.state.name_of_interest_1,
      "is_deleted_1": false,
      "name_of_interest_2": this.state.name_of_interest_2,
      "is_deleted_2": false,
      "name_of_interest_3": this.state.name_of_interest_3,
      "is_deleted_3": false,
      "email" : this.state.email,
      "first_name": this.state.first_name,
      "gender": this.state.gender,
      "last_name": this.state.last_name,
      "personal_city": this.state.personal_city,
      "personal_country": this.state.personal_country,
      "personal_postal": this.personal_postal,
      "personal_state": this.personal_state,
      "personal_street_address": this.personal_street_address,
      "phone_number": this.phone_number,
    }

    const response = await fetch('/api/updateCandidateProfileInfo', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'PUT',
      body: JSON.stringify(candidateProfile)
    })

    const status = response.status;

    if(status === 400 || status === 500){
      alert("Fix your candidate profile information");
      return;
    }
    else { 
      this.setState({
        candidate_edit: !this.state.candidate_edit
      })
    }
  }

  handleCheckBox = (event) => {
    const data = event.target.name;
    const value = `end_date_${event.target.name[event.target.name.length-1]}`;
    this.setState({
      [event.target.name]: !this.state[event.target.name],
      check_state: true
    }, () => {
      if(this.state[data] === true){
        this.setState({
          [value]: ''
        })
      }
    })
  }
  
  renderEndDate = (number) => {
    let end_date= `end_date_${number}`;
    let present= `present_${number}`;
    if(this.state[present]){
      return (
        <div>
          <input type='checkbox' name={present} checked onClick={this.handleCheckBox}/>
          <label>Present</label>
        </div>
      )
    }
    else{
      return (
        <div className='unchecked'>
          <input type='date' name={end_date} onChange={this.handleChange} value={this.state[end_date]}/>
          <br/>
          <input type='checkbox' name={present} onClick={this.handleCheckBox}/>
          <label>Present</label>
        </div>
      )
    }
  }

  increaseNumberOfExperiences = (event) => {
    event.preventDefault();
    // ensure cant increase unless previous one is filled
    if(this.state[`role_title_${this.state.experiences.length}`] === '' || this.state[`description_${this.state.experiences.length}`] === '' || this.state[`start_date_${this.state.experiences.length}`] === '' || ((this.state[`end_date_${this.state.experiences.length}`] === '' && this.state[`present_${this.state.experiences.length}`] === false))){
      alert(`Please fill in Experience ${this.state.experiences.length}`);
      return;
    }
    if(this.state.experiences.length <5 ){
      this.state.experiences.push(1);
      this.setState({
        count: this.state.count + 1
      });
    }
    else {
      return(alert("No more than 5 allowed"));
    }
  }

  deleteRecentExperience = (event) => {
    event.preventDefault();
    const size = this.state.experiences.length;
    const description = `description_${size}`;
    const title = `role_title_${size}`;
    const start_date = `start_date_${size}`;
    const end_date = `end_date_${size}`;
    const present = `present_${size}`;

    // to change display and delete one experience field
    this.state.experiences.pop();

    this.setState({
      [description]: '',
      [title]: '',
      [start_date]: '',
      [end_date]: '',
      [present]: false,
      count: this.state.count -1
    }) 
  }

  increaseLinks = (event) => {
    event.preventDefault();
    if(this.state[`link_${this.state.profileLinks.length}`] === '' || this.state[`type_of_link_${this.state.profileLinks.length}`] === '' ){
      alert(`Please fill in link ${this.state.profileLinks.length}`);
      return;
    }
    if(this.state.profileLinks.length <= 3){
      this.state.profileLinks.push(1);
      this.setState({
        link_count: this.state.link_count + 1
      });
    }
    else{
      return (alert("No more then 3 links allowed"));
    }
  }

  deleteRecentLink = (event) => {
    event.preventDefault();
    const size = this.state.profileLinks.length;
    const link =`link_${size}`;
    const type_of_link = `type_of_link_${size}`;

    this.state.profileLinks.pop();

    this.setState({
      [link]: '',
      [type_of_link]: '',
      link_count: this.state.link_count - 1
    });
  }

  increaseInterests = (event) => {
    event.preventDefault();
    if(this.state[`name_of_interest_${this.state.profileInterests.length}`] === ''){
      alert(`Please fill in interest ${this.state.profileInterests.length}`);
      return;
    }
    if(this.state.profileInterests.length <= 3) {
      this.state.profileInterests.push(1);
      this.setState({
        interest_count: this.state.interest_count + 1
      });
    }
    else{
      return (alert("No more then 3 interests allowed"));
    }
  }

  deleteRecentInterest = (event) => {
    event.preventDefault();
    const size = this.state.profileInterests.length;
    const interest = `name_of_interest_${size}`;

    this.state.profileInterests.pop();

    this.setState({
      [interest]: '',
      interest_count: this.state.interest_count - 1
    });
  }

  modifySkill = (event, value, type) => {
    // value contains the selected inputs over time
    if(type === 'remove-option'){
      let difference = this.state.skills.filter(x => !value.includes(x));
      this.setState({ 
        delete_skills: [...this.state.delete_skills, difference[0]],
        // skill_count: this.state.skill_count - 1,
        skills: value,
        // skill_options: []
      });
    } else if(this.state.skills.length >= 10){
      // event.target.value='';
      return alert('Only 10 allowed');
    } else if((type === 'create-option') && this.state.skills.length < 10){
      var data = event.target.value.toLowerCase();
      if(this.state.skills && (this.state.skills.filter(currentValue=>data===currentValue).length > 0)){
        return;
      }
      this.setState({ 
        // skill_count: this.state.skill_count + 1,
        skills: [...this.state.skills, value[value.length-1].toLowerCase()],
        // skill_options: []
      });
    } else {
      return;
    }

    // delete previous optins so they dont appear again
    // this.setState({
    //   skill_options: []
    // })    
  }
  
  handleLinkSubmission = async () => {
    const links = {
      "type_of_link_1": this.state.type_of_link_1,
      "link_1": this.state.link_1,
      "is_deleted_1": false,
      "type_of_link_2": this.state.type_of_link_2,
      "link_2": this.state.link_2,
      "is_deleted_2": false,
      "type_of_link_3": this.state.type_of_link_3,
      "link_3": this.state.link_3,
      "is_deleted_3": false
    }
    // checking if the data is paired properly {link type, and link}
    for(let i = 1; i <= 3; i++){
      if(this.state[`type_of_link_${i}`].length > 0 || this.state[`link_${i}`].length > 0){
        if(!(this.state[`type_of_link_${i}`].length > 0 && this.state[`link_${i}`].length > 0)){
          (alert('Please fill in both fields for your links'));
          return;
        }
      }
    }

    const response = await fetch('/api/updateCandidateLinks', {
      headers: {
        'Accept': 'application/json',
        "Content-Type": 'application/json'
      },
      method: 'PUT',
      body: JSON.stringify(links)
    });

    const status = response.status;

    if(status === 400 || status === 500){
      alert("Please fix your links");
      return;
    }
    else{
      this.setState({
        links_edit: false,
      });
    }
  }

  handleExperiencesSubmission = async () => {    
    const experiencess = {
      "role_title_1": this.state.role_title_1,
      "description_1": this.state.description_1,
      "start_date_1": this.state.start_date_1,
      "end_date_1": this.state.end_date_1,
      "present_1": this.state.present_1,
      "is_deleted_1": false,
      
      "role_title_2": this.state.role_title_2,
      "description_2": this.state.description_2,
      "start_date_2": this.state.start_date_2,
      "end_date_2": this.state.end_date_2,
      "present_2": this.state.present_2,
      "is_deleted_2": false,
      
      "role_title_3": this.state.role_title_3,
      "description_3": this.state.description_3,
      "start_date_3": this.state.start_date_3,
      "end_date_3": this.state.end_date_3,
      "present_3": this.state.present_3,
      "is_deleted_3": false,
      
      "role_title_4": this.state.role_title_4,
      "description_4": this.state.description_4,
      "start_date_4": this.state.start_date_4,
      "end_date_4": this.state.end_date_4,
      "present_4": this.state.present_4,
      "is_deleted_4": false,
      
      "role_title_5": this.state.role_title_5,
      "description_5": this.state.description_5,
      "start_date_5": this.state.start_date_5,
      "end_date_5": this.state.end_date_5,
      "present_5": this.state.present_5,
      "is_deleted_5": false
    }

    for(let i = 1; i <= this.state.experiences.length; i++){
      // Need to ensure that end date empty if present is true
      if(this.state[`present_${i}`] === true){
        this.setState({
          [`end_date_${i}`]: ''
        })
      }
      if (this.state[`role_title_${i}`].length > 0 || this.state[`description_${i}`].length > 0 || this.state[`start_date_${i}`].length > 0 || this.state[`end_date_${i}`].length > 0 || this.state[`present_${i}`] === true){
        if (this.state[`role_title_${i}`].length > 0 && this.state[`description_${i}`].length > 0 && this.state[`start_date_${i}`].length > 0 && (this.state[`end_date_${i}`].length > 0 || this.state[`present_${i}`] === true)){
          if(this.state[`end_date_${i}`].length > 0 && this.state[`end_date_${i}`]<this.state[`start_date_${i}`]){
            alert('End Date must be after Start Date');
            return;
          }
          continue;
        }  
        else {
          alert(`Please fill out all the fields in Experience ${i}`);
          return;
        }
      }
      if (this.state[`role_title_${i}`].length === 0 && this.state[`description_${i}`].length === 0 && this.state[`start_date_${i}`].length === 0 && (this.state[`end_date_${i}`].length === 0 || this.state[`present_${i}`] === true)){
        alert("Please delete experience using -")
        return;
      }
    }
    const response = await fetch('/api/updateCandidateExperiences', {
      headers: {
        'Accept': 'application/json',
        "Content-Type": 'application/json'
      },
      method: 'PUT',
      body: JSON.stringify(experiencess)
    });

    const status = response.status;
    // const result = await response.json();

    if(status === 400 || status === 500){
      alert("Fix Experiences");
      return;
    }
    else{
      this.setState({
        experiences_edit: false,
      })
    }
  }

  handleSkillSubmission = async () => {
    if(!this.state.skills || this.state.skills.length < 1){
      return(alert("Please enter atleast one skill"));
    }
    // delete skills first before updates
    for(let i = 0; i < this.state.delete_skills.length; i++){
      const skill = {
        "skill": this.state.delete_skills[i].toLowerCase(),
        "is_deleted": true
      }
      const response = await fetch('/api/deleteCandidateSkill',{
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'PUT',
        body: JSON.stringify(skill)
      })
      
      const status = response.status;

      if(status >= 400) {
        continue;
      }
      else{
        this.setState({
          skills_edit: false,
        })
      }
    }
    // add skills
    for(let i = 0; i < this.state.skills.length; i++){
      const skill = {
        "skill": this.state.skills[i].toLowerCase(),
        "is_deleted": false
      }
      const response = await fetch('/api/candidateSkills',{
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(skill)
      })
      
      const status = response.status;
      const result = await response.json();

      if(status >= 400) {
        if(!result.status_info === 'Candidate Already Has That Skill!'){
          console.log(result);
        }
        else{
          console.log(`Candidate already has skill ${this.state.skills[i]}`);
        }
      }
      else{
        this.setState({
          skills_edit: false,
        })
      }
    }
    //ensure no skills left to be deleted in state
    this.setState({
      delete_skills: []
    })
    
  }

  updateLogout = () => {
    this.setState({
      is_logged_in: false
    })
  }

  render() {
    return (
      <div className='candidate_profile'>
        <NavigationBarCandidate updateLogout={this.updateLogout}/>
        {
          this.state.didRegister 
          ? null
          : <Redirect to='/candidate_register_profile'/>
        }
        {/* handle logout */}
        {
          this.state.is_logged_in
          ? null
          : <Redirect to='/'/>
        }
        {/* candidate data */}
        {
          this.state.candidate_edit
          ? <div className='edit_candidate_profile'>
              <label> Current Position </label>
              <input name='candidate_current_position' onChange={this.handleChange} value={this.state.candidate_current_position}/>
                <br/>
              <label> Description </label>
              <input name='candidate_description' onChange={this.handleChange} value={this.state.candidate_description}/>
                <br/>
              <label> School </label>
              <input name='candidate_school' onChange={this.handleChange} value={this.state.candidate_school}/>
              <select name='candidate_highest_level_of_education' onChange={this.handleChange}>
                <option value="none" hidden>Select your education level</option> 
                {this.educationLevels.map((educationLevel) => {
                  return (
                    <option key={educationLevel} value={educationLevel}> {educationLevel}</option>
                  )
                })}
                <option value='other'>Other</option>
              </select>
              <label> Interests (Note not all of them have to be filled)</label>
              <div>
                {
                  this.state.profileInterests.map((interest, index) => {
                    return (
                      <input key={index+1} name={`name_of_interest_${index+1}`} onChange={this.handleChange} value={this.state[`name_of_interest_${index+1}`]}/>
                      )
                  })
                }
              </div>
              {/* Button to add another interest */}
              {
                (this.state.profileInterests.length < 3)
                ? <button onClick={this.increaseInterests}>+</button>
                : null
              }
              {/* Button to delete most recent interest */}
              {
                (this.state.profileInterests.length > 0)
                ? <button onClick={this.deleteRecentInterest}>-</button>
                : null
              }
              <br/>
              <button name='candidate_edit' onClick={this.handleEditCancel}>Cancel</button>
              <button onClick={this.handleCandidateProfileSubmission}>Submit</button>
            </div>
          : <div className='no_edit_candidate_profile'>
              <label>First Name: </label>
              <p>{this.state.first_name}</p>

              <label>Last Name:</label>
              <p>{this.state.last_name}</p>

              <label>Email: </label>
              <p>{this.state.email}</p>
              
              <label>Position: </label>
              <span>{this.state.candidate_current_position}</span>
              <br/>
              <label>Description: </label>
              <span>{this.state.candidate_description}</span>
              <br/>
              <label>School: </label>
              <span>{this.state.candidate_school}</span>
              <br/>
              <label>Interests: </label>
              <br/>
              {
                this.state.name_of_interest_1.length > 1
                ? <span>{this.state.name_of_interest_1} </span>
                : null
              }
              {
                this.state.name_of_interest_2.length > 1
                ? <span>{this.state.name_of_interest_2} </span>
                : null
              }
              {
                this.state.name_of_interest_3.length > 1
                ? <span>{this.state.name_of_interest_3}</span>
                : null
              }
              <br/>
              <button name='candidate_edit' onClick={this.handleEditClick}>Edit</button>
            </div>
        }
        <br/>
        {/* candidate links */}
        {
          this.state.links_edit
          ? <div className='edit_candidate_links'>
              <p> Links: </p>
              {
                this.state.profileLinks.map((link, index) => {
                  return (
                    <div key ={index + 1}>
                      <label>Type of Link </label>
                      <input name={`type_of_link_${index+1}`} onChange={this.handleChange} value={this.state[`type_of_link_${index+1}`]}/>
                      <br/>
                      <label>Link </label>
                      <input name={`link_${index+1}`} onChange={this.handleChange} value={this.state[`link_${index+1}`]}/>
                    </div>
                  )
                })
              }
              {/* Button to add another link */}
              {
                (this.state.profileLinks.length < 3)
                ? <button onClick={this.increaseLinks}>+</button>
                : null
              }
              {/* Button to delete most recent link */}
              {
                (this.state.profileLinks.length > 0)
                ? <button onClick={this.deleteRecentLink}>-</button>
                : null
              }
              <br/>
              <button name='links_edit' onClick={this.handleEditCancel}>Cancel</button>
              <button onClick={this.handleLinkSubmission}>Submit</button>
            </div>
          : <div className='no_edit_candidate_links'>
              <label>Links:</label>
              {this.state.profileLinks.map((links, index) => {
                return(
                <div key={`link ${index+1}`}>
                  <label>{this.state[`type_of_link_${index+1}`]} - </label>
                  <span>{this.state[`link_${index+1}`]}</span>
                </div>
              )})}
              <button name='links_edit' onClick={this.handleEditClick}>Edit</button>
            </div>
        }
        <br/>
        {/* candidate experiences */}
        {
          this.state.experiences_edit
          ? <div className='edit_candidate_experiences'>
              {
                this.state.experiences.map((experience, index)=>{
                  return (
                    <div key={index+1}>
                      <p>Experience {index+1}</p>
                      <label>Position</label>
                      <input type='text' name={`role_title_${index+1}`} onChange={this.handleChange} value={this.state[`role_title_${index+1}`]}/>
                        <br/>
                      <label>Decription</label>
                      <input type='text' name={`description_${index+1}`} onChange={this.handleChange} value={this.state[`description_${index+1}`]}/>
                        <br/>
                      <label>Start Date</label>
                      <input type='date' name={`start_date_${index+1}`} onChange={this.handleChange} value={this.state[`start_date_${index+1}`]}/>
                        <br/>
                      <label>End Date</label>
                      {this.renderEndDate(index+1)}
                    </div>
                  )  
                })
              }
              {/* Button to add another experience */}
              {
                (this.state.experiences.length < 5)
                ? <button onClick={this.increaseNumberOfExperiences}>+</button>
                : null
              }
              {/* Button to delete most recent experience */}
              {
                (this.state.experiences.length > 0)
                ? <button onClick={this.deleteRecentExperience}>-</button>
                : null
              }
              <br/>
              <button name='experiences_edit' onClick={this.handleEditCancel}>Cancel</button>
              <button onClick={this.handleExperiencesSubmission}>Submit</button>
            </div>
          : <div className='no_edit_candidate_experiences'>
              <label>Experiences: </label>
              {this.state.experiences.map((experience, index) => {
                  return (
                    <div key={index+1}>
                      <span>Experience {index+1}</span>
                      <br/>
                      <label>Position: </label>
                      <span>{this.state[`role_title_${index+1}`]}</span> 
                        <br/>
                      <label>Decription</label>
                      <span>{this.state[`description_${index+1}`]}</span>
                        <br/>
                      <label>Start Date: </label>
                      <span>{this.state[`start_date_${index+1}`]}</span>
                        <br/>
                      {this.renderViewEndDate(index+1)}
                    </div>
                  ) 
                })
              }
              <button name='experiences_edit' onClick={this.handleEditClick}>Edit</button>  
            </div>
        }
        <br/>
        {/* candidate skills */}
        {
          this.state.skills_edit
          ? <div className='edit_candidate_skills'>
              <Autocomplete
                multiple // allows multiple entries
                limitTags={10} // only 10 displayed in input box
                freeSolo // add entries not in provided options
                disableClearable={true} // remove delete all option
                value={this.state.skills} // make sure that the extra inputs more than 10 dont show
                size='small' // dispaly small
                id="multiple-limit-tags" // id for this component
                options={[]} // provide no options
                onChange={this.modifySkill} // when a user presses enter this function occurs
                renderInput={params => ( //display for all entered inputs
                  <TextField
                    {...params}
                    variant="outlined"
                    label="skills"
                    placeholder="skill"
                  />
                )}
              />
              <button name='skills_edit' onClick={this.handleEditCancel}>Cancel</button>
              <button onClick={this.handleSkillSubmission}>Submit</button>
            </div>
          : <div className='no_edit_candidate_skills'>
              <label>Skills: </label>
              {this.state.skills.map((skill, index) =>{
                return <span key={index}> {this.state.skills[`${index}`]}</span>
              })}
              <br/>
              <button name='skills_edit' onClick={this.handleEditClick}>Edit</button>
            </div>
        }
      </div>
    )
  } 
}

export default CandidateProfile;
