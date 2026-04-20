let lesson = [];
let i = 0;
let score = 0;
let lives = 3;

// NAVIGAZIONE
function startLesson(name){
  window.location.href = "?lesson=" + name;
}

// PARAMETRI
let params = new URLSearchParams(window.location.search);
let lessonName = params.get("lesson");

// CARICA JSON
if(lessonName){

  fetch("data/" + lessonName + ".json")
  .then(r=>r.json())
  .then(data=>{

    lesson = data.questions;

    showTheory(data.theory);

  })
  .catch(err=>{
    alert("Errore JSON ❌");
    console.log(err);
  });

}

// TEORIA
function showTheory(theory){

document.body.innerHTML = `
<div class="app">
  <h2 dir="rtl">${theory.ar}</h2>
<p dir="ltr">${theory.de}</p>
  <button onclick="startQuiz()">Start ▶️</button>
</div>
`;

}

// START QUIZ
function startQuiz(){

i = 0;
score = 0;
lives = 3;

document.body.innerHTML = `
<div class="app fadeIn">

  <div class="top">
    <button class="homeBtn" onclick="goHome()">🏠</button>
    <div id="hearts"></div>
<div id="score"></div>
  </div>

  <div class="progressBar">
    <div id="progress" class="progress"></div>
  </div>

  <div id="sentence"></div>

  <img id="image"/>

  <div id="answers" class="answers"></div>

  <div id="feedback"></div>

  <button id="nextBtn" style="display:none">Weiter</button>

</div>
`;


document.getElementById("nextBtn").onclick = next;

load();

}

// LOAD DOMANDA
function load(){

if(!lesson || lesson.length === 0) return;
if(!lesson[i]) return;

let q = lesson[i];

// frase
let s = document.getElementById("sentence");
s.innerText = q.sentence;
s.dir = "ltr";

// immagine
let img = document.getElementById("image");
img.src = q.image || "";
img.onerror = ()=> img.style.display = "none";

// cuori
document.getElementById("hearts").innerText = "❤️".repeat(lives);
//score
document.getElementById("score").innerText = (i+1) + "/" + lesson.length;
// progress
let progress = (i / lesson.length) * 100;
document.getElementById("progress").style.width = progress + "%";

// risposte
let div = document.getElementById("answers");
div.innerHTML = "";

let options = q.options.map((opt, index) => {
  return { text: opt, index: index };
});

// mescola
options.sort(() => Math.random() - 0.5).sort(() => Math.random() - 0.5);

options.forEach((optObj)=>{

  let b = document.createElement("button");
  b.innerText = optObj.text;
  b.dir = "ltr";

  // SALVIAMO indice corretto nel bottone
  b.dataset.index = optObj.index;

  b.onclick = ()=>{
    speak(optObj.text);
    check(optObj.index, b);
  };

  div.appendChild(b);
});

}

// AUDIO
function speak(text){

  speechSynthesis.cancel();

  let u = new SpeechSynthesisUtterance(text);

  // rilevamento base lingua
  if(/[a-zA-Z]/.test(text)){
    u.lang = "de-DE"; // tedesco
  } else {
    u.lang = "ar-SA"; // arabo
  }

  u.rate = 0.85;

  setTimeout(()=>{
    speechSynthesis.speak(u);
  },100);
}

// CHECK
function check(n, btn){

let q = lesson[i];

// blocca click multipli
if(document.getElementById("nextBtn").style.display === "block") return;

// frase completa
let full = q.sentence.replace("____", q.options[n]);
document.getElementById("sentence").innerText = full;

// audio frase
speak(full);

// blocca bottoni
document.querySelectorAll("#answers button").forEach(b=>b.disabled=true);

// feedback
let fb = document.getElementById("feedback");

if(n === q.correct){

  btn.classList.add("correct");
  fb.innerText = "✔️ Richtig";
  score++;

}else{

  btn.classList.add("wrong");
  fb.innerText = "❌ Falsch";
  lives--;
  

  // evidenzia risposta corretta
document.querySelectorAll("#answers button").forEach(b=>{
  if(Number(b.dataset.index) === q.correct){
    b.classList.add("correct");
  }
});

  // 🔊 AUDIO RISPOSTA CORRETTA
  speak(q.options[q.correct]);

}

// mostra next
document.getElementById("nextBtn").style.display = "block";

}

// NEXT
function next(){

i++;

if(lives <= 0){
  end();
  return;
}

if(i >= lesson.length){
  end();
  return;
}

document.getElementById("feedback").innerText = "";
document.getElementById("nextBtn").style.display = "none";

load();

}

// END
function end(){

let message = "";

if(lives <= 0){
  message = "❌ Versuche es noch einmal!";
}else{
  message = "🎉 Sehr gut gemacht!";
}

document.body.innerHTML = `
<div class="app resultBox">

  <h1>${message}</h1>

  <p>${score} / ${lesson.length}</p>

  <button onclick="startQuiz()">Nochmal 🔁</button>
  <button onclick="goHome()">🏠 Home</button>

</div>
`;

}// Update XP bar

function updateXP(){

  let bar = document.getElementById("xpFill");

  bar.style.width = xp + "%";

  bar.style.boxShadow = "0 0 20px #58cc02";

  setTimeout(()=>{
    bar.style.boxShadow = "0 0 10px #58cc02";
  },300);

  document.getElementById("level").innerText = "Livello " + level;
}
//Home
function goHome(){
  window.location.href = "index.html";
}

