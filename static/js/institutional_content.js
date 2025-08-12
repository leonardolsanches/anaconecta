/**
 * institutional_content.js
 * Gestão de conteúdo institucional do Ana Conecta
 */

// Dados simulados de episódios do podcast 
// Em ambiente de produção, estes dados seriam carregados da API do YouTube
const podcastEpisodeStats = [
    {
        id: 1,
        title: "Carreira, Propósito e Reinvenção Profissional",
        duration: "52:14",
        views: "1.2K",
        timeAgo: "há 2 meses",
        youtubeId: "abc123"
    },
    {
        id: 2,
        title: "Mentoria como Ferramenta de Desenvolvimento",
        duration: "48:31",
        views: "986",
        timeAgo: "há 3 meses",
        youtubeId: "def456"
    },
    {
        id: 3,
        title: "Liderança Humanizada em Tempos de Transformação",
        duration: "55:18",
        views: "1.5K",
        timeAgo: "há 5 meses",
        youtubeId: "ghi789"
    },
    {
        id: 4,
        title: "Inteligência Emocional no Ambiente Corporativo",
        duration: "46:27",
        views: "1.1K",
        timeAgo: "há 6 meses",
        youtubeId: "jkl101"
    },
    {
        id: 5,
        title: "Mulheres na Liderança: Desafios e Oportunidades",
        duration: "58:42",
        views: "2.3K",
        timeAgo: "há 7 meses",
        youtubeId: "mno112"
    },
    {
        id: 6,
        title: "O Futuro do Trabalho e as Habilidades Necessárias",
        duration: "50:15",
        views: "1.8K",
        timeAgo: "há 8 meses",
        youtubeId: "pqr131"
    },
    {
        id: 7,
        title: "Desenvolvimento de Carreira para Profissionais Seniores",
        duration: "53:09",
        views: "1.3K",
        timeAgo: "há 9 meses",
        youtubeId: "stu142"
    },
    {
        id: 8,
        title: "Equilibrando Vida Pessoal e Profissional",
        duration: "49:37",
        views: "2.1K",
        timeAgo: "há 10 meses",
        youtubeId: "vwx153"
    }
];

// Perfil da Ana Rosa (dados que seriam usados em páginas institucionais)
const profileInfo = {
    name: "Ana Rosa Marcuartú",
    title: "Mentora de Carreira e Desenvolvimento Profissional",
    linkedin: "https://www.linkedin.com/in/anarosamarcuartu/",
    youtube: "https://www.youtube.com/@anaconecta",
    shortBio: "Especialista em desenvolvimento humano, carreira e liderança. Criadora do canal Ana Conecta.",
    expertise: [
        "Mentoria em Carreira",
        "Liderança Humanizada",
        "Transição de Carreira",
        "Comunicação Corporativa",
        "Desenvolvimento Humano"
    ],
    education: [
        "MBA em Gestão de Pessoas",
        "Especialização em Desenvolvimento Humano",
        "Certificação em Executive Coaching"
    ]
};

async function loadPodcastEpisodes() {
    // Em ambiente real, faria uma chamada AJAX para a API
    // Simularemos o tempo de resposta
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(podcastEpisodeStats);
        }, 800);
    });
}

function displayPodcastEpisodes(containerId = 'podcast-list') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    let html = '<div class="row">';
    
    podcastEpisodeStats.forEach((episode, index) => {
        html += `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <span class="badge badge-secondary float-right">${episode.timeAgo}</span>
                        <h5 class="card-title">${episode.title}</h5>
                        <p class="card-text text-muted">Duração: ${episode.duration} • ${episode.views} visualizações</p>
                        <div class="text-right">
                            <a href="javascript:void(0)" class="btn btn-sm btn-danger view-episode" data-episode-id="${episode.id}">
                                <i class="fab fa-youtube"></i> Assistir
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
    
    // Adicionar event listeners para os botões de episódios
    document.querySelectorAll('.view-episode').forEach(button => {
        button.addEventListener('click', function() {
            const episodeId = parseInt(this.getAttribute('data-episode-id'));
            showPodcastDetails(episodeId);
        });
    });
}

async function showPodcastDetails(episodeId) {
    const episode = podcastEpisodeStats.find(ep => ep.id === episodeId);
    
    if (episode) {
        const modalContent = document.getElementById('podcast-episode-content');
        if (modalContent) {
            modalContent.innerHTML = `
                <h4>${episode.title}</h4>
                <p><small class="text-muted">Publicado ${episode.timeAgo} • ${episode.views} visualizações</small></p>
                <hr>
                <p class="mb-2"><strong>Duração:</strong> ${episode.duration}</p>
                <div class="embed-responsive embed-responsive-16by9 mt-3">
                    <div class="text-center py-5 bg-light">
                        <i class="fab fa-youtube fa-3x text-danger mb-3"></i>
                        <p>Clique em "Assistir no YouTube" para ver o episódio completo</p>
                    </div>
                </div>
            `;
            
            document.getElementById('watch-youtube-btn').href = `https://www.youtube.com/watch?v=${episode.youtubeId}`;
            document.getElementById('podcastEpisodeModalLabel').textContent = episode.title;
            
            $('#podcastEpisodeModal').modal('show');
        }
    }
}

function loadProfileInfo() {
    return profileInfo;
}

function displayProfileInfo(containerId = 'profile-container') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    let html = `
        <div class="text-center mb-4">
            <img src="/static/img/ana-rosa-profile.svg" alt="${profileInfo.name}" class="img-fluid rounded-circle" style="max-width: 150px;">
            <h4 class="mt-3">${profileInfo.name}</h4>
            <p>${profileInfo.title}</p>
            <div class="mb-3">
                <a href="${profileInfo.linkedin}" target="_blank" class="btn btn-sm btn-outline-primary">
                    <i class="fab fa-linkedin"></i> LinkedIn
                </a>
                <a href="${profileInfo.youtube}" target="_blank" class="btn btn-sm btn-outline-danger">
                    <i class="fab fa-youtube"></i> YouTube
                </a>
            </div>
        </div>
        <p>${profileInfo.shortBio}</p>
        <div class="row mt-4">
            <div class="col-md-6">
                <h5>Especialidades</h5>
                <ul class="list-group list-group-flush">
                    ${profileInfo.expertise.map(item => `<li class="list-group-item">${item}</li>`).join('')}
                </ul>
            </div>
            <div class="col-md-6">
                <h5>Formação</h5>
                <ul class="list-group list-group-flush">
                    ${profileInfo.education.map(item => `<li class="list-group-item">${item}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

function searchPodcastEpisodes(query) {
    if (!query) return podcastEpisodeStats;
    
    query = query.toLowerCase();
    return podcastEpisodeStats.filter(episode => 
        episode.title.toLowerCase().includes(query)
    );
}

async function initInstitutionalContent() {
    await loadPodcastEpisodes();
    displayPodcastEpisodes();
}

// Exportar funcionalidades para uso global
const institutionalContent = {
    loadPodcastEpisodes,
    displayPodcastEpisodes,
    showPodcastDetails,
    loadProfileInfo,
    displayProfileInfo,
    searchPodcastEpisodes,
    initInstitutionalContent
};