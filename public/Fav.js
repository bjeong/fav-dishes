export default class Fav {

  constructor(data) {
    this.importJSON(data)
  }

  // Given the provided JSON data
  // copy all fields into this object
  importJSON = (data) => {
    for (const key in data) { this[key] = data[key] }
  }

  // Below we prepare a JSON object (e.g. for saving to a database)
  exportJSON = () => {
    // FormData defines a checked checkbox with an "on" string 
    // but we prefer to save it as a boolean   
    // so we convert it here to a simple true/false value.
    this.vegan = (this.vegan == "on") ? true : false;
    // build a JSON object that the database will respect.
    return {
      name: this.name,
      restaurant: this.restaurant,
      location: this.location,
      description: this.description,
      fileName: this.fileName,
      // rating: this.rating,
      cost: this.cost,
      vegan: this.vegan
    }
  }

  // In this iteration the Create and Update are combined 
  // into a single "save" function
  save = () => {
    let method = "POST"
    let endpoint = '/api/fav/'
    if (this._id) {
      method = "PUT"
      endpoint = '/api/fav/' + this._id
    }
    fetch(endpoint, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.exportJSON())
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        this.importJSON(data)
        // add the newly created fav to the page.
        this.render()
        // auto scroll to the newly created fav.
        $(`[data-id="${this._id}"]`).scrollIntoView()
      })
      .catch(error => console.log(error))
  }

  // delete this fav from the database.
  // i.e. remove the data for this fav from the database
  // by means of an API endpoint using the DELETE method
  delete = () => {
    fetch('/api/fav/' + this._id, { "method": "DELETE" })
      .then(response => response.json())
      .then(response => {
        // also remove fav from page layout
        this.remove()
      })
      .catch(error => console.log(error))
  }


  // Below we have a function that populates the HTML form with data
  edit = () => {
    const favForm = $('#favForm');
    favForm.elements['_id'].value = this._id
    favForm.elements['name'].value = this.name
    favForm.elements['restaurant'].value = this.restaurant
    favForm.elements['location'].value = this.location
    favForm.elements['description'].value = this.description

    // set a hidden fileName field but also set the preview image
    preview.setAttribute('src', '/uploads/' + this.fileName)
    favForm.elements['fileName'].value = this.fileName

    // favForm.elements['rating'].value = this.rating
    favForm.elements['cost'].value = this.cost

    // note the use of the "checked" property insstead of the usual "value"
    favForm.elements['vegan'].checked = this.vegan
    // set the heading for the form to match our intentions.
    $('#favForm h2').innerHTML = `Edit ${this.name}`
    // make the form appear (normally it is set to display="none")
    favForm.style.display = 'flex'
    // auto-scroll to the top of the page when editing a fav.
    $('body').scrollIntoView();
  }

  // remove this fav from the page
  remove = () => {
    $(`[data-id="${this._id}"]`).remove();
  }

  // render the fav's template on the page
  render = () => {
    // build an html template
    const template = this.template()
    // look for an already existing version on the page
    const existing = $(`[data-id="${this._id}"]`);
    // if a previous version exists, replace it
    if (existing) $('#content').replaceChild(template, existing)
    // if this is a new fav, add it to the top of the page.
    else $('#content').prepend(template)
    // activate the edit button
    $(`[data-id="${this._id}"] button.edit`)
      .addEventListener('click', (event) => this.edit())
    // activate the delete button
    $(`[data-id="${this._id}"] button.delete`)
      .addEventListener('click', (event) => this.delete())
  }

  // build an html template for this fav
  template = () => {
    let div = document.createElement('div')
    div.classList.add('fav')
    // attach the _id of the fav to a data-id attribute.
    // this helps us to easily identify it elsewhere in our code.
    div.setAttribute('data-id', this._id)
    let favHTML =
      // <a href="${this.imageURL()}" target="_blank">
      //       <img src="/open.svg" alt="Open">
      //     </a>

      // <div class="stat">
      //       <h4>rating</h4>
      //       <meter min="0" max="5" value="${this.rating}"></meter> 
      //     </div>

      // <div class="stats">
      //       <div class="stat">
      //       <h3 class="restaurant">cost</h3>
      //        <meter min="0" max="3" value="${this.cost}"></meter> 
      //      </div> 
      //             </div>
      `<section class="image" style="background-image: url(${this.imageURL()})"> 
          
        </section>
        <section class="information">
          <header > 
          <div class="basicInfo"> 
            <h2 class="name"> ${this.name}</h2>
            <h3 class="restaurant">  
            <img src="/restaurant.svg" class="locationIcon" alt="home">
              <span class="restaurant">${this.restaurant}</span>
                  
            </h3>
            <h3 class="restaurant">
              <img src="/location.svg" class="locationIcon" alt="Location">
             ${this.location}</h3>

               <h3 class="restaurant">
              <img class="locationIcon" src="https://upload.wikimedia.org/wikipedia/commons/1/14/Dollar_Sign.svg" alt="Dollar Sign Icon Svg@pngkey.com">
            <meter min="0" max="5" value="${this.cost}"></meter> </h3>
              
          </div>
        </header>
        <main>
          <p class="description">${this.description}</p>
        
        

   
          <div class="badges">
            ${this.badge()}
          </div>
          <div class="options">
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
          </div>
        </main>
        </section>
      `
    div.innerHTML = favHTML
    return div
  }


  badge = () => {
    return (this.vegan) ?
      '<div class="badge success">Vegan Friendly</div>' :
      '<div class="badge alert">Not Vegan Friendly</div>'
  }

  imageURL = () => {
    return (this.fileName) ? '/uploads/' + this.fileName : '/photo.svg';
  }

  // svg = () => {
  //   return `<svg xmlns="http://www.w3.org/2000/svg" stroke="currentlocation" fill="${this.location}" stroke-width="0" viewBox="0 0 512 512"> <use href="#catIcon" /> </svg>`
  // }


}