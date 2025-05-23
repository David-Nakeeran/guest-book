const form = document.querySelector("form");
const commentsContainer = document.getElementById("comments-container");

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
    commentsContainer.append(messageContainer);

    const firstNamePara = document.createElement("p");
    const surnamePara = document.createElement("p");
    const messagePara = document.createElement("p");
    const likesPara = document.createElement("p");
    console.log(element.first_name);
    firstNamePara.textContent = `First name: ${element.first_name}`;
    surnamePara.textContent = `Surname: ${element.surname}`;
    messagePara.textContent = `Message: ${element.message}`;
    likesPara.textContent = `Likes: ${element.likes || 0}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.setAttribute("id", element.id);
    deleteBtn.textContent = "Delete Message";

    messageContainer.append(
      firstNamePara,
      surnamePara,
      messagePara,
      likesPara,
      deleteBtn
    );
  });
};

const getData = async () => {
  try {
    const response = await fetch("http://localhost:8080");
    const data = await response.json();
    console.log(data.messages);
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

const coordinator = async () => {
  commentsContainer.innerHTML = "";
  const data = await getData();
  createElements(data);
};

const handleDelete = async (e) => {
  await deleteData(Number(e.target.id));
  coordinator();
};

const deleteMessage = () => {
  const section = document.getElementById("comments-container");
  section.addEventListener("click", handleDelete);
};

deleteMessage();
coordinator();
