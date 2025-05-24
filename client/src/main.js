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

    deleteBtn.addEventListener("click", async () => {
      await deleteData(element.id);
      deleteBtn.parentElement.remove();
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

const messageHandler = () => {
  commentsContainer.classList.toggle("hidden");
  if (messagesBtn.textContent === "Show Messages") {
    messagesBtn.textContent = "Hide Messages";
  } else {
    messagesBtn.textContent = "Show Messages";
  }
};

messagesBtn.addEventListener("click", messageHandler);

coordinator();
