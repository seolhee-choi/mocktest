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

class CompletePage extends React.Component {
  render() {
    let quizResult = [];
    let data1 = [];
    quizResult = this.props.result;
    // console.log("result",this.props.result);
    fetch('http://localhost:8080/result.php', {
      method: 'POST',
      headers: {
        //'Access-Control-Allow-Origin' : '*',
        //'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body : JSON.stringify(quizResult)
    })
    .then(response => response.json())
    .then(data => { 
      data1 = data;
      console.log("Success: ", data);
    })   
    .catch(error => { 
      console.log('Error:', error); 
    });
/*
    for (const key in quizResult) {
      if (quizResult.hasOwnProperty(key)) {
        const value = quizResult[key];
        console.log("선택값 : ", value);
      }
    }
*/    
    return (
      <div >
          <Result result={data1}/>
      </div>
    )
   }
  }


export default App;

    //여기서부터 진짜
    // let quizResult = [];
    // quizResult['result'] = this.props.result;
    // let data1 = [];
    // //console.log(quizResult);

    // fetch('http://localhost:8080/result.php', {
    //   method: 'POST',
    //   headers: {
    //     // 'Access-Control-Allow-Origin' : '*',
    //     // 'Accept': 'application/json',
    //     'Content-Type': 'application/json'},
    //   body : JSON.stringify(data1),
    // })
    // .then((res) => {
    //   res.json();
    // })
    
    // .then((data) => { 
    //   data1=data;
    //     //console.log("Success: ", data); 
    //     // console.log("Success: ", data1); 
    //     console.log("Success: ", quizResult); 
    //     //console.log("Success: ", quizResult['result']); 
    // })
   
    // .catch((error) => { 
    //   console.error('Error:', error); 
    // });


    // data1 = Object.values(quizResult);
    // quizSum= Object.keys(quizResult).length;
    // console.log(data1);
    // console.log(quizResult);

   
   
   