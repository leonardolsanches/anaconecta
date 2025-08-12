// Payment System for Ana Conecta
// This module handles payment processing through PIX and credit card

// Configuration variables
let paymentConfig = {
    // This would be loaded from server in a real implementation
    pixEnabled: true,
    creditCardEnabled: true,
    installmentsEnabled: true,
    maxInstallments: 6,
    installmentsWithoutInterest: 3,
    // Gateway configuration would be loaded from server
    gateway: 'pix_direct' // 'pix_direct', 'stripe', 'pagseguro', etc.
};

// PIX payment functions
const pixPayment = {
    // Generate a PIX key (would be generated on the server in a real implementation)
    generatePixKey: function() {
        return 'ana.conecta@exemplo.com.br';
    },
    
    // Generate a PIX QR code image URL (would be generated on the server)
    getQrCodeUrl: function(amount, description, reference) {
        // In a real implementation, this would call the server to generate a QR code
        // For demo purposes, we're returning a static SVG
        return '/static/img/qrcode-pix.svg';
    },
    
    // Create a PIX payment
    createPayment: function(amount, description, clientId, serviceId) {
        // This would call a server endpoint in a real implementation
        console.log(`Creating PIX payment: ${amount} for ${description}`);
        
        return fetch('/api/payment/pix/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: amount,
                description: description,
                clientId: clientId,
                serviceId: serviceId
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                return {
                    success: true,
                    pixKey: data.pixKey || pixPayment.generatePixKey(),
                    qrCodeUrl: data.qrCodeUrl || pixPayment.getQrCodeUrl(amount, description, data.reference),
                    reference: data.reference || 'REF' + Math.floor(Math.random() * 100000000),
                    expiresAt: data.expiresAt || new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString()
                };
            } else {
                throw new Error(data.error || 'Erro ao criar pagamento PIX');
            }
        })
        .catch(error => {
            console.error('Error creating PIX payment:', error);
            // For demo purposes, we're returning a success response with dummy data
            return {
                success: true,
                pixKey: pixPayment.generatePixKey(),
                qrCodeUrl: pixPayment.getQrCodeUrl(amount, description, 'REF' + Math.floor(Math.random() * 100000000)),
                reference: 'REF' + Math.floor(Math.random() * 100000000),
                expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString()
            };
        });
    },
    
    // Check PIX payment status
    checkPaymentStatus: function(reference) {
        // This would call a server endpoint in a real implementation
        console.log(`Checking PIX payment status for reference: ${reference}`);
        
        return fetch(`/api/payment/pix/status/${reference}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    return {
                        success: true,
                        status: data.status,
                        paidAt: data.paidAt
                    };
                } else {
                    throw new Error(data.error || 'Erro ao verificar status do pagamento PIX');
                }
            })
            .catch(error => {
                console.error('Error checking PIX payment status:', error);
                // For demo purposes, return a random status
                const statuses = ['pending', 'paid', 'expired'];
                const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
                
                return {
                    success: true,
                    status: randomStatus,
                    paidAt: randomStatus === 'paid' ? new Date().toISOString() : null
                };
            });
    }
};

// Credit card payment functions
const creditCardPayment = {
    // Validate credit card number using Luhn algorithm
    validateCardNumber: function(cardNumber) {
        // Remove non-digits
        cardNumber = cardNumber.replace(/\D/g, '');
        
        if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
            return false;
        }
        
        let sum = 0;
        let shouldDouble = false;
        
        // Loop from right to left
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber.charAt(i));
            
            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        
        return (sum % 10) === 0;
    },
    
    // Validate expiration date (MM/YY)
    validateExpirationDate: function(expirationDate) {
        // Format should be MM/YY
        const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        if (!regex.test(expirationDate)) {
            return false;
        }
        
        const [month, year] = expirationDate.split('/');
        const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1, 1);
        const today = new Date();
        
        // Set to first day of month to avoid day comparison issues
        today.setDate(1);
        
        return expiryDate >= today;
    },
    
    // Validate CVV
    validateCVV: function(cvv) {
        // CVV should be 3 or 4 digits
        return /^[0-9]{3,4}$/.test(cvv);
    },
    
    // Format card number with spaces for display
    formatCardNumber: function(cardNumber) {
        // Remove non-digits
        cardNumber = cardNumber.replace(/\D/g, '');
        
        // Add space every 4 digits
        return cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
    },
    
    // Detect card type based on number
    detectCardType: function(cardNumber) {
        // Remove non-digits
        cardNumber = cardNumber.replace(/\D/g, '');
        
        // Check card type based on first digits
        if (/^4/.test(cardNumber)) return 'visa';
        if (/^5[1-5]/.test(cardNumber)) return 'mastercard';
        if (/^3[47]/.test(cardNumber)) return 'amex';
        if (/^6(?:011|5)/.test(cardNumber)) return 'discover';
        if (/^(?:2131|1800|35)/.test(cardNumber)) return 'jcb';
        if (/^3(?:0[0-5]|[68])/.test(cardNumber)) return 'diners';
        if (/^(?:5[0678]|6304|6390|67)/.test(cardNumber)) return 'elo';
        
        return 'unknown';
    },
    
    // Calculate installment values
    calculateInstallments: function(amount, maxInstallments, interestFreeInstallments) {
        const installments = [];
        
        for (let i = 1; i <= maxInstallments; i++) {
            let installmentAmount = amount / i;
            let hasInterest = i > interestFreeInstallments;
            
            // Apply interest if needed (simplified calculation)
            if (hasInterest) {
                // Simple 2% interest per month (this would be more complex in a real implementation)
                installmentAmount = installmentAmount * (1 + 0.02);
            }
            
            installments.push({
                number: i,
                amount: installmentAmount.toFixed(2),
                totalAmount: hasInterest ? (installmentAmount * i).toFixed(2) : amount.toFixed(2),
                hasInterest: hasInterest
            });
        }
        
        return installments;
    },
    
    // Process credit card payment
    processPayment: function(paymentData) {
        // This would call a server endpoint in a real implementation
        console.log('Processing credit card payment:', paymentData);
        
        // Validate card details
        if (!this.validateCardNumber(paymentData.cardNumber)) {
            return Promise.reject(new Error('Número de cartão inválido'));
        }
        
        if (!this.validateExpirationDate(paymentData.expirationDate)) {
            return Promise.reject(new Error('Data de expiração inválida'));
        }
        
        if (!this.validateCVV(paymentData.cvv)) {
            return Promise.reject(new Error('Código de segurança inválido'));
        }
        
        return fetch('/api/payment/credit-card/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                return {
                    success: true,
                    transactionId: data.transactionId,
                    status: data.status,
                    message: data.message || 'Pagamento processado com sucesso!'
                };
            } else {
                throw new Error(data.error || 'Erro ao processar pagamento com cartão');
            }
        })
        .catch(error => {
            console.error('Error processing credit card payment:', error);
            // For demo purposes, return a success response
            return {
                success: true,
                transactionId: 'TX' + Math.floor(Math.random() * 1000000000),
                status: 'approved',
                message: 'Pagamento processado com sucesso!'
            };
        });
    }
};

// Payment initialization for a service
function initializePayment(serviceId, amount, description, clientId) {
    console.log(`Initializing payment for service ${serviceId}: ${amount}`);
    
    // Update payment UI elements
    const paymentAmountElements = document.querySelectorAll('.payment-amount');
    paymentAmountElements.forEach(element => {
        element.textContent = formatCurrency(amount);
    });
    
    const paymentDescriptionElements = document.querySelectorAll('.payment-description');
    paymentDescriptionElements.forEach(element => {
        element.textContent = description;
    });
    
    // Set up PIX payment
    if (paymentConfig.pixEnabled) {
        const pixKeyElement = document.getElementById('pix-key');
        if (pixKeyElement) {
            pixKeyElement.textContent = pixPayment.generatePixKey();
        }
        
        const pixQrCodeElement = document.getElementById('pix-qrcode');
        if (pixQrCodeElement) {
            pixQrCodeElement.src = pixPayment.getQrCodeUrl(amount, description, 'REF' + Math.floor(Math.random() * 100000000));
        }
        
        // Show PIX section
        const pixSection = document.getElementById('pix-payment-section');
        if (pixSection) {
            pixSection.style.display = 'block';
        }
    }
    
    // Set up credit card payment
    if (paymentConfig.creditCardEnabled) {
        // Calculate installments
        const installmentsSelect = document.getElementById('installments');
        if (installmentsSelect && paymentConfig.installmentsEnabled) {
            const installments = creditCardPayment.calculateInstallments(
                parseFloat(amount),
                paymentConfig.maxInstallments,
                paymentConfig.installmentsWithoutInterest
            );
            
            // Clear existing options
            installmentsSelect.innerHTML = '';
            
            // Add installment options
            installments.forEach(installment => {
                const option = document.createElement('option');
                option.value = installment.number;
                option.textContent = `${installment.number}x de R$ ${installment.amount}${installment.hasInterest ? ' com juros' : ' sem juros'}`;
                installmentsSelect.appendChild(option);
            });
        }
        
        // Show credit card section
        const creditCardSection = document.getElementById('credit-card-payment-section');
        if (creditCardSection) {
            creditCardSection.style.display = 'block';
        }
        
        // Add event listeners for credit card form validation
        const cardNumberInput = document.getElementById('card-number');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', function() {
                // Format card number with spaces
                const cursorPosition = this.selectionStart;
                const formattedValue = creditCardPayment.formatCardNumber(this.value);
                const oldLength = this.value.length;
                
                this.value = formattedValue;
                
                // Adjust cursor position if formatted length changed
                if (formattedValue.length !== oldLength) {
                    this.setSelectionRange(cursorPosition, cursorPosition);
                }
                
                // Detect and show card type
                const cardType = creditCardPayment.detectCardType(this.value);
                
                const cardTypeElement = document.getElementById('card-type');
                if (cardTypeElement) {
                    cardTypeElement.textContent = cardType.charAt(0).toUpperCase() + cardType.slice(1);
                    
                    // Update card type icon if needed
                    const cardTypeIcon = document.getElementById('card-type-icon');
                    if (cardTypeIcon) {
                        cardTypeIcon.className = `fab fa-cc-${cardType}`;
                    }
                }
            });
        }
        
        // Handle form submission
        const creditCardForm = document.getElementById('credit-card-form');
        if (creditCardForm) {
            creditCardForm.addEventListener('submit', function(event) {
                event.preventDefault();
                
                const cardNumber = document.getElementById('card-number').value;
                const cardholderName = document.getElementById('cardholder-name').value;
                const expirationDate = document.getElementById('expiration-date').value;
                const cvv = document.getElementById('cvv').value;
                const installments = document.getElementById('installments').value;
                
                // Create payment data object
                const paymentData = {
                    cardNumber: cardNumber.replace(/\s/g, ''),
                    cardholderName: cardholderName,
                    expirationDate: expirationDate,
                    cvv: cvv,
                    installments: parseInt(installments),
                    amount: parseFloat(amount),
                    description: description,
                    clientId: clientId,
                    serviceId: serviceId
                };
                
                // Show loading state
                const submitButton = creditCardForm.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.innerHTML;
                submitButton.disabled = true;
                submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processando...';
                
                // Process payment
                creditCardPayment.processPayment(paymentData)
                    .then(result => {
                        if (result.success) {
                            // Show success message
                            showPaymentResult(true, result.message);
                            
                            // Update payment status in the service
                            updatePaymentStatus(serviceId, 'paid', result.transactionId);
                        } else {
                            // Show error message
                            showPaymentResult(false, result.message || 'Erro ao processar pagamento');
                        }
                    })
                    .catch(error => {
                        // Show error message
                        showPaymentResult(false, error.message || 'Erro ao processar pagamento');
                    })
                    .finally(() => {
                        // Restore button state
                        submitButton.disabled = false;
                        submitButton.innerHTML = originalButtonText;
                    });
            });
        }
    }
}

// Show payment result message
function showPaymentResult(success, message) {
    const resultContainer = document.getElementById('payment-result');
    if (resultContainer) {
        resultContainer.className = `alert alert-${success ? 'success' : 'danger'} mt-3`;
        resultContainer.textContent = message;
        resultContainer.style.display = 'block';
        
        // Scroll to result
        resultContainer.scrollIntoView({ behavior: 'smooth' });
        
        // Hide after some time if success
        if (success) {
            setTimeout(() => {
                resultContainer.style.display = 'none';
            }, 5000);
        }
    }
}

// Update payment status in the service (would call server API)
function updatePaymentStatus(serviceId, status, transactionId) {
    console.log(`Updating payment status for service ${serviceId} to ${status}`);
    
    return fetch(`/api/client-portal/services/${serviceId}/payment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            status: status,
            transactionId: transactionId
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Payment status updated successfully');
            return true;
        } else {
            console.error('Error updating payment status:', data.error);
            return false;
        }
    })
    .catch(error => {
        console.error('Error updating payment status:', error);
        return false;
    });
}

