// Client Portal JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Load client services, available initiatives, and podcasts
    loadClientServices();
    loadAvailableInitiatives();
    loadPodcastEpisodes();
    
    // Event listeners for chat
    document.getElementById('send-message-btn').addEventListener('click', sendChatMessage);
    document.getElementById('chat-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
    
    // Event listeners for modals
    document.getElementById('request-service-btn').addEventListener('click', requestService);
    document.getElementById('approve-scope-btn').addEventListener('click', approveScope);
    document.getElementById('request-changes-btn').addEventListener('click', requestScopeChanges);
    
    // Payment related event listeners
    document.getElementById('copy-pix-key-btn').addEventListener('click', copyPixKey);
    document.getElementById('credit-card-form').addEventListener('submit', processCreditCardPayment);
});

// Sample data for client services
const sampleClientServices = [
    {
        id: 1,
        title: "Mentoria em Liderança",
        status: "in_progress",
        lastUpdate: "2025-05-15T14:30:00",
        client_id: 1,
        meetings: [
            { date: "2025-05-10", topic: "Introdução e Definição de Objetivos" },
            { date: "2025-05-17", topic: "Estilos de Liderança e Autoconhecimento" }
        ],
        documents: [
            { type: "proposal", name: "Proposta_Mentoria_Lideranca.pdf" },
            { type: "contract", name: "Contrato_Mentoria_Lideranca.pdf" }
        ],
        scope: [
            { title: "Avaliação de Perfil de Liderança", description: "Diagnóstico do perfil de liderança atual e identificação de pontos fortes e áreas de desenvolvimento." },
            { title: "Desenvolvimento de Habilidades", description: "Sessões focadas em comunicação, delegação, feedback, gerenciamento de conflitos e desenvolvimento de equipes." },
            { title: "Plano de Ação Individual", description: "Elaboração de plano de desenvolvimento individual com metas e ações específicas." }
        ],
        price: "R$ 1.800,00",
        installments: 3,
        timeline: [
            { date: "2025-05-05", title: "Solicitação de Serviço", description: "Solicitação inicial de mentoria em liderança." },
            { date: "2025-05-07", title: "Proposta Enviada", description: "Proposta personalizada enviada para aprovação." },
            { date: "2025-05-09", title: "Contrato Assinado", description: "Contrato assinado e primeira sessão agendada." }
        ],
        chatHistory: [
            { sender: "client", message: "Olá Ana, gostaria de mais informações sobre o programa de mentoria em liderança.", timestamp: "2025-05-03T10:15:00" },
            { sender: "ana", message: "Olá! Claro, o programa de mentoria em liderança é personalizado para suas necessidades específicas. Podemos agendar uma conversa inicial para entender melhor seus objetivos?", timestamp: "2025-05-03T10:20:00" },
            { sender: "client", message: "Seria ótimo! Tenho disponibilidade na próxima semana.", timestamp: "2025-05-03T10:25:00" },
            { sender: "ana", message: "Perfeito! Podemos marcar para segunda-feira às 14h?", timestamp: "2025-05-03T10:30:00" },
            { sender: "client", message: "Confirmado, estarei disponível nesse horário.", timestamp: "2025-05-03T10:35:00" }
        ]
    },
    {
        id: 2,
        title: "Consultoria em Comunicação Corporativa",
        status: "proposal_sent",
        lastUpdate: "2025-05-18T09:15:00",
        client_id: 1,
        meetings: [],
        documents: [
            { type: "proposal", name: "Proposta_Consultoria_Comunicacao.pdf" }
        ],
        scope: [
            { title: "Diagnóstico de Comunicação", description: "Avaliação da comunicação interna e externa atual, identificando pontos fortes e fragilidades." },
            { title: "Plano Estratégico", description: "Desenvolvimento de estratégia de comunicação alinhada aos objetivos de negócio." },
            { title: "Treinamento de Porta-Vozes", description: "Preparação da equipe para comunicação eficaz com diferentes públicos." }
        ],
        price: "R$ 2.500,00",
        installments: 2,
        timeline: [
            { date: "2025-05-15", title: "Solicitação de Serviço", description: "Solicitação de consultoria em comunicação corporativa." },
            { date: "2025-05-18", title: "Proposta Enviada", description: "Proposta personalizada enviada para aprovação." }
        ],
        chatHistory: [
            { sender: "client", message: "Ana, estou com dificuldades na comunicação interna da minha empresa. Você poderia me ajudar?", timestamp: "2025-05-15T08:30:00" },
            { sender: "ana", message: "Com certeza! A comunicação interna é fundamental para o sucesso organizacional. Poderia me contar um pouco mais sobre os desafios específicos que está enfrentando?", timestamp: "2025-05-15T08:45:00" },
            { sender: "client", message: "Temos problemas de alinhamento entre departamentos e as informações não fluem adequadamente.", timestamp: "2025-05-15T09:00:00" },
            { sender: "ana", message: "Entendo. Vou preparar uma proposta de consultoria focada nessas questões. Enviarei para você o mais breve possível.", timestamp: "2025-05-15T09:15:00" }
        ]
    }
];

