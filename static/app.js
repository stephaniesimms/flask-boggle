// global variables

let score = 0;
let canSubmit = true;

// event listener for new word guess
$("form").on("submit", submitWord);

// sends the submitted word to the server to check if it's valid, calls helper functions to handle the UI display of messaging and word list for valid words
async function submitWord(evt) {  
  evt.preventDefault();
  if (!canSubmit) {
    return;
  }

  word_guess = $("#word-guess").val();

  response = await axios.get("/check-word", {
    params:
      {word: word_guess}
  });

  responseObj = response.data.result;
  // decide what to append to site
  message = generateMessage(responseObj);
  appendMessage(message)
  $("#word-guess").val("")
}

// chooses the appropriate message depending on the response from the server about the word guess
function generateMessage(response){
  if (response === "ok") {
    appendToWordList()
    addToScore()
    return "Nice job!"
  }
  else if (response === "not-on-board") {
    return "The word is not on the board. Try again!"
  }
  else {
    return "This word does not exist. Try again!"
  }
}

// displays the appropriate message in the UI
function appendMessage(msg){
  $("#message").empty()
  $("#message").append(`<p>${msg}</p>`)
}

// adds correct word guesses to the word list in the UI
function appendToWordList(){
  word = $("#word-guess").val();
  $("#word-list").append(`<li>${word}</li>`)
}

function addToScore(){
  word = $("#word-guess").val();
  score += word.length

  $("#score").text(`Score: ${score}`);
}

// on load start counter 
// instantiate new Date as countdown
// 
$(async function(){
  // from W3C Schools https://www.w3schools.com/howto/howto_js_countdown.asp
  let countDown = new Date().getTime();
  let timer = setInterval(function startTimer() {
    let now = new Date().getTime();
    let remainingTime = now-countDown;
  
    var minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
    
    $("#timer").text(`Time left: ${60-seconds}`);
  
    if (minutes > 0) {
      clearInterval(timer);
      canSubmit = false;
      $("#timer").text(`Time left: 0`);
      appendMessage("Game over!");
      logGameStats()
    }
  }, 1000);
  await getStats();
})


// async axios request to 
async function logGameStats () {
  response = await axios.post('/check-stats', {score: score});
  
  highScore = parseInt(response.data.highscore)
  gameCount = parseInt(response.data.game_count)
  appendStats(highScore, gameCount);
}

// display highscore and total games played, access from server session
function appendStats(highScore, gameCount){
   $('#highscore').text(`High score: ${highScore}`)
   $('#games-played').text(`Games played: ${gameCount}`)
}

// check and update highscore and total games played, display in UI
async function getStats(){
  response = await axios.get('/get-stats');
  
  highScore = parseInt(response.data.highscore)
  gameCount = parseInt(response.data.game_count)
  appendStats(highScore, gameCount);
}

