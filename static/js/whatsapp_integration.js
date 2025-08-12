// WhatsApp Integration for Ana Conecta
// This module handles the integration with WhatsApp API

// Function to send a WhatsApp message
function sendWhatsAppMessage(phoneNumber, message) {
    // Format the phone number (remove any non-numeric characters)
    const formattedPhone = phoneNumber.replace(/\D/g, '');
    
    // Check if we're using the direct WhatsApp API or Twilio
    if (window.twilioEnabled) {
        // In a real implementation, this would call a server endpoint
        // that uses Twilio API to send the message
        console.log(`Sending WhatsApp message via Twilio to ${formattedPhone}: ${message}`);
        
        // Make API call to our backend
        return fetch('/api/send-whatsapp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone: formattedPhone,
                message: message
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                return {
                    success: true,
                    message: 'Mensagem enviada com sucesso!'
                };
            } else {
                throw new Error(data.error || 'Erro ao enviar mensagem');
            }
        });
    } else {
        // Use direct WhatsApp link (doesn't actually send, just opens WhatsApp)
        const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
        
        // Open in new window
        window.open(whatsappUrl, '_blank');
        
        return Promise.resolve({
            success: true,
            message: 'WhatsApp aberto com a mensagem pré-preenchida'
        });
    }
}

// Create a WhatsApp deep link
function createWhatsAppLink(phoneNumber, message) {
    const formattedPhone = phoneNumber.replace(/\D/g, '');
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}

// Function to schedule a WhatsApp message (would require server implementation)
function scheduleWhatsAppMessage(phoneNumber, message, scheduledDate) {
    // This would call a server endpoint to schedule a message
    console.log(`Scheduling WhatsApp message to ${phoneNumber} at ${scheduledDate}: ${message}`);
    
    return fetch('/api/schedule-whatsapp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            phone: phoneNumber,
            message: message,
            scheduledDate: scheduledDate
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            return {
                success: true,
                message: 'Mensagem agendada com sucesso!',
                scheduledId: data.scheduledId
            };
        } else {
            throw new Error(data.error || 'Erro ao agendar mensagem');
        }
    });
}

// Function to generate a template message
function generateTemplateMessage(templateName, params = {}) {
    const templates = {
        'welcome': `Olá ${params.name || '[Nome]'}, bem-vindo(a) ao Ana Conecta! Estamos felizes em tê-lo(a) conosco. Como posso ajudar?`,
        'proposal': `Olá ${params.name || '[Nome]'}, segue a proposta para ${params.service || 'o serviço'} que conversamos. Aguardo seu feedback!`,
        'meeting': `Olá ${params.name || '[Nome]'}, gostaria de confirmar nossa reunião no dia ${params.date || '[data]'} às ${params.time || '[horário]'}. Podemos prosseguir?`,
        'payment': `Olá ${params.name || '[Nome]'}, o pagamento para ${params.service || 'o serviço'} foi ${params.status || 'processado'}. Para mais detalhes, acesse o portal do cliente.`,
        'follow_up': `Olá ${params.name || '[Nome]'}, como está? Gostaria de fazer um acompanhamento sobre ${params.topic || 'nosso último contato'}. Podemos conversar sobre isso?`
    };
    
    return templates[templateName] || 'Mensagem não encontrada';
}

// Function to handle incoming WhatsApp messages (would be integrated with webhooks)
function handleIncomingWhatsAppMessage(message) {
    console.log('Incoming WhatsApp message:', message);
    // This would be handled by server webhooks in a real implementation
}

// Function to add WhatsApp button to interface elements
function addWhatsAppButtons() {
    // Find all elements with data-whatsapp-phone attribute
    document.querySelectorAll('[data-whatsapp-phone]').forEach(element => {
        const phone = element.getAttribute('data-whatsapp-phone');
        const message = element.getAttribute('data-whatsapp-message') || '';
        
        // Create button if it doesn't exist
        if (!element.querySelector('.whatsapp-btn')) {
            const button = document.createElement('a');
            button.className = 'btn btn-success btn-sm whatsapp-btn';
            button.innerHTML = '<i class="fab fa-whatsapp"></i> WhatsApp';
            button.href = createWhatsAppLink(phone, message);
            button.target = '_blank';
            
            element.appendChild(button);
        }
    });
}

// Initialize WhatsApp integration
function initWhatsAppIntegration() {
    // Check if Twilio integration is enabled
    window.twilioEnabled = false; // This would be set based on server configuration
    
    // Add WhatsApp buttons to any elements with the appropriate data attributes
    addWhatsAppButtons();
    
    console.log('WhatsApp integration initialized');
}

// Export functions
window.whatsAppIntegration = {
    sendMessage: sendWhatsAppMessage,
    createLink: createWhatsAppLink,
    scheduleMessage: scheduleWhatsAppMessage,
    generateTemplate: generateTemplateMessage
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initWhatsAppIntegration);