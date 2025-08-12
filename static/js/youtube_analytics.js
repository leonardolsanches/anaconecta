// YouTube Analytics for Ana Conecta
// This module handles YouTube data extraction for analytics and prospect generation

// Configuration
const youtubeConfig = {
    channelId: 'anaconecta', // YouTube channel ID
    apiKey: '' // Will be populated from environment variable
};

// Podcast episodes data with view counts
const podcastEpisodeStats = [
    { 
        id: 1, 
        title: "Ana Conecta Podcast Ep #05 Com Patricia Rocha - Minha jornada em RH",
        duration: "22:11",
        views: 81,
        timeAgo: "há 3 meses"
    },
    { 
        id: 2, 
        title: "Ana Conecta Podcast Ep #05 Com Patricia Rocha - Minha jornada em RH | Bloco 2",
        duration: "30:37:00",
        views: 15,
        timeAgo: "há 2 meses"
    },
    { 
        id: 3, 
        title: "Ana Conecta Podcast Ep #05 Com Patricia Rocha - Minha jornada em RH | Bloco 3",
        duration: "16:20",
        views: 14,
        timeAgo: "há 2 meses"
    },
    { 
        id: 4, 
        title: "Ana Conecta Podcast Ep #05 Com Patricia Rocha - Minha jornada em RH | Episódio COMPLETO",
        duration: "01:09:04",
        views: 14,
        timeAgo: "há 2 meses"
    },
    { 
        id: 5, 
        title: "Episódio #01 \"Uma Ponte para Você\" - Com Nivea Oliveira",
        duration: "50:51:00",
        views: 221,
        timeAgo: "há 8 meses"
    },
    { 
        id: 6, 
        title: "Episódio #02 Até onde as conexões podem nos levar? - Com Janine Alcure e Andréia Xavier",
        duration: "54:58:00",
        views: 96,
        timeAgo: "há 7 meses"
    },
    { 
        id: 7, 
        title: "EPISÓDIO #03: De outubro a outubro rosa - Com Valesca Félix Caetano e Mariana Amon",
        duration: "05:45",
        views: 97,
        timeAgo: "há 7 meses"
    },
    { 
        id: 8, 
        title: "EPISÓDIO #03: De outubro a outubro rosa - Com Valesca Félix Caetano e Mariana Amon | Parte 1",
        duration: "22:22",
        views: 111,
        timeAgo: "há 7 meses"
    },
    { 
        id: 9, 
        title: "EPISÓDIO #03: De outubro a outubro rosa - Com Valesca Félix Caetano e Mariana Amon | Parte 2",
        duration: "39:54:00",
        views: 48,
        timeAgo: "há 6 meses"
    },
    { 
        id: 10, 
        title: "EPISÓDIO #03: De outubro a outubro rosa - Com Valesca Félix Caetano e Mariana Amon | Parte 3",
        duration: "14:13",
        views: 30,
        timeAgo: "há 6 meses"
    },
    { 
        id: 11, 
        title: "Episódio #04: O Poder de Transformação do Planejamento Financeiro Pessoal - Com Silze Takano",
        duration: "27:00:00",
        views: 35,
        timeAgo: "há 6 meses"
    },
    { 
        id: 12, 
        title: "Episódio #04: O Poder de Transformação do Planejamento Financeiro Pessoal - Com Silze Takano PARTE 2",
        duration: "23:00:00",
        views: 38,
        timeAgo: "há 5 meses"
    },
    { 
        id: 13, 
        title: "Episódio #09 A humanização das organizações com Éder Monteiro",
        duration: "01:05:19",
        views: 73,
        timeAgo: "há 11 meses"
    },
    { 
        id: 14, 
        title: "Episódio #10: Liderança que abre caminhos e protagoniza futuros inclusivos",
        duration: "01:28:18",
        views: 163,
        timeAgo: "há 3 semanas"
    },
    { 
        id: 15, 
        title: "Episódio #6 : Longevidade Produtiva e o Mercado de Trabalho para a Mulher Madura| Com Marcia Tavares",
        duration: "01:04:52",
        views: 165,
        timeAgo: "há 1 mês"
    },
    { 
        id: 16, 
        title: "Episódio #7: Saúde mental na economia do cuidado com Monique Menezes",
        duration: "01:13:32",
        views: 115,
        timeAgo: "há 1 mês"
    },
    { 
        id: 17, 
        title: "Episódio #8 Saúde Mental nas Organizações com Deborah Leite e Marta Serra",
        duration: "39:01:00",
        views: 58,
        timeAgo: "há 2 semanas"
    },
    { 
        id: 18, 
        title: "Espaço Facial, Grupo Impettus e Peggô Store na EXPO FRANCHISING ABF RIO 2024",
        duration: "35:17:00",
        views: 20,
        timeAgo: "há 5 meses"
    },
    { 
        id: 19, 
        title: "PERGUNTA DA AUDIÊNCIA: RECRUTAMENTO E ENTREVISTA - COM PATRÍCIA ROCHA | EPISÓDIO #05",
        duration: "07:19",
        views: 21,
        timeAgo: "há 2 meses"
    }
];

