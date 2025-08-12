// Mentorship management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Load mentorships and clients when page loads
    loadClients();
    loadMentorships();
    
    // Set up event listeners
    document.getElementById('mentorship-form').addEventListener('submit', handleMentorshipSubmit);
    document.getElementById('mentorship-status-filter').addEventListener('change', loadMentorships);
    
    // Set up meeting form functionality
    document.getElementById('add-meeting-btn').addEventListener('click', addMeetingToForm);
    document.getElementById('meetings-container').addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-meeting-btn')) {
            e.target.closest('.meeting-item').remove();
        }
    });
    
    // Set up document form functionality
    document.getElementById('add-document-btn').addEventListener('click', addDocumentToForm);
    document.getElementById('documents-container').addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-document-btn')) {
            e.target.closest('.document-item').remove();
        }
    });
    
    // Clear form when modal is hidden
    $('#mentorshipModal').on('hidden.bs.modal', function () {
        resetMentorshipForm();
    });
});

// Global variable to track if we're editing or creating
let editingMentorshipId = null;
let currentMeetings = [];
let currentDocuments = [];

// Load clients for dropdown
function loadClients() {
    fetch('/api/clients')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(clients => {
            // Populate client dropdown
            const clientDropdown = document.getElementById('mentorship-client');
            clientDropdown.innerHTML = '<option value="">Selecione um cliente...</option>';
            
            // Add clients to dropdown
            clients.forEach(client => {
                const option = document.createElement('option');
                option.value = client.id;
                option.textContent = client.name;
                clientDropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error loading clients:', error);
            showAlert('error', 'Erro ao carregar clientes. Por favor, tente novamente.');
        });
}

// Load mentorships from the server
function loadMentorships() {
    const statusFilter = document.getElementById('mentorship-status-filter').value;
    const url = statusFilter ? `/api/mentorships?status=${statusFilter}` : '/api/mentorships';
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(mentorships => {
            displayMentorships(mentorships);
        })
        .catch(error => {
            console.error('Error loading mentorships:', error);
            showAlert('error', 'Erro ao carregar mentorias. Por favor, tente novamente.');
        });
}

// Display mentorships in the table
function displayMentorships(mentorships) {
    const tableBody = document.getElementById('mentorships-table-body');
    tableBody.innerHTML = '';
    
    if (mentorships.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="6" class="text-center">Nenhuma mentoria encontrada</td>
        `;
        tableBody.appendChild(emptyRow);
        return;
    }
    
    mentorships.forEach(mentorship => {
        const row = document.createElement('tr');
        
        // Format the status badge
        let statusBadgeClass = '';
        let statusText = '';
        
        switch(mentorship.status) {
            case 'initial_contact':
                statusBadgeClass = 'badge-initial-contact';
                statusText = 'Contato Inicial';
                break;
            case 'proposal_sent':
                statusBadgeClass = 'badge-proposal-sent';
                statusText = 'Proposta Enviada';
                break;
            case 'contract_signed':
                statusBadgeClass = 'badge-contract-signed';
                statusText = 'Contrato Assinado';
                break;
            case 'in_progress':
                statusBadgeClass = 'badge-in-progress';
                statusText = 'Em Progresso';
                break;
            case 'completed':
                statusBadgeClass = 'badge-completed';
                statusText = 'Concluída';
                break;
            default:
                statusBadgeClass = 'badge-secondary';
                statusText = mentorship.status;
        }
        
        // Format the date
        const createdDate = new Date(mentorship.created_at);
        const formattedDate = `${createdDate.toLocaleDateString('pt-BR')}`;
        
        row.innerHTML = `
            <td>${mentorship.title}</td>
            <td>${mentorship.client_name}</td>
            <td><span class="badge ${statusBadgeClass}">${statusText}</span></td>
            <td>${mentorship.meetings ? mentorship.meetings.length : 0}</td>
            <td>${formattedDate}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary mr-1" onclick="editMentorship(${mentorship.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteMentorship(${mentorship.id}, '${mentorship.title}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Handle mentorship form submission
function handleMentorshipSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const clientId = document.getElementById('mentorship-client').value;
    const title = document.getElementById('mentorship-title').value.trim();
    const description = document.getElementById('mentorship-description').value.trim();
    const status = document.getElementById('mentorship-status').value;
    
    // Collect meetings
    const meetings = [];
    document.querySelectorAll('.meeting-item').forEach(item => {
        const dateInput = item.querySelector('.meeting-date');
        const topicInput = item.querySelector('.meeting-topic');
        
        if (dateInput && topicInput && dateInput.value && topicInput.value) {
            meetings.push({
                date: dateInput.value,
                topic: topicInput.value.trim()
            });
        }
    });
    
    // Collect documents
    const documents = [];
    document.querySelectorAll('.document-item').forEach(item => {
        const typeSelect = item.querySelector('.document-type');
        const nameInput = item.querySelector('.document-name');
        
        if (typeSelect && nameInput && typeSelect.value && nameInput.value) {
            documents.push({
                type: typeSelect.value,
                name: nameInput.value.trim()
            });
        }
    });
    
    // Validate form data
    if (!clientId || !title || !description) {
        showAlert('error', 'Cliente, título e descrição são obrigatórios.');
        return;
    }
    
    // Prepare mentorship data
    const mentorshipData = {
        client_id: clientId,
        title,
        description,
        status,
        meetings,
        documents
    };
    
    // Determine if we're creating or updating
    const isEditing = editingMentorshipId !== null;
    const url = isEditing ? `/api/mentorships/${editingMentorshipId}` : '/api/mentorships';
    const method = isEditing ? 'PUT' : 'POST';
    
    // Send the request
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(mentorshipData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Close the modal
        $('#mentorshipModal').modal('hide');
        
        // Show success message
        const message = isEditing ? 'Mentoria atualizada com sucesso!' : 'Mentoria criada com sucesso!';
        showAlert('success', message);
        
        // Reload mentorships
        loadMentorships();
    })
    .catch(error => {
        console.error('Error saving mentorship:', error);
        showAlert('error', 'Erro ao salvar mentoria. Por favor, tente novamente.');
    });
}

// Add meeting to form
function addMeetingToForm() {
    const meetingsContainer = document.getElementById('meetings-container');
    const meetingItem = document.createElement('div');
    meetingItem.className = 'meeting-item row mb-2';
    meetingItem.innerHTML = `
        <div class="col-md-4">
            <input type="date" class="form-control meeting-date" required>
        </div>
        <div class="col-md-6">
            <input type="text" class="form-control meeting-topic" placeholder="Tópico da reunião" required>
        </div>
        <div class="col-md-2">
            <button type="button" class="btn btn-danger btn-sm remove-meeting-btn">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    meetingsContainer.appendChild(meetingItem);
}

// Add document to form
function addDocumentToForm() {
    const documentsContainer = document.getElementById('documents-container');
    const documentItem = document.createElement('div');
    documentItem.className = 'document-item row mb-2';
    documentItem.innerHTML = `
        <div class="col-md-4">
            <select class="form-control document-type" required>
                <option value="">Tipo de documento...</option>
                <option value="proposal">Proposta</option>
                <option value="contract">Contrato</option>
                <option value="receipt">Recibo</option>
                <option value="content">Conteúdo</option>
                <option value="other">Outro</option>
            </select>
        </div>
        <div class="col-md-6">
            <input type="text" class="form-control document-name" placeholder="Nome do documento" required>
        </div>
        <div class="col-md-2">
            <button type="button" class="btn btn-danger btn-sm remove-document-btn">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    documentsContainer.appendChild(documentItem);
}

// Edit mentorship
function editMentorship(mentorshipId) {
    fetch(`/api/mentorships/${mentorshipId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(mentorship => {
            // Set form values
            document.getElementById('mentorship-client').value = mentorship.client_id;
            document.getElementById('mentorship-title').value = mentorship.title;
            document.getElementById('mentorship-description').value = mentorship.description;
            document.getElementById('mentorship-status').value = mentorship.status;
            
            // Clear existing meetings and documents
            document.getElementById('meetings-container').innerHTML = '';
            document.getElementById('documents-container').innerHTML = '';
            
            // Add meetings to form
            if (mentorship.meetings && mentorship.meetings.length > 0) {
                mentorship.meetings.forEach(meeting => {
                    const meetingsContainer = document.getElementById('meetings-container');
                    const meetingItem = document.createElement('div');
                    meetingItem.className = 'meeting-item row mb-2';
                    meetingItem.innerHTML = `
                        <div class="col-md-4">
                            <input type="date" class="form-control meeting-date" value="${meeting.date}" required>
                        </div>
                        <div class="col-md-6">
                            <input type="text" class="form-control meeting-topic" value="${meeting.topic}" placeholder="Tópico da reunião" required>
                        </div>
                        <div class="col-md-2">
                            <button type="button" class="btn btn-danger btn-sm remove-meeting-btn">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `;
                    meetingsContainer.appendChild(meetingItem);
                });
            }
            
            // Add documents to form
            if (mentorship.documents && mentorship.documents.length > 0) {
                mentorship.documents.forEach(document => {
                    const documentsContainer = document.getElementById('documents-container');
                    const documentItem = document.createElement('div');
                    documentItem.className = 'document-item row mb-2';
                    documentItem.innerHTML = `
                        <div class="col-md-4">
                            <select class="form-control document-type" required>
                                <option value="">Tipo de documento...</option>
                                <option value="proposal" ${document.type === 'proposal' ? 'selected' : ''}>Proposta</option>
                                <option value="contract" ${document.type === 'contract' ? 'selected' : ''}>Contrato</option>
                                <option value="receipt" ${document.type === 'receipt' ? 'selected' : ''}>Recibo</option>
                                <option value="content" ${document.type === 'content' ? 'selected' : ''}>Conteúdo</option>
                                <option value="other" ${document.type === 'other' ? 'selected' : ''}>Outro</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <input type="text" class="form-control document-name" value="${document.name}" placeholder="Nome do documento" required>
                        </div>
                        <div class="col-md-2">
                            <button type="button" class="btn btn-danger btn-sm remove-document-btn">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `;
                    documentsContainer.appendChild(documentItem);
                });
            }
            
            // Set the editing flag
            editingMentorshipId = mentorship.id;
            
            // Update modal title
            document.getElementById('mentorshipModalLabel').textContent = 'Editar Mentoria';
            
            // Show the modal
            $('#mentorshipModal').modal('show');
        })
        .catch(error => {
            console.error('Error loading mentorship:', error);
            showAlert('error', 'Erro ao carregar mentoria. Por favor, tente novamente.');
        });
}

// Delete mentorship
function deleteMentorship(mentorshipId, mentorshipTitle) {
    if (confirm(`Tem certeza que deseja excluir a mentoria "${mentorshipTitle}"?`)) {
        fetch(`/api/mentorships/${mentorshipId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            showAlert('success', 'Mentoria excluída com sucesso!');
            loadMentorships();
        })
        .catch(error => {
            console.error('Error deleting mentorship:', error);
            showAlert('error', 'Erro ao excluir mentoria. Por favor, tente novamente.');
        });
    }
}

// Reset mentorship form
function resetMentorshipForm() {
    document.getElementById('mentorship-form').reset();
    document.getElementById('meetings-container').innerHTML = '';
    document.getElementById('documents-container').innerHTML = '';
    editingMentorshipId = null;
    document.getElementById('mentorshipModalLabel').textContent = 'Nova Mentoria';
}

// Show new mentorship modal
function showNewMentorshipModal() {
    resetMentorshipForm();
    $('#mentorshipModal').modal('show');
}
