const mainBox = document.querySelector(".main");
const gradeBox = document.querySelector(".grade");
const texts = document.querySelector(".texts");
const user = document.querySelector(".user");
const feed = document.querySelector(".feed");
const cards = document.querySelector(".cards");
const speak = document.querySelector(".start");
const audio = document.querySelector("audio");
const trialsVal = document.querySelector("#trials");
let orginalWord = "";
setGrade(0);

if ("webkitSpeechRecognition" in window) {
  var recognition = new webkitSpeechRecognition();
  // recognition.continuous = true;
  recognition.interimResults = true;
  let p = document.createElement("p");
  let result = document.createElement("p");
  let c = 0;
  let grade = 0;
  let trials = "trialsVal.valu";
  let words = [
    "Package beach holiday",
    "Skiing snowboarding",
    "Backpacking",
    "Volunteer work",
    "Cruise",
    "Study vacation",
    "Working holiday",
  ];
  window.onload = () => {
    let isVolume = false;
    initRec();
    words.forEach((w, wIndx) => {
      let card = `<div class="card splide__slide">
      
      <div class="card-body">
      ${volume}
      <img src="./assets/images/${w}.png" class="card-img" alt="card">
      <p class="card-text">${w}</p>
      </div>
      </div>`;
      cards.innerHTML += card;
    });
    const volumeBtn = document.querySelectorAll(".volume-btn");
    volumeBtn.forEach((vBtn, vIndx) => {
      vBtn.addEventListener("click", () => {
        isVolume = true;
        audio.src = `./assets/voices/${words[vIndx].toLowerCase()}.mp3`;
        audio.play();
        speak.style.pointerEvents = "none";
      });
    });
    audio.addEventListener("ended", () => {
      speak.style.pointerEvents = "initial";
    });
    new Splide(".splide", {
      type: "loop",
      perPage: 4,
    }).mount();

    const card = cards.querySelectorAll(".card");
    card.forEach((c, cIndx) => {
      const cardP = document.querySelectorAll(".card-text");
      c.addEventListener("click", () => {
        if (!isVolume) {
          for (let i = 0; i < card.length; i++) {
            cardP[i]?.classList.remove("active-p");
            c.style.pointerEvents = "initial";
          }
          cardP[cIndx].classList.add("active-p");
          c.style.pointerEvents = "none";
          orginalWord = cardP[cIndx].innerText.toLowerCase();
          user.classList.remove("hide");
          user.children[0].innerText = "";
          feed.innerText = "";
        }
        isVolume = false;
      });
    });
  };

  // trialsVal.onchange = () => {
  //   trials = trialsVal.value;
  // };

  function initRec(reset = false) {
    if (reset) {
      c = 0;
      trials = "trialsVal.value";
      grade = 0;
    }
    if (c === 0) {
      // texts.children[0].innerText = words[c];
      // user.children[0].innerText = "";
      // feed ? (feed.innerText = "") : "";
      c++;
    } else {
      words.map((w, wIndx) => {
        if (c == wIndx) {
          speak.style.pointerEvents = "none";
          setTimeout(() => {
            speak.style.pointerEvents = "initial";
            // texts.children[0].innerText = w;
            // user.children[0].innerText = "";
            // feed.innerText = "";
          }, 1000);
          trials = "trialsVal.value";
        }
        return w;
      });
    }
  }

  recognition.addEventListener("result", (e) => {
    let text = "";
    for (let i = e.resultIndex; i < e.results.length; ++i) {
      if (e.results[i].isFinal) {
        text += e.results[i][0].transcript.replace(/[^a-zA-Z ]/g, "");
      }
    }
    // const text = Array.from(e.results)
    //   .map((result) => result[0])
    //   .map((result) => result.transcript)
    //   .join("");

    user.children[0].innerText = capitalize(text);

    if (e.results[0].isFinal) {
      if (
        text.toLowerCase() === orginalWord ||
        capitalize(text) === capitalize(orginalWord)
      ) {
        initRec();
        console.log(1);
        feed.classList.add("result");
        feed.classList.remove("wrong");
        feed.classList.add("correct");
        feed.innerText = "Correct";

        grade++;
        // setGrade(grade);
        // setTimeout(() => {
        //   if (c > words.length) {
        //     showReult("none", "flex");
        //   }
        // }, 1000);
        c++;
      } else {
        // if (trials <= 1) {
        //   initRec();
        //   c++;
        //   setTimeout(() => {
        //     if (c > words.length) {
        //       showReult("none", "flex");
        //     }
        //   }, 1000);
        // } else {
        //   trials--;
        // }
        console.log(0);
        feed.classList.add("result");
        feed.classList.remove("correct");
        feed.classList.add("wrong");
        feed.innerText = "Wrong";
      }
      // p = document.createElement("p");
    }
  });
  if (window.matchMedia("(pointer: coarse)").matches) {
    speak.addEventListener("touchstart", (e) => {
      e.preventDefault();
      const r = document.querySelectorAll(".result");
      r.forEach((el) => el.remove());
      recognition.start();
      speak.classList.add("an-s");
    });
    speak.addEventListener("touchend", () => {
      recognition.stop();
      speak.classList.remove("an-s");
    });
  } else {
    speak.addEventListener("mousedown", () => {
      const r = document.querySelectorAll(".result");
      // r.forEach((el) => el.remove());
      recognition.start();
      speak.classList.add("an-s");
    });
    speak.addEventListener("mouseup", () => {
      recognition.stop();
      speak.classList.remove("an-s");
    });
  }

  function showReult(main, result) {
    mainBox.style.display = main;
    gradeBox.style.display = result;

    gradeBox.children[0].innerText = `grade: ${getGrade()}/${words.length}`;
    gradeBox.children[1].innerText =
      getGrade() >= words.length / 2 ? "passed" : "not passed";
  }

  function reset() {
    showReult("flex", "none");
    initRec(true);
  }
} else {
  alert("Your device does not support speech to text");
}
function setGrade(grade) {
  localStorage.setItem("grade", grade);
}

