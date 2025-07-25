// Helper function to get all users
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

// Helper function to save all users
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// When page loads
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  // Handle Login
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const role = document.getElementById("role").value;
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      if (role === "user") {
        const users = getUsers();
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
          localStorage.setItem("loggedInUser", JSON.stringify(user));
          window.location.href = "user-dashboard.html";
        } else {
          alert("Invalid user credentials");
        }
      } else if (role === "admin") {
        if (username === "admin" && password === "admin") {
          localStorage.setItem("adminLoggedIn", "true");
          window.location.href = "admin-dashboard.html";
        } else {
          alert("Invalid admin credentials");
        }
      }
    });
  }

  // Handle Registration
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const account = document.getElementById("regAccount").value;
      const username = document.getElementById("regUsername").value;
      const password = document.getElementById("regPassword").value;

      const users = getUsers();
      if (users.some(u => u.username === username)) {
        alert("Username already exists!");
        return;
      }

      users.push({ account, username, password, balance: 0 });
      saveUsers(users);
      alert("Registration successful!");
      window.location.href = "index.html";
    });
  }

  // Admin Dashboard
  if (document.getElementById("customerList")) {
    const users = getUsers();
    const list = document.getElementById("customerList");
    users.forEach(user => {
      const li = document.createElement("li");
      li.textContent = `Account: ${user.account}, Username: ${user.username}, Balance: ₹${user.balance}`;
      list.appendChild(li);
    });
  }

  // User Dashboard
  if (document.getElementById("balance")) {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    document.getElementById("balance").textContent = user.balance;
  }
});

// Deposit Function
function depositMoney() {
  const amount = parseFloat(document.getElementById("depositAmount").value);
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!isNaN(amount) && amount > 0) {
    const users = getUsers();
    const index = users.findIndex(u => u.username === user.username);

    users[index].balance += amount;
    saveUsers(users);

    localStorage.setItem("loggedInUser", JSON.stringify(users[index]));
    document.getElementById("balance").textContent = users[index].balance;
    alert("Amount deposited successfully!");
  } else {
    alert("Enter a valid deposit amount.");
  }
}
