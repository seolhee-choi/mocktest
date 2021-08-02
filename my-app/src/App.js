import React, { Component } from 'react';
import './App.css';
import "survey-react/survey.css"
import * as Survey from "survey-react";
import Result from "./Result";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items : []
    };
    this.result = "";
    this.onCompleteComponent = this.onCompleteComponent.bind(this)
  }

  onCompleteComponent = (survey) => {
    this.setState({
      isCompleted: true
    })
    this.result = survey.data;
  }

  componentDidMount() {
    fetch("http://localhost:8080/test.php")
      .then(res => res.json())
      .then((result) => {
        this.setState({
          isLoaded: true,
          json: result[0]
        });
        console.log(result);
      },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )

  }

  render() {
    const { error, isLoaded, json } = this.state;

    var surveyRender = !this.state.isCompleted && this.state.isLoaded ? (
      <Survey.Survey
        json={json}
        showCompletedPage={false}
        onComplete={this.onCompleteComponent}
        componentMount={this.componentDidMount}
        pageNextText="다음"
        pagePrevText="이전"
        completeText="완료"

      />
    ) : null


    var onSurveyCompletion = this.state.isCompleted && this.state.isLoaded ? (
      <CompletePage result={this.result} /> ): null;
    
      if (error) {
        return <div>Error: {error.message}</div>;
      } else if (!isLoaded) {
        return <div>Loading...</div>;
      } else {
        return (
          <div className="App">
              {surveyRender}
              {/* {pages.map(item => (
                <li key={item.id}>
                  {item.title}
                </li>
              ))} */}
              {onSurveyCompletion}
          </div>
        );
      }
    } 
}  
   
class CompletePage extends React.Component {
  
      render() {
        let quizResult = this.props.result;
        let quizSum = 0;
        //let quizTotal = 0;
        let quizAverage = 0;
        console.log(quizResult);
        
        for (var k in quizResult["id"]) {
              if (quizResult["id"].hasOwnProperty(k)) {
                  quizSum += parseInt(quizResult["id"][k]);
              }
          }
        quizAverage = quizSum / Object.keys(quizResult["id"]).length;
        return (
          <div>
            <Result result={quizAverage} />
            
          </div>
        )
      }
    }
    
    
    
      // <div>Thanks for completing the survey :)
        
      // </div>) : null;

    
  
  



export default App;