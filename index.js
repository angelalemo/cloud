// index.js
document.addEventListener('DOMContentLoaded', () => {
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const submitButton = document.getElementById('submit');

  submitButton.addEventListener('click', async (event) => {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    try {
      const response = await fetch('/users'); 
      const users = await response.json();

      const matchedUser = users.find(
        (user) => user.username === username && user.password === password
      );

      if (matchedUser) {
        alert('login completed');
      } else {
        alert('username or password is incorrect');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('An error occurred. Please try again later.');
    }
  });
});
