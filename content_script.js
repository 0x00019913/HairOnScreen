var w = 200;
var h = 200;
var imageUrls = [
  'assets/h1.png',
  'assets/h2.png',
  'assets/h3.png',
  'assets/h4.png',
  'assets/h5.png',
  'assets/h6.png',
  'assets/h7.png',
  'assets/h8.png',
  'assets/h9.png',
  'assets/h10.png',
  'assets/h11.png',
  'assets/h12.png',
  'assets/h13.png',
  'assets/h14.png',
  'assets/h15.png'
];

render();

function render() {
  // get the number of images in the global store
  chrome.storage.sync.get("numHairImages", function(items) {
    var numHairImages = 1;
    if (items.hasOwnProperty("numHairImages")) {
      numHairImages = items.numHairImages;
    }
    // if no image number in the store, store the default number
    else {
      chrome.storage.sync.set( {"numHairImages": numHairImages } );
    }
    
    insertImages(numHairImages);
  });
}

function insertImages(numHairImages) {
  chrome.storage.sync.get("hairImages", function(items) {
    var hairImages = [];
    var needUpdate = false;
    
    if (items.hasOwnProperty("hairImages")) {
      hairImages = items.hairImages;
    }

    for (var i=0; i<numHairImages; i++) {
      var imageObject = hairImages[i];
      if (imageObject === undefined) {
        needUpdate = true;
        imageObject = constructImageObject();
        hairImages[i] = imageObject;
      }
      
      var image = document.createElement("div");
      image.className = "screenHairImage";

      image.style.width = w + "px";
      image.style.height = h + "px";
      image.style.left = imageObject.leftOffset + "px";
      image.style.top = imageObject.topOffset + "px";

      var absoluteUrl = chrome.runtime.getURL(imageObject.url);
      image.style.backgroundImage = "url('" + absoluteUrl + "')";

      document.body.appendChild(image);
    }
    
    if (needUpdate) chrome.storage.sync.set( { "hairImages": hairImages } );
  });
}

function randomOffset() {
  var leftOffset = Math.round(Math.random() * (window.screen.width - w));
  var topOffset = Math.round(Math.random() * (window.screen.height - h));
  return [leftOffset, topOffset];
}

function randomImage() {
  return imageUrls[Math.floor(Math.random() * imageUrls.length)];
}

function constructImageObject() {
  var offset = randomOffset();
  
  return {
    leftOffset: offset[0],
    topOffset: offset[1],
    url: randomImage()
  };
}

// debugging function
function resetStoreVariables() {
  chrome.storage.sync.remove(["numHairImages", "hairImages"], function() {
    chrome.storage.sync.get("numHairImages", function(items) {
      console.log(items);
    });
    chrome.storage.sync.get("hairImages", function(items) {
      console.log(items);
    });
  });
}