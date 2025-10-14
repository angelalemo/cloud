document.addEventListener('DOMContentLoaded', () => {
  const idInput = document.getElementById('id');
  const adminusernameInput = document.getElementById('username');
  const adminpasswordInput = document.getElementById('password');
  const submitButton = document.getElementById('submit');

  submitButton.addEventListener('click', async (event) => {
    event.preventDefault();

    const id = idInput.value.trim();
    const adminusername = adminusernameInput.value.trim();
    const adminpassword = adminpasswordInput.value.trim();

    fetch('/adminfunc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, adminusername, adminpassword })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Admin added successfully');
        } else {
          alert('Failed to add admin: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        alert('An error occurred. Please try again later.');
      });
    
  });
});