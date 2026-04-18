let xp = 0;
let level = 1;
let lesson=[];
let i=0;
let lives=3;
let score=0;
let wrong=[];

// LOAD JSON
fetch("data/lesson1.json")
.then(r=>r.json())
.then(data=>{
lesson=data;
load();
});

// LOAD
function load(){

let q=lesson[i];

document.getElementById("sentence").innerText=q.sentence;
let img = document.getElementById("image");

img.src = q.image;

// fallback automatico se immagine non carica
img.onerror = function(){
this.src = "https://via.placeholder.com/300?text=Image";
};

// progress
let progress=(i/lesson.length)*100;
document.getElementById("progress").style.width=progress+"%";

// hearts
document.getElementById("hearts").innerText="❤️".repeat(lives);

// answers
let div=document.getElementById("answers");
div.innerHTML="";

q.options.forEach((opt,idx)=>{
let b=document.createElement("button");
b.innerText=opt;

b.onclick=()=>check(idx,b);

div.appendChild(b);
});

}

// 🔊 AUDIO AUTOMATICO (FIX)
document.getElementById("audio").onclick = () => {

let full = lesson[i].sentence.replace("____","");

let u = new SpeechSynthesisUtterance(full);
u.lang = "ar-SA";
u.rate = 0.8;
u.pitch = 1;

// FIX reale voci
function speakNow(){
let voices = speechSynthesis.getVoices();
let v = voices.find(v => v.lang.includes("ar"));

if(v) u.voice = v;

speechSynthesis.cancel();
speechSynthesis.speak(u);
}

// se voci non pronte
if(speechSynthesis.getVoices().length === 0){
speechSynthesis.onvoiceschanged = speakNow;
}else{
speakNow();
}

};

// 🎤 VOCE BAMBINO
function startVoice(){

let rec=new (window.SpeechRecognition||window.webkitSpeechRecognition)();
rec.lang="ar-SA";

rec.onresult=(e)=>{
let said=e.results[0][0].transcript;

if(said.includes(lesson[i].options[lesson[i].correct])){
score++;
}else{
lives--;
wrong.push(lesson[i]);
}

next();
};

rec.start();
}

// CHECK
function check(n,btn){
if(document.getElementById("nextBtn").style.display==="block") return;
let q=lesson[i];
//vibration
if(n!==q.correct){
  if(navigator.vibrate){
    navigator.vibrate(200);
  }
}
// XP+LEVEL UP
xp += 10;

if(xp >= 100){
  xp = 0;
  level++;
}

updateXP();

// frase completa
let full=q.sentence.replace("____",q.options[n]);
document.getElementById("sentence").innerText=full;

// audio frase completa
let u=new SpeechSynthesisUtterance(full);
u.lang="ar-SA";
u.rate=0.8;

let voices = speechSynthesis.getVoices();
let v = voices.find(v => v.lang.includes("ar"));
if(v) u.voice = v;

speechSynthesis.cancel();
speechSynthesis.speak(u);

// blocca bottoni
document.querySelectorAll("#answers button").forEach(b=>b.disabled=true);

// FEEDBACK
let fb=document.getElementById("feedback");

if(n===q.correct){
btn.classList.add("correct");
fb.innerText="صحيح ✅";
fb.className="correctText";
score++;
}else{
btn.classList.add("wrong");
fb.innerText="خطأ ❌";
fb.className="wrongText";
lives--;
wrong.push(q);
}
document.getElementById("correctSound").play();
document.getElementById("wrongSound").play();

// mostra bottone continua
document.getElementById("nextBtn").style.display="block";
}
// NEXT
function next(){

i++;

if(lives<=0){
end();
return;
}

if(i>=lesson.length){

if(wrong.length>0){
alert("Ripetiamo errori!");
lesson=wrong;
wrong=[];
i=0;
load();
return;
}

end();
return;
}

load();
}

// END + BADGE
function end(){

let percent=Math.round((score/lesson.length)*100);

// voto tedesco
let grade="5";
let text="";

if(percent>=95){grade="1+"; text="Sehr gut";}
else if(percent>=85){grade="1"; text="Sehr gut";}
else if(percent>=70){grade="2"; text="Gut";}
else if(percent>=55){grade="3"; text="Befriedigend";}
else if(percent>=40){grade="4"; text="Ausreichend";}
else{grade="5"; text="Nicht bestanden";}

document.querySelector(".card").innerHTML=`

<div class="resultBox">
<h1>📊 Ergebnis</h1>

<p style="font-size:26px;">${score}/${lesson.length}</p>

<p style="font-size:30px;">Note: ${grade}</p>

<p>${text}</p>

<button onclick="location.reload()">🔄 Try Again</button>
</div>

`;
}

//bottone continua
document.getElementById("nextBtn").onclick=()=>{

document.getElementById("feedback").innerText="";
document.getElementById("nextBtn").style.display="none";

i++;

if(lives<=0){
end();
return;
}

if(i>=lesson.length){

if(wrong.length>0){
lesson=wrong;
wrong=[];
i=0;
load();
return;
}

end();
return;
}

load();
};
function updateXP(){

let percent = xp;

document.getElementById("xpFill").style.width = percent + "%";
document.getElementById("level").innerText = "Livello " + level;

}