// Display podcast statistics table
function displayPodcastStats(containerId = 'podcast-stats-container') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Sort episodes by views (highest first)
    const sortedEpisodes = [...podcastEpisodeStats].sort((a, b) => b.views - a.views);
    
    let html = `
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="thead-dark">
                    <tr>
                        <th>Duração</th>
                        <th>Título</th>
                        <th class="text-center">Visualizações</th>
                        <th class="text-center">Publicado</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    sortedEpisodes.forEach(episode => {
        html += `
            <tr>
                <td>${episode.duration}</td>
                <td>${episode.title}</td>
                <td class="text-center">${episode.views}</td>
                <td class="text-center">${episode.timeAgo}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
        
        <div class="mt-4">
            <h6>Estatísticas gerais</h6>
            <div class="row">
                <div class="col-md-3 mb-3">
                    <div class="card bg-primary text-white">
                        <div class="card-body text-center">
                            <h3>${sortedEpisodes.length}</h3>
                            <p class="mb-0">Total de episódios</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 mb-3">
                    <div class="card bg-success text-white">
                        <div class="card-body text-center">
                            <h3>${sortedEpisodes.reduce((sum, ep) => sum + ep.views, 0)}</h3>
                            <p class="mb-0">Total de visualizações</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 mb-3">
                    <div class="card bg-info text-white">
                        <div class="card-body text-center">
                            <h3>${Math.round(sortedEpisodes.reduce((sum, ep) => sum + ep.views, 0) / sortedEpisodes.length)}</h3>
                            <p class="mb-0">Média de visualizações</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 mb-3">
                    <div class="card bg-warning text-white">
                        <div class="card-body text-center">
                            <h3>${sortedEpisodes[0].views}</h3>
                            <p class="mb-0">Máximo de visualizações</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// Generate potential prospects from YouTube viewers
async function generateProspectsFromYouTube() {
    // In a real application, this would call YouTube API to get viewers
    // For demonstration purposes, we'll use sample data
    
    // Simulated API call
    try {
        console.log('Generating potential prospects from YouTube viewers...');
        
        // This would show a loading indicator in the UI
        document.getElementById('prospect-generator-status').textContent = 'Consultando API do YouTube...';
        document.getElementById('prospect-generator-progress').style.width = '30%';
        
        // Simulate a delay for API request
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Update progress
        document.getElementById('prospect-generator-status').textContent = 'Processando dados de espectadores...';
        document.getElementById('prospect-generator-progress').style.width = '60%';
        
        // Generate sample prospects (in a real application, these would come from the API)
        const sampleProspects = [
            { name: 'Maria Silva', email: 'maria.silva@gmail.com', video: 'Episódio #01 "Uma Ponte para Você"', commented: true },
            { name: 'João Santos', email: 'joao.santos@outlook.com', video: 'Episódio #10: Liderança que abre caminhos', commented: true },
            { name: 'Ana Carolina', email: 'ana.carolina@gmail.com', video: 'Episódio #6 : Longevidade Produtiva', commented: false },
            { name: 'Ricardo Oliveira', email: 'ricardo.oliveira@hotmail.com', video: 'Episódio #7: Saúde mental na economia', commented: true },
            { name: 'Juliana Costa', email: 'juliana.costa@gmail.com', video: 'EPISÓDIO #03: De outubro a outubro rosa', commented: false },
            { name: 'Fernando Mendes', email: 'fernando.mendes@gmail.com', video: 'Episódio #8 Saúde Mental nas Organizações', commented: true },
            { name: 'Patrícia Lima', email: 'patricia.lima@outlook.com', video: 'Ana Conecta Podcast Ep #05', commented: false },
            { name: 'Carlos Eduardo', email: 'carlos.eduardo@gmail.com', video: 'Episódio #09 A humanização das organizações', commented: true }
        ];
        
        // Simulate another delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update progress
        document.getElementById('prospect-generator-status').textContent = 'Preparando resultados...';
        document.getElementById('prospect-generator-progress').style.width = '90%';
        
        // Final delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Complete progress
        document.getElementById('prospect-generator-status').textContent = 'Concluído!';
        document.getElementById('prospect-generator-progress').style.width = '100%';
        
        // Display the prospects
        displayProspects(sampleProspects);
        
        return sampleProspects;
    } catch (error) {
        console.error('Error generating prospects:', error);
        document.getElementById('prospect-generator-status').textContent = 'Erro: ' + error.message;
        document.getElementById('prospect-generator-progress').style.width = '100%';
        document.getElementById('prospect-generator-progress').classList.remove('bg-success');
        document.getElementById('prospect-generator-progress').classList.add('bg-danger');
        return [];
    }
}

