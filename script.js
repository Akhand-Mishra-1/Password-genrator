document.addEventListener("DOMContentLoaded", function () {

  const lengthSlider   = document.getElementById("length");
  const lengthValue    = document.getElementById("slidervalue");
  const upperCheckbox  = document.getElementById("up-letters");
  const lowerCheckbox  = document.getElementById("lo-letters");
  const numberCheckbox = document.getElementById("numbers");
  const symbolCheckbox = document.getElementById("symbols");
  const excludeInput   = document.getElementById("excludeChars");
  const outputField    = document.getElementById("ip");
  const generateBtn    = document.getElementById("genbtn");
  const copyBtn        = document.getElementById("copyBtn");
  const themeToggle    = document.getElementById("themeToggle");
  const themeIcon      = document.getElementById("themeIcon");
  const strengthBar    = document.getElementById("strengthBar");
  const strengthText   = document.getElementById("strengthText");
  const historyList    = document.getElementById("historyList");
  const clearHistory   = document.getElementById("clearHistory");


  const UPPER   = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const LOWER   = "abcdefghijklmnopqrstuvwxyz";
  const NUMBERS = "0123456789";
  const SYMBOLS = "!@#$%^&*()-_=+[]{}|;:,.<>?";


  let history = [];
  let isDark   = true;


  updateSliderTrack();
  lengthValue.textContent = lengthSlider.value;

  
  lengthSlider.addEventListener("input", function () {
    lengthValue.textContent = this.value;
    updateSliderTrack();
    if (outputField.value) updateStrength(outputField.value);
  });

  function updateSliderTrack() {
    const min = +lengthSlider.min, max = +lengthSlider.max, val = +lengthSlider.value;
    const pct = ((val - min) / (max - min)) * 100;
    lengthSlider.style.background =
      `linear-gradient(to right, #7c6dfa 0%, #7c6dfa ${pct}%, #2e2e3d ${pct}%, #2e2e3d 100%)`;
  }


  function updateSliderForTheme() {
    const isDarkNow = document.documentElement.getAttribute("data-theme") !== "light";
    const trackColor = isDarkNow ? "#2e2e3d" : "#ddddf0";
    const min = +lengthSlider.min, max = +lengthSlider.max, val = +lengthSlider.value;
    const pct = ((val - min) / (max - min)) * 100;
    const accent = isDarkNow ? "#7c6dfa" : "#6355e8";
    lengthSlider.style.background =
      `linear-gradient(to right, ${accent} 0%, ${accent} ${pct}%, ${trackColor} ${pct}%, ${trackColor} 100%)`;
  }
 const checkboxes = [upperCheckbox, lowerCheckbox, numberCheckbox, symbolCheckbox];
  checkboxes.forEach(cb => cb.addEventListener("change", updateGenerateBtn));
  updateGenerateBtn();

  function updateGenerateBtn() {
    const anyChecked = checkboxes.some(c => c.checked);
    generateBtn.disabled = !anyChecked;
  }

  function generatePassword() {
    let pool = "";
    if (upperCheckbox.checked)  pool += UPPER;
    if (lowerCheckbox.checked)  pool += LOWER;
    if (numberCheckbox.checked) pool += NUMBERS;
    if (symbolCheckbox.checked) pool += SYMBOLS;

    const excluded = excludeInput.value.split("").filter(Boolean);
    if (excluded.length) {
      pool = pool.split("").filter(ch => !excluded.includes(ch)).join("");
    }

    if (!pool) return "No characters available!";

    const len = +lengthSlider.value;
    let password = "";
    const array = new Uint32Array(len);
    crypto.getRandomValues(array);
    for (let i = 0; i < len; i++) {
      password += pool[array[i] % pool.length];
    }
    return password;
  }


  function calcStrength(pw) {
    if (!pw || pw.length === 0) return { score: 0, label: "—", color: "var(--border)" };

    let score = 0;
    if (pw.length >= 8)  score++;
    if (pw.length >= 12) score++;
    if (pw.length >= 16) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    if (score <= 2) return { score: 15,  label: "Weak",      color: "var(--red)" };
    if (score <= 3) return { score: 40,  label: "Fair",      color: "var(--orange)" };
    if (score <= 5) return { score: 70,  label: "Strong",    color: "var(--yellow)" };
    return              { score: 100, label: "Very Strong", color: "var(--green)" };
  }

  function updateStrength(pw) {
    const { score, label, color } = calcStrength(pw);
    strengthBar.style.width = score + "%";
    strengthBar.style.background = color;
    strengthText.textContent = label;
    strengthText.style.color = color;
  }


  generateBtn.addEventListener("click", function () {
    const pw = generatePassword();
    outputField.value = pw;
    updateStrength(pw);
    addToHistory(pw);


    outputField.animate([
      { opacity: 0, transform: "translateY(-4px)" },
      { opacity: 1, transform: "translateY(0)" }
    ], { duration: 250, easing: "ease" });
  });

  copyBtn.addEventListener("click", () => copyText(outputField.value, copyBtn));

  function copyText(text, btn) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      showToast("Copied to clipboard!");
      if (btn) {
        btn.classList.add("copied");
        btn.innerHTML = '<i class="fa-solid fa-check"></i>';
        setTimeout(() => {
          btn.classList.remove("copied");
          btn.innerHTML = '<i class="fa-solid fa-copy"></i>';
        }, 1800);
      }
    });
  }


  function addToHistory(pw) {
    history.unshift(pw);
    if (history.length > 5) history.pop();
    renderHistory();
  }

  function renderHistory() {
    if (history.length === 0) {
      historyList.innerHTML = '<li class="history-empty">No passwords generated yet</li>';
      return;
    }
    historyList.innerHTML = history.map((pw, i) => `
      <li class="history-item">
        <span class="history-pw" title="${pw}">${pw}</span>
        <button class="history-copy" data-index="${i}" title="Copy">
          <i class="fa-solid fa-copy"></i>
        </button>
      </li>
    `).join("");

    historyList.querySelectorAll(".history-copy").forEach(btn => {
      btn.addEventListener("click", () => {
        const pw = history[+btn.dataset.index];
        copyText(pw, null);
        btn.innerHTML = '<i class="fa-solid fa-check"></i>';
        setTimeout(() => btn.innerHTML = '<i class="fa-solid fa-copy"></i>', 1800);
      });
    });
  }

  clearHistory.addEventListener("click", () => {
    history = [];
    renderHistory();
  });


  themeToggle.addEventListener("click", () => {
    isDark = !isDark;
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    themeIcon.className = isDark ? "fa-solid fa-moon" : "fa-solid fa-sun";
    updateSliderForTheme();
  });


  let toastTimer;
  function showToast(msg) {
    let toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-check-circle"></i>${msg}`;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  renderHistory();
});
