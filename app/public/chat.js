document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.querySelector('.boton');
    const userInput = document.getElementById('user-input');
    const messagesContainer = document.getElementById('messages');

    sendButton.addEventListener('click', sendMessage);

    userInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    async function sendMessage() {
        const userMessage = userInput.value.trim();

        if (!userMessage) return;

        // Mostrar el mensaje del usuario en el chat
        displayMessage(`Tú: ${userMessage}`);
        userInput.value = ''; // Limpiar el campo de entrada

        try {
            // Enviar la solicitud al servidor
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: userMessage }), // El mensaje del usuario se envía aquí
            });

            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }

            const data = await response.json();
            // Mostrar la respuesta de la IA
            displayMessage(`Modelo AI: ${data.reply}`);
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
            displayMessage('Error al obtener la respuesta.');
        }
    }

    function displayMessage(message) {
        const newMessage = document.createElement('p');
        newMessage.textContent = message;
        messagesContainer.appendChild(newMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll automático hacia abajo
    }
});