// Display prospects in the UI
function displayProspects(prospects, containerId = 'prospects-container') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (!prospects || prospects.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">Nenhum prospect encontrado.</p>';
        return;
    }
    
    let html = `
        <div class="alert alert-success">
            <strong>${prospects.length} prospects</strong> encontrados a partir das visualizações do YouTube!
        </div>
        
        <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead class="thead-dark">
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Vídeo</th>
                        <th class="text-center">Comentou</th>
                        <th class="text-center">Ações</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    prospects.forEach(prospect => {
        html += `
            <tr>
                <td>${prospect.name}</td>
                <td>${prospect.email}</td>
                <td>${prospect.video}</td>
                <td class="text-center">
                    ${prospect.commented ? 
                        '<span class="badge badge-success"><i class="fas fa-check"></i> Sim</span>' : 
                        '<span class="badge badge-secondary"><i class="fas fa-times"></i> Não</span>'}
                </td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-primary mr-1 add-prospect-btn" data-name="${prospect.name}" data-email="${prospect.email}">
                        <i class="fas fa-user-plus"></i> Adicionar
                    </button>
                </td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
        
        <div class="text-right mt-3">
            <button id="import-all-prospects-btn" class="btn btn-success">
                <i class="fas fa-file-import"></i> Importar Todos os Prospects
            </button>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Add event listeners for add buttons
    document.querySelectorAll('.add-prospect-btn').forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const email = this.getAttribute('data-email');
            addProspectToClients(name, email);
        });
    });
    
    // Add event listener for import all button
    document.getElementById('import-all-prospects-btn').addEventListener('click', importAllProspects);
}

// Add a prospect to clients
function addProspectToClients(name, email) {
    // In a real application, this would call the API to add a client
    fetch('/api/clients', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
            phone: '', // This would be empty initially
            status: 'prospect',
            notes: 'Prospect gerado a partir de visualizações do YouTube'
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        showAlert('success', `Prospect ${name} adicionado com sucesso!`);
    })
    .catch(error => {
        console.error('Error adding prospect:', error);
        showAlert('error', `Erro ao adicionar prospect: ${error.message}`);
    });
}

// Import all prospects
function importAllProspects() {
    // Get all prospect buttons
    const buttons = document.querySelectorAll('.add-prospect-btn');
    
    // Show confirmation dialog
    if (confirm(`Deseja importar ${buttons.length} prospects para a base de clientes?`)) {
        // Import each prospect
        buttons.forEach(button => {
            const name = button.getAttribute('data-name');
            const email = button.getAttribute('data-email');
            addProspectToClients(name, email);
        });
    }
}

// Show alert message (this may be duplicated with common.js)
function showAlert(type, message) {
    // Check if a showAlert function already exists (defined in common.js)
    if (typeof window.showAlert === 'function') {
        window.showAlert(type, message);
        return;
    }
    
    const alertContainer = document.getElementById('alert-container');
    if (!alertContainer) return;
    
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

// Export functions
window.youtubeAnalytics = {
    displayPodcastStats,
    generateProspectsFromYouTube,
    displayProspects
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if podcast stats container exists and display stats
    const podcastStatsContainer = document.getElementById('podcast-stats-container');
    if (podcastStatsContainer) {
        displayPodcastStats();
    }
    
    // Check if prospect generator button exists and add event listener
    const generateProspectsBtn = document.getElementById('generate-prospects-btn');
    if (generateProspectsBtn) {
        generateProspectsBtn.addEventListener('click', generateProspectsFromYouTube);
    }
});