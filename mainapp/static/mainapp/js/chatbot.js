document.addEventListener('DOMContentLoaded', () => {
    const chatFab = document.getElementById('chatbotFab');
    const chatPanel = document.getElementById('chatbotPanel');
    const chatClose = document.getElementById('chatbotClose');
    const chatInput = document.getElementById('chatbotInput');
    const chatSendBtn = document.getElementById('chatbotSendBtn');
    const chatMessages = document.getElementById('chatbotMessages');

    if (!chatFab || !chatPanel) return;

    // Toggle Chat Window
    chatFab.addEventListener('click', () => {
        chatPanel.classList.toggle('active');
        if (chatPanel.classList.contains('active')) {
            chatInput.focus();
        }
    });

    chatClose.addEventListener('click', () => {
        chatPanel.classList.remove('active');
    });

    // Handle Resizing
    const chatDecrease = document.getElementById('chatbotDecrease');
    const chatIncrease = document.getElementById('chatbotIncrease');
    let currentSizeIndex = 1;
    const sizes = [
        { width: '300px', height: '420px' }, // small
        { width: '360px', height: '520px' }, // default
        { width: '480px', height: '680px' }  // large
    ];

    if (chatDecrease && chatIncrease) {
        chatDecrease.addEventListener('click', () => {
            if (currentSizeIndex > 0) {
                currentSizeIndex--;
                chatPanel.style.width = sizes[currentSizeIndex].width;
                chatPanel.style.height = sizes[currentSizeIndex].height;
            }
        });
        chatIncrease.addEventListener('click', () => {
            if (currentSizeIndex < sizes.length - 1) {
                currentSizeIndex++;
                chatPanel.style.width = sizes[currentSizeIndex].width;
                chatPanel.style.height = sizes[currentSizeIndex].height;
            }
        });
    }

    // Handle Sending Message
    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        // 1. Add User Message
        appendMessage(text, 'user');
        chatInput.value = '';

        // 2. Show Typing Indicator
        const typingId = showTypingIndicator();

        // 3. Call backend API
        try {
            const response = await fetch('/api/chatbot/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({ message: text })
            });
            
            removeMessage(typingId);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error("TravelGenie chatbot error:", {
                    status: response.status,
                    error: errorData
                });
                throw new Error(
                    errorData?.error ||
                    errorData?.message ||
                    `Chatbot request failed with status ${response.status}`
                );
            }
            
            const data = await response.json();
            if (data.response) {
                appendMessage(data.response, 'bot');
            } else {
                throw new Error("Invalid response format from server");
            }
            
        } catch (error) {
            removeMessage(typingId);
            appendMessage("Sorry, I'm temporarily unable to reach the AI service. Please try again in a moment.", 'bot');
            console.error("Fetch Error:", error.message);
        }
    }

    chatSendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function formatMessage(str) {
        let escaped = escapeHTML(str);
        // Replace markdown images ![alt](url)
        escaped = escaped.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<br><img src="$2" alt="$1" style="max-width: 100%; border-radius: 8px; margin-top: 8px; border: 1px solid var(--border); display: block;">');
        // Replace bold **text**
        escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        return escaped;
    }

    function appendMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${sender}`;
        
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        msgDiv.innerHTML = `
            <div class="chat-bubble">${formatMessage(text)}</div>
            <div class="chat-time">${timeStr}</div>
        `;
        
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    function showTypingIndicator() {
        const id = 'typing-' + Date.now();
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-message bot';
        msgDiv.id = id;
        
        msgDiv.innerHTML = `
            <div class="chat-bubble" style="padding: 12px 14px;">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
        return id;
    }

    function removeMessage(id) {
        const msgDiv = document.getElementById(id);
        if (msgDiv) {
            msgDiv.remove();
        }
    }

    function scrollToBottom() {
        chatMessages.scrollTo({
            top: chatMessages.scrollHeight,
            behavior: 'smooth'
        });
    }

    // Helper to get CSRF token from cookies
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function escapeHTML(str) {
        const div = document.createElement('div');
        div.innerText = str;
        return div.innerHTML;
    }
});
