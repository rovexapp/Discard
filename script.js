// Initial Data (Local Storage or Placeholder)
let groups = JSON.parse(localStorage.getItem('groups')) || [];

// Elements
const groupList = document.getElementById('group-list');
const createGroupBtn = document.getElementById('create-group-btn');
const groupModal = document.getElementById('group-modal');
const chatModal = document.getElementById('chat-modal');
const groupForm = document.getElementById('group-form');
const groupImageInput = document.getElementById('group-image');
const userDetails = document.getElementById('user-details');
const userCountInput = document.getElementById('user-count');

// Event Listeners
createGroupBtn.addEventListener('click', openGroupModal);
groupForm.addEventListener('submit', createGroup);
userCountInput.addEventListener('input', generateUserFields);

// Functions
function renderGroups() {
    groupList.innerHTML = '';
    groups.forEach((group, index) => {
        const groupItem = document.createElement('div');
        groupItem.className = 'group-item';
        groupItem.innerHTML = `
            <img src="${group.image || generateDefaultImage(group.name)}" alt="Group Image">
            <h3>${group.name}</h3>
        `;
        groupItem.addEventListener('click', () => openChat(index));
        groupList.appendChild(groupItem);
    });
}

function openGroupModal() {
    groupModal.style.display = 'flex';
}

function closeGroupModal() {
    groupModal.style.display = 'none';
}

function createGroup(e) {
    e.preventDefault();
    const groupName = document.getElementById('group-name').value;
    const groupDescription = document.getElementById('group-description').value;
    const groupImage = groupImageInput.files[0] ? URL.createObjectURL(groupImageInput.files[0]) : null;

    const users = [];
    const userElements = document.querySelectorAll('.user-detail');
    userElements.forEach((userElement) => {
        const username = userElement.querySelector('.username').value;
        const userCountry = userElement.querySelector('.country').value;
        const userBio = userElement.querySelector('.bio').value;
        const userImage = userElement.querySelector('.user-image').files[0] ? URL.createObjectURL(userElement.querySelector('.user-image').files[0]) : null;
        const isOwner = userElement.querySelector('.is-owner').checked;
        const isAdmin = userElement.querySelector('.is-admin').checked;

        users.push({
            username,
            country: userCountry,
            bio: userBio,
            image: userImage,
            isOwner,
            isAdmin
        });
    });

    const newGroup = {
        name: groupName,
        description: groupDescription,
        image: groupImage,
        users,
        messages: []
    };

    groups.push(newGroup);
    localStorage.setItem('groups', JSON.stringify(groups));
    closeGroupModal();
    renderGroups();
}

function generateUserFields() {
    const count = userCountInput.value;
    userDetails.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const userDetail = document.createElement('div');
        userDetail.className = 'user-detail';
        userDetail.innerHTML = `
            <input type="text" class="username" placeholder="Username" required>
            <input type="file" class="user-image" accept="image/*">
            <input type="text" class="country" placeholder="Country" required>
            <textarea class="bio" placeholder="Bio"></textarea>
            <label>
                <input type="radio" name="owner" class="is-owner"> Owner
            </label>
            <label>
                <input type="checkbox" class="is-admin"> Admin
            </label>
        `;
        userDetails.appendChild(userDetail);
    }
}

function generateDefaultImage(groupName) {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF33A2', '#33FFF3'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const initials = groupName.split(' ').map(word => word.charAt(0)).join('').slice(0, 2).toUpperCase();

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 50;
    canvas.height = 50;

    // Background color
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Initials
    ctx.font = '20px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL();
}

function openChat(groupIndex) {
    const group = groups[groupIndex];
    document.getElementById('chat-group-name').textContent = group.name;
    document.getElementById('chat-group-image').src = group.image || generateDefaultImage(group.name);
    chatModal.style.display = 'flex';
    renderMessages(groupIndex);
}

function renderMessages(groupIndex) {
    const chatContent = document.getElementById('chat-content');
    chatContent.innerHTML = '';
    const group = groups[groupIndex];

    group.messages.forEach((message, messageIndex) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.sentBy === 'me' ? 'sent' : 'received'}`;
        messageDiv.innerHTML = `
            <strong>${message.username} ${message.isOwner ? '(Owner)' : message.isAdmin ? '(Admin)' : ''}</strong>
            <p>${message.content}</p>
            <div class="meta">
                <span class="time">${message.timestamp}</span>
                <img src="${message.userImage || generateDefaultImage(message.username)}" alt="User Image">
            </div>
        `;
        messageDiv.addEventListener('longpress', () => editMessage(groupIndex, messageIndex));
        chatContent.appendChild(messageDiv);
    });
}

function editMessage(groupIndex, messageIndex) {
    const newTimestamp = prompt('Edit the timestamp (YYYY-MM-DD HH:MM:SS):');
    if (newTimestamp) {
        groups[groupIndex].messages[messageIndex].timestamp = newTimestamp;
        localStorage.setItem('groups', JSON.stringify(groups));
        renderMessages(groupIndex);
    }
}

document.getElementById('send-message-btn').addEventListener('click', () => {
    const groupIndex = groups.findIndex(group => group.name === document.getElementById('chat-group-name').textContent);
    const messageContent = document.getElementById('chat-message').value;
    const activeUser = 'me';  // Replace with logic to get the active user
    const activeUserDetails = groups[groupIndex].users.find(user => user.username === activeUser);

    if (messageContent) {
        const newMessage = {
            content: messageContent,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            username: activeUserDetails.username,
            isOwner: activeUserDetails.isOwner,
            isAdmin: activeUserDetails.isAdmin,
            userImage: activeUserDetails.image,
            sentBy: 'me'
        };
        groups[groupIndex].messages.push(newMessage);
        localStorage.setItem('groups', JSON.stringify(groups));
        renderMessages(groupIndex);
        document.getElementById('chat-message').value = '';
    }
});

function longpress(element, callback) {
    let timer;
    element.addEventListener('mousedown', () => {
        timer = setTimeout(callback, 10000);
    });

    element.addEventListener('mouseup', () => clearTimeout(timer));
    element.addEventListener('mouseout', () => clearTimeout(timer));
}

document.querySelectorAll('.message .time').forEach(timeElement => {
    longpress(timeElement, () => editMessage());
});

// Initial Render
renderGroups();
