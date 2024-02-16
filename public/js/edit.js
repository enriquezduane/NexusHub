document.addEventListener('click', (event) => {
    const clickedElement = event.target;

    if (clickedElement.classList.contains('edit-button')) {
        const postArea = clickedElement.closest('.post-area');
        const postContent = postArea.querySelector('.post-content');

        // Check if a textarea already exists
        let textarea = postArea.querySelector('.edit-post-textarea');
        if (!textarea) {
            // Create a new textarea if it doesn't exist
            textarea = document.createElement('textarea');
            textarea.className = 'edit-post-textarea';
            postContent.innerHTML = postContent.innerHTML.replace(/<(?!br>)(?!\/br>)/g, '[').replace(/(?<!<br)(?<!<\/br)>/g, ']');
            textarea.value = postContent.innerText.trim(); // Use innerText to preserve newline characters
            setDimensions(textarea, postContent);

            // Create save button
            const saveButton = document.createElement('button');
            saveButton.textContent = 'Save';
            saveButton.className = 'save-button';

            // Create cancel button
            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancel';
            cancelButton.className = 'cancel-button';

            // Create buttons div to contain save and cancel buttons
            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'edit-buttons';
            buttonsDiv.appendChild(saveButton);
            buttonsDiv.appendChild(cancelButton);

            // Hide original post content
            postContent.style.display = 'none';

            // Insert textarea before the post content
            postArea.insertBefore(textarea, postContent);
            // Insert buttons below the textarea
            postArea.insertBefore(buttonsDiv, postContent.nextSibling);

            // Event listener for the save button
            saveButton.addEventListener('click', async () => {
                // Get the closest post or reply container
                const postContainer = clickedElement.closest('.post-section');

                // Get the updated content
                const updatedContent = textarea.value.replace(/\n/g, '<br>').replace(/\[/g, '<').replace(/\]/g, '>');

                // Determine if the container is a post or a reply
                const isReply = postContainer.classList.contains('reply-section');

                // Get the post title
                const postTitle = postContainer.querySelector('.post-name').textContent.trim();
                
                try {
                    const response = await fetch(`/post/${postTitle}`, {
                        method: 'PATCH', // or 'PUT' depending on backend API
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ type: (isReply ? 'reply' : 'post'), content: updatedContent, title: postTitle})
                    });

                    if (!response.ok) {
                        throw new Error('Failed to update post');
                    }

                    postContent.innerHTML = updatedContent; // Convert newline characters to <br> tags
                    postContent.style.display = ''; // Show original post content
                    textarea.remove();
                    buttonsDiv.remove();

                    alert('Edited ' + (isReply ? 'reply' : 'post') + ' successfully');
                } catch (error) {
                    console.error('Error:', error.message);
                }
            });

            // Event listener for the cancel button
            cancelButton.addEventListener('click', () => {
                postContent.innerHTML = postContent.innerHTML.replace(/\[/g, '<').replace(/\]/g, '>'); // Convert newline characters to <br> tags
                postContent.style.display = ''; // Show original post content
                textarea.remove();
                buttonsDiv.remove();
            });
        } else {
            // Focus on the existing textarea
            textarea.focus();
        }
    }
});

function setDimensions(textarea, element) {
    textarea.style.fontSize = getComputedStyle(element).fontSize;
    textarea.style.fontFamily = getComputedStyle(element).fontFamily;
    textarea.style.lineHeight = getComputedStyle(element).lineHeight;
    textarea.style.width = getComputedStyle(element).width;
    textarea.style.height = getComputedStyle(element).height;
}