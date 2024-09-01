document.addEventListener("DOMContentLoaded", function () {
  // تحميل القروبات من Local Storage
  let groups = JSON.parse(localStorage.getItem("groups")) || [];

  const groupListElement = document.getElementById("group-list");
  const addGroupBtn = document.getElementById("add-group-btn");

  // عرض القروبات في القائمة
  function displayGroups() {
    groupListElement.innerHTML = "";
    groups.forEach((group, index) => {
      const groupElement = document.createElement("div");
      groupElement.className = "group";
      groupElement.innerHTML = `
        <img src="${group.image}" alt="${group.name}" class="group-image">
        <span class="group-name">${group.name}</span>
      `;
      groupElement.addEventListener("click", () => openChat(index));
      groupElement.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        showGroupOptions(index);
      });
      groupListElement.appendChild(groupElement);
    });
  }

  // فتح الدردشة للقروب
  function openChat(groupIndex) {
    const group = groups[groupIndex];
    const chatElement = document.getElementById("chat");
    const groupHeaderElement = document.getElementById("group-header");
    const chatMessagesElement = document.getElementById("chat-messages");
    const sendMessageBtn = document.getElementById("send-message-btn");
    const messageInput = document.getElementById("message-input");

    chatMessagesElement.innerHTML = "";

    groupHeaderElement.innerHTML = `
      <img src="${group.image}" alt="${group.name}" class="group-image">
      <span class="group-name">${group.name}</span>
    `;
    groupHeaderElement.addEventListener("mousedown", (e) => {
      if (e.which === 1) {
        // إذا ضغط على الصورة لمدة 10 ثوانٍ، أظهر قائمة الحسابات
        setTimeout(() => showAccountSwitchOptions(groupIndex), 10000);
      }
    });

    group.messages.forEach((message) => {
      const messageElement = document.createElement("div");
      messageElement.className = message.sender.isOwner ? "message owner" : "message";
      messageElement.innerHTML = `
        <div class="message-info">
          <span class="message-sender">${message.sender.name} ${message.sender.isOwner ? "(المالك)" : message.sender.isModerator ? "(مشرف)" : ""}</span>
          <span class="message-timestamp" title="Edit">${message.timestamp}</span>
        </div>
        <div class="message-text">${message.text}</div>
        <img src="${message.sender.image}" alt="${message.sender.name}" class="user-image">
      `;
      messageElement.querySelector(".message-timestamp").addEventListener("mousedown", (e) => {
        if (e.which === 1) {
          // إذا ضغط على الوقت لمدة 10 ثوانٍ، اسمح بتعديل الوقت
          setTimeout(() => editMessageTimestamp(message), 10000);
        }
      });
      chatMessagesElement.appendChild(messageElement);
    });

    sendMessageBtn.onclick = function () {
      const message = {
        text: messageInput.value,
        sender: group.currentUser,
        timestamp: new Date().toLocaleString(),
        read: false,
      };
      group.messages.push(message);
      saveGroups();
      displayGroups();
      openChat(groupIndex);
      messageInput.value = "";
    };
  }

  // حفظ القروبات في Local Storage
  function saveGroups() {
    localStorage.setItem("groups", JSON.stringify(groups));
  }

  // إنشاء قروب جديد
  addGroupBtn.onclick = function () {
    const groupName = prompt("أدخل اسم القروب:");
    const groupImage = prompt("أدخل رابط صورة بروفايل القروب (اختياري):");
    const groupDescription = prompt("أدخل نبذة عن القروب:");
    const groupUsersCount = parseInt(prompt("أدخل عدد المستخدمين:"));
    const users = [];

    for (let i = 0; i < groupUsersCount; i++) {
      const userName = prompt(`أدخل اسم المستخدم ${i + 1}:`);
      const userImage = prompt(`أدخل رابط صورة المستخدم ${i + 1} (اختياري):`);
      const userCountry = prompt(`أدخل بلد المستخدم ${i + 1}:`);
      const userDescription = prompt(`أدخل نبذة عن المستخدم ${i + 1}:`);
      const isOwner = confirm(`هل المستخدم ${userName} هو المالك؟`);
      const isModerator = confirm(`هل المستخدم ${userName} هو مشرف؟`);

      users.push({
        name: userName,
        image: userImage || "default_user.png",
        country: userCountry,
        description: userDescription,
        isOwner: isOwner,
        isModerator: isModerator,
      });
    }

    const group = {
      name: groupName,
      image: groupImage || `https://via.placeholder.com/150x150.png?text=${groupName.charAt(0)}+${groupName.charAt(groupName.length - 1)}`,
      description: groupDescription,
      users: users,
      messages: [],
      currentUser: users.find(user => user.isOwner) || users[0],
    };

    groups.push(group);
    saveGroups();
    displayGroups();
  };

  // عرض خيارات الحسابات لتبديل المستخدم
  function showAccountSwitchOptions(groupIndex) {
    const group = groups[groupIndex];
    let options = "اختر حسابًا للدردشة:\n";
    group.users.forEach((user, index) => {
      options += `${index + 1}. ${user.name} (${user.isOwner ? "المالك" : user.isModerator ? "مشرف" : "مستخدم"})\n`;
    });
    const selectedUserIndex = parseInt(prompt(options)) - 1;
    group.currentUser = group.users[selectedUserIndex];
    saveGroups();
    openChat(groupIndex);
  }

  // عرض خيارات تعديل أو حذف القروب
  function showGroupOptions(groupIndex) {
    const group = groups[groupIndex];
    const option = prompt("اختر خيارًا:\n1. تعديل القروب\n2. حذف القروب");

    if (option === "1") {
      editGroup(groupIndex);
    } else if (option === "2") {
      if (confirm(`هل أنت متأكد أنك تريد حذف القروب "${group.name}"؟`)) {
        groups.splice(groupIndex, 1);
        saveGroups();
        displayGroups();
      }
    }
  }

  // تعديل القروب
  function editGroup(groupIndex) {
    const group = groups[groupIndex];
    const groupName = prompt("أدخل اسم القروب:", group.name);
    const groupImage = prompt("أدخل رابط صورة بروفايل القروب (اختياري):", group.image);
    const groupDescription = prompt("أدخل نبذة عن القروب:", group.description);
    const groupUsersCount = parseInt(prompt("أدخل عدد المستخدمين:", group.users.length));
    const users = [];

    for (let i = 0; i < groupUsersCount; i++) {
      const user = group.users[i] || {};
      const userName = prompt(`أدخل اسم المستخدم ${i + 1}:`, user.name || "");
      const userImage = prompt(`أدخل رابط صورة المستخدم ${i + 1} (اختياري):`, user.image || "");
      const userCountry = prompt(`أدخل بلد المستخدم ${i + 1}:`, user.country || "");
      const userDescription = prompt(`أدخل نبذة عن المستخدم ${i + 1}:`, user.description || "");
      const isOwner = confirm(`هل المستخدم ${userName} هو المالك؟`);
      const isModerator = confirm(`هل المستخدم ${userName} هو مشرف؟`);

      users.push({
        name: userName,
        image: userImage || "default_user.png",
        country: userCountry,
        description: userDescription,
        isOwner: isOwner,
        isModerator: isModerator,
      });
    }

    group.name = groupName;
    group.image = groupImage || `https://via.placeholder.com/150x150.png?text=${groupName.charAt(0)}+${groupName.charAt(groupName.length - 1)}`;
    group.description = groupDescription;
    group.users = users;

    saveGroups();
    displayGroups();
    openChat(groupIndex);
  }

  // تعديل تاريخ ووقت الرسالة
  function editMessageTimestamp(message) {
    const newTimestamp = prompt("أدخل الوقت والتاريخ الجديد:", message.timestamp);
    if (newTimestamp) {
      message.timestamp = newTimestamp;
      saveGroups();
      displayGroups();
    }
  }

  // عرض القروبات عند تحميل الصفحة
  displayGroups();
});
