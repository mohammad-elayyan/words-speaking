const mainBox = document.querySelector(".main");
const gradeBox = document.querySelector(".grade");
const texts = document.querySelector(".texts");
const speak = document.querySelector(".start");
setGrade(0);

if ("webkitSpeechRecognition" in window) {
  var recognition = new webkitSpeechRecognition();
  // recognition.continuous = true;
  recognition.interimResults = true;
  let p = document.createElement("p");
  let result = document.createElement("p");
  let c = 0;
  let grade = 0;
  let trials = 2;
  let words = ["Hello", "How are you", "Thank you"];
  initRec();

  function initRec(reset = false) {
    if (reset) {
      c = 0;
      trials = 2;
      grade = 0;
    }
    if (c === 0) {
      texts.children[0].innerText = words[c];
      texts.children[1].innerText = "";
      texts.children[2] ? (texts.children[2].innerText = "") : "";
      c++;
    } else {
      words.map((w, wIndx) => {
        if (c == wIndx) {
          speak.style.pointerEvents = "none";
          setTimeout(() => {
            speak.style.pointerEvents = "initial";
            texts.children[0].innerText = w;
            texts.children[1].innerText = "";
            texts.children[2].innerText = "";
          }, 1000);
          trials = 2;
        }
        return w;
      });
    }
  }

  recognition.addEventListener("result", (e) => {
    let text = "";
    for (let i = e.resultIndex; i < e.results.length; ++i) {
      if (e.results[i].isFinal) {
        text += e.results[i][0].transcript;
      }
    }
    // const text = Array.from(e.results)
    //   .map((result) => result[0])
    //   .map((result) => result.transcript)
    //   .join("");

    texts.children[1].innerText = capitalize(text);

    if (e.results[0].isFinal) {
      if (
        text.includes(texts.children[0].innerText.toLowerCase()) ||
        text.includes(capitalize(texts.children[0].innerText))
      ) {
        initRec();
        result = document.createElement("p");
        result.classList.add("result");
        result.classList.add("correct");
        result.innerText = "Correct";
        texts.append(result);

        grade++;
        setGrade(grade);
        setTimeout(() => {
          if (c > words.length) {
            showReult("none", "flex");
          }
        }, 1000);
        c++;
      } else {
        if (trials <= 1) {
          initRec();
          c++;
          setTimeout(() => {
            if (c >= words.length) {
              showReult("none", "flex");
            }
          }, 1000);
        } else {
          trials--;
        }
        result = document.createElement("p");
        result.classList.add("result");
        result.classList.add("wrong");
        result.innerText = "Wrong";
        texts.append(result);
      }
      // p = document.createElement("p");
    }
  });
  if (window.matchMedia("(pointer: coarse)").matches) {
    speak.addEventListener("touchstart", () => {
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
      r.forEach((el) => el.remove());
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
