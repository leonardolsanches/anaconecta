from models import Client, clients, ClientStatus
from datetime import datetime

def get_all_clients(status_filter=None):
    """
    Get all clients, optionally filtered by status
    """
    result = []
    for client in clients.values():
        if status_filter is None or client.status == status_filter:
            result.append(client.to_dict())
    return result

def get_client_by_id(client_id):
    """
    Get a client by ID
    """
    client = clients.get(client_id)
    if client:
        return client.to_dict()
    return None

def create_client(name, email, phone, status=ClientStatus.PROSPECT, notes=""):
    """
    Create a new client
    """
    if not name or not email or not phone:
        raise ValueError("Name, email, and phone are required")
    
    client = Client(name, email, phone, status, notes)
    clients[client.id] = client
    return client.to_dict()

def update_client(client_id, name=None, email=None, phone=None, status=None, notes=None):
    """
    Update an existing client
    """
    client = clients.get(client_id)
    if not client:
        return None
    
    if name is not None:
        client.name = name
    
    if email is not None:
        client.email = email
    
    if phone is not None:
        client.phone = phone
    
    if status is not None:
        client.status = status
    
    if notes is not None:
        client.notes = notes
    
    client.updated_at = datetime.now()
    return client.to_dict()

def delete_client(client_id):
    """
    Delete a client by ID
    """
    if client_id in clients:
        del clients[client_id]
        return True
    return False
