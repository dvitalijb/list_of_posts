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

function createContentUl(currentComments) {
    const ol = createElement('', 'ol');

    for (const comment of currentComments) {
        const li = createElement('', 'li');
        const innerUl = createElement('', 'ul');
        const commentLi = createElement(comment.body, 'li');
        const authorCommentLi = createElement(comment.name, 'li');
        innerUl.append(commentLi, authorCommentLi);
        li.append(innerUl);
        ol.append(li);
    }

    return ol;
}

const createRow = additionalProps => props => {

    const {usersMap, comments} = additionalProps;
    const {title, body, userId, id} = props;
    const {name} = usersMap[userId];
    const currentComments = [];

    for (const comment of comments) {
        if (comment.postId === id) {
            currentComments.push(comment);
        }
    }

    const row = createElement('', 'tr');
    const titleTd = createElement(title);
    const bodyTd = createElement(body);
    const nameTd = createElement(name);
    const commentsTd = createElement();
    const commentsUl = createContentUl(currentComments);

    commentsTd.append(commentsUl);
    row.append(titleTd, bodyTd, nameTd, commentsTd);

    return row;
};

function createTable({posts, users, comments}) {
    const usersMap = users
        .reduce((acc, user) => ({...acc, [user.id]: user,}), {});

    const table = createElement('', 'table');
    const thead = createElement('', 'thead');
    const tbody = createElement('', 'tbody');
    const headRow = createElement('', 'tr');

    const heads = headers.map(title => createElement(title, 'th'));
    const rows = posts.map(createRow({usersMap, comments}));

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
