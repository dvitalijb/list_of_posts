const headers = ['title', 'text', 'name', 'sublist'];

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

    return {posts, users, comments};
}

function createElement(content = '', tag = 'td') {
    const element = document.createElement(tag);

    typeof content === 'string'
        ? element.textContent = content
        : element.appendChild(content);

    return element;
}

function createContentUl(comments) {
    const ol = createElement('', 'ol');

    for (let key in comments) {
        const li = createElement('', 'li');
        const innerUl = createElement('', 'ul');
        const commentLi = createElement(comments[key].body, 'li');
        const authorCommentLi = createElement(comments[key].name, 'li');
        innerUl.append(commentLi, authorCommentLi);
        li.append(innerUl);
        ol.append(li);
    }

    return ol;
}

const createRow = propsMap => props => {
    const { usersMap, commentsMap } = propsMap;
    const { title, body, userId, id } = props;
    const { name } = usersMap[userId];
    const comments = {};

    for (let key in commentsMap) {
        if (commentsMap[key].postId === id) {
            comments[key] = commentsMap[key];
        }
    }

    const row = createElement('', 'tr');
    const titleTd = createElement(title);
    const bodyTd = createElement(body);
    const nameTd = createElement(name);
    const commentsTd = createElement();
    const commentsUl = createContentUl(comments);

    commentsTd.append(commentsUl);
    row.append(titleTd, bodyTd, nameTd, commentsTd);

    return row;
};

function createTable({posts, users, comments}) {
    const usersMap = users
        .reduce((acc, user) => ({...acc, [user.id]: user,}), {});
    const commentsMap = comments
        .reduce((acc, comment) => ({...acc, [comment.id]: comment,}), {});

    const table = createElement('', 'table');
    const thead = createElement('', 'thead');
    const tbody = createElement('', 'tbody');
    const headRow = createElement('', 'tr');

    const heads = headers.map(title => createElement(title, 'th'));
    const rows = posts.map(createRow({usersMap, commentsMap}));

    headRow.append(...heads);
    thead.append(headRow);
    tbody.append(...rows);
    table.append(thead, tbody);

    return table;
}

async function renderLists() {
    const date = await loadData();
    const table = createTable(date);

    document.body.append(table);
}

window.addEventListener('load', renderLists);