// Sample data for available initiatives
const sampleInitiatives = [
    {
        id: 1,
        title: "Mentoria Individual em Carreira",
        category: "Mentoria Individual",
        description: "Programa personalizado de mentoria para desenvolvimento profissional e planejamento de carreira.",
        details: "O programa de Mentoria Individual em Carreira é desenhado para profissionais que buscam clareza, direcionamento e estratégias concretas para alavancar sua trajetória profissional. Através de sessões personalizadas, trabalharemos juntos para identificar seus pontos fortes, áreas de desenvolvimento, e criar um plano de ação alinhado com seus objetivos de carreira.",
        benefits: [
            "Autoconhecimento profissional e identificação de potencialidades",
            "Definição de metas claras e estratégias para alcançá-las",
            "Desenvolvimento de habilidades comportamentais essenciais",
            "Orientação para tomada de decisões estratégicas de carreira",
            "Acompanhamento personalizado do progresso"
        ],
        format: "6 sessões individuais de 1h30 cada, realizadas quinzenalmente via Google Meet",
        price: "R$ 1.800,00",
        installments: 3,
        image: "mentoria-carreira.jpg"
    },
    {
        id: 2,
        title: "Mentoria em Grupo: Liderança Humanizada",
        category: "Mentoria em Grupo",
        description: "Desenvolvimento de habilidades de liderança com foco em pessoas e resultados sustentáveis.",
        details: "A Mentoria em Grupo sobre Liderança Humanizada reúne um grupo seleto de líderes que desejam desenvolver uma abordagem mais centrada nas pessoas sem abrir mão de resultados. O programa aborda temas como comunicação empática, feedback construtivo, desenvolvimento de equipes, gestão de conflitos e liderança inspiradora.",
        benefits: [
            "Troca de experiências com outros líderes",
            "Desenvolvimento de competências essenciais de liderança",
            "Ferramentas práticas para aplicação imediata",
            "Construção de rede de contatos qualificada",
            "Acesso a conteúdos exclusivos"
        ],
        format: "8 encontros em grupo de 2h cada, realizados semanalmente via Google Meet",
        price: "R$ 1.200,00",
        installments: 3,
        image: "mentoria-lideranca.jpg"
    },
    {
        id: 3,
        title: "Workshop Estratégias para LinkedIn",
        category: "Conteúdo Digital",
        description: "Aprenda a maximizar o potencial do LinkedIn para networking e oportunidades profissionais.",
        details: "O Workshop de Estratégias para LinkedIn oferece um guia prático para transformar seu perfil e atuação nesta rede profissional. Você aprenderá a otimizar seu perfil, criar conteúdo relevante, construir uma rede estratégica e utilizar a plataforma para alcançar seus objetivos profissionais.",
        benefits: [
            "Otimização de perfil profissional",
            "Estratégias de criação de conteúdo",
            "Técnicas de networking eficaz",
            "Uso de ferramentas avançadas do LinkedIn",
            "Material complementar exclusivo"
        ],
        format: "Workshop de 4 horas com material de apoio",
        price: "R$ 350,00",
        installments: 1,
        image: "workshop-linkedin.jpg"
    },
    {
        id: 4,
        title: "Palestra: O Futuro do Trabalho",
        category: "Palestras",
        description: "Uma análise das tendências de transformação no mundo do trabalho e estratégias de adaptação.",
        details: "Nesta palestra, discutimos as principais tendências que estão remodelando o mundo do trabalho, como inteligência artificial, automação, trabalho remoto e híbrido, novas competências demandadas e mudanças nas relações de trabalho. Apresentamos insights valiosos e estratégias práticas para profissionais e organizações se prepararem para este futuro.",
        benefits: [
            "Visão abrangente das tendências do mercado de trabalho",
            "Identificação de competências futuras essenciais",
            "Estratégias de adaptação às mudanças",
            "Casos práticos e exemplos reais",
            "Sessão de perguntas e respostas"
        ],
        format: "Palestra de 1h30 com apresentação visual e material complementar",
        price: "Sob consulta",
        installments: 1,
        image: "palestra-futuro.jpg"
    },
    {
        id: 5,
        title: "Podcast Personalizado para Empresas",
        category: "Podcast",
        description: "Produção de episódios de podcast personalizados para comunicação interna ou externa da sua empresa.",
        details: "O serviço de Podcast Personalizado para Empresas oferece a produção completa de episódios de podcast adaptados às necessidades de comunicação da sua organização. Pode ser usado para comunicação interna, compartilhamento de conhecimento, storytelling da marca ou posicionamento no mercado.",
        benefits: [
            "Produção profissional de áudio",
            "Roteirização personalizada",
            "Condução de entrevistas",
            "Edição e finalização",
            "Estratégia de distribuição"
        ],
        format: "Série de episódios (número a definir) com duração média de 30 minutos cada",
        price: "Sob consulta",
        installments: 1,
        image: "podcast-empresas.jpg"
    }
];

