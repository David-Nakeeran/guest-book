const form = document.querySelector("form");

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
};

form.addEventListener("submit", submitHandler);
