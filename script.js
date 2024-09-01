document.addEventListener("DOMContentLoaded", () => {
    const groupsList = document.getElementById("groups-list");
    const addGroupBtn = document.getElementById("add-group-btn");
    const createGroupModal = document.getElementById("create-group-modal");
    const closeModalBtn = document.getElementById("close-modal");
    const createGroupBtn = document.getElementById("create-group-btn");
    const chatWindow = document.getElementById("chat-window");
    const chatGroupName = document.getElementById("chat-group-name");
    const chatGroupImage = document.getElementById("chat-group-image");
    const messagesContainer = document.getElementById("messages");
    const messageInput = document.getElementById("message-input");
    const sendMessageBtn = document.getElementById("send-message-btn");

    let groups = JSON.parse(localStorage.getItem("groups")) || [];
    let currentGroup = null;
    let currentUser = null;

    function saveGroups() {
        localStorage.setItem("groups", JSON.stringify(groups));
    }

    function renderGroups() {
        groupsList.innerHTML = "";
        groups.forEach((group, index) => {
            const groupItem = document.createElement("div");
            groupItem.className = "group-item";
            groupItem.innerHTML = `
                <img src="${group.image || getDefaultGroupImage(group.name)}" alt="${group.name}">
                <div>${group.name}</div>
            `;
            groupItem.addEventListener("click", () => openGroupChat(index));
            groupsList.appendChild(groupItem);
        });
    }

    function openGroupChat(index) {
        currentGroup = groups[index];
        chatGroupName.innerText = currentGroup.name;
        chatGroupImage.src = currentGroup.image || getDefaultGroupImage(currentGroup.name);
        renderMessages();
        chatWindow.style.display = "flex";
    }

    function renderMessages() {
        messagesContainer.innerHTML = "";
        currentGroup.messages.forEach((message) => {
            const messageElement = document.createElement("div");
            messageElement.className = `message ${message.sender === currentUser ? "mine" : "other"}`;
            messageElement.innerHTML = `
                <strong>${message.sender}</strong> - <small>${message.time}</small>
                <p>${message.text}</p>
            `;
            messagesContainer.appendChild(messageElement);
        });
    }

    function sendMessage() {
        const text = messageInput.value.trim();
        if (text) {
            const message = {
                sender: currentUser,
                text,
                time: new Date().toLocaleTimeString(),
            };
            currentGroup.messages.push(message);
            messageInput.value = "";
            renderMessages();
            saveGroups();
        }
    }

    function getDefaultGroupImage(name) {
        const initials = name.split(" ").map(word => word[0]).join("");
        return `https://via.placeholder.com/50/007bff/FFFFFF?text=${initials}`;
    }

    addGroupBtn.addEventListener("click", () => {
        createGroupModal.style.display = "flex";
    });

    closeModalBtn.addEventListener("click", () => {
        createGroupModal.style.display = "none";
    });

    createGroupBtn.addEventListener("click", () => {
        const groupName = document.getElementById("group-name").value.trim();
        const groupImage = document.getElementById("group-image").files[0];
        const groupDescription = document.getElementById("group-description").value.trim();
        const numUsers = parseInt(document.getElementById("num-users").value.trim(), 10);

        if (!groupName || isNaN(numUsers) || numUsers < 1) {
            alert("Please enter a valid group name and number of users.");
            return;
        }

        const usersInfo = [];
        for (let i = 0; i < numUsers; i++) {
            const userName = prompt(`Enter name for User ${i + 1}:`);
            const isOwner = confirm(`Is ${userName} the group owner?`);
            const isModerator = confirm(`Is ${userName} a moderator?`);
            usersInfo.push({
                name: userName,
                isOwner: isOwner,
                isModerator: isModerator,
            });
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const newGroup = {
                name: groupName,
                image: e.target.result,
                description: groupDescription,
                users: usersInfo,
                messages: [],
            };
            groups.push(newGroup);
            saveGroups();
            renderGroups();
            createGroupModal.style.display = "none";
        };

        if (groupImage) {
            reader.readAsDataURL(groupImage);
        } else {
            const newGroup = {
                name: groupName,
                image: null,
                description: groupDescription,
                users: usersInfo,
                messages: [],
            };
            groups.push(newGroup);
            saveGroups();
            renderGroups();
            createGroupModal.style.display = "none";
        }
    });

    sendMessageBtn.addEventListener("click", sendMessage);

    messageInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    function initialize() {
        renderGroups();
        currentUser = prompt("Please enter your name to start chatting:");
    }

    initialize();
});
