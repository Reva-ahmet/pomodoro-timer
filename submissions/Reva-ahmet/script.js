// Get elements
const timerDisplay = document.getElementById("timer");
const modeDisplay = document.getElementById("mode");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const sessionDisplay = document.getElementById("sessions");
const minutesInput = document.getElementById("minutesInput");
const progressBar = document.getElementById("progress-bar");
const alarm = document.getElementById("alarm");


// Variables
let totalSeconds = 0;
let initialSeconds = 0;
let timerInterval = null;
let completedSessions = 0;
let isStudyTime = true;


// Function to update the timer display
function updateTimerDisplay() {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Add leading zero if needed
    timerDisplay.textContent = `${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`;
}


// Setup a session
function setupSession(useInput = false) {
    let userMinutes = 25;  // default

    if (isStudyTime) {
        if (useInput) {

            userMinutes = parseInt(minutesInput.value);
            if (isNaN(userMinutes) || userMinutes <= 0) userMinutes = 25;
        }
        
        totalSeconds = userMinutes * 60;
        modeDisplay.textContent = "Study Time";
        timerDisplay.classList.add("study");
        timerDisplay.classList.remove("break");
        progressBar.style.background = "#e74C3C";
    } else {
        totalSeconds = 5 * 60;
        modeDisplay.textContent = "Break Time";
        timerDisplay.classList.remove("study");
        timerDisplay.classList.add("break");
        progressBar.style.background = "#27ae60";
    }
    initialSeconds = totalSeconds;
    progressBar.style.width = "0%";
    updateTimerDisplay();
}

// Start timer
function startTimer() {
    if (timerInterval) return; // already running
    // disable Start button while timer runs
    startBtn.disabled = true;

    if (totalSeconds === 0 && isStudyTime) setupSession(true);

    timerInterval = setInterval(() => {
        if (totalSeconds > 0) {
            totalSeconds--;
            updateTimerDisplay();
            const percent = ((initialSeconds - totalSeconds) / initialSeconds) * 100;
            progressBar.style.width = percent + "%";
        } else {
            clearInterval(timerInterval);
            timerInterval = null;

            // Play alarm
            if (alarm) alarm.play();

            if (isStudyTime) {
                completedSessions++;
                sessionDisplay.textContent = completedSessions;
                modeDisplay.textContent = "Break Time";  // show message
                if (alarm) alarm.play();
            } else {
                modeDisplay.textContent = "Study Time";
                if (alarm) alarm.play();
            }
                

            isStudyTime = !isStudyTime;
            totalSeconds = 0;
            setupSession();
            startTimer(); // automatically start next session
        }
    }, 1000);
}


// Pause timer
pauseBtn.addEventListener("click", () => {
        clearInterval(timerInterval);
        timerInterval = null;

        // << re-enable start
        startBtn.disabled = false;
    
});

// Reset timer
resetBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;

    // << re-enable start
    startBtn.disabled = false;

    totalSeconds = 0;
    completedSessions = 0;
    isStudyTime = true;
    sessionDisplay.textContent = completedSessions;
    setupSession();
});

startBtn.addEventListener("click", startTimer);

