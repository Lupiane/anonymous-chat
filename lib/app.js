const batch = 65; // change to your own batch id
const baseUrl = `https://wagon-chat.herokuapp.com/${batch}/messages`;

// Your turn to code!
const cleanMessageList = () => {
  document.querySelectorAll("li").forEach((element) => {
    element.remove();
  })
};

const insertMessage = (message, author, date) => {
  const elapsedTime = Math.round((Date.now() - new Date(date)) / 60000);
  document.querySelector(".list")
    .insertAdjacentHTML("afterbegin", `<li>${message} (posted <span class="date">${elapsedTime} minutes ago</span>) by ${author}</li>`);
};

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();

  const message = document.getElementById("your-message").value;
  const author = document.getElementById("your-name").value;

  fetch(`${baseUrl}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ "author": author, "content": message })
  })
    .then(response => response.json())
    .then((data) => {
      insertMessage(data.content, data.author, data.created_at);
    });
});

const refresh = () => {
  fetch(`${baseUrl}`)
  .then(response => response.json())
  .then((data) => {
    cleanMessageList();
    data.messages.forEach((message) => {
      insertMessage(message.content, message.author, message.created_at);
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  setInterval(refresh, 5000);
});
