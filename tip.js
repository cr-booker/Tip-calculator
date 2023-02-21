"use strict"

function TipCalculator(){};

TipCalculator.init = function(){
  const tippingOptions = document.getElementsByClassName("tip-options")[0];
  tippingOptions.addEventListener("click", event => {TipCalculator.setActiveTipBtn(event.target)})
  
  const customTipInput = document.getElementById("custom-tip");
  customTipInput.addEventListener("input", event => {
    TipCalculator.checkCustomTip(event.target)
  });

  const calculateBtn = document.getElementById("calculate-btn");
  calculateBtn.addEventListener("click", TipCalculator.displayResults)

  TipCalculator.installFilters()
}

TipCalculator.installFilters = function(){
  TipCalculator.setInputFilter(document.getElementById("bill-amount"), function(value) {
    return /^-?\d*[.,]?\d{0,2}$/.test(value) && (value === "" || parseInt(value) <= 10000000); });

  TipCalculator.setInputFilter(document.getElementById("custom-tip"), function(value) {
    return /^\d*$/.test(value) && (value === ""  || parseInt(value) <= 100); });
    
  TipCalculator.setInputFilter(document.getElementById("person-count"), function(value) {
    return /^\d*$/.test(value) && (value === ""  || parseInt(value) <= 100); });
}

TipCalculator.setInputFilter = function(textbox, inputFilter){
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
    textbox.addEventListener(event, function() {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      } else {
        this.value = "";
      }
    });
  });
}

TipCalculator.displayResults = function(){
  const results = TipCalculator.calculate();
  const perPersonText = document.querySelectorAll(".per-person");
  
  if (results["numberOfPeople"] < 2){
    document.querySelector(".tip-calculation-result").textContent = `$${results["tip"]}`;
    document.querySelector(".total-calculation-result").textContent = `$${results["total"]}`;
    perPersonText.forEach(element => {element.classList.add("hidden")})
  }
  else{
    document.querySelector(".tip-calculation-result").textContent = `$${results["tipPerPerson"]}`;
    document.querySelector(".total-calculation-result").textContent = `$${results["pricePerPerson"]}`;
    perPersonText.forEach(element => {element.classList.remove("hidden")})
  }

}

TipCalculator.calculate = function(){
  const billAmount = Number(document.getElementById("bill-amount").value);
  const numOfPeople = Number(document.getElementById("person-count").value);
  const tipDecimal = Number(TipCalculator.getTipSetting()) / 100;
  
  const tipAmount = billAmount * tipDecimal;
  const total = billAmount + (tipAmount);
  const idvTipPrice = tipAmount / numOfPeople;
  const perPersonPrice = (billAmount / numOfPeople) + idvTipPrice;
  return {
        tip: tipAmount.toFixed(2),
        total: total.toFixed(2),
        tipPerPerson: idvTipPrice.toFixed(2),
        pricePerPerson : perPersonPrice.toFixed(2),
        numberOfPeople : numOfPeople,
      }
}

TipCalculator.getTipSetting = function(){
  const customTipInput = document.getElementById("custom-tip");
  const currentActiveBtn = document.querySelector(".active-btn");
  const tipValue = currentActiveBtn ? currentActiveBtn.firstChild.textContent : customTipInput.value;
  return tipValue;
}

TipCalculator.setActiveTipBtn = function(targetedElement){
  const customTipInput = document.getElementById("custom-tip");
  const currentActiveBtn = document.querySelector(".active-btn");
  if (targetedElement.type === "button"){
    if (currentActiveBtn){
      currentActiveBtn.classList.remove("active-btn");
    }
    targetedElement.classList.add("active-btn");
    customTipInput.value = "";
    targetedElement.classList.add("active-btn");
    return;
  }
}

TipCalculator.checkCustomTip = function(targetedElement){
  const currentActiveBtn = document.querySelector(".active-btn");
  if (targetedElement.value){
    if (currentActiveBtn){
      currentActiveBtn.classList.remove("active-btn");
    }
  }
  else{
    const tipBtn = document.getElementsByClassName("tip-select-btn")[2];
    tipBtn.classList.add("active-btn");
  }
  
}

document.addEventListener("DOMContentLoaded", TipCalculator.init)
