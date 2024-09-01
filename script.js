const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const channelList = document.getElementById('channel-list');
let activeChannel = 'general';

const maxUsers = 13;
const users = Array.from({ length: maxUsers }, (_, i) => `مستخدم ${i + 1}`);

const messages = {
    general: [],
    random: [],
    tech: [],
    games: []
};

sendBtn.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        const user = users[Math.floor(Math.random() * users.length)];
        addMessage(user, message, activeChannel);
        messageInput.value = '';
    }
});

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});

channelList.addEventListener('click', (e) => {
    if (e.target.classList.contains('channel')) {
        document.querySelector('.channel.active').classList.remove('active');
        e.target.classList.add('active');
        activeChannel = e.target.dataset.channel;
        loadMessages(activeChannel);
    }
});

function addMessage(user, text, channel) {
    const message = { user, text };
    messages[channel].push(message);
    renderMessage(message);
}

function renderMessage({ user, text }) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${user === 'مستخدم 1' ? 'user' : ''}`;
    messageDiv.textContent = `${user}: ${text}`;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function loadMessages(channel) {
    chatBox.innerHTML = '';
    messages[channel].forEach(renderMessage);
}

// تحميل الرسائل الأولية للقناة النشطة
loadMessages(activeChannel);
