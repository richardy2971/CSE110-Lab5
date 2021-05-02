// script.js
const img = new Image(); // used to load image from <input> and draw to canvas
const canvas = document.getElementById('user-image');
const canvas_context = canvas.getContext('2d');
const canvas_change = document.getElementById('image-input');
const generate = document.getElementById('generate-meme');
const text_top = document.getElementById('text-top');
const text_bottom = document.getElementById('text-bottom');
const voice = document.getElementById('voice-selection');
const resest = document.querySelector("[type='reset']");
const button= document.querySelector("[type='button']");
const volume = document.getElementById('volume-group');



// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
    // TODO

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  canvas_context.beginPath();
  canvas_context.clearRect(0, 0, canvas.width, canvas.height);
 

  var every_button= document.getElementsByTagName("button");
  for(let i=0;i<every_button.length;i++){
    if(every_button[i].type =="submit"){
      every_button[i].disabled=false;
    }
    else{
      every_button[i].disabled=true;
    }
  }
  
  canvas_context.rect(0,0,canvas.width,canvas.height);
  canvas_context.fillStyle = "black";
  canvas_context.fill();

  var dimmensions = getDimmensions(canvas.width, canvas.height, img.width, img.height);
  canvas_context.drawImage(img, dimmensions['startX'], dimmensions['startY'], dimmensions['width'], dimmensions['height']);

  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});
canvas_change.addEventListener('change', (event) => {
  img.src= URL.createObjectURL(event.target.files[0]);
  img.alt = event.target.files[0];
});

generate.addEventListener('submit', (event) => {
  event.preventDefault();
  //styling of white "meme text"
  canvas_context.fillStyle= "white";
  canvas_context.textAlign = "center";
  canvas_context.font = "35px Arial";
  canvas_context.fillText(text_top.value,canvas.width/2,30);
  canvas_context.fillText(text_bottom.value,canvas.width/2,canvas.height-15); 
  //turns on the voice text
  voice.disabled=false;
  //Selected specific type to disable or enable
  document.querySelector("[type='reset']").disabled= false;
  document.querySelector("[type='submit']").disabled= true;
  document.querySelector("[type='button']").disabled= false;
  
});

resest.addEventListener('click', (event) => {
  //something like don't handle not used
  event.preventDefault();
  canvas_context.clearRect(0, 0, canvas.width, canvas.height);
  //found and simply disabeled buttons
  document.querySelector("[type='reset']").disabled= true;
  document.querySelector("[type='submit']").disabled= false;
  document.querySelector("[type='button']").disabled= true;

});



button.addEventListener('click', () => {
  //mostly look at the docs
  var synth = window.speechSynthesis;
  var voices = synth.getVoices();
  var talk = new SpeechSynthesisUtterance(text_top.value+text_bottom.value);
  talk.voice = voices[voice.value];
  talk.volume = volume.children[1].value/100;
  synth.speak(talk);
});

volume.addEventListener('input', () => {
  const icon = volume.children[0];
  const range = volume.children[1];
  //html descriptions
  if(range.value >=67){
    icon.src = "icons/volume-level-3.svg";
    icon.alt = "Volume Level 3";

  }
  else if(range.value >= 33){
    icon.src = "icons/volume-level-2.svg";
    icon.alt = "Volume Level 2";
  }
  else if(range.value > 0){
    icon.src = "icons/volume-level-1.svg";
    icon.alt = "Volume Level 1";
  }
  else{
    icon.src = "icons/volume-level-0.svg";
    icon.alt = "Volume Level 0";
  }
});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
