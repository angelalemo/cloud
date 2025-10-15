document.addEventListener('DOMContentLoaded', () => {
  const idInput = document.getElementById('id');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const submitButton = document.getElementById('submit');

  submitButton.addEventListener('click', async (event) => {
    event.preventDefault();

    const id = idInput.value.trim();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    fetch('/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, username, password })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert(' added successfully');
        } else {
          alert('Failed to add : ' + data.message);
        }
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        alert('An error occurred. Please try again later.');
      });
    
  });
});