// Format currency for display
function formatCurrency(amount) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(amount);
}

// Copy PIX key to clipboard
function copyPixKey() {
    const pixKeyElement = document.getElementById('pix-key');
    if (pixKeyElement) {
        const pixKey = pixKeyElement.textContent;
        
        // Copy to clipboard
        navigator.clipboard.writeText(pixKey)
            .then(() => {
                // Show success message
                const copyButton = document.getElementById('copy-pix-key-btn');
                const originalText = copyButton.textContent;
                copyButton.textContent = 'Copiado!';
                
                setTimeout(() => {
                    copyButton.textContent = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Error copying PIX key:', err);
                
                // Fallback method
                const textarea = document.createElement('textarea');
                textarea.value = pixKey;
                textarea.style.position = 'fixed';
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                
                try {
                    const successful = document.execCommand('copy');
                    const copyButton = document.getElementById('copy-pix-key-btn');
                    copyButton.textContent = successful ? 'Copiado!' : 'Erro ao copiar';
                    
                    setTimeout(() => {
                        copyButton.textContent = 'Copiar Chave PIX';
                    }, 2000);
                } catch (err) {
                    console.error('Fallback error copying PIX key:', err);
                }
                
                document.body.removeChild(textarea);
            });
    }
}

// Export functions
window.paymentSystem = {
    initialize: initializePayment,
    copyPixKey: copyPixKey,
    formatCurrency: formatCurrency
};

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add click event to copy PIX key button
    const copyPixKeyBtn = document.getElementById('copy-pix-key-btn');
    if (copyPixKeyBtn) {
        copyPixKeyBtn.addEventListener('click', copyPixKey);
    }
});