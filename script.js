let subject;
let currentQuestionIndex = 0;
let quizData = {}; // Declare globally
let mathsscore = 0;
let attempted = false;
let userEmblem;
let user;

document.addEventListener('DOMContentLoaded', () => {
    const upperText = document.getElementById('uppertext-maths');
    const mathScoreVar = document.getElementById('maths-score');
    const gotoQuizBtn = document.getElementById('goto-quiz');
    
    userEmblem = document.getElementById('userEmb');
    
    if (userEmblem){
        user = localStorage.getItem('user');
        userEmblem.innerText = user;
    }
    // Retrieve the score from localStorage
    const storedMathsScore = localStorage.getItem('mathsScore');
    attempted = (localStorage.getItem('attempted') === 'true');

    if (storedMathsScore && upperText && mathScoreVar && attempted) {
        upperText.innerText = "Your score in maths:";
        mathScoreVar.innerText = storedMathsScore + "/6"; // Display score
    }

    // Hide the "goto-quiz" button if it exists
    if (gotoQuizBtn && attempted) {
        gotoQuizBtn.style.display = 'none';
    }
});



fetch('quizData.json')
    .then(response => response.json())
    .then(data => {
        quizData = data;
        localStorage.setItem('quizData', JSON.stringify(quizData)); // Save data to localStorage for later use
    });

function loadQuestion() {
    subject = localStorage.getItem('subject');
    if (!quizData[subject] || quizData[subject].length === 0) {
        console.error("Quiz data is not available for subject:", subject);
        return;
    }

    const questionData = quizData[subject][currentQuestionIndex];
    let question = document.getElementById('question');
    if (question){
        question.innerText = questionData.question;
        document.getElementById('label1').innerText = questionData.options[0];
        document.getElementById('label2').innerText = questionData.options[1];
        document.getElementById('label3').innerText = questionData.options[2];
        document.getElementById('label4').innerText = questionData.options[3];
    }
}
    

document.addEventListener('DOMContentLoaded', () => {
    quizData = JSON.parse(localStorage.getItem('quizData')); // Retrieve data from localStorage
    loadQuestion();
});

document.addEventListener('DOMContentLoaded', () => {
    mathsscore = localStorage.getItem('mathsScore');
    
});

function checkCredentials() {
    let rNum = (document.getElementById('roll-number').value).toUpperCase();
    let password = document.getElementById('password').value;

    if (rNum && password) {
        fetch('http://localhost:3000/addUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: rNum, password: password }),
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            window.location.href = 'sign-in.html';
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Error adding user.');
        });
    } else {
        alert("Please enter both roll number and password.");
    }
}
/*
function verifyCredentials() {
    let rNum = (document.getElementById('roll-number').value).toUpperCase();
    let password = document.getElementById('password').value;

    if (rNum && password) {
        fetch('http://localhost:3000/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: rNum, password: password }),
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            login(rNum,'maths');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Error adding user.');
        });
    } else {
        alert("Please enter both roll number and password.");
    }
}

*/
function verifyCredentials() {
    let rNum = (document.getElementById('roll-number').value).toUpperCase();
    let password = document.getElementById('password').value;

    if (rNum && password) {
        console.log('Sending request to server...');
        fetch('http://127.0.0.1:3000/Signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: rNum, password: password }), // Log before sending
        })
        .then(response =>  {
            console.log('Received response:', response);
            if (!response.ok) {
                throw new Error('Invalid credentials');
            }
            return response.text();
        })
        .then(data => { 
            alert(data); // Show success message
            login(rNum,'maths'); // Redirect to dashboard
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Error signing in: ' + error.message);
        });
    } else {
        alert("Please enter both roll number and password.");
    }
}



// To check the stored credentials, you can retrieve and display them

function getQuiz(){
    attempted = true;
    mathsscore = 0;
    localStorage.setItem('currentQuestionIndex', currentQuestionIndex); // Store the current question index
    localStorage.setItem('attempted', attempted);
    localStorage.setItem('mathsScore', mathsscore);
    window.location.href='quiz.html'; // Navigate to the quiz page
}

function nextQuestion(){
    if(attemptedQuestion()){
        addScore();
        var options = document.getElementsByName("quiz-options");
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData[subject].length) {
            localStorage.setItem('currentQuestionIndex', currentQuestionIndex); // Save updated index
            loadQuestion(); // Load the next question
        } else {
            loadDashboard();
        }
    }
    else{
        alert("Attempt the question!!");
    }
}
function prevQuestion(){
    currentQuestionIndex--;
    var options = document.getElementsByName("quiz-options");
    for (let i = 0; i < options.length; i++) {
        if (options[i].checked) {
            options[i].checked = false;
        }
    }
    if (currentQuestionIndex > -1) {
        localStorage.setItem('currentQuestionIndex', currentQuestionIndex); // Save updated index
        subScore();
        loadQuestion(); // Load the next question
    } else {
        alert('No previous question');
    }
}

function login(user1,sub){
    user = user1;
    localStorage.setItem('user',user);
    setSubject(sub);
}

function setSubject(sub){
    subject = sub;
    localStorage.setItem('attempted', false);
    localStorage.setItem('subject', subject); // Store subject in localStorage for the next page
    
    if(subject === 'maths'){
        window.location.href = '/dashboard-math.html';
        alert();
    }
    else if(subject === 'english'){
        window.location.href = 'dashboard-English.html';
    }
    else{
        window.location.href = 'dashboard-iq.html';
    }
}

function subScore(){
    mathsscore = Number(localStorage.getItem('mathsScore')) || 0;
    mathsscore--;
    localStorage.setItem('mathsScore', mathsscore);
}
/*
function loadDashboard() {
    const upperText = document.getElementById('uppertext-maths');
    const mathScoreVar = document.getElementById('maths-score'); 
    window.location.href = 'dashboard-math.html';
    if (upperText) {
        upperText.innerText = "Your score in maths:";; // Correct way to hide the button
    }
    else{
        alert("error1")
    }
    if (mathScoreVar) {
        mathScoreVar.innerText = mathsscore + "/6"; // Correct way to hide the button
    }
    else{
        alert("error2")
    }
    const gotoQuizBtn = document.getElementById('goto-quiz');
    if (gotoQuizBtn) {
        gotoQuizBtn.style.display = 'none'; // Correct way to hide the button
    }
    else{
        alert("error3")
    }
}*/

function loadDashboard() {
    // Store necessary data in localStorage
    localStorage.setItem('mathsScore', mathsscore);
    localStorage.setItem('attempted',attempted);

    if(subject === 'maths'){
        window.location.href = 'dashboard-math.html';
        alert();
    }
    else if(subject === 'english'){
        window.location.href = 'dashboard-English.html';
    }
    else{
        window.location.href = 'dashboard-iq.html';
    }
}

function addScore() {
    var options = document.getElementsByName("quiz-options");
    const questionData = quizData[subject][currentQuestionIndex];
    mathsscore = Number(localStorage.getItem('mathsScore')) || 0;
    for (let i = 0; i < options.length; i++) {
        if (options[i].checked) {
            if (i == questionData.correctAnswer) {
                mathsscore++; // Increment score if the answer is correct
                options[i].checked = false;
            }else{
                options[i].checked = false;
            }
            localStorage.setItem('mathsScore', mathsscore);
            break; // Exit the loop once the answer is checked
        }
    }
}

function attemptedQuestion() {
    var options = document.getElementsByName("quiz-options");
    const questionData = quizData[subject][currentQuestionIndex];
    for (let i = 0; i < options.length; i++) {
        if (options[i].checked) {
            return true;
        }
    }
    return false;
}

