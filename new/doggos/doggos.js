const spinner = document.getElementById("spinner");
const input = document.querySelector('.breed');
input.addEventListener('click', function (event) {
  if (event.target.tagName === 'OPTION'){
  selected = event.target.value;
   addNewDoggo(selected);
  }
})

const dogs = document.querySelector(".dogs");

function addNewDoggo(selected) {
  DOG_URL = `https://dog.ceo/api/breed/${selected}/images/random`; //replaces the url with the needed breed
  spinner.removeAttribute('hidden');
  const promise = fetch(DOG_URL);
  promise
    .then(function (response) { //fetchs that from the API
      const processingPromise = response.json(); //process like the blob into a JSON Object
      return processingPromise;
    })
    .then(function (processedResponse) {
      spinner.setAttribute('hidden', '');
      const img = document.createElement("img");// creates a new element (this is how you create elements programmatically)
      img.src = processedResponse.message; //sets the source to be processedResponse.message. "message" is the tag you get from the API
      img.alt = "Cute doggo"; // gives an alt text, you have to give images alt text...
      img.height = "400";
      img.style.margin = "10px";
      dogs.appendChild(img); // inside of dogs, it's going to add to the end a new child
      
    });

}

