const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');

const maxUsers = 13;
const users = Array.from({ length: maxUsers }, (_, i) => `مستخدم ${i + 1}`);

sendBtn.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        const user = users[Math.floor(Math.random() * users.length)];
        addMessage(`${user}: ${message}`);
        messageInput.value = '';
    }
});

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});

function addMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.textContent = message;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}
