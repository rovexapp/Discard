body {
    font-family: Arial, sans-serif;
    background-color: #f1f1f1;
    margin: 0;
    padding: 0;
}

.container {
    width: 100%;
    max-width: 800px;
    margin: auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.header {
    text-align: center;
    margin-bottom: 20px;
}

.groups-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.group-item {
    display: flex;
    align-items: center;
    background-color: #ececec;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
}

.group-item img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
}

.add-group-btn {
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #007bff;
    color: white;
    font-size: 24px;
    border: none;
    cursor: pointer;
}

.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    width: 80%;
    max-width: 500px;
}

.close-btn {
    float: right;
    cursor: pointer;
    font-size: 24px;
}

.chat-window {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: white;
    display: flex;
    flex-direction: column;
}

.chat-header {
    display: flex;
    align-items: center;
    padding: 20px;
    background-color: #007bff;
    color: white;
}

.chat-header img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
}

.messages {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
}

.message {
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 10px;
    max-width: 70%;
}

.message.mine {
    background-color: #007bff;
    color: white;
    align-self: flex-end;
}

.message.other {
    background-color: #ececec;
    align-self: flex-start;
}

.message-input {
    display: flex;
    padding: 10px;
    background-color: #ececec;
}

.message-input input {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 5px;
    margin-right: 10px;
}

.message-input button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
