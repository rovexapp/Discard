document.addEventListener('DOMContentLoaded', function () {
    const groupList = document.getElementById('group-list');
    const addGroupModal = document.getElementById('add-group-modal');

    // تحميل القروبات من Local Storage
    let groups = JSON.parse(localStorage.getItem('groups')) || [];

    function saveGroups() {
        localStorage.setItem('groups', JSON.stringify(groups));
    }

    function renderGroups() {
        groupList.innerHTML = '';
        groups.forEach((group, index) => {
            const groupItem = document.createElement('div');
            groupItem.classList.add('group-item');
            groupItem.innerHTML = `
                <img src="${group.image || generateDefaultImage(group.name)}" alt="صورة القروب">
                <h3>${group.name}</h3>
                <button onclick="deleteGroup(${index})">حذف</button>
            `;
            groupItem.onclick = function () {
                openChat(index);
            };
            groupList.appendChild(groupItem);
        });
    }

    function openAddGroupModal() {
        // منطق فتح النافذة المنبثقة لإنشاء قروب جديد
        const name = prompt('أدخل اسم القروب:');
        const image = prompt('أدخل رابط الصورة (اختياري):');
        const description = prompt('أدخل نبذة عن القروب:');
        const usersCount = prompt('أدخل عدد المستخدمين:');

        const users = [];
        for (let i = 0; i < usersCount; i++) {
            const userName = prompt(`أدخل اسم المستخدم ${i + 1}:`);
            const userImage = prompt(`أدخل رابط صورة المستخدم ${i + 1} (اختياري):`);
            const userCountry = prompt(`أدخل البلد للمستخدم ${i + 1}:`);
            const userDescription = prompt(`أدخل نبذة عن المستخدم ${i + 1}:`);
            const isOwner = confirm(`هل هذا المستخدم ${i + 1} هو المالك؟`);
            const isAdmin = confirm(`هل هذا المستخدم ${i + 1} مشرف؟`);

            users.push({
                name: userName,
                image: userImage,
                country: userCountry,
                description: userDescription,
                isOwner: isOwner,
                isAdmin: isAdmin
            });
        }

        const newGroup = {
            name: name,
            image: image,
            description: description,
            users: users
        };

        groups.push(newGroup);
        saveGroups();
        renderGroups();
    }

    function generateDefaultImage(groupName) {
        const initials = groupName.split(' ').map(word => word.charAt(0)).join('');
        const colors = ['#f28b82', '#fbbc04', '#34a853', '#4285f4', '#ea4335'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        return `https://via.placeholder.com/50/${color.substring(1)}/ffffff?text=${initials}`;
    }

    function deleteGroup(index) {
        groups.splice(index, 1);
        saveGroups();
        renderGroups();
    }

    function openChat(groupIndex) {
        const group = groups[groupIndex];
        alert(`دخول للدردشة مع ${group.name}`);
        // هنا يمكن فتح صفحة الدردشة الخاصة بالقروب
    }

    renderGroups();
});
