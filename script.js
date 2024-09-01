const addGroupBtn = document.getElementById('add-group-btn');
const addGroupModal = document.getElementById('add-group-modal');
const closeModal = document.getElementById('close-modal');
const addGroupForm = document.getElementById('add-group-form');
const groupList = document.getElementById('group-list');
const usersInfo = document.getElementById('users-info');
let groups = [];

addGroupBtn.addEventListener('click', () => {
    addGroupModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    addGroupModal.style.display = 'none';
    clearForm();
});

window.addEventListener('click', (event) => {
    if (event.target == addGroupModal) {
        addGroupModal.style.display = 'none';
        clearForm();
    }
});

addGroupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const groupName = document.getElementById('group-name').value;
    const groupProfilePic = document.getElementById('group-profile-pic').files[0];
    const groupDescription = document.getElementById('group-description').value;
    const groupUsersCount = parseInt(document.getElementById('group-users').value);

    const users = [];
    for (let i = 0; i < groupUsersCount; i++) {
        const userName = document.getElementById(`user-name-${i}`).value;
        const userProfilePic = document.getElementById(`user-profile-pic-${i}`).files[0];
        const userCountry = document.getElementById(`user-country-${i}`).value;
        const userDescription = document.getElementById(`user-description-${i}`).value;
        const isOwner = document.getElementById(`user-owner-${i}`).checked;
        const isModerator = document.getElementById(`user-moderator-${i}`).checked;

        users.push({
            userName,
            userProfilePic,
            userCountry,
            userDescription,
            isOwner,
            isModerator
        });
    }

    const group = {
        groupName,
        groupProfilePic: groupProfilePic ? URL.createObjectURL(groupProfilePic) : generateDefaultProfilePic(groupName),
        groupDescription,
        users
    };

    groups.push(group);
    renderGroup(group);
    addGroupModal.style.display = 'none';
    clearForm();
});

document.getElementById('group-users').addEventListener('input', (e) => {
    const usersCount = parseInt(e.target.value);
    renderUserFields(usersCount);
});

function renderGroup(group) {
    const groupItem = document.createElement('li');
    groupItem.classList.add('group-item');

    const groupImage = document.createElement('img');
    groupImage.src = group.groupProfilePic;

    const groupInfo = document.createElement('div');
    groupInfo.innerHTML = `<strong>${group.groupName}</strong><br>${group.groupDescription}`;

    groupItem.appendChild(groupImage);
    groupItem.appendChild(groupInfo);

    groupList.appendChild(groupItem);
}

function renderUserFields(count) {
    usersInfo.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const userFieldset = document.createElement('fieldset');
        userFieldset.innerHTML = `
            <legend>معلومات المستخدم ${i + 1}</legend>
            <label for="user-name-${i}">اسم المستخدم:</label>
            <input type="text" id="user-name-${i}" required>

            <label for="user-profile-pic-${i}">صورة شخصية (اختياري):</label>
            <input type="file" id="user-profile-pic-${i}" accept="image/*">

            <label for="user-country-${i}">البلد:</label>
            <input type="text" id="user-country-${i}" required>

            <label for="user-description-${i}">نبذة عن المستخدم:</label>
            <textarea id="user-description-${i}"></textarea>

            <label for="user-owner-${i}">مالك:</label>
            <input type="radio" name="group-owner" id="user-owner-${i}" value="${i}">

            <label for="user-moderator-${i}">مشرف:</label>
            <input type="checkbox" id="user-moderator-${i}">
        `;
        usersInfo.appendChild(userFieldset);
    }
}

function clearForm() {
    document.getElementById('group-name').value = '';
    document.getElementById('group-profile-pic').value = '';
    document.getElementById('group-description').value = '';
    document.getElementById('group-users').value = '';
    usersInfo.innerHTML = '';
}

function generateDefaultProfilePic(groupName) {
    const initials = groupName.split(' ').map(word => word[0]).join('');
    const colors = ['#ff6347', '#4682b4', '#32cd32', '#ff4500', '#daa520'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const canvas = document.createElement('canvas');
    canvas.width = 50;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 50, 50);

    ctx.font = '24px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, 25, 25);

    return canvas.toDataURL();
}
