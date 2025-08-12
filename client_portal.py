from datetime import datetime
from enum import Enum

# Client Services statuses
class ServiceStatus(str, Enum):
    INITIAL_CONTACT = "initial_contact"
    PROPOSAL_SENT = "proposal_sent"
    CONTRACT_SIGNED = "contract_signed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

# Chat message model
class ChatMessage:
    def __init__(self, sender, message, timestamp=None):
        self.sender = sender  # 'client' or 'mentor'
        self.message = message
        self.timestamp = timestamp or datetime.now()
        
    def to_dict(self):
        return {
            "sender": self.sender,
            "message": self.message,
            "timestamp": self.timestamp.isoformat()
        }

# Document model
class Document:
    def __init__(self, type, name, file_path=None):
        self.type = type  # 'proposal', 'contract', 'receipt', 'content'
        self.name = name
        self.file_path = file_path
        self.created_at = datetime.now()
        
    def to_dict(self):
        return {
            "type": self.type,
            "name": self.name,
            "file_path": self.file_path,
            "created_at": self.created_at.isoformat()
        }

# Timeline event model
class TimelineEvent:
    def __init__(self, title, description, date=None):
        self.title = title
        self.description = description
        self.date = date or datetime.now()
        
    def to_dict(self):
        return {
            "title": self.title,
            "description": self.description,
            "date": self.date.isoformat()
        }

# Meeting model
class Meeting:
    def __init__(self, date, topic, notes=None):
        self.date = date
        self.topic = topic
        self.notes = notes
        
    def to_dict(self):
        return {
            "date": self.date,
            "topic": self.topic,
            "notes": self.notes
        }

# Scope item model
class ScopeItem:
    def __init__(self, title, description):
        self.title = title
        self.description = description
        
    def to_dict(self):
        return {
            "title": self.title,
            "description": self.description
        }

# Client Service model (represents a service contracted by a client)
class ClientService:
    def __init__(self, title, client_id, status=ServiceStatus.INITIAL_CONTACT, description=""):
        global next_service_id
        self.id = next_service_id
        next_service_id += 1
        self.title = title
        self.client_id = client_id
        self.description = description
        self.status = status
        self.meetings = []
        self.documents = []
        self.chat_history = []
        self.scope = []
        self.timeline = []
        self.price = ""
        self.installments = 1
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
        
    def add_meeting(self, date, topic, notes=None):
        meeting = Meeting(date, topic, notes)
        self.meetings.append(meeting)
        self.updated_at = datetime.now()
        return meeting
        
    def add_document(self, type, name, file_path=None):
        document = Document(type, name, file_path)
        self.documents.append(document)
        self.updated_at = datetime.now()
        return document
        
    def add_chat_message(self, sender, message):
        chat_message = ChatMessage(sender, message)
        self.chat_history.append(chat_message)
        self.updated_at = datetime.now()
        return chat_message
        
    def add_scope_item(self, title, description):
        scope_item = ScopeItem(title, description)
        self.scope.append(scope_item)
        self.updated_at = datetime.now()
        return scope_item
        
    def add_timeline_event(self, title, description, date=None):
        event = TimelineEvent(title, description, date)
        self.timeline.append(event)
        self.updated_at = datetime.now()
        return event
        
    def set_price(self, price, installments=1):
        self.price = price
        self.installments = installments
        self.updated_at = datetime.now()
        
    def update_status(self, status):
        self.status = status
        self.updated_at = datetime.now()
        
        # Add timeline event for status change
        status_descriptions = {
            ServiceStatus.INITIAL_CONTACT: "Contato inicial realizado",
            ServiceStatus.PROPOSAL_SENT: "Proposta enviada ao cliente",
            ServiceStatus.CONTRACT_SIGNED: "Contrato assinado",
            ServiceStatus.IN_PROGRESS: "Serviço em andamento",
            ServiceStatus.COMPLETED: "Serviço concluído"
        }
        
        description = status_descriptions.get(status, f"Status atualizado para {status}")
        self.add_timeline_event(f"Status: {status}", description)
        
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "client_id": self.client_id,
            "description": self.description,
            "status": self.status,
            "meetings": [meeting.to_dict() for meeting in self.meetings],
            "documents": [document.to_dict() for document in self.documents],
            "chat_history": [message.to_dict() for message in self.chat_history],
            "scope": [item.to_dict() for item in self.scope],
            "timeline": [event.to_dict() for event in self.timeline],
            "price": self.price,
            "installments": self.installments,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }

# Podcast Episode model
class PodcastEpisode:
    def __init__(self, title, description, date, youtube_link, summary=""):
        global next_episode_id
        self.id = next_episode_id
        next_episode_id += 1
        self.title = title
        self.description = description
        self.date = date
        self.youtube_link = youtube_link
        self.summary = summary
        self.created_at = datetime.now()
        
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "date": self.date,
            "youtube_link": self.youtube_link,
            "summary": self.summary,
            "created_at": self.created_at.isoformat()
        }

# In-memory storage
client_services = {}
podcast_episodes = {}

# ID counters
next_service_id = 1
next_episode_id = 1

# Initialize sample data
def initialize_client_portal_data():
    # Add podcast episodes
    add_podcast_episode(
        "Minha jornada em RH - Com Patricia Rocha",
        "Patricia Rocha compartilha sua trajetória no mundo de Recursos Humanos e insights valiosos sobre o desenvolvimento deste campo ao longo dos anos.",
        "2025-04-15",
        "https://www.youtube.com/@anaconecta",
        "Neste episódio, Patricia Rocha, experiente profissional de RH, compartilha sua jornada de mais de 20 anos na área. Ela aborda temas como a evolução das práticas de RH, a importância do desenvolvimento humano nas organizações e como o papel de RH passou de administrativo para estratégico. Patricia também oferece conselhos valiosos para novos profissionais que desejam ingressar na área."
    )
    
    add_podcast_episode(
        "Uma Ponte para Você - Com Nivea Oliveira",
        "Uma conversa inspiradora sobre transições de carreira e a importância de construir pontes para novos caminhos profissionais.",
        "2025-03-28",
        "https://www.youtube.com/@anaconecta",
        "Nivea Oliveira, especialista em transição de carreira, compartilha sua metodologia 'Uma Ponte para Você', que ajuda profissionais a navegarem com sucesso por mudanças em suas trajetórias. Ela discute a importância do autoconhecimento, da identificação de competências transferíveis e do networking estratégico. O episódio traz exemplos reais de pessoas que reinventaram suas carreiras e estratégias práticas para quem está considerando uma mudança profissional."
    )
    
    add_podcast_episode(
        "Até onde as conexões podem nos levar? - Com Janine Alcure e Andréia Xavier",
        "Uma análise do poder das conexões genuínas e como elas podem transformar carreiras e negócios.",
        "2025-03-10",
        "https://www.youtube.com/@anaconecta",
        "Janine Alcure e Andréia Xavier, especialistas em networking estratégico, discutem como construir e manter conexões profissionais significativas. Elas abordam a diferença entre networking quantitativo e qualitativo, técnicas para estabelecer relações autênticas e como aproveitar as conexões de forma ética e mutuamente benéfica. O episódio também explora como as redes sociais transformaram o networking e estratégias para se destacar no ambiente digital."
    )
    
    # Add a client service example
    if len(client_services) == 0 and len(podcast_episodes) > 0:
        service = add_client_service(
            "Mentoria em Liderança",
            1,  # Client ID
            ServiceStatus.IN_PROGRESS,
            "Programa de mentoria focado em desenvolvimento de habilidades de liderança."
        )
        
        # Add scope items
        service.add_scope_item(
            "Avaliação de Perfil de Liderança", 
            "Diagnóstico do perfil de liderança atual e identificação de pontos fortes e áreas de desenvolvimento."
        )
        service.add_scope_item(
            "Desenvolvimento de Habilidades", 
            "Sessões focadas em comunicação, delegação, feedback, gerenciamento de conflitos e desenvolvimento de equipes."
        )
        service.add_scope_item(
            "Plano de Ação Individual", 
            "Elaboração de plano de desenvolvimento individual com metas e ações específicas."
        )
        
        # Add meetings
        service.add_meeting("2025-05-10", "Introdução e Definição de Objetivos")
        service.add_meeting("2025-05-17", "Estilos de Liderança e Autoconhecimento")
        
        # Add documents
        service.add_document("proposal", "Proposta_Mentoria_Lideranca.pdf")
        service.add_document("contract", "Contrato_Mentoria_Lideranca.pdf")
        
        # Add chat history
        service.add_chat_message("client", "Olá Ana, gostaria de mais informações sobre o programa de mentoria em liderança.")
        service.add_chat_message("mentor", "Olá! Claro, o programa de mentoria em liderança é personalizado para suas necessidades específicas. Podemos agendar uma conversa inicial para entender melhor seus objetivos?")
        service.add_chat_message("client", "Seria ótimo! Tenho disponibilidade na próxima semana.")
        service.add_chat_message("mentor", "Perfeito! Podemos marcar para segunda-feira às 14h?")
        service.add_chat_message("client", "Confirmado, estarei disponível nesse horário.")
        
        # Add timeline events
        service.add_timeline_event("Solicitação de Serviço", "Solicitação inicial de mentoria em liderança.", datetime.fromisoformat("2025-05-05T10:00:00"))
        service.add_timeline_event("Proposta Enviada", "Proposta personalizada enviada para aprovação.", datetime.fromisoformat("2025-05-07T15:30:00"))
        service.add_timeline_event("Contrato Assinado", "Contrato assinado e primeira sessão agendada.", datetime.fromisoformat("2025-05-09T11:45:00"))
        
        # Set price
        service.set_price("R$ 1.800,00", 3)

# Function to add a new podcast episode
def add_podcast_episode(title, description, date, youtube_link, summary=""):
    episode = PodcastEpisode(title, description, date, youtube_link, summary)
    podcast_episodes[episode.id] = episode
    return episode.to_dict()

# Function to get all podcast episodes
def get_all_podcast_episodes():
    episodes = [episode.to_dict() for episode in podcast_episodes.values()]
    # Sort by date (newest first)
    episodes.sort(key=lambda x: x["date"], reverse=True)
    return episodes

# Function to get a podcast episode by ID
def get_podcast_episode(episode_id):
    episode = podcast_episodes.get(episode_id)
    if episode:
        return episode.to_dict()
    return None

# Function to add a new client service
def add_client_service(title, client_id, status=ServiceStatus.INITIAL_CONTACT, description=""):
    service = ClientService(title, client_id, status, description)
    client_services[service.id] = service
    return service

# Function to get all client services
def get_all_client_services(client_id=None):
    if client_id:
        services = [service.to_dict() for service in client_services.values() if service.client_id == client_id]
    else:
        services = [service.to_dict() for service in client_services.values()]
    
    # Sort by updated_at (newest first)
    services.sort(key=lambda x: x["updated_at"], reverse=True)
    return services

# Function to get a client service by ID
def get_client_service(service_id):
    service = client_services.get(service_id)
    if service:
        return service.to_dict()
    return None

# Function to update a client service
def update_client_service(service_id, update_data):
    service = client_services.get(service_id)
    if not service:
        return None
    
    if 'title' in update_data:
        service.title = update_data['title']
    
    if 'description' in update_data:
        service.description = update_data['description']
    
    if 'status' in update_data:
        service.update_status(update_data['status'])
    
    if 'price' in update_data and 'installments' in update_data:
        service.set_price(update_data['price'], update_data['installments'])
    
    service.updated_at = datetime.now()
    return service.to_dict()

# Function to add a chat message to a service
def add_chat_message_to_service(service_id, sender, message):
    service = client_services.get(service_id)
    if not service:
        return None
    
    chat_message = service.add_chat_message(sender, message)
    return chat_message.to_dict()

# Function to add a document to a service
def add_document_to_service(service_id, type, name, file_path=None):
    service = client_services.get(service_id)
    if not service:
        return None
    
    document = service.add_document(type, name, file_path)
    return document.to_dict()

# Function to add a meeting to a service
def add_meeting_to_service(service_id, date, topic, notes=None):
    service = client_services.get(service_id)
    if not service:
        return None
    
    meeting = service.add_meeting(date, topic, notes)
    return meeting.to_dict()

# Function to add a scope item to a service
def add_scope_item_to_service(service_id, title, description):
    service = client_services.get(service_id)
    if not service:
        return None
    
    scope_item = service.add_scope_item(title, description)
    return scope_item.to_dict()

# Function to delete a client service
def delete_client_service(service_id):
    if service_id in client_services:
        del client_services[service_id]
        return True
    return False