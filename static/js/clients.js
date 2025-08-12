// Client management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Load clients when page loads
    loadClients();
    
    // Set up event listeners
    document.getElementById('client-form').addEventListener('submit', handleClientSubmit);
    document.getElementById('client-filter').addEventListener('change', loadClients);
    
    // Clear form when modal is hidden
    $('#clientModal').on('hidden.bs.modal', function () {
        resetClientForm();
    });
});

// Global variable to track if we're editing or creating
let editingClientId = null;

// Load clients from the server
function loadClients() {
    const statusFilter = document.getElementById('client-filter').value;
    const url = statusFilter ? `/api/clients?status=${statusFilter}` : '/api/clients';
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(clients => {
            displayClients(clients);
        })
        .catch(error => {
            console.error('Error loading clients:', error);
            showAlert('error', 'Erro ao carregar clientes. Por favor, tente novamente.');
        });
}

// Display clients in the table
function displayClients(clients) {
    const tableBody = document.getElementById('clients-table-body');
    tableBody.innerHTML = '';
    
    if (clients.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="6" class="text-center">Nenhum cliente encontrado</td>
        `;
        tableBody.appendChild(emptyRow);
        return;
    }
    
    clients.forEach(client => {
        const row = document.createElement('tr');
        
        // Format the status badge
        let statusBadgeClass = '';
        let statusText = '';
        
        switch(client.status) {
            case 'prospect':
                statusBadgeClass = 'badge-prospect';
                statusText = 'Prospect';
                break;
            case 'active':
                statusBadgeClass = 'badge-active';
                statusText = 'Ativo';
                break;
            case 'completed':
                statusBadgeClass = 'badge-completed';
                statusText = 'Concluído';
                break;
            default:
                statusBadgeClass = 'badge-secondary';
                statusText = client.status;
        }
        
        // Format the date
        const createdDate = new Date(client.created_at);
        const formattedDate = `${createdDate.toLocaleDateString('pt-BR')}`;
        
        row.innerHTML = `
            <td>${client.name}</td>
            <td>${client.email}</td>
            <td>${client.phone}</td>
            <td><span class="badge ${statusBadgeClass}">${statusText}</span></td>
            <td>${formattedDate}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary mr-1" onclick="editClient(${client.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteClient(${client.id}, '${client.name}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Handle client form submission
function handleClientSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const name = document.getElementById('client-name').value.trim();
    const email = document.getElementById('client-email').value.trim();
    const phone = document.getElementById('client-phone').value.trim();
    const status = document.getElementById('client-status').value;
    const notes = document.getElementById('client-notes').value.trim();
    
    // Validate form data
    if (!name || !email || !phone) {
        showAlert('error', 'Nome, e-mail e telefone são obrigatórios.');
        return;
    }
    
    // Prepare client data
    const clientData = {
        name,
        email,
        phone,
        status,
        notes
    };
    
    // Determine if we're creating or updating
    const isEditing = editingClientId !== null;
    const url = isEditing ? `/api/clients/${editingClientId}` : '/api/clients';
    const method = isEditing ? 'PUT' : 'POST';
    
    // Send the request
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(clientData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Close the modal
        $('#clientModal').modal('hide');
        
        // Show success message
        const message = isEditing ? 'Cliente atualizado com sucesso!' : 'Cliente criado com sucesso!';
        showAlert('success', message);
        
        // Reload clients
        loadClients();
    })
    .catch(error => {
        console.error('Error saving client:', error);
        showAlert('error', 'Erro ao salvar cliente. Por favor, tente novamente.');
    });
}

// Edit client
function editClient(clientId) {
    fetch(`/api/clients/${clientId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(client => {
            // Set form values
            document.getElementById('client-name').value = client.name;
            document.getElementById('client-email').value = client.email;
            document.getElementById('client-phone').value = client.phone;
            document.getElementById('client-status').value = client.status;
            document.getElementById('client-notes').value = client.notes || '';
            
            // Set the editing flag
            editingClientId = client.id;
            
            // Update modal title
            document.getElementById('clientModalLabel').textContent = 'Editar Cliente';
            
            // Show the modal
            $('#clientModal').modal('show');
        })
        .catch(error => {
            console.error('Error loading client:', error);
            showAlert('error', 'Erro ao carregar cliente. Por favor, tente novamente.');
        });
}

// Delete client
function deleteClient(clientId, clientName) {
    if (confirm(`Tem certeza que deseja excluir o cliente "${clientName}"?`)) {
        fetch(`/api/clients/${clientId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            showAlert('success', 'Cliente excluído com sucesso!');
            loadClients();
        })
        .catch(error => {
            console.error('Error deleting client:', error);
            showAlert('error', 'Erro ao excluir cliente. Por favor, tente novamente.');
        });
    }
}

// Reset client form
function resetClientForm() {
    document.getElementById('client-form').reset();
    editingClientId = null;
    document.getElementById('clientModalLabel').textContent = 'Novo Cliente';
}

// Show new client modal
function showNewClientModal() {
    resetClientForm();
    $('#clientModal').modal('show');
}
