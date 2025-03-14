const postsContainer = document.getElementById("posts-container");
const postForm = document.getElementById("post-form");
const titleInput = document.getElementById("title");
const bodyInput = document.getElementById("text");
const searchInput = document.getElementById("find-post");

let posts = []; // Local saving of posts
let currentPage = 1;
const postsPerPage = 10;

// Function to get all posts
async function fetchPosts() {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    posts = await response.json();
    displayPosts();
}

fetchPosts();

// Search function
searchInput.addEventListener("input", () => {
    currentPage = 1;
    displayPosts();
});

// Pagination creation function
function displayPosts() {
    postsContainer.innerHTML = "";

    const query = searchInput.value.toLowerCase();
    const filteredPosts = posts.filter(post => post.title.toLowerCase().includes(query));

    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    paginatedPosts.forEach(post => {
        const postElement = document.createElement("div");
        postElement.classList.add("post");
        postElement.style.border = "1px solid #c6c6c6";
        postElement.style.borderRadius = "5px";
        postElement.style.padding = "1rem";
        postElement.style.marginBottom = "1rem";
        postElement.style.backgroundColor = "#f8f9fa";

        const titleElement = document.createElement("div");
        titleElement.textContent = post.title;
        titleElement.style.fontSize = "1.4rem";
        titleElement.style.marginBottom = "1rem";
        titleElement.style.fontWeight = "bold";

        const viewText = document.createElement("div");
        viewText.textContent = "View the text of the post";
        viewText.style.cursor = "pointer";
        viewText.style.marginBottom = "1rem";
        viewText.style.color = "#0d6efd";
        viewText.style.fontSize = "0.9rem";

        const bodyElement = document.createElement("div");
        bodyElement.textContent = post.body;
        bodyElement.style.fontSize = "1.2rem";
        bodyElement.style.marginBottom = "0.4rem";
        bodyElement.style.display = "none";

        viewText.addEventListener("click", () => {
            viewText.style.display = "none"
            bodyElement.style.display = "block";
            hideText.style.display = "block"
        });

        const hideText = document.createElement("div");
        hideText.textContent = "Hide text";
        hideText.style.cursor = "pointer";
        hideText.style.marginBottom = "1rem";
        hideText.style.color = "#0d6efd";
        hideText.style.fontSize = "0.9rem";
        hideText.style.display = "none"

        hideText.addEventListener("click", () => {
            hideText.style.display = "none"
            bodyElement.style.display = "none";
            viewText.style.display = "block"
        });

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("btn", "btn-secondary");
        editButton.style.fontSize = "0.9rem";
        editButton.style.width = "5rem";
        editButton.style.marginRight = "1rem";
        editButton.onclick = () => editPost(post.id);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("btn", "btn-danger");
        deleteButton.style.fontSize = "0.9rem";
        deleteButton.style.width = "5rem";
        deleteButton.onclick = () => deletePost(post.id);

        postElement.appendChild(titleElement);
        postElement.appendChild(viewText);
        postElement.appendChild(bodyElement);
        postElement.appendChild(hideText);
        postElement.appendChild(editButton);
        postElement.appendChild(deleteButton);

        postsContainer.appendChild(postElement);
    });

    displayPagination(filteredPosts.length);
}

// Pagination creation function
function displayPagination(totalPosts) {
    const paginationContainer = document.getElementById("pagination");
    if (!paginationContainer) {
        const newPagination = document.createElement("div");
        newPagination.id = "pagination";
        newPagination.classList.add("mt-3", "d-flex", "justify-content-center");
        document.querySelector(".container").appendChild(newPagination);
    }

    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(totalPosts / postsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.style.fontSize = "0.9rem";
        pageButton.classList.add("btn", "btn-outline-primary", "mx-1");
        if (i === currentPage) {
            pageButton.classList.add("active");
        }
        pageButton.onclick = () => {
            currentPage = i;
            displayPosts();
        };
        paginationContainer.appendChild(pageButton);
    }
}

// New post creation function
postForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newPost = {
        id: Date.now(),
        title: titleInput.value,
        body: bodyInput.value,
        userId: 1
    };

    // Request to demonstrate working with the API (server does not save changes)
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost)
    });

    // Updating the local array (posts)
    const post = await response.json();
    posts.unshift(post);
    searchInput.value = "";
    displayPosts();
    postForm.reset();
    showCustomAlert("Post successfully added!");
});

// Post editing function
window.editPost = async (id) => {
    const post = posts.find(p => p.id === id);
    if (!post) return;

    const newTitle = prompt("Edit Title", post.title);
    const newBody = prompt("Edit Body", post.body);

    if (newTitle && newBody) {

        // Request to demonstrate working with the API (server does not save changes)
        await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newTitle, body: newBody })
        });

        // Updating the local array (posts)
        post.title = newTitle;
        post.body = newBody;
        displayPosts();
        showCustomAlert("Post successfully updated!");
    }
};

// Post deletion function
window.deletePost = async (id) => {

    // Request to demonstrate working with the API (server does not save changes)
    await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: "DELETE"
    });

    // Updating the local array (posts)
    posts = posts.filter(post => post.id !== id);
    displayPosts();
    showCustomAlert("Post successfully deleted!");
};

// Custom message display function
function showCustomAlert(message, duration = 3000) {
    const notification = document.getElementById("custom-notification");
    notification.textContent = message;
    notification.style.display = "block";

    setTimeout(() => {
        notification.style.display = "none";
    }, duration);
}


