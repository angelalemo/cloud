document.addEventListener('DOMContentLoaded', () => {
  const idInput = document.getElementById('id');
  const submitButton = document.getElementById('submit');

  submitButton.addEventListener('click', async (event) => {
    event.preventDefault();

    const id = idInput.value.trim();

    fetch(`/users/${id}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('User deleted successfully');
        } else {
          alert('Failed to delete user: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        alert('An error occurred. Please try again later.');
      });
  });
});