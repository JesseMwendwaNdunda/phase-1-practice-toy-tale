let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");

  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Fetch and display toys
  fetch("http://localhost:3000/toys")
    .then(res => res.json())
    .then(toys => toys.forEach(renderToy));

  // Handle form submission
  const toyForm = document.querySelector(".add-toy-form");
  toyForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = e.target.name.value;
    const image = e.target.image.value;

    const newToy = {
      name: name,
      image: image,
      likes: 0
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(newToy)
    })
      .then(res => res.json())
      .then(renderToy);
  });
});

// Render toy to DOM
function renderToy(toy) {
  const toyCollection = document.getElementById("toy-collection");

  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;

  const likeBtn = card.querySelector(".like-btn");
  likeBtn.addEventListener("click", () => {
    const newLikes = toy.likes + 1;
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ likes: newLikes })
    })
      .then(res => res.json())
      .then(updatedToy => {
        toy.likes = updatedToy.likes; // update local toy data
        card.querySelector("p").textContent = `${updatedToy.likes} Likes`;
      });
  });

  toyCollection.appendChild(card);
}

