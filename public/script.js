// Import the Fav Module
import Fav from './Fav.js';

//Alphabetical Sort
const getFavs = (sort = 'name') => {
  console.log(sort)
  $('#content').style.background = '/load.svg'
  // fetch and render favs.
  fetch('/api/favs?sort=' + sort, { "method": "GET" })
    .then(response => response.json())
    .then(response => {
      $('#content').style.background = 'none'
      $('#content').innerHTML = ''
      response.forEach(data => {
        const fav = new Fav(data)
        fav.render()
      })
    })
    .catch(error => console.log(error))
}
//Cost Sort
const getCosts = (sort = 'cost') => {

  $('#content').style.background = '/load.svg'
  // fetch and render cost
  fetch('/api/favs?sort=' + sort, { "method": "GET" })
    .then(response => response.json())
    .then(response => {
      $('#content').style.background = 'none'
      $('#content').innerHTML = ''
      response.forEach(data => {
        const fav = new Fav(data)
        fav.render()
      })
    })
    .catch(error => console.log(error))
  console.log(sort)
}

// Vegan Sort
const getVegans = (sort = 'vegan') => {

  $('#content').style.background = '/load.svg'
  // fetch and render vegan
  fetch('/api/favs?sort=' + sort, { "method": "GET" })
    .then(response => response.json())
    .then(response => {
      $('#content').style.background = 'none'
      $('#content').innerHTML = ''
      response.forEach(data => {
        const fav = new Fav(data)
        fav.render()
      })
    })
    .catch(error => console.log(error))
  console.log(sort)
}


getFavs()


const upload = (theFile) => {
  // if the file is too big, prevent the upload
  if (theFile.size > 5 * 1024 * 1024) {
    alert('Maximum file size is 5MB')
  }
  else {
    // activate a loading animation during upload
    preview.setAttribute('src', '/load.svg')
    // send a POST request with the file in the request body
    const formData = new FormData()
    formData.append('image', theFile)
    fetch('/api/file', {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        // set the uploaded file to appear as a preview.
        preview.setAttribute('src', '/uploads/' + data.fileName)
        // set a hidden value to match the uploaded filename.
        // we can then save the metadata alongside the file.
        favForm.elements['fileName'].value = data.fileName
      })
      .catch(error => console.log(error))
  }
}



// Listen for clicks on the "Add a Fav" button
aToZButton.addEventListener('click', event => {
  favForm.reset()
  getFavs('name')
})


// Listen for clicks on the "Add a Fav" button
addButton.addEventListener('click', event => {
  favForm.reset()
  favForm.style.display = 'flex'
  $('body').scrollIntoView()
})

//Sort by veganfriendly button
veganFriendlyButton.addEventListener('click', event => {
  favForm.reset()
  getVegans('vegan')
})

//sort by cost
byCostButton.addEventListener('click', event => {
  favForm.reset()
  getCosts('cost')
})


// the browse button has its own event handler, 
// independed from the form as a whole
uploader.addEventListener('change', event => {
  upload(event.target.files[0])
})

// in addition to the default reset behaviour for form elements, 
// also reset the _id, image, heading, and visibility
favForm.addEventListener('reset', (e) => {
  favForm.elements['_id'].value = '';
  favForm.elements['fileName'].value = ''
  preview.setAttribute('src', '/photo.svg')
  $('#favForm h2').innerHTML = `Add a Fav`
  favForm.style.display = 'none';
})

// define a set of handler functions 
// to respond to various events
const formEvents = {
  // when the form is submitted, save the form  
  submit: (event) => {
    const formData = new FormData(event.target)
    const json = Object.fromEntries(formData)
    const fav = new Fav(json)
    fav.save()
    event.target.reset()
  },
  // add a visual cue to indifave drag and drop is ready
  dragenter: (event) => { event.currentTarget.className = "ready" },
  dragover: (event) => { event.currentTarget.className = "ready" },
  // if a drag and drop ends, hide the visual cue styling
  dragleave: (event) => { event.currentTarget.className = "" },
  drop: (event) => {
    event.currentTarget.className = ""
    // when a file is dropped onto the form, upload it.
    upload(event.dataTransfer.files[0])
  }
}

// iterate through all the above event handlers 
// and activate them on the image form
for (const [eventName, eventHandler] of Object.entries(formEvents)) {
  favForm.addEventListener(eventName, (event) => {
    // prevent default event handlers from running
    event.preventDefault()
    event.stopPropagation()
  })
  // listen for the event and attach the handler to it.
  favForm.addEventListener(eventName, eventHandler)
}