// Sample podcast episodes
const samplePodcastEpisodes = [
    {
        id: 1,
        title: "Minha jornada em RH - Com Patricia Rocha",
        date: "2025-04-15",
        description: "Patricia Rocha compartilha sua trajetória no mundo de Recursos Humanos e insights valiosos sobre o desenvolvimento deste campo ao longo dos anos.",
        youtubeLink: "https://www.youtube.com/@anaconecta",
        summary: "Neste episódio, Patricia Rocha, experiente profissional de RH, compartilha sua jornada de mais de 20 anos na área. Ela aborda temas como a evolução das práticas de RH, a importância do desenvolvimento humano nas organizações e como o papel de RH passou de administrativo para estratégico. Patricia também oferece conselhos valiosos para novos profissionais que desejam ingressar na área."
    },
    {
        id: 2,
        title: "Uma Ponte para Você - Com Nivea Oliveira",
        date: "2025-03-28",
        description: "Uma conversa inspiradora sobre transições de carreira e a importância de construir pontes para novos caminhos profissionais.",
        youtubeLink: "https://www.youtube.com/@anaconecta",
        summary: "Nivea Oliveira, especialista em transição de carreira, compartilha sua metodologia 'Uma Ponte para Você', que ajuda profissionais a navegarem com sucesso por mudanças em suas trajetórias. Ela discute a importância do autoconhecimento, da identificação de competências transferíveis e do networking estratégico. O episódio traz exemplos reais de pessoas que reinventaram suas carreiras e estratégias práticas para quem está considerando uma mudança profissional."
    },
    {
        id: 3,
        title: "Até onde as conexões podem nos levar? - Com Janine Alcure e Andréia Xavier",
        date: "2025-03-10",
        description: "Uma análise do poder das conexões genuínas e como elas podem transformar carreiras e negócios.",
        youtubeLink: "https://www.youtube.com/@anaconecta",
        summary: "Janine Alcure e Andréia Xavier, especialistas em networking estratégico, discutem como construir e manter conexões profissionais significativas. Elas abordam a diferença entre networking quantitativo e qualitativo, técnicas para estabelecer relações autênticas e como aproveitar as conexões de forma ética e mutuamente benéfica. O episódio também explora como as redes sociais transformaram o networking e estratégias para se destacar no ambiente digital."
    },
    {
        id: 4,
        title: "Saúde mental nas Organizações - Com Deborah Leite e Marta Serra",
        date: "2025-02-20",
        description: "Uma discussão importante sobre o papel das empresas na promoção da saúde mental dos colaboradores.",
        youtubeLink: "https://www.youtube.com/@anaconecta",
        summary: "Deborah Leite, psicóloga organizacional, e Marta Serra, gestora de RH, conversam sobre a crescente importância da saúde mental no ambiente corporativo. Elas discutem os impactos do estresse e burnout na produtividade, os sinais de alerta que líderes devem observar, e estratégias eficazes para promover um ambiente de trabalho mentalmente saudável. O episódio também aborda políticas organizacionais, o papel dos líderes e práticas que podem ser implementadas para criar uma cultura de bem-estar psicológico."
    }
];

