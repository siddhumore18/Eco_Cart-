document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('chatbot-toggle');
    const chatWindow = document.getElementById('chatbot-window');
    const closeBtn = document.getElementById('chatbot-close');
    const sendBtn = document.getElementById('chatbot-send');
    const inputField = document.getElementById('chatbot-input');
    const chatMessages = document.getElementById('chatbot-messages');

    // IMPORTANT: For production, you should call your own backend service
    // instead of exposing the API key in client-side code
    const GEMINI_API_KEY = "AIzaSyBInwJCLAFhNWuXGWyq0N_qYJVK8FpJN1g";
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    toggleBtn.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
    });

    closeBtn.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
    });

    sendBtn.addEventListener('click', sendMessage);
    inputField.addEventListener('keypress', e => {
        if (e.key === 'Enter') sendMessage();
    });

    function appendMessage(text, isUser = false) {
        const div = document.createElement('div');
        div.className = `p-2 rounded-md max-w-[80%] ${isUser ? 'bg-emerald-100 self-end text-right ml-auto' : 'bg-gray-100 text-gray-800'}`;
        div.textContent = text;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendMessage() {
        const message = inputField.value.trim();
        if (!message) return;
        
        appendMessage(message, true);
        inputField.value = '';
        inputField.focus();
        
        // Create loading placeholder
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'p-2 italic text-gray-400 rounded-md max-w-[80%] bg-gray-100';
        loadingDiv.textContent = 'Typing...';
        chatMessages.appendChild(loadingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        try {
            const res = await fetch(GEMINI_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: message }] }]
                })
            });
            
            if (!res.ok) {
                throw new Error(`API request failed with status ${res.status}`);
            }
            
            const data = await res.json();
            loadingDiv.remove();
            
            if (!data.candidates || !data.candidates[0].content.parts[0].text) {
                throw new Error('Invalid response format from API');
            }
            
            const reply = data.candidates[0].content.parts[0].text;
            appendMessage(reply);
        } catch (err) {
            loadingDiv.remove();
            console.error('Chatbot error:', err);
            appendMessage("Sorry, I'm having trouble responding right now. Please try again later.");
        }
    }
});