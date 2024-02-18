// resize textarea to fit content dynamically
var textarea = document.querySelector('.create-post-textarea');

function resizeTextarea() {
  textarea.style.height = 'auto';
  textarea.style.height = (textarea.scrollHeight) + 'px';
}

textarea.addEventListener('input', resizeTextarea);

resizeTextarea();

// create post
document.querySelector('.create-post-form').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    // get form data
    const title = document.querySelector('#post-subject').value;
    const content = document.querySelector('#post-content').value;
    const boardId = window.location.pathname.split('/')[2];
  
    try {
      const response = await fetch('/forum/:id/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content, boardId })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Post created successfully! Redirecting to post...');
        window.location.href = `/forum/${boardId}/${data.id}`;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
});