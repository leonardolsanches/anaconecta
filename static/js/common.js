// Common JavaScript functions

// Show alert message
function showAlert(type, message) {
    const alertContainer = document.getElementById('alert-container');
    
    // Create alert element
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`;
    alertElement.role = 'alert';
    
    alertElement.innerHTML = `
        ${message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    `;
    
    // Add to container
    alertContainer.appendChild(alertElement);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
        alertElement.classList.remove('show');
        setTimeout(() => {
            alertElement.remove();
        }, 300);
    }, 5000);
}

// Format date to locale string
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Format date and time to locale string
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
}

// Get dashboard stats
function getDashboardStats() {
    const promises = [
        fetch('/api/clients').then(res => res.json()),
        fetch('/api/initiatives').then(res => res.json()),
        fetch('/api/mentorships').then(res => res.json())
    ];
    
    Promise.all(promises)
        .then(([clients, initiatives, mentorships]) => {
            // Count client statuses
            const prospectClients = clients.filter(c => c.status === 'prospect').length;
            const activeClients = clients.filter(c => c.status === 'active').length;
            const completedClients = clients.filter(c => c.status === 'completed').length;
            
            // Count initiative statuses
            const pendingInitiatives = initiatives.filter(i => i.status === 'pending').length;
            const inProgressInitiatives = initiatives.filter(i => i.status === 'in_progress').length;
            const completedInitiatives = initiatives.filter(i => i.status === 'completed').length;
            
            // Count mentorship statuses
            const initialContactMentorships = mentorships.filter(m => m.status === 'initial_contact').length;
            const proposalSentMentorships = mentorships.filter(m => m.status === 'proposal_sent').length;
            const contractSignedMentorships = mentorships.filter(m => m.status === 'contract_signed').length;
            const inProgressMentorships = mentorships.filter(m => m.status === 'in_progress').length;
            const completedMentorships = mentorships.filter(m => m.status === 'completed').length;
            
            // Update DOM
            document.getElementById('total-clients').textContent = clients.length;
            document.getElementById('prospect-clients').textContent = prospectClients;
            document.getElementById('active-clients').textContent = activeClients;
            document.getElementById('completed-clients').textContent = completedClients;
            
            document.getElementById('total-initiatives').textContent = initiatives.length;
            document.getElementById('pending-initiatives').textContent = pendingInitiatives;
            document.getElementById('inprogress-initiatives').textContent = inProgressInitiatives;
            document.getElementById('completed-initiatives').textContent = completedInitiatives;
            
            document.getElementById('total-mentorships').textContent = mentorships.length;
            document.getElementById('initial-mentorships').textContent = initialContactMentorships;
            document.getElementById('proposal-mentorships').textContent = proposalSentMentorships;
            document.getElementById('contract-mentorships').textContent = contractSignedMentorships;
            document.getElementById('inprogress-mentorships').textContent = inProgressMentorships;
            document.getElementById('completed-mentorships').textContent = completedMentorships;
        })
        .catch(error => {
            console.error('Error loading dashboard stats:', error);
            showAlert('error', 'Erro ao carregar estatísticas do dashboard.');
        });
}
