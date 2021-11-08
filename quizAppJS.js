const appState = {
    username : "Player",
    quizType : "",
    quizTitle : "",
    current_view : "",
    message : "",
    quiz_length : 0,
    current_question : 0,
    questions_complete: 0,
    score: 0,
    finalTime: new Date,
    current_model : {}
}

const time = {
    startTime : 0,
    elapedTime : new Date
}

//var interval = setInterval(message, 1000);

const pageView = "#application"
const qView = "#questionView"

const databaseUrl = 'https://my-json-server.typicode.com/ChrisCaliendo/Web-Development';

document.addEventListener('DOMContentLoaded', function() {

    render_view("#startView", pageView, appState);

    document.querySelector("#application").onsubmit = function() {
        
        if(appState.current_view == "#startView"){

            if(document.querySelector("#nameInput").value != ""){
                appState.username = document.querySelector("#nameInput").value;
            }

            appState.quizType = document.querySelector('input[name="quizSelect"]:checked').value;

            if(appState.quizType == "htmlQuestions"){
                appState.quizTitle = "HTML & CSS";
            }
            else{
                appState.quizTitle = "Bootstraps";
            }

            getQuizLength();
            render_question(1);
            
            //activateTimer(true, false);
        }
        return false;
    }

});

const render_view = (viewId,viewPort, data) => {
    
    if(viewId == qView || pageView || "#endScreen"){
        appState.current_view = viewId;
    }

    var source = document.querySelector(viewId).innerHTML;
    
    var template = Handlebars.compile(source);
    
    document.querySelector(viewPort).innerHTML = template(data);
    
}

async function render_question(qNum){
    appState.current_model = await fetchData(qNum);
    alert
    appState.current_question++;
    render_view("#testView", pageView, appState);
    var qData = appState.current_model;
    var questionType = qData.qType;
    questionType = "#"+questionType;
    render_view(questionType, qView, qData);
}

async function fetchData(qNum){
    var url = databaseUrl+"/"+appState.quizType+"/"+qNum;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

function update_view(appState) {
    const html_element = render_widget(appState.current_model, appState.current_view)
    document.querySelector("#application").innerHTML = html_element;
}

async function getQuizLength(){
    var url = databaseUrl+"/"+appState.quizType;
    const response = await fetch(url);
    const data = await response.json();
    appState.quiz_length = data.length;
}

function checkAnswer(answer){
    if(answer==appState.current_model.trueA){
        appState.score++;
        Congratulate()
    }
    else{
        correctUser()
    }
}

function correctUser(){
    if(appState.current_model.qType == "classQuestion" || "styleQuestion"){
        switch (appState.current_model.trueA) {
            case appState.current_model.op1:
                appState.current_model.trueA = "Option 1";
              break;
            case appState.current_model.op2:
                appState.current_model.trueA = "Option 2";
              break;
            case appState.current_model.op3:
                appState.current_model.trueA = "Option 3";
              break;
            case appState.current_model.op4:
                appState.current_model.trueA = "Option 4";
              break;
            default:
                
              break;
        }
    }
    
    render_view("#CorrectionScreen",qView,appState.current_model);
}


function Congratulate(){
    var praise = ["Good Job!", "Nice Work!", "Great!", "Excellent!", "Amazing!", "Brilliant!"]
    const randomNum = Math.floor(Math.random() * praise.length);
    appState.message = praise[randomNum]
    render_view("#CongratulationScreen",qView,appState);
    
    setTimeout(() => {gotoNextQuestion()}, 1000);
}

function gotoNextQuestion(){
    appState.questions_complete++;
    
    if(appState.questions_complete >= appState.quiz_length){
        endQuiz();
    }
    else{
        const nextQ = appState.current_question+1;
        render_question(nextQ)
    }
}

function endQuiz(){
    appState.finalTime = time.elapedTime;
    var endView = "#badEndScreen";
    var calculation = appState.score/appState.quiz_length;
    if(calculation > 0.8){
        endView = "#goodEndScreen";
    }
    render_view(endView, qView, appState);
}

function restart(){
    appState.username = "Player";
    appState.quizType = "";
    appState.quizTitle = "";
    appState.current_question = 0;
    appState.questions_complete= 0;
    appState.score = 0;
    render_view("#startView", pageView, appState);
}

function activateTimer(onOrOff, repeat){
    if(repeat==false){
        time.timerOn = onOrOff;
        time.startTime = new Date().getTime();
    }
    if(time.timerOn==true){
        setTimeout(timer(),1000)
    }
}

function timer(){
    if(appState.current_view == qView){
        time.elapedTime = new Date().getTime() - time.startTime;
        render_view("#timeSlot","#timer",time);
    }
}

