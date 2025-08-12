from models import Initiative, initiatives, InitiativeStatus
from datetime import datetime

def get_all_initiatives(category_filter=None, status_filter=None):
    """
    Get all initiatives, optionally filtered by category and status
    """
    result = []
    for initiative in initiatives.values():
        category_match = category_filter is None or initiative.category == category_filter
        status_match = status_filter is None or initiative.status == status_filter
        
        if category_match and status_match:
            result.append(initiative.to_dict())
    
    # Sort by priority (highest first)
    result.sort(key=lambda x: x["priority"])
    return result

def get_initiative_by_id(initiative_id):
    """
    Get an initiative by ID
    """
    initiative = initiatives.get(initiative_id)
    if initiative:
        return initiative.to_dict()
    return None

def create_initiative(title, description, category, status=InitiativeStatus.PENDING, priority=3):
    """
    Create a new initiative
    """
    if not title or not description or not category:
        raise ValueError("Title, description, and category are required")
    
    try:
        priority = int(priority)
        if priority < 1 or priority > 5:
            raise ValueError("Priority must be between 1 and 5")
    except (ValueError, TypeError):
        priority = 3
    
    initiative = Initiative(title, description, category, status, priority)
    initiatives[initiative.id] = initiative
    return initiative.to_dict()

def update_initiative(initiative_id, title=None, description=None, category=None, status=None, priority=None):
    """
    Update an existing initiative
    """
    initiative = initiatives.get(initiative_id)
    if not initiative:
        return None
    
    if title is not None:
        initiative.title = title
    
    if description is not None:
        initiative.description = description
    
    if category is not None:
        initiative.category = category
    
    if status is not None:
        initiative.status = status
    
    if priority is not None:
        try:
            priority = int(priority)
            if 1 <= priority <= 5:
                initiative.priority = priority
        except (ValueError, TypeError):
            pass
    
    initiative.updated_at = datetime.now()
    return initiative.to_dict()

def delete_initiative(initiative_id):
    """
    Delete an initiative by ID
    """
    if initiative_id in initiatives:
        del initiatives[initiative_id]
        return True
    return False
