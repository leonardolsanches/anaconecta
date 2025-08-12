from models import Mentorship, mentorships, MentorshipStatus, clients
from datetime import datetime

def get_all_mentorships(client_id=None, status_filter=None):
    """
    Get all mentorships, optionally filtered by client and status
    """
    result = []
    for mentorship in mentorships.values():
        client_match = client_id is None or mentorship.client_id == client_id
        status_match = status_filter is None or mentorship.status == status_filter
        
        if client_match and status_match:
            mentorship_dict = mentorship.to_dict()
            
            # Add client name to mentorship for display purposes
            client = clients.get(mentorship.client_id)
            if client:
                mentorship_dict["client_name"] = client.name
            else:
                mentorship_dict["client_name"] = "Unknown Client"
                
            result.append(mentorship_dict)
    
    # Sort by created date (newest first)
    result.sort(key=lambda x: x["created_at"], reverse=True)
    return result

def get_mentorship_by_id(mentorship_id):
    """
    Get a mentorship by ID
    """
    mentorship = mentorships.get(mentorship_id)
    if mentorship:
        mentorship_dict = mentorship.to_dict()
        
        # Add client name to mentorship for display purposes
        client = clients.get(mentorship.client_id)
        if client:
            mentorship_dict["client_name"] = client.name
        else:
            mentorship_dict["client_name"] = "Unknown Client"
            
        return mentorship_dict
    return None

def create_mentorship(client_id, title, description, status=MentorshipStatus.INITIAL_CONTACT):
    """
    Create a new mentorship
    """
    if not client_id or not title or not description:
        raise ValueError("Client ID, title, and description are required")
    
    try:
        client_id = int(client_id)
    except (ValueError, TypeError):
        raise ValueError("Client ID must be a valid integer")
    
    # Check if client exists
    if client_id not in clients:
        raise ValueError("Client does not exist")
    
    mentorship = Mentorship(client_id, title, description, status)
    mentorships[mentorship.id] = mentorship
    
    # Update client status to active if they were a prospect
    client = clients.get(client_id)
    if client and client.status == "prospect":
        client.status = "active"
        client.updated_at = datetime.now()
    
    return mentorship.to_dict()

def update_mentorship(mentorship_id, client_id=None, title=None, description=None, status=None, meetings=None, documents=None):
    """
    Update an existing mentorship
    """
    mentorship = mentorships.get(mentorship_id)
    if not mentorship:
        return None
    
    if client_id is not None:
        try:
            client_id = int(client_id)
            if client_id not in clients:
                raise ValueError("Client does not exist")
            mentorship.client_id = client_id
        except (ValueError, TypeError):
            pass
    
    if title is not None:
        mentorship.title = title
    
    if description is not None:
        mentorship.description = description
    
    if status is not None:
        mentorship.status = status
        
        # Update client status if mentorship is completed
        if status == MentorshipStatus.COMPLETED:
            client = clients.get(mentorship.client_id)
            if client:
                client.status = "completed" 
                client.updated_at = datetime.now()
    
    if meetings is not None:
        mentorship.meetings = meetings
    
    if documents is not None:
        mentorship.documents = documents
    
    mentorship.updated_at = datetime.now()
    
    mentorship_dict = mentorship.to_dict()
    
    # Add client name to mentorship for display purposes
    client = clients.get(mentorship.client_id)
    if client:
        mentorship_dict["client_name"] = client.name
    else:
        mentorship_dict["client_name"] = "Unknown Client"
        
    return mentorship_dict

def delete_mentorship(mentorship_id):
    """
    Delete a mentorship by ID
    """
    if mentorship_id in mentorships:
        del mentorships[mentorship_id]
        return True
    return False
