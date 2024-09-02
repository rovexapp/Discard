document.addEventListener('DOMContentLoaded', function () {
    let groups = JSON.parse(localStorage.getItem('groups')) || [];
    const groupList = document.getElementById('groupList');
    const createGroupBtn = document.getElementById('createGroupBtn');
    const createGroupModal = document.getElementById('createGroupModal');
    const chatModal = document.getElementById('chatModal');
    const groupNameInput = document.getElementById('groupName');
    const groupDescriptionInput = document.getElementById('groupDescription');
    const groupUsersInput = document.getElementById('groupUsers');
    const userFields = document.getElementById('userFields');
    const createGroupButton = document.getElementById('createGroup');
    const messageInput = document.getElementById('messageInput');
    const sendMessageButton = document.getElementById('sendMessage');
    let activeGroup = null;
    let activeUser = null;

    function renderGroups() {
        groupList.innerHTML = '';
        groups.forEach((group, index) => {
            const groupItem = document.createElement('div');
            groupItem.className = 'group-item';
            groupItem.innerHTML = `
                <img src="${group.profileImage || getDefaultImage(group.name)}" alt="Group Profile">
                <h3>${group.name}</h3>
            `;
            groupItem.addEventListener('click', () => openChat(index));
            groupItem.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                editOrDeleteGroup(index);
            });
            groupList.appendChild(groupItem);
        });
    }

    function getDefaultImage(groupName) {
        const initials = groupName.split(' ').map(word => word[0]).join('');
        const colors = ['#f44336', '#9c27b0', '#3f51b5', '#03a9f4', '#4caf50', '#ffeb3b', '#ff9800', '#795548'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        return `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50"><rect width="100%" height="100%" fill="${color}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="24" fill="white">${initials}</text></svg>`)}`;
    }

    createGroupBtn.addEventListener('click', () => {
        createGroupModal.style.display = 'flex';
        userFields.innerHTML = '';
        groupUsersInput.addEventListener('input', generateUserFields);
    });

    function generateUserFields() {
        const userCount = groupUsersInput.value;
        userFields.innerHTML = '';
        for (let i = 0; i < userCount; i++) {
            userFields.innerHTML += `
                <div class="userField">
                    <label for="userName${i}">User Name:</label>
                    <input type="text" id="userName${i}" placeholder="Enter user name">
                    
                    <label for="userCountry${i}">Country:</label>
                    <input type="text" id="userCountry${i}" placeholder="Enter country">
                    
                    <label for="userBio${i}">Bio:</label>
                    <textarea id="userBio${i}" placeholder="Enter bio"></textarea>
                    
                    <label for="userProfile${i}">Profile Picture (Optional):</label>
                    <input type="file" id="userProfile${i}" accept="image/*">
                    
                    <label for="owner${i}">Owner:</label>
                    <input type="radio" name="owner" id="owner${i}" value="${i}">
                    
                    <label for="admin${i}">Admin:</label>
