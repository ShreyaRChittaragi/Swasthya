// Chatbot functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.getElementById('chatbot-container');
    const closeChatbot = document.getElementById('close-chatbot');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    
     
    // Initially hide the chatbot
    chatbotContainer.classList.add('hidden');
    
    // Toggle chatbot visibility
    chatbotToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        chatbotContainer.classList.remove('hidden');
    });
    
    // Close chatbot when X is clicked
    closeChatbot.addEventListener('click', function(e) {
        e.stopPropagation();
        chatbotContainer.classList.add('hidden');
    });
    
    // Send message on button click
    sendBtn.addEventListener('click', sendMessage);
    
    // Send message on Enter key
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Quick replies
    setTimeout(() => {
        addQuickReplies([
            "How do I take my medicine?",
            "What should I eat today?",
            "Is my blood pressure normal?",
            "When is my next appointment?",
            "Show me my reminders",
            "I'm not feeling well"
        ]);
    }, 2000);
});

function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    
    if (message) {
        addUserMessage(message);
        userInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Process message after a short delay
        setTimeout(() => {
            processUserMessage(message);
        }, 1000);
    }
}

function addUserMessage(text) {
    const messagesContainer = document.getElementById('chatbot-messages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'user-message';
    messageDiv.innerHTML = `<p>${text}</p>`;
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

function addBotMessage(text, isQuickReply = false) {
    const messagesContainer = document.getElementById('chatbot-messages');
    
    // Remove typing indicator if present
    const typingIndicator = messagesContainer.querySelector('.typing-indicator');
    if (typingIndicator) {
        messagesContainer.removeChild(typingIndicator);
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'bot-message';
    messageDiv.innerHTML = `<p>${text}</p>`;
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
    
    // If this is a quick reply, don't show more quick replies
    if (!isQuickReply) {
        setTimeout(() => {
            addQuickReplies([
                "How do I take my medicine?",
                "What should I eat today?",
                "Is my blood pressure normal?",
                "When is my next appointment?",
                "Show me my reminders",
                "I'm not feeling well"
            ]);
        }, 500);
    }
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbot-messages');
    
    // Remove existing typing indicator if present
    const existingIndicator = messagesContainer.querySelector('.typing-indicator');
    if (existingIndicator) {
        messagesContainer.removeChild(existingIndicator);
    }
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    
    messagesContainer.appendChild(typingDiv);
    scrollToBottom();
}

function scrollToBottom() {
    const messagesContainer = document.getElementById('chatbot-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function processUserMessage(message) {
    message = message.toLowerCase();
    
    // Enhanced response logic with more recommendations
    if (message.includes('medicine') || message.includes('pill') || message.includes('tablet') || message.includes('medication')) {
        const responses = [
            "You should take your medicine with water, as prescribed by your doctor. Never skip a dose unless advised.",
            "Take your medication at the same time each day to maintain consistent levels in your body.",
            "If you experience any side effects from your medication, contact your doctor immediately.",
            "Store your medicines in a cool, dry place away from direct sunlight.",
            "Always check the expiration date before taking any medication."
        ];
        addBotMessage(responses[Math.floor(Math.random() * responses.length)]);
    } 
    else if (message.includes('eat') || message.includes('diet') || message.includes('food') || message.includes('meal')) {
        const responses = [
            "A balanced diet with fruits, vegetables, and lean proteins is recommended. Avoid processed foods and excess salt.",
            "For better recovery, include foods rich in antioxidants like berries, nuts, and leafy greens.",
            "Stay hydrated by drinking at least 8 glasses of water daily. Herbal teas are also beneficial.",
            "Small, frequent meals are easier to digest than large meals. Try eating 5-6 times a day.",
            "Limit caffeine and alcohol intake as they can interfere with medications and recovery."
        ];
        addBotMessage(responses[Math.floor(Math.random() * responses.length)]);
    }
    else if (message.includes('blood pressure') || message.includes('bp')) {
        const bpValue = document.getElementById('bp-value').textContent;
        const recommendations = bpValue === '120/80' ? 
            'This is normal. Keep up the good work!' : 
            'This seems abnormal. Here are some recommendations:\n' +
            '- Reduce sodium intake\n' +
            '- Practice stress-reduction techniques\n' +
            '- Get regular exercise\n' +
            '- Limit alcohol consumption\n' +
            '- Monitor your blood pressure regularly';
        
        addBotMessage(`Your last recorded blood pressure was ${bpValue}. ${recommendations}`);
    }
    else if (message.includes('appointment') || message.includes('doctor')) {
        addBotMessage('Your next appointment is tomorrow at 4:00 PM with Dr. Sharma. ' + 
            'It will be a video call. I\'ll remind you 30 minutes before.');
    }
    else if (message.includes('reminder') || message.includes('remind')) {
        const savedReminders = localStorage.getItem('healthReminders');
        if (savedReminders) {
            const reminders = JSON.parse(savedReminders);
            if (reminders.length > 0) {
                let reminderText = "Here are your upcoming reminders:\n";
                reminders.forEach(reminder => {
                    reminderText += `- ${reminder.name} at ${formatTime(reminder.time)}\n`;
                });
                addBotMessage(reminderText);
            } else {
                addBotMessage("You don't have any reminders set up yet. Would you like to add one?");
            }
        } else {
            addBotMessage("You don't have any reminders set up yet. Would you like to add one?");
        }
    }
    else if (message.includes('not feeling well') || message.includes('feel sick') || message.includes('unwell')) {
        const responses = [
            "I'm sorry to hear that. Can you describe your symptoms in more detail?",
            "If your symptoms are severe or worsening, please contact your doctor immediately.",
            "Make sure you're staying hydrated and getting enough rest. Monitor your vital signs.",
            "Have you taken all your prescribed medications today? Sometimes missed doses can cause discomfort.",
            "Try some deep breathing exercises to help relax. If symptoms persist, seek medical attention."
        ];
        addBotMessage(responses[Math.floor(Math.random() * responses.length)]);
    }
    else if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        addBotMessage('Hello! How can I help you with your recovery today?');
    }
    else {
        const fallbackResponses = [
            "I'm here to help with your recovery. You can ask me about medications, diet, appointments, or your health status.",
            "I'm not sure I understand. Could you rephrase that? I can help with medication reminders, diet advice, and more.",
            "As your health assistant, I can provide information about your care plan, reminders, and general health advice.",
            "I specialize in post-hospital recovery support. Ask me about your medications, exercises, or appointments."
        ];
        addBotMessage(fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]);
    }
}

function addQuickReplies(replies) {
    const messagesContainer = document.getElementById('chatbot-messages');
    
    // Remove existing quick replies if present
    const existingReplies = messagesContainer.querySelector('.quick-replies');
    if (existingReplies) {
        messagesContainer.removeChild(existingReplies);
    }
    
    const repliesDiv = document.createElement('div');
    repliesDiv.className = 'quick-replies';
    
    replies.forEach(reply => {
        const button = document.createElement('button');
        button.className = 'quick-reply';
        button.textContent = reply;
        button.addEventListener('click', () => {
            addUserMessage(reply);
            showTypingIndicator();
            setTimeout(() => {
                processUserMessage(reply);
            }, 1000);
        });
        repliesDiv.appendChild(button);
    });
    
    messagesContainer.appendChild(repliesDiv);
    scrollToBottom();
}

function formatTime(timeString) {
    if (!timeString) return '';
    
    // Check if already formatted (contains AM/PM)
    if (timeString.includes('AM') || timeString.includes('PM')) {
        return timeString;
    }
    
    const [hours, minutes] = timeString.split(':');
    let period = 'AM';
    let formattedHours = parseInt(hours);
    
    if (formattedHours >= 12) {
        period = 'PM';
        if (formattedHours > 12) {
            formattedHours -= 12;
        }
    }
    
    if (formattedHours === 0) {
        formattedHours = 12;
    }
    
    return `${formattedHours}:${minutes.padStart(2, '0')} ${period}`;
}