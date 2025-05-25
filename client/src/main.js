const form = document.querySelector("form");
const commentsContainer = document.getElementById("comments-container");
const likes = document.querySelectorAll("[data-like]");
const messagesBtn = document.getElementById("messages-btn");

const submitHandler = async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const formValues = Object.fromEntries(formData);

  const response = await fetch("http://localhost:8080", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formValues),
  });
  const result = await response.json();
  if (result.success) {
    form.reset();
  }
  coordinator();
};

form.addEventListener("submit", submitHandler);

const createElements = (arr) => {
  arr.forEach((element, index) => {
    const messageContainer = document.createElement("div");
    messageContainer.setAttribute("data-index", index);
    messageContainer.classList.add("message");
    commentsContainer.append(messageContainer);

    const firstNamePara = document.createElement("p");
    const surnamePara = document.createElement("p");
    const messagePara = document.createElement("p");
    const likesContainer = document.createElement("div");
    const likesCounterPara = document.createElement("p");
    const likesTextPara = document.createElement("p");
    const btnContainer = document.createElement("div");

    btnContainer.classList.add("button-container");

    firstNamePara.textContent = `First name: ${element.first_name}`;
    surnamePara.textContent = `Surname: ${element.surname}`;
    messagePara.textContent = `Message: ${element.message}`;
    likesTextPara.textContent = "Likes: ";
    likesCounterPara.textContent = parseInt(element.likes) || 0;

    const likeBtn = document.createElement("button");
    likeBtn.setAttribute("data-like", element.id);
    likeBtn.textContent = "Like";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete Message";

    // I had originally assigned each message container with the id from the db and then would set an event listener for getting the id with event object target.id. Also taking into account empty strings.
    // However Elena came up with a better solution that was a lot easier to deal with, I've used this for the deleteBtn functionality, give her a gold star!
    deleteBtn.addEventListener("click", async () => {
      await deleteData(element.id);
      deleteBtn.parentElement.parentElement.remove();
    });

    likeBtn.addEventListener("click", async () => {
      const result = await updateLikeMessageData(element.id);
      if (!result.success) {
        return;
      }
      likesCounterPara.textContent++;
    });

    likesContainer.classList.add("likes-container");

    btnContainer.append(deleteBtn, likeBtn);
    likesContainer.append(likesTextPara, likesCounterPara);
    messageContainer.append(
      firstNamePara,
      surnamePara,
      messagePara,
      likesContainer,
      btnContainer
    );
  });
};

const getData = async () => {
  try {
    const response = await fetch("http://localhost:8080");
    const data = await response.json();
    return data.messages;
  } catch (error) {
    console.error(error);
  }
};

const deleteData = async (id) => {
  try {
    const response = await fetch(`http://localhost:8080/${id}`, {
      method: "DELETE",
    });
    await response.json();
  } catch (error) {
    console.error(error);
  }
};

const updateLikeMessageData = async (id) => {
  try {
    const response = await fetch(`http://localhost:8080/${id}/likes`, {
      method: "PUT",
    });
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

const coordinator = async () => {
  commentsContainer.innerHTML = "";
  const data = await getData();
  createElements(data);
};

const messageHandler = (e) => {
  commentsContainer.classList.toggle("hidden");
  if (messagesBtn.textContent === "Show Messages") {
    messagesBtn.textContent = "Hide Messages";
  } else {
    messagesBtn.textContent = "Show Messages";
  }
  // Checks browser supports web animations api
  if (document.body.animate) {
    // Create multiply particles
    for (let i = 0; i < 25; i++) {
      // Passing in mouse click coordinates
      createParticles(e.clientX, e.clientY);
    }
  }
};

// Create particles for submit button click
const createParticles = (x, y) => {
  const particle = document.createElement("particle");
  document.body.append(particle);

  // Generates a random size between 5 and 28
  const size = Math.floor(Math.random() * 28) + 5;
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;

  // Generate a random color in a blue/purple palette
  // Haven't changed this from the tutorial
  particle.style.background = `hsl(${Math.random() * 90 + 180}, 70%, 60%)`;

  // Random destination with 75px of mouse click
  const destinationX = x + (Math.random() - 0.5) * 2 * 75;
  const destinationY = y + (Math.random() - 0.5) * 2 * 75;

  const animation = particle.animate(
    [
      {
        // Set the origin position of the particle
        // Offset the particle with half its size to center it around the mouse
        transform: `translate(${x - size / 2}px, ${y - size / 2}px)`,
        opacity: 1,
      },
      {
        // Final coordinates as the second keyframe
        transform: `translate(${destinationX}px, ${destinationY}px)`,
        opacity: 0,
      },
    ],
    {
      // Set a random duration from 500 to 1500ms
      duration: 500 + Math.random() * 1000,
      easing: "cubic-bezier(0, .9, .57, 1)",
      // Delay every particle with a random value from 0ms to 200ms
      delay: Math.random() * 200,
    }
  );
  // Removed element after animation has finished
  animation.onfinish = () => {
    particle.remove();
  };
};

messagesBtn.addEventListener("click", messageHandler);

coordinator();
