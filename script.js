// JavaScript code for Password Generator
document.addEventListener("DOMContentLoaded", function () {
    const lengthSlider = document.getElementById("length");
    const lengthValue = document.getElementById("slidervalue");
    const upperCheckbox = document.getElementById("up letters");
    const lowerCheckbox = document.getElementById("lo letters");
    const numberCheckbox = document.getElementById("numbers");
    const symbolCheckbox = document.getElementById("Symbols");
    const outputField = document.getElementById("ip");
    const generateBtn = document.getElementById("genbtn");
    const copyBtn = document.querySelector(".copy-btn");
  
    // Character sets for password
    const upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()-_=+<>?";
  
    // Update the slider value display
    lengthSlider.addEventListener("input", function () {
      lengthValue.textContent = lengthSlider.value;
    });
  
    // Enable generate button if at least one checkbox is selected
    [upperCheckbox, lowerCheckbox, numberCheckbox, symbolCheckbox].forEach(checkbox => {
      checkbox.addEventListener("change", function () {
        generateBtn.disabled = !(
          upperCheckbox.checked ||
          lowerCheckbox.checked ||
          numberCheckbox.checked ||
          symbolCheckbox.checked
        );
      });
    });
  
    // Generate password function
    function generatePassword() {
      let characters = "";
      if (upperCheckbox.checked) characters += upperCaseLetters;
      if (lowerCheckbox.checked) characters += lowerCaseLetters;
      if (numberCheckbox.checked) characters += numbers;
      if (symbolCheckbox.checked) characters += symbols;
  
      let password = "";
      for (let i = 0; i < lengthSlider.value; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
      }
      return password;
    }
  
    // Handle generate button click
    generateBtn.addEventListener("click", function () {
      outputField.value = generatePassword();
    });
  
    // Copy password to clipboard
    copyBtn.addEventListener("click", function () {
      if (outputField.value) {
        outputField.select();
        document.execCommand("copy");
        alert("Password copied to clipboard!");
      }
    });
  });
  