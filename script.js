let inputslider= document.getElementById("inputslider");
let slidervalue = document.getElementById("slidervalue");
 slidervalue.textContent= inputslider.value;
inputslider.addEventListener,('input',()=>{
    slidervalue.textContent = inputslider.value;

});
