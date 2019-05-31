async function loadData() {
    const postsPromise = fetch('https://jsonplaceholder.typicode.com/posts');
    const usersPromise = fetch('https://jsonplaceholder.typicode.com/users');
    const commentsPromise = fetch('https://jsonplaceholder.typicode.com/comments');
    const [
        postsResponse,
        usersResponse,
        commentsResponse
    ] = await Promise.all([
        postsPromise,
        usersPromise,
        commentsPromise
    ]);

    const posts = await postsResponse.json();
    const users = await usersResponse.json();
    const comments = await commentsResponse.json();
console.log({posts, users, comments})
    return {posts, users, comments};
}

async function renderLists() {
    const date = await loadData();
    const table = createTable(date);

    document.body.append(table);
}

window.addEventListener('load', renderLists);