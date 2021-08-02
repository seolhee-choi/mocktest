import logo from './logo.svg';
import React, { Component } from 'react';
import './App.css';
import Posts from './components/Posts';
import "survey-react/survey.css"
import * as Survey from "survey-react";


class App extends Component {
  constructor(props){
  super(props)
  this.state = {
  }
  this.onCompleteComponent = this.onCompleteComponent.bind(this)
}
onCompleteComponent = () =>{
  this.setState({
    isCompleted: true
  })
}


  render() {
   
    var json = {
      "title":"은행",
      "pages":[
        {
          "name":"page1",
          "elements":[
            {
              "type": "radiogroup",
              "name": "customer_role",
              "title":"{this.json}",
              "choices": ["","","",]
            }
          ]
        }
      ]
    };

    var surveyRender = !this.state.isCompleted ? (
      <Survey.Survey
        json={json}
        showCompletedPage={false}
        onComplete={this.onCompleteComponent}

      />
    ) : null

    var onSurveyCompletion = this.state.isCompleted ? (
      <div>Tanks for completing the survey :)</div>
    ) : null;

    return (
      <div className="App">
         <div>
          {surveyRender}
          {onSurveyCompletion}
        </div>
      
 
       <input type="button" value="get data" onClick={
         function () {
            fetch('http://localhost:8080/test.php', {
              method: 'POST',
            })
              .then(function(response) {
                console.log(response);
                return response.json();
              })
              .then(function(json) {
                console.log(json);
              })
          }}/> 
        
        
      </div>
    );
  }
}
export default App;