// Load client services to sidebar
function loadClientServices() {
    const servicesList = document.getElementById('client-services');
    
    if (sampleClientServices.length === 0) {
        servicesList.innerHTML = '<p class="text-muted text-center py-3">Você ainda não possui serviços contratados.</p>';
        return;
    }
    
    let servicesHTML = '';
    
    sampleClientServices.forEach(service => {
        // Format status text
        let statusText = '';
        let statusClass = '';
        
        switch(service.status) {
            case 'initial_contact':
                statusText = 'Contato Inicial';
                statusClass = 'text-warning';
                break;
            case 'proposal_sent':
                statusText = 'Proposta Enviada';
                statusClass = 'text-primary';
                break;
            case 'contract_signed':
                statusText = 'Contrato Assinado';
                statusClass = 'text-success';
                break;
            case 'in_progress':
                statusText = 'Em Andamento';
                statusClass = 'text-info';
                break;
            case 'completed':
                statusText = 'Concluído';
                statusClass = 'text-secondary';
                break;
            default:
                statusText = service.status;
                statusClass = 'text-dark';
        }
        
        // Format date
        const lastUpdate = new Date(service.lastUpdate);
        const formattedDate = lastUpdate.toLocaleDateString('pt-BR');
        
        servicesHTML += `
            <a href="javascript:void(0)" class="list-group-item list-group-item-action service-item" data-service-id="${service.id}">
                <div class="d-flex justify-content-between align-items-center">
                    <h6 class="mb-1">${service.title}</h6>
                    <small>${formattedDate}</small>
                </div>
                <small class="service-status ${statusClass}">${statusText}</small>
            </a>
        `;
    });
    
    servicesList.innerHTML = servicesHTML;
    
    // Add event listeners to service items
    document.querySelectorAll('.service-item').forEach(item => {
        item.addEventListener('click', function() {
            const serviceId = this.getAttribute('data-service-id');
            loadServiceDetails(serviceId);
            
            // Remove active class from all items and add to clicked one
            document.querySelectorAll('.service-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Load available initiatives
function loadAvailableInitiatives() {
    const initiativesContainer = document.getElementById('available-initiatives');
    
    if (sampleInitiatives.length === 0) {
        initiativesContainer.innerHTML = '<p class="text-muted text-center py-3">Nenhuma iniciativa disponível no momento.</p>';
        return;
    }
    
    let initiativesHTML = '';
    
    sampleInitiatives.forEach(initiative => {
        initiativesHTML += `
            <div class="col-md-6 mb-4">
                <div class="card initiative-card" data-initiative-id="${initiative.id}">
                    <div class="card-body">
                        <h5 class="card-title">${initiative.title}</h5>
                        <span class="badge badge-info mb-2">${initiative.category}</span>
                        <p class="card-text">${initiative.description}</p>
                        <div class="text-right">
                            <a href="javascript:void(0)" class="btn btn-sm btn-outline-primary view-initiative-btn" data-initiative-id="${initiative.id}">Ver detalhes</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    initiativesContainer.innerHTML = initiativesHTML;
    
    // Add event listeners to initiative cards
    document.querySelectorAll('.view-initiative-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const initiativeId = this.getAttribute('data-initiative-id');
            showInitiativeDetails(initiativeId);
        });
    });
}

// Load podcast episodes
function loadPodcastEpisodes() {
    const podcastList = document.getElementById('podcast-list');
    
    if (samplePodcastEpisodes.length === 0) {
        podcastList.innerHTML = '<p class="text-muted text-center py-3">Nenhum episódio de podcast disponível.</p>';
        return;
    }
    
    let podcastHTML = '';
    
    samplePodcastEpisodes.forEach(episode => {
        // Format date
        const episodeDate = new Date(episode.date);
        const formattedDate = episodeDate.toLocaleDateString('pt-BR');
        
        podcastHTML += `
            <a href="javascript:void(0)" class="list-group-item list-group-item-action podcast-item" data-episode-id="${episode.id}">
                <div class="d-flex justify-content-between align-items-center">
                    <h6 class="mb-1">${episode.title}</h6>
                </div>
                <p class="mb-1 text-truncate">${episode.description}</p>
                <small class="podcast-date">${formattedDate}</small>
            </a>
        `;
    });
    
    podcastList.innerHTML = podcastHTML;
    
    // Add event listeners to podcast items
    document.querySelectorAll('.podcast-item').forEach(item => {
        item.addEventListener('click', function() {
            const episodeId = this.getAttribute('data-episode-id');
            showPodcastEpisodeDetails(episodeId);
        });
    });
}

// Show initiative details in modal
function showInitiativeDetails(initiativeId) {
    const initiative = sampleInitiatives.find(init => init.id == initiativeId);
    
    if (!initiative) {
        console.error('Initiative not found:', initiativeId);
        return;
    }
    
    const detailContent = document.getElementById('initiative-detail-content');
    
    // Create benefits list HTML
    let benefitsHTML = '';
    if (initiative.benefits && initiative.benefits.length > 0) {
        benefitsHTML = '<ul>';
        initiative.benefits.forEach(benefit => {
            benefitsHTML += `<li>${benefit}</li>`;
        });
        benefitsHTML += '</ul>';
    }
    
    // Generate HTML content
    detailContent.innerHTML = `
        <h4>${initiative.title}</h4>
        <span class="badge badge-info mb-3">${initiative.category}</span>
        <div class="mb-4">
            <h6>Descrição</h6>
            <p>${initiative.details}</p>
        </div>
        <div class="mb-4">
            <h6>Benefícios</h6>
            ${benefitsHTML}
        </div>
        <div class="mb-4">
            <h6>Formato</h6>
            <p>${initiative.format}</p>
        </div>
        <div class="mb-4">
            <h6>Investimento</h6>
            <p class="service-price">${initiative.price}</p>
            <p>${initiative.installments > 1 ? `Parcelamento em até ${initiative.installments}x` : 'Pagamento à vista'}</p>
        </div>
    `;
    
    // Set the initiative ID on the request button
    document.getElementById('request-service-btn').setAttribute('data-initiative-id', initiativeId);
    
    // Show the modal
    $('#initiativeDetailModal').modal('show');
}

// Show podcast episode details in modal
function showPodcastEpisodeDetails(episodeId) {
    const episode = samplePodcastEpisodes.find(ep => ep.id == episodeId);
    
    if (!episode) {
        console.error('Episode not found:', episodeId);
        return;
    }
    
    const episodeContent = document.getElementById('podcast-episode-content');
    
    // Format date
    const episodeDate = new Date(episode.date);
    const formattedDate = episodeDate.toLocaleDateString('pt-BR');
    
    // Generate HTML content
    episodeContent.innerHTML = `
        <h4>${episode.title}</h4>
        <p><small class="text-muted">Publicado em ${formattedDate}</small></p>
        <hr>
        <h6>Resumo</h6>
        <p>${episode.summary}</p>
    `;
    
    // Set the YouTube link on the watch button
    document.getElementById('watch-youtube-btn').href = episode.youtubeLink;
    
    // Set the modal title
    document.getElementById('podcastEpisodeModalLabel').textContent = episode.title;
    
    // Show the modal
    $('#podcastEpisodeModal').modal('show');
}

// Load service details
function loadServiceDetails(serviceId) {
    const service = sampleClientServices.find(svc => svc.id == serviceId);
    
    if (!service) {
        console.error('Service not found:', serviceId);
        return;
    }
    
    // Show the service details card
    document.getElementById('service-details-card').style.display = 'block';
    
    const detailsContainer = document.getElementById('service-details');
    
    // Format status text
    let statusText = '';
    let statusClass = '';
    
    switch(service.status) {
        case 'initial_contact':
            statusText = 'Contato Inicial';
            statusClass = 'badge-warning';
            break;
        case 'proposal_sent':
            statusText = 'Proposta Enviada';
            statusClass = 'badge-primary';
            break;
        case 'contract_signed':
            statusText = 'Contrato Assinado';
            statusClass = 'badge-success';
            break;
        case 'in_progress':
            statusText = 'Em Andamento';
            statusClass = 'badge-info';
            break;
        case 'completed':
            statusText = 'Concluído';
            statusClass = 'badge-secondary';
            break;
        default:
            statusText = service.status;
            statusClass = 'badge-dark';
    }
    
    // Create meetings HTML
    let meetingsHTML = '';
    if (service.meetings && service.meetings.length > 0) {
        meetingsHTML = '<div class="mb-4"><h6>Reuniões Agendadas</h6><ul class="list-group">';
        service.meetings.forEach(meeting => {
            // Format date
            const meetingDate = new Date(meeting.date);
            const formattedMeetingDate = meetingDate.toLocaleDateString('pt-BR');
            
            meetingsHTML += `
                <li class="list-group-item">
                    <div class="d-flex justify-content-between align-items-center">
                        <span>${meeting.topic}</span>
                        <span class="badge badge-primary">${formattedMeetingDate}</span>
                    </div>
                </li>
            `;
        });
        meetingsHTML += '</ul></div>';
    }
    
    // Create scope HTML
    let scopeHTML = '';
    if (service.scope && service.scope.length > 0) {
        scopeHTML = '<div class="mb-4"><h6>Escopo do Serviço</h6>';
        service.scope.forEach(item => {
            scopeHTML += `
                <div class="scope-item">
                    <div class="scope-item-title">${item.title}</div>
                    <p class="mb-0">${item.description}</p>
                </div>
            `;
        });
        scopeHTML += '</div>';
    }
    
    // Create timeline HTML
    let timelineHTML = '';
    if (service.timeline && service.timeline.length > 0) {
        timelineHTML = '<div class="mb-4"><h6>Linha do Tempo</h6><div class="timeline">';
        service.timeline.forEach(item => {
            // Format date
            const itemDate = new Date(item.date);
            const formattedItemDate = itemDate.toLocaleDateString('pt-BR');
            
            timelineHTML += `
                <div class="timeline-item">
                    <div class="timeline-icon">
                        <i class="fas fa-circle"></i>
                    </div>
                    <div class="timeline-content">
                        <div class="timeline-date">${formattedItemDate}</div>
                        <div class="timeline-title">${item.title}</div>
                        <p class="mb-0">${item.description}</p>
                    </div>
                </div>
            `;
        });
        timelineHTML += '</div></div>';
    }
    
    // Generate HTML content
    detailsContainer.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4>${service.title}</h4>
            <span class="badge ${statusClass}">${statusText}</span>
        </div>
        
        ${timelineHTML}
        ${scopeHTML}
        ${meetingsHTML}
        
        <div class="mb-4">
            <h6>Investimento</h6>
            <p class="service-price">${service.price}</p>
            <p>${service.installments > 1 ? `Parcelamento em até ${service.installments}x` : 'Pagamento à vista'}</p>
        </div>
    `;
    
    // Show scope approval section if status is 'proposal_sent'
    if (service.status === 'proposal_sent') {
        document.getElementById('scope-approval').style.display = 'block';
    } else {
        document.getElementById('scope-approval').style.display = 'none';
    }
    
    // Show payment card if status is appropriate
    if (service.status === 'proposal_sent' || service.status === 'contract_signed') {
        document.getElementById('payment-card').style.display = 'block';
    } else {
        document.getElementById('payment-card').style.display = 'none';
    }
    
    // Load chat history
    loadChatHistory(service.chatHistory);
    
    // Load documents
    loadDocuments(service.documents);
}

// Load chat history
function loadChatHistory(chatHistory) {
    const chatHistoryContainer = document.getElementById('chat-history');
    
    if (!chatHistory || chatHistory.length === 0) {
        chatHistoryContainer.innerHTML = '<p class="text-muted text-center">Nenhuma interação registrada.</p>';
        return;
    }
    
    let chatHTML = '';
    
    chatHistory.forEach(message => {
        // Format timestamp
        const messageTime = new Date(message.timestamp);
        const formattedTime = messageTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const formattedDate = messageTime.toLocaleDateString('pt-BR');
        
        const messageClass = message.sender === 'client' ? 'message-user' : 'message-other';
        const senderName = message.sender === 'client' ? 'Você' : 'Ana Rosa';
        
        chatHTML += `
            <div class="message ${messageClass}">
                <div class="message-content">
                    <strong>${senderName}:</strong> ${message.message}
                </div>
                <div class="message-timestamp">${formattedDate} às ${formattedTime}</div>
            </div>
        `;
    });
    
    // Add a button to open chat modal
    chatHTML += `
        <div class="text-center mt-4">
            <button class="btn btn-outline-primary btn-sm" onclick="openChatModal()">
                <i class="fas fa-comment"></i> Continuar conversa
            </button>
        </div>
    `;
    
    chatHistoryContainer.innerHTML = chatHTML;
}

// Load documents
function loadDocuments(documents) {
    const documentsContainer = document.getElementById('client-documents');
    
    if (!documents || documents.length === 0) {
        documentsContainer.innerHTML = '<p class="text-muted text-center">Nenhum documento disponível.</p>';
        return;
    }
    
    let documentsHTML = '';
    
    documents.forEach(document => {
        // Choose icon based on document type
        let icon = 'file-alt';
        let typeName = 'Documento';
        
        switch(document.type) {
            case 'proposal':
                icon = 'file-contract';
                typeName = 'Proposta';
                break;
            case 'contract':
                icon = 'file-signature';
                typeName = 'Contrato';
                break;
            case 'receipt':
                icon = 'file-invoice';
                typeName = 'Recibo';
                break;
            case 'content':
                icon = 'file-pdf';
                typeName = 'Conteúdo';
                break;
        }
        
        documentsHTML += `
            <a href="javascript:void(0)" class="list-group-item list-group-item-action document-item">
                <div class="document-icon">
                    <i class="fas fa-${icon}"></i>
                </div>
                <div>
                    <div>${document.name}</div>
                    <small class="document-type">${typeName}</small>
                </div>
            </a>
        `;
    });
    
    documentsContainer.innerHTML = documentsHTML;
}

// Request a service
function requestService() {
    const initiativeId = document.getElementById('request-service-btn').getAttribute('data-initiative-id');
    const initiative = sampleInitiatives.find(init => init.id == initiativeId);
    
    if (!initiative) {
        console.error('Initiative not found:', initiativeId);
        return;
    }
    
    // Close initiative modal
    $('#initiativeDetailModal').modal('hide');
    
    // Show success alert
    showAlert('success', `Solicitação de serviço "${initiative.title}" enviada com sucesso! Ana Rosa entrará em contato em breve.`);
    
    // Optional: Add the service to client services and reload
    // In a real application, this would be done through an API call
    // For demo purposes, we'll just show the alert
}

// Approve scope
function approveScope() {
    showAlert('success', 'Escopo aprovado com sucesso! O contrato será enviado em breve.');
    document.getElementById('scope-approval').style.display = 'none';
}

// Request scope changes
function requestScopeChanges() {
    // Open chat modal to discuss changes
    openChatModal();
    
    // Add a pre-filled message
    document.getElementById('chat-input').value = 'Gostaria de sugerir algumas alterações no escopo do serviço...';
}

// Open chat modal
function openChatModal() {
    // Load chat messages to modal
    const serviceId = document.querySelector('.service-item.active').getAttribute('data-service-id');
    const service = sampleClientServices.find(svc => svc.id == serviceId);
    
    if (!service || !service.chatHistory) {
        return;
    }
    
    const chatMessages = document.getElementById('chat-messages');
    let messagesHTML = '';
    
    service.chatHistory.forEach(message => {
        // Format timestamp
        const messageTime = new Date(message.timestamp);
        const formattedTime = messageTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        const messageClass = message.sender === 'client' ? 'message-user' : 'message-other';
        const senderName = message.sender === 'client' ? 'Você' : 'Ana Rosa';
        
        messagesHTML += `
            <div class="message ${messageClass}">
                <div class="message-content">
                    <strong>${senderName}:</strong> ${message.message}
                </div>
                <div class="message-timestamp">${formattedTime}</div>
            </div>
        `;
    });
    
    chatMessages.innerHTML = messagesHTML;
    
    // Show the modal
    $('#chatModal').modal('show');
    
    // Focus the input field
    document.getElementById('chat-input').focus();
}

// Send chat message
function sendChatMessage() {
    const messageInput = document.getElementById('chat-input');
    const message = messageInput.value.trim();
    
    if (!message) {
        return;
    }
    
    // Clear input
    messageInput.value = '';
    
    // Add message to chat window
    const chatMessages = document.getElementById('chat-messages');
    const now = new Date();
    const formattedTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    const messageHTML = `
        <div class="message message-user">
            <div class="message-content">
                <strong>Você:</strong> ${message}
            </div>
            <div class="message-timestamp">${formattedTime}</div>
        </div>
    `;
    
    chatMessages.innerHTML += messageHTML;
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Simulate a response (in a real app, this would be handled by a server)
    setTimeout(() => {
        const responseHTML = `
            <div class="message message-other">
                <div class="message-content">
                    <strong>Ana Rosa:</strong> Obrigada pela sua mensagem! Responderei assim que possível.
                </div>
                <div class="message-timestamp">${formattedTime}</div>
            </div>
        `;
        
        chatMessages.innerHTML += responseHTML;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
}

// Copy PIX key
function copyPixKey() {
    // In a real application, this would copy the actual PIX key to clipboard
    // For demo purposes, we'll just show an alert
    showAlert('success', 'Chave PIX copiada para a área de transferência!');
}

// Process credit card payment
function processCreditCardPayment(event) {
    event.preventDefault();
    
    // In a real application, this would submit the payment to a payment processor
    // For demo purposes, we'll just show an alert
    showAlert('success', 'Pagamento processado com sucesso! Você receberá um email com a confirmação.');
    
    // Hide the payment card
    document.getElementById('payment-card').style.display = 'none';
}

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