function getGrade() {
  let grade = localStorage.getItem("grade");
  return grade;
}

var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function (m) {
    return m.toUpperCase();
  });
}

let volume = `<svg version="1.1" id="Layer_1" class="volume-btn" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
viewBox="0 0 37.3 36.7" style="enable-background:new 0 0 37.3 36.7;" xml:space="preserve">
<style type="text/css">
.st0{fill:#907BA8;}
</style>
<g>
<path class="st0" d="M29.2,9.1c-0.5-0.4-1.2-0.4-1.7,0.1c-0.4,0.5-0.4,1.1,0,1.6c4.1,4.2,4.1,10.9,0,15c-0.5,0.4-0.5,1.2-0.1,1.7
 c0.4,0.5,1.2,0.5,1.7,0.1c0,0,0.1-0.1,0.1-0.1C34.2,22.5,34.2,14.2,29.2,9.1"/>
<path class="st0" d="M25.3,12.1c-0.3-0.3-0.8-0.3-1.1,0.1c-0.3,0.3-0.3,0.8,0,1.1c2.8,2.8,2.8,7.3,0,10.2c-0.3,0.3-0.4,0.8-0.1,1.1
 c0.3,0.3,0.8,0.4,1.1,0.1c0,0,0,0,0.1-0.1C28.7,21.1,28.7,15.6,25.3,12.1"/>
<path class="st0" d="M20.8,4.3C17.2,4.9,14,7,11.8,10h-1.5c-3.3,0-6,2.7-6,6v4.8c0,3.3,2.7,6,6,6h1.5c2.2,3,5.4,5,9,5.7
 c0.6,0.1,1.3-0.3,1.4-1c0-0.1,0-0.1,0-0.2V5.4c0-0.7-0.5-1.2-1.2-1.2C21,4.2,20.9,4.3,20.8,4.3"/>
</g>
</svg>`;
