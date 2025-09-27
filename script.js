// 留言板数据模型
let messages = JSON.parse(localStorage.getItem('schoolMessageBoard')) || [];

// DOM元素
const postForm = document.getElementById('postForm');
const messagesList = document.getElementById('messagesList');
const emptyState = document.getElementById('emptyState');

// 初始化留言板
function initMessageBoard() {
    renderMessages();
    
    // 表单提交事件
    postForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const author = document.getElementById('author').value.trim();
        const title = document.getElementById('title').value.trim();
        const content = document.getElementById('content').value.trim();
        
        if (author && title && content) {
            const newMessage = {
                id: Date.now(),
                author: author,
                title: title,
                content: content,
                date: new Date().toLocaleString('zh-CN'),
                replies: []
            };
            
            messages.unshift(newMessage);
            saveMessages();
            renderMessages();
            
            // 重置表单
            postForm.reset();
        }
    });
}

// 渲染留言列表
function renderMessages() {
    if (messages.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    messagesList.innerHTML = '';
    
    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.innerHTML = `
            <div class="message-header">
                <div class="message-title">${escapeHtml(message.title)}</div>
                <div class="message-meta">${escapeHtml(message.author)} · ${message.date}</div>
            </div>
            <div class="message-content">${escapeHtml(message.content)}</div>
            <div class="message-actions">
                <button class="reply-btn" data-id="${message.id}">回复</button>
                <button class="delete-btn" data-id="${message.id}">删除</button>
            </div>
            <div class="reply-form" id="replyForm-${message.id}">
                <form class="reply-form-inner">
                    <div class="form-group">
                        <input type="text" placeholder="你的姓名" class="reply-author" required>
                    </div>
                    <div class="form-group">
                        <textarea placeholder="回复内容" class="reply-content" required></textarea>
                    </div>
                    <button type="submit">提交回复</button>
                </form>
            </div>
            <div class="replies" id="replies-${message.id}">
                ${renderReplies(message.replies)}
            </div>
        `;
        
        messagesList.appendChild(messageElement);
    });
    
    // 添加回复按钮事件
    document.querySelectorAll('.reply-btn').forEach(button => {
        button.addEventListener('click', function() {
            const messageId = parseInt(this.getAttribute('data-id'));
            const replyForm = document.getElementById(`replyForm-${messageId}`);
            replyForm.classList.toggle('active');
        });
    });
    
    // 添加删除按钮事件
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const messageId = parseInt(this.getAttribute('data-id'));
            if (confirm('确定要删除这条留言吗？')) {
                deleteMessage(messageId);
            }
        });
    });
    
    // 添加回复表单提交事件
    document.querySelectorAll('.reply-form-inner').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const messageId = parseInt(this.closest('.reply-form').id.split('-')[1]);
            const authorInput = this.querySelector('.reply-author');
            const contentInput = this.querySelector('.reply-content');
            
            const author = authorInput.value.trim();
            const content = contentInput.value.trim();
            
            if (author && content) {
                addReply(messageId, author, content);
                authorInput.value = '';
                contentInput.value = '';
            }
        });
    });
}

// 渲染回复列表
function renderReplies(replies) {
    if (replies.length === 0) return '';
    
    return replies.map(reply => `
        <div class="reply">
            <div class="reply-header">
                <span class="reply-author">${escapeHtml(reply.author)}</span>
                <span class="reply-date">${reply.date}</span>
            </div>
            <div class="reply-content">${escapeHtml(reply.content)}</div>
        </div>
    `).join('');
}

// 添加回复
function addReply(messageId, author, content) {
    const message = messages.find(msg => msg.id === messageId);
    if (message) {
        const newReply = {
            author: author,
            content: content,
            date: new Date().toLocaleString('zh-CN')
        };
        
        message.replies.push(newReply);
        saveMessages();
        renderMessages();
    }
}

// 删除留言
function deleteMessage(messageId) {
    messages = messages.filter(msg => msg.id !== messageId);
    saveMessages();
    renderMessages();
}

// 保存留言到本地存储
function saveMessages() {
    localStorage.setItem('schoolMessageBoard', JSON.stringify(messages));
}

// 防止XSS攻击的HTML转义函数
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 初始化留言板
document.addEventListener('DOMContentLoaded', initMessageBoard);