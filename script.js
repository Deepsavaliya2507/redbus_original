document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const authLinkContainer = document.querySelector(".nav-item-dropdown");

  if (user && authLinkContainer) {
    const accountText = authLinkContainer.querySelector("div");
    if (accountText) {
      accountText.innerHTML = `<i class="fa-regular fa-user"></i> Hi, ${user.name.split(" ")[0]} <i class="fa-solid fa-angle-down"></i>`;
    }

    const dropdownContent =
      authLinkContainer.querySelector(".dropdown-content");
    if (dropdownContent) {
      if (!dropdownContent.querySelector(".logout-btn")) {
        const divider = document.createElement("div");
        divider.className = "divider";

        const logoutBtn = document.createElement("a");
        logoutBtn.href = "#";
        logoutBtn.className = "logout-btn";
        logoutBtn.innerText = "Logout";
        logoutBtn.addEventListener("click", (e) => {
          e.preventDefault();
          localStorage.removeItem("currentUser");
          alert("Logged out successfully.");
          window.location.href = "index.html";
        });

        dropdownContent.appendChild(divider);
        dropdownContent.appendChild(logoutBtn);
      }

      const loginLink = Array.from(dropdownContent.querySelectorAll("a")).find(
        (a) => a.href.includes("login.html"),
      );
      if (loginLink) loginLink.style.display = "none";
    }
  }

  const path = window.location.pathname;

  if (path.includes("signup.html")) {
    const signupForm = document.querySelector("form");
    if (signupForm) {
      signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const inputs = signupForm.querySelectorAll("input");
        const name = inputs[0].value;
        const email = inputs[1].value;
        const mobile = inputs[2].value;
        const password = inputs[3].value;

        if (name && email && mobile && password) {
          const newUser = { name, email, mobile, password };
          localStorage.setItem("currentUser", JSON.stringify(newUser));
          alert("Account created successfully! Logging you in...");
          window.location.href = "index.html";
        } else {
          alert("Please fill in all fields.");
        }
      });
    }
  }

  if (path.includes("login.html")) {
    const loginBtn = document.querySelector(".submit-btn");
    if (loginBtn) {
      loginBtn.onclick = null;
      loginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const mobileInput = document.querySelector('input[type="text"]');
        if (mobileInput && mobileInput.value) {
          // Simulating Login
          const mockUser = { name: "RedBus User", mobile: mobileInput.value };
          localStorage.setItem("currentUser", JSON.stringify(mockUser));
          alert("OTP Verified. Logged in successfully!");
          window.location.href = "index.html";
        } else {
          alert("Please enter your mobile number.");
        }
      });
    }
  }

  document.addEventListener("contextmenu", (e) => e.preventDefault());

  function ctrlShiftKey(e, keyCode) {
    return e.ctrlKey && e.shiftKey && e.keyCode === keyCode.charCodeAt(0);
  }

  document.onkeydown = (e) => {
    if (
      event.keyCode === 123 ||
      ctrlShiftKey(e, "I") ||
      ctrlShiftKey(e, "J") ||
      ctrlShiftKey(e, "C") ||
      (e.ctrlKey && e.keyCode === "U".charCodeAt(0))
    )
      return false;
  };

  const forms = document.querySelectorAll("form");

  const showStatus = (message, type = "success") => {
    const statusDiv = document.getElementById("status-message");
    if (statusDiv) {
      statusDiv.style.display = "block";
      statusDiv.className =
        type === "success" ? "status-success" : "status-error";
      statusDiv.innerHTML = message.replace(/\n/g, "<br>");
    } else {
      alert(message);
    }
  };

  forms.forEach((form) => {
    if (form.querySelector('input[type="password"]')) return;
    if (form.id === "change-date-form") return;

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.onclick = null;
      submitBtn.addEventListener("click", (e) => {
        e.preventDefault();

        const pageTitle = document.title;
        const inputs = form.querySelectorAll("input");
        let valid = true;
        inputs.forEach((input) => {
          if (!input.value) valid = false;
        });

        if (!valid) {
          showStatus("Please fill in all required fields.", "error");
          return;
        }

        if (pageTitle.includes("Cancel")) {
          showStatus(
            "Searching for ticket... <br><strong>Ticket found! Refund amount: ₹850.</strong><br>Cancellation processed successfully.",
          );
        } else if (pageTitle.includes("Show My Ticket")) {
          showStatus(
            "<strong>Ticket Details:</strong><br><br>Bus: VRL Travels<br>From: Bangalore<br>To: Hyderabad<br>Date: 25th Aug<br>Seat: L4, L5<br><br><em>(Ticket downloaded)</em>",
          );
        } else if (pageTitle.includes("Email / SMS")) {
          showStatus(
            "Ticket details have been sent to your email and mobile number.",
          );
        }
      });
    }
  });

  if (window.location.pathname.includes("change_date.html")) {
    const searchBtn = document.getElementById("search-btn");
    const confirmBtn = document.getElementById("confirm-btn");
    const newDateSection = document.getElementById("new-date-section");
    const newDateInput = document.getElementById("new-date");

    const showChangeDateStatus = (message, type = "success") => {
      const statusDiv = document.getElementById("status-message");
      if (statusDiv) {
        statusDiv.style.display = "block";
        statusDiv.className =
          type === "success" ? "status-success" : "status-error";
        statusDiv.innerHTML = message;
      }
    };

    if (searchBtn && newDateSection) {
      const today = new Date().toISOString().split("T")[0];
      if (newDateInput) newDateInput.setAttribute("min", today);

      searchBtn.addEventListener("click", () => {
        const ticketNo = document.getElementById("ticket-no").value;
        const emailId = document.getElementById("email-id").value;
        const statusDiv = document.getElementById("status-message");
        if (statusDiv) statusDiv.style.display = "none";

        if (ticketNo && emailId) {
          searchBtn.innerText = "Searching...";
          setTimeout(() => {
            searchBtn.innerText = "SEARCH";
            searchBtn.style.display = "none";
            document.getElementById("ticket-no").disabled = true;
            document.getElementById("email-id").disabled = true;

            newDateSection.style.display = "block";
            showChangeDateStatus(
              "Ticket found! Please select a new travel date below.",
              "success",
            );
          }, 1000);
        } else {
          showChangeDateStatus("Please enter Ticket No and Email ID.", "error");
        }
      });

      confirmBtn.addEventListener("click", () => {
        const newDate = newDateInput.value;
        if (newDate) {
          showChangeDateStatus(
            `Success! Your travel date has been changed to <strong>${newDate}</strong>.<br>An updated ticket has been sent to your email.`,
          );
        } else {
          showChangeDateStatus("Please select a new date.", "error");
        }
      });
    }
  }

  const dateInput = document.getElementById("date");
  const today = new Date().toISOString().split("T")[0];
  if (dateInput) {
    dateInput.setAttribute("min", today);
    dateInput.value = today;
  }

  const swapBtn = document.querySelector(".swap-icon");
  const sourceInput = document.getElementById("source");
  const destInput = document.getElementById("destination");

  if (swapBtn && sourceInput && destInput) {
    swapBtn.addEventListener("click", () => {
      const icon = swapBtn.querySelector("i");
      if (icon) {
        icon.style.transition = "transform 0.3s";
        icon.style.transform = "rotate(180deg)";
        setTimeout(() => {
          icon.style.transform = "rotate(0deg)";
        }, 300);
      }

      const temp = sourceInput.value;
      sourceInput.value = destInput.value;
      destInput.value = temp;
    });
  }

  const searchBtn = document.querySelector(".search-btn");
  if (searchBtn) {
    if (!window.location.pathname.includes("search_results.html")) {
      searchBtn.addEventListener("click", () => {
        const source = sourceInput ? sourceInput.value : "";
        const dest = destInput ? destInput.value : "";
        const date = dateInput ? dateInput.value : "";

        if (source && dest && date) {
          window.location.href = `search_results.html?from=${encodeURIComponent(source)}&to=${encodeURIComponent(dest)}&date=${encodeURIComponent(date)}`;
        } else {
          alert("Please fill in all fields to search buses.");
        }
      });
    }
  }

  const navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
      } else {
        navbar.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
      }
    });
  }
});
