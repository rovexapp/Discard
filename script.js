document.addEventListener("DOMContentLoaded", function() {
    const groupListPage = document.getElementById('group-list-page');
    const createGroupPage = document.getElementById('create-group-page');
    const chatPage = document.getElementById('chat-page');
    const groupList = document.getElementById('group-list');
    const addGroupBtn = document.getElementById('add-group-btn');
    const createGroupForm = document.getElementById('create-group-form');
    const groupChatName = document.getElementById('group-chat-name');
    const groupChatPic = document.getElementById('group-chat-pic');
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendMessageBtn = document.getElementById('send-message-btn');

    let groups = JSON.parse(localStorage.getItem('groups')) || [];
    let currentGroup = null;

    function renderGroups() {
        groupList.innerHTML = '';
        groups.forEach((group, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<img src="${group.profilePic || 'default.jpg'}" alt="صورة القروب" style="width:40px; height:40px; border-radius:50%; margin-right:10px;">
                            <span>${group.name}</span>`;
            li.addEventListener('click', () => openChat(index));
            groupList.appendChild(li);
        });
    }

    function openChat(index) {
        currentGroup = groups[index];
        groupChatName.textContent = currentGroup.name;
        groupChatPic.src = currentGroup.profilePic || 'default.jpg';
        groupListPage.style.display = 'none';
        chatPage.style.display = 'block';
        renderMessages();
    }

    function renderMessages() {
        chatMessages.innerHTML = '';
        currentGroup.messages.forEach((msg, index) => {
            const div = document.createElement('div');
            div.classList.add('message', msg.sent ? 'sent' : 'received');
            div.innerHTML = `<img src="${msg.userPic || 'default-user.jpg'}" alt="صورة المستخدم"><span>${msg.userName}</span><br>${msg.text}`;
            chatMessages.appendChild(div);
        });
    }

    addGroupBtn.addEventListener('click', () => {
        groupListPage.style.display = 'none';
        createGroupPage.style.display = 'block';
    });

    createGroupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const groupName = document.getElementById('group-name').value;
        const groupProfilePic = document.getElementById('group-profile-pic').files[0];
        const groupDescription = document.getElementById('group-description').value;

        const newGroup = {
            name: groupName,
            profilePic: groupProfilePic ? URL.createObjectURL(groupProfilePic) : null,
            description: groupDescription,
            users: [],
            messages: []
        };

        groups.push(newGroup);
        localStorage.setItem('groups', JSON.stringify(groups));
        renderGroups();
        groupListPage.style.display = 'block';
        createGroupPage.style.display = 'none';
    });

    sendMessageBtn.addEventListener('click', () => {
        const messageText = messageInput.value;
        if (messageText.trim() !== '') {
            currentGroup.messages.push({
                userName: 'المالك',
                userPic: 'default-owner.jpg',
                text: messageText,
                sent: true,
                timestamp: new Date().toLocaleString()
            });
            localStorage.setItem('groups', JSON.stringify(groups));
            renderMessages();
            messageInput.value = '';
        }
    });

    renderGroups();
});
