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
  <h2>${theory.ar}</h2>
  <p>${theory.de}</p>
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
document.getElementById("sentence").innerText = q.sentence;

// immagine
let img = document.getElementById("image");
img.src = q.image || "";
img.onerror = ()=> img.style.display = "none";

// cuori
document.getElementById("hearts").innerText = "❤️".repeat(lives);

// progress
let progress = (i / lesson.length) * 100;
document.getElementById("progress").style.width = progress + "%";

// risposte
let div = document.getElementById("answers");
div.innerHTML = "";

q.options.forEach((opt, idx)=>{
  let b = document.createElement("button");
  b.innerText = opt;

  b.onclick = ()=>{
    speak(opt);
    check(idx, b);
  };

  div.appendChild(b);
});

}

// AUDIO
function speak(text){
  speechSynthesis.cancel();

  let u = new SpeechSynthesisUtterance(text);
  u.lang = "ar-SA";
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
  fb.innerText = "✔️";
  score++;
}else{
  btn.classList.add("wrong");
  fb.innerText = "❌";
  lives--;
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
document.body.innerHTML = `

<div class="app">

  <div class="top">
    <button class="homeBtn" onclick="goHome()">🏠</button>
    <div class="hearts" id="hearts"></div>
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


}

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

