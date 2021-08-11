import React, { Component, useState, useEffect } from 'react';
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

  //DB(test.php)를 받아와서 문제페이지 출력
  componentDidMount() {
    fetch("http://localhost:8080/test.php")
      .then(res => res.json())
      .then((result) => {
        this.setState({
          isLoaded: true,
          json: result[0]
        });
       // console.log(result);
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
              {onSurveyCompletion}
          </div>
        );
      }
   
    } 
}  

//결과페이지(result.php) 출력

const CompletePage = (props) => {
  const [obj, setObj] = useState([])
  let [quizResult] = useState([])
    // let quizResult = [];
    //let data1 = [];
    quizResult = props.result;
    //console.log("quizResult : ",quizResult);
    useEffect(() => {
      fetch('http://localhost:8080/result.php', {
        method: 'POST',
        headers: {
          //'Access-Control-Allow-Origin' : '*',
          // 'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body : JSON.stringify(quizResult)
      })
      .then(response => response.json())
      .then(data => { //result.php로부터 받아온 값
        return setObj(data);
      })   
      .catch(error => { 
        console.log('Error:', error); 
      });
      
    },[])
    console.log("Success: ", obj);
    
    // console.log(data1);
      
    return (
      <div >
        <Result 
          result={quizResult}
          quizCheck={obj}
        />
      </div>
    )
}


export default App;

   
   