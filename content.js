// Função para pegar o texto da conversa
function getConversation() {
    // Supondo que a conversa está em um elemento com ID 'chatgpt-conversation'
    const conversation = document.getElementById('chatgpt-conversation').innerText;
    return conversation;
  }
  
  // Listen para mensagens da extensão
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getConversation') {
      const conversation = getConversation();
      sendResponse({ conversation });
    }
  });
  