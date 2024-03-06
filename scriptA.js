// const axios = require('axios');
function createCarouselItem(imgSrc, imgAlt, imgId) {
  const template = document.querySelector("#carouselItemTemplate");
  const clone = template.content.firstElementChild.cloneNode(true);

  const img = clone.querySelector("img");
  img.src = imgSrc;
  img.alt = imgAlt;

  const favBtn = clone.querySelector(".favourite-button");
  favBtn.addEventListener("click", () => {
    favourite(imgId);
  });

  return clone;
}

function clear() {
  const carousel = document.querySelector("#carouselInner");
  while (carousel.firstChild) {
    carousel.removeChild(carousel.firstChild);
  }
  infoDump.innerHTML = ""
}

function appendCarousel(element) {
  const carousel = document.querySelector("#carouselInner");

  const activeItem = document.querySelector(".carousel-item.active");
  if (!activeItem) element.classList.add("active");

  carousel.appendChild(element);
}

function start() {
  const multipleCardCarousel = document.querySelector(
    "#carouselExampleControls"
  );
  if (window.matchMedia("(min-width: 768px)").matches) {
    const carousel = new bootstrap.Carousel(multipleCardCarousel, {
      interval: false,
    });
    const carouselWidth = $(".carousel-inner")[0].scrollWidth;
    const cardWidth = $(".carousel-item").width();
    let scrollPosition = 0;
    $("#carouselExampleControls .carousel-control-next").unbind();
    $("#carouselExampleControls .carousel-control-next").on(
      "click",
      function () {
        if (scrollPosition < carouselWidth - cardWidth * 4) {
          scrollPosition += cardWidth;
          $("#carouselExampleControls .carousel-inner").animate(
            { scrollLeft: scrollPosition },
            600
          );
        }
      }
    );
    $("#carouselExampleControls .carousel-control-prev").unbind();
    $("#carouselExampleControls .carousel-control-prev").on(
      "click",
      function () {
        if (scrollPosition > 0) {
          scrollPosition -= cardWidth;
          $("#carouselExampleControls .carousel-inner").animate(
            { scrollLeft: scrollPosition },
            600
          );
        }
      }
    );
  } else {
    $(multipleCardCarousel).addClass("slide");
  }
}

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY =
  "live_Wav4bwy9xSzMtY5dxDWzZaZaI4PjIpyEQ2jGItCxW8D7WspoHRqCH8PyFdnhbmrc";

const url = `https://api.thecatapi.com/v1/breeds`;
let storedBreeds = [];
let storedImages = [];

let images_url = 'https://api.thecatapi.com/v1/images/search?limit=10&';

async function imagesLoad(breed_id, breed_name='none') {
  //https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=beng&api_key=REPLACE_ME
  const final_images_url = `${images_url}breed_ids=${breed_id}`;

  if (breed_name == 'none') {
    breed_name = 'kitty';
  }
  try {
    const response2 = await axios.get(final_images_url, {
      headers: {
        "x-api-key": API_KEY,
      },
    });
    let data2 = response2.data;
    storedImages = [];
    storedImages = data2;
    for (let i = 0; i < storedImages.length; i++) {
      const image = storedImages[i];

      if (!image) continue;
      const breedImgSrc = `https://cdn2.thecatapi.com/images/${image.id}.jpg`;

      const breedImgAlt = breed_name;
      const breedImgId = image.id;
      const newCat = createCarouselItem(breedImgSrc, breedImgAlt, breedImgId);
      appendCarousel(newCat);
    }
  } catch (error) {
    console.log(error);
  }
}

async function initialLoad() {
  try {
    const response = await axios.get(url, {
      headers: {
        "x-api-key": API_KEY,
      },
    });
    console.log("Response:", response);
    let data = response.data;
    // Filter to only include those with an `image` object
    data = data.filter((img) => img.image?.url != null);
    storedBreeds = data;

    for (let i = 0; i < storedBreeds.length; i++) {
      const breed = storedBreeds[i];
      let option = document.createElement("option");
      // Skip any breeds that don't have an image
      if (!breed.image) continue;
      // Use the current array index
      option.value = `${breed.id}`;

      option.innerHTML = `${breed.name}`;
      document.getElementById("breedSelect").appendChild(option);
    }
    // Show the first breed by default
    showBreedImage(0);

  } catch (error) {
    console.log(error);
  }

}

function showBreedImage(index) {
  const breedImgSrc = `https://cdn2.thecatapi.com/images/${storedBreeds[index].image.id}.jpg`;

  const breedImgAlt = storedBreeds[index].name
  const breedImgId = storedBreeds[index].id
  const newCat = createCarouselItem(breedImgSrc, breedImgAlt, breedImgId);
  appendCarousel(newCat);
}

initialLoad();
document.addEventListener("DOMContentLoaded", function () {
  

  // Event handler for breedSelect
  breedSelect.addEventListener("change", async function () {
    // Get the selected breed ID
    const selectedBreedId = this.value;

    try {
      const response = await axios.get(`https://api.thecatapi.com/v1/images/search?breed_id=${selectedBreedId}`, {
        headers: {
          "x-api-key": API_KEY,
        },
      });
    
      const data = response.data;
    
      // Clear the existing carousel items
      clear();
//first image

      data.forEach(image => {
        const breedImgSrc = image.url;
        const breedImgAlt = image.breeds[0].name; // Assuming the first breed in the array is the primary breed
        const breedImgId = image.id;
        description = image.breeds[0].description;
        const newCat = createCarouselItem(breedImgSrc, breedImgAlt, breedImgId);
        appendCarousel(newCat);
      });
// Create and append new carousel items for each image of the selected breed
      imagesLoad(selectedBreedId);

      let catInfo = document.createElement("p")
      catInfo.innerHTML = description;
      infoDump.appendChild(catInfo)

    } catch (error) {
      console.error("Error fetching breed images:", error);
    }
  });
});



/*
 * 4. 
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */
/*
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */

/*
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */

/*
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */
/*
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
// export async function favourite(imgId) {
//   // your code here
// }

/*
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */

/*
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */
