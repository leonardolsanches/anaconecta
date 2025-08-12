from datetime import datetime
from enum import Enum

# In-memory database using dictionaries
clients = {}
initiatives = {}
mentorships = {}

# Categories for initiatives
initiative_categories = [
    "Mentoria Individual",
    "Mentoria em Grupo",
    "Podcast",
    "Palestras",
    "Conteúdo Digital",
    "Networking",
    "Outros"
]

# Next IDs for auto-increment
next_client_id = 1
next_initiative_id = 1
next_mentorship_id = 1

# Enums for status
class ClientStatus(str, Enum):
    PROSPECT = "prospect"
    ACTIVE = "active"
    COMPLETED = "completed"

class InitiativeStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class MentorshipStatus(str, Enum):
    INITIAL_CONTACT = "initial_contact"
    PROPOSAL_SENT = "proposal_sent"
    CONTRACT_SIGNED = "contract_signed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class Client:
    def __init__(self, name, email, phone, status=ClientStatus.PROSPECT, notes=""):
        global next_client_id
        self.id = next_client_id
        next_client_id += 1
        self.name = name
        self.email = email
        self.phone = phone
        self.status = status
        self.notes = notes
        self.created_at = datetime.now()
        self.updated_at = datetime.now()

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "status": self.status,
            "notes": self.notes,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }

class Initiative:
    def __init__(self, title, description, category, status=InitiativeStatus.PENDING, priority=3):
        global next_initiative_id
        self.id = next_initiative_id
        next_initiative_id += 1
        self.title = title
        self.description = description
        self.category = category
        self.status = status
        self.priority = priority  # 1-5, with 1 being highest
        self.created_at = datetime.now()
        self.updated_at = datetime.now()

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "category": self.category,
            "status": self.status,
            "priority": self.priority,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }

class Mentorship:
    def __init__(self, client_id, title, description, status=MentorshipStatus.INITIAL_CONTACT):
        global next_mentorship_id
        self.id = next_mentorship_id
        next_mentorship_id += 1
        self.client_id = client_id
        self.title = title
        self.description = description
        self.status = status
        self.meetings = []
        self.documents = []
        self.created_at = datetime.now()
        self.updated_at = datetime.now()

    def to_dict(self):
        return {
            "id": self.id,
            "client_id": self.client_id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "meetings": self.meetings,
            "documents": self.documents,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }

def initialize_db():
    """Initialize the in-memory database with sample data"""
    # Sample data will be initialized here if needed
