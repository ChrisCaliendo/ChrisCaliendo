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
    current_model : {}
}

const time = {
    startTime : 0,
    stopper : false,
    elapedTime : new Date
}


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
            
            
            setTimeout(toggleTimer(true), 1000);
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
        render_view("#CorrectionScreen",qView,appState.current_model);
    }
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

}

function toggleTimer(toggle){
    
    if(toggle == true){
        stopper = false;
        startTime = new Date();
        timer();
    }
    else if(toggle == false){
        stopper == true
    }
}

function timer(){
    if(appState.current_view == qView){
        
        elapedTime = new Date().getTime() - startTime;
        alert(elapedTime);
        render_view("#timeSlot","#timer",time);
    }
    timerCheck();
}

function timerCheck(){
    if(stopper == true){
        return;
    } 
    setTimeout(timer(), 1000);
}











