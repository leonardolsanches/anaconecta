// Initiative management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Load initiatives and categories when page loads
    loadInitiativeCategories();
    loadInitiatives();
    
    // Set up event listeners
    document.getElementById('initiative-form').addEventListener('submit', handleInitiativeSubmit);
    document.getElementById('initiative-category-filter').addEventListener('change', loadInitiatives);
    document.getElementById('initiative-status-filter').addEventListener('change', loadInitiatives);
    
    // Clear form when modal is hidden
    $('#initiativeModal').on('hidden.bs.modal', function () {
        resetInitiativeForm();
    });
});

// Global variable to track if we're editing or creating
let editingInitiativeId = null;

// Load initiative categories
function loadInitiativeCategories() {
    fetch('/api/initiative-categories')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(categories => {
            // Populate category dropdowns
            const filterDropdown = document.getElementById('initiative-category-filter');
            const formDropdown = document.getElementById('initiative-category');
            
            // Clear existing options except the first one
            while (filterDropdown.options.length > 1) {
                filterDropdown.remove(1);
            }
            
            // Clear all options in form dropdown
            formDropdown.innerHTML = '';
            
            // Add categories to dropdowns
            categories.forEach(category => {
                const filterOption = document.createElement('option');
                filterOption.value = category;
                filterOption.textContent = category;
                filterDropdown.appendChild(filterOption);
                
                const formOption = document.createElement('option');
                formOption.value = category;
                formOption.textContent = category;
                formDropdown.appendChild(formOption);
            });
        })
        .catch(error => {
            console.error('Error loading categories:', error);
            showAlert('error', 'Erro ao carregar categorias. Por favor, tente novamente.');
        });
}

// Load initiatives from the server
function loadInitiatives() {
    const categoryFilter = document.getElementById('initiative-category-filter').value;
    const statusFilter = document.getElementById('initiative-status-filter').value;
    
    let url = '/api/initiatives';
    const params = [];
    
    if (categoryFilter) {
        params.push(`category=${encodeURIComponent(categoryFilter)}`);
    }
    
    if (statusFilter) {
        params.push(`status=${encodeURIComponent(statusFilter)}`);
    }
    
    if (params.length > 0) {
        url += '?' + params.join('&');
    }
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(initiatives => {
            displayInitiatives(initiatives);
        })
        .catch(error => {
            console.error('Error loading initiatives:', error);
            showAlert('error', 'Erro ao carregar iniciativas. Por favor, tente novamente.');
        });
}

// Display initiatives in the table
function displayInitiatives(initiatives) {
    const tableBody = document.getElementById('initiatives-table-body');
    tableBody.innerHTML = '';
    
    if (initiatives.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="6" class="text-center">Nenhuma iniciativa encontrada</td>
        `;
        tableBody.appendChild(emptyRow);
        return;
    }
    
    initiatives.forEach(initiative => {
        const row = document.createElement('tr');
        
        // Format the status badge
        let statusBadgeClass = '';
        let statusText = '';
        
        switch(initiative.status) {
            case 'pending':
                statusBadgeClass = 'badge-pending';
                statusText = 'Pendente';
                break;
            case 'in_progress':
                statusBadgeClass = 'badge-in-progress';
                statusText = 'Em Progresso';
                break;
            case 'completed':
                statusBadgeClass = 'badge-completed';
                statusText = 'Concluído';
                break;
            case 'cancelled':
                statusBadgeClass = 'badge-cancelled';
                statusText = 'Cancelado';
                break;
            default:
                statusBadgeClass = 'badge-secondary';
                statusText = initiative.status;
        }
        
        // Create priority indicator
        let priorityHtml = '<div class="priority-indicator">';
        for (let i = 1; i <= 5; i++) {
            const isActive = i <= initiative.priority;
            priorityHtml += `<div class="priority-dot ${isActive ? 'active' : ''}"></div>`;
        }
        priorityHtml += '</div>';
        
        // Format the date
        const createdDate = new Date(initiative.created_at);
        const formattedDate = `${createdDate.toLocaleDateString('pt-BR')}`;
        
        row.innerHTML = `
            <td>${initiative.title}</td>
            <td>${initiative.category}</td>
            <td><span class="badge ${statusBadgeClass}">${statusText}</span></td>
            <td>${priorityHtml}</td>
            <td>${formattedDate}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary mr-1" onclick="editInitiative(${initiative.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteInitiative(${initiative.id}, '${initiative.title}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Handle initiative form submission
function handleInitiativeSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const title = document.getElementById('initiative-title').value.trim();
    const description = document.getElementById('initiative-description').value.trim();
    const category = document.getElementById('initiative-category').value;
    const status = document.getElementById('initiative-status').value;
    const priority = document.getElementById('initiative-priority').value;
    
    // Validate form data
    if (!title || !description || !category) {
        showAlert('error', 'Título, descrição e categoria são obrigatórios.');
        return;
    }
    
    // Prepare initiative data
    const initiativeData = {
        title,
        description,
        category,
        status,
        priority
    };
    
    // Determine if we're creating or updating
    const isEditing = editingInitiativeId !== null;
    const url = isEditing ? `/api/initiatives/${editingInitiativeId}` : '/api/initiatives';
    const method = isEditing ? 'PUT' : 'POST';
    
    // Send the request
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(initiativeData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Close the modal
        $('#initiativeModal').modal('hide');
        
        // Show success message
        const message = isEditing ? 'Iniciativa atualizada com sucesso!' : 'Iniciativa criada com sucesso!';
        showAlert('success', message);
        
        // Reload initiatives
        loadInitiatives();
    })
    .catch(error => {
        console.error('Error saving initiative:', error);
        showAlert('error', 'Erro ao salvar iniciativa. Por favor, tente novamente.');
    });
}

// Edit initiative
function editInitiative(initiativeId) {
    fetch(`/api/initiatives/${initiativeId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(initiative => {
            // Set form values
            document.getElementById('initiative-title').value = initiative.title;
            document.getElementById('initiative-description').value = initiative.description;
            document.getElementById('initiative-category').value = initiative.category;
            document.getElementById('initiative-status').value = initiative.status;
            document.getElementById('initiative-priority').value = initiative.priority;
            
            // Set the editing flag
            editingInitiativeId = initiative.id;
            
            // Update modal title
            document.getElementById('initiativeModalLabel').textContent = 'Editar Iniciativa';
            
            // Show the modal
            $('#initiativeModal').modal('show');
        })
        .catch(error => {
            console.error('Error loading initiative:', error);
            showAlert('error', 'Erro ao carregar iniciativa. Por favor, tente novamente.');
        });
}

// Delete initiative
function deleteInitiative(initiativeId, initiativeTitle) {
    if (confirm(`Tem certeza que deseja excluir a iniciativa "${initiativeTitle}"?`)) {
        fetch(`/api/initiatives/${initiativeId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            showAlert('success', 'Iniciativa excluída com sucesso!');
            loadInitiatives();
        })
        .catch(error => {
            console.error('Error deleting initiative:', error);
            showAlert('error', 'Erro ao excluir iniciativa. Por favor, tente novamente.');
        });
    }
}

// Reset initiative form
function resetInitiativeForm() {
    document.getElementById('initiative-form').reset();
    editingInitiativeId = null;
    document.getElementById('initiativeModalLabel').textContent = 'Nova Iniciativa';
}

// Show new initiative modal
function showNewInitiativeModal() {
    resetInitiativeForm();
    $('#initiativeModal').modal('show');
}
