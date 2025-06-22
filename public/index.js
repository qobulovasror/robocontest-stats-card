//Get elements
const form = document.getElementById('form');
const spinner = document.getElementById('spinner');
const card = document.getElementById('card');
const preview = document.getElementById('preview');

//Get buttons
const generateButton = document.getElementById('generate');
const getLinkButton = document.getElementById('get-link');
const openInNewTabButton = document.getElementById('open-in-new-tab');

//check if the username exists on Robocontest
const checkUsername = async (username) => {
  try {
    const response = await fetch(`/cards/robocontest/${encodeURIComponent(username)}`);
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

//Gemerate handler
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  spinner.classList.remove('d-none');
  card.classList.add('d-none');
  const username = document.getElementById('username').value.trim();
  const extension_type = document.getElementById('extension_type').value;
  const theme = document.getElementById('theme').value;
  if (!username) {
    Swal.fire({
      title: "Error!",
      text: "Please enter a username",
      icon: "error"
    });
    return;
  }

  const exists = await checkUsername(username);
  if (!exists) {
    Swal.fire({
      title: "Error!",
      text: "Please check if the username exists on Robocontest.",
      icon: "error"
    });
    spinner.classList.add('d-none');
    return;
  }

  const cardUrl = `/cards/robocontest/${encodeURIComponent(username)}?extension_type=${extension_type}&theme=${theme}`;

  // Load the card
  preview.src = cardUrl;
  preview.onload = function () {
    spinner.classList.add('d-none');
    card.classList.remove('d-none');
    document.getElementById('link').value = "![Summary card]("+window.location.origin + cardUrl+")";
  };

  document.getElementById('copy-link').addEventListener('click', async () => {
    e.preventDefault();
    await navigator.clipboard.writeText("![Summary card]("+window.location.origin + cardUrl+")");
    Swal.fire({
      title: "Success!",
      text: "Link copied to clipboard",
      icon: "success"
    });
  });

  preview.onerror = function () {
    Swal.fire({
      title: "Error!",
      text: "Error loading card.",
      icon: "error"
    });
    card.classList.add('d-none');
    spinner.classList.add('d-none');
  };
});


//Get link handler
getLinkButton.addEventListener('click', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const extension_type = document.getElementById('extension_type').value;
  const theme = document.getElementById('theme').value;
  if (!username) {
    Swal.fire({
      title: "Error!",
      text: "Please enter a username",
      icon: "error"
    });
    return;
  }

  const exists = await checkUsername(username);
  if (!exists) {
    Swal.fire({
      title: "Error!",
      text: "Please check if the username exists on Robocontest.",
      icon: "error"
    });
    return;
  }

  const cardUrl = `/cards/robocontest/${encodeURIComponent(username)}?extension_type=${extension_type}&theme=${theme}`;
  await navigator.clipboard.writeText("![Summary card]("+window.location.origin + cardUrl+")");
  Swal.fire({
    title: "Success!",
    text: "Link copied to clipboard",
    icon: "success"
  });
});


//Open in new tab handler
openInNewTabButton.addEventListener('click', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const extension_type = document.getElementById('extension_type').value;
  const theme = document.getElementById('theme').value;
  if (!username) {
    Swal.fire({
      title: "Error!",
      text: "Please enter a username",
      icon: "error"
    });
    return;
  }

  const exists = await checkUsername(username);
  if (!exists) {
    Swal.fire({
      title: "Error!",
      text: "Please check if the username exists on Robocontest.",
      icon: "error"
    });
    return;
  }

  const cardUrl = `/cards/robocontest/${encodeURIComponent(username)}?extension_type=${extension_type}&theme=${theme}`;
  window.open(cardUrl, '_blank');
});
