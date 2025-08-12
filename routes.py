from flask import render_template, request, jsonify, redirect, url_for, flash
from app import app
import json
import logging
from datetime import datetime

from models import Client, Initiative, Mentorship
from models import ClientStatus, InitiativeStatus, MentorshipStatus
from models import clients, initiatives, mentorships, initiative_categories

from services.client_service import (
    get_all_clients, get_client_by_id, create_client, 
    update_client, delete_client
)
from services.initiative_service import (
    get_all_initiatives, get_initiative_by_id, create_initiative,
    update_initiative, delete_initiative
)
from services.mentorship_service import (
    get_all_mentorships, get_mentorship_by_id, create_mentorship,
    update_mentorship, delete_mentorship
)

# Import client portal module
import client_portal
from client_portal import ServiceStatus

# Main routes
@app.route('/')
def index():
    """Página inicial pública focada no cliente"""
    return render_template('public_home.html')
    
@app.route('/admin')
def admin_dashboard():
    """Dashboard administrativo - Acesso exclusivo para Ana Rosa"""
    # Calcular estatísticas do dashboard
    clients = get_all_clients()
    mentorships = get_all_mentorships()
    initiatives = get_all_initiatives()
    
    stats = {
        'total_clients': len(clients),
        'prospect_clients': len([c for c in clients if c.status == 'prospect']),
        'active_clients': len([c for c in clients if c.status == 'active']),
        'total_mentorships': len(mentorships),
        'active_mentorships': len([m for m in mentorships if m.status == 'in_progress']),
        'total_initiatives': len(initiatives),
        'pending_initiatives': len([i for i in initiatives if i.status == 'pending'])
    }
    
    return render_template('admin_dashboard.html', stats=stats)
    
# Client Portal routes
@app.route('/services')
def services():
    """Página de serviços oferecidos - para captação de clientes"""
    return render_template('services.html')
    
@app.route('/contact')
def contact():
    """Página de contato - para prospecção de clientes"""
    return render_template('contact.html')

@app.route('/portal')
def client_portal():
    """Portal do cliente - para gerenciamento de serviços contratados"""
    # Inicializa dados do portal do cliente se necessário
    try:
        if hasattr(client_portal, 'initialize_client_portal_data'):
            client_portal.initialize_client_portal_data()
        return render_template('client_portal.html')
    except Exception as e:
        app.logger.error(f"Erro ao carregar portal do cliente: {str(e)}")
        return render_template('error.html', error=str(e))

@app.route('/youtube-prospects')
def youtube_prospects():
    """Página para gerar prospects a partir de visualizações do YouTube"""
    return render_template('youtube_prospects.html')

@app.route('/institutional')
def institutional():
    """Página institucional com conteúdos e mídia"""
    return render_template('institutional.html')

@app.route('/api/client-portal/services', methods=['GET'])
def get_client_portal_services():
    try:
        client_id = request.args.get('client_id')
        if client_id:
            client_id = int(client_id)
        
        services = client_portal.get_all_client_services(client_id)
        return jsonify(services)
    except Exception as e:
        logging.error(f"Error getting client services: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/client-portal/services/<int:service_id>', methods=['GET'])
def get_client_portal_service(service_id):
    try:
        service = client_portal.get_client_service(service_id)
        if service:
            return jsonify(service)
        return jsonify({"error": "Service not found"}), 404
    except Exception as e:
        logging.error(f"Error getting service {service_id}: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/client-portal/services/<int:service_id>/chat', methods=['POST'])
def add_chat_message(service_id):
    try:
        data = request.json
        sender = data.get('sender')
        message = data.get('message')
        
        if not sender or not message:
            return jsonify({"error": "Sender and message are required"}), 400
            
        result = client_portal.add_chat_message_to_service(service_id, sender, message)
        if result:
            return jsonify(result)
        return jsonify({"error": "Service not found"}), 404
    except Exception as e:
        logging.error(f"Error adding chat message to service {service_id}: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/client-portal/podcasts', methods=['GET'])
def get_podcasts():
    try:
        podcasts = client_portal.get_all_podcast_episodes()
        return jsonify(podcasts)
    except Exception as e:
        logging.error(f"Error getting podcasts: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/client-portal/podcasts/<int:episode_id>', methods=['GET'])
def get_podcast(episode_id):
    try:
        episode = client_portal.get_podcast_episode(episode_id)
        if episode:
            return jsonify(episode)
        return jsonify({"error": "Podcast episode not found"}), 404
    except Exception as e:
        logging.error(f"Error getting podcast episode {episode_id}: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Client routes
@app.route('/clients')
def client_page():
    return render_template('clients.html')

@app.route('/api/clients', methods=['GET'])
def get_clients():
    try:
        status_filter = request.args.get('status')
        all_clients = get_all_clients(status_filter)
        return jsonify(all_clients)
    except Exception as e:
        logging.error(f"Error getting clients: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/clients/<int:client_id>', methods=['GET'])
def get_client(client_id):
    try:
        client = get_client_by_id(client_id)
        if client:
            return jsonify(client)
        return jsonify({"error": "Client not found"}), 404
    except Exception as e:
        logging.error(f"Error getting client {client_id}: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/clients', methods=['POST'])
def add_client():
    try:
        data = request.json
        result = create_client(
            data.get('name'), 
            data.get('email'), 
            data.get('phone'),
            data.get('status', ClientStatus.PROSPECT),
            data.get('notes', '')
        )
        return jsonify(result), 201
    except Exception as e:
        logging.error(f"Error creating client: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/clients/<int:client_id>', methods=['PUT'])
def update_client_route(client_id):
    try:
        data = request.json
        result = update_client(
            client_id,
            data.get('name'), 
            data.get('email'), 
            data.get('phone'),
            data.get('status'),
            data.get('notes')
        )
        if result:
            return jsonify(result)
        return jsonify({"error": "Client not found"}), 404
    except Exception as e:
        logging.error(f"Error updating client {client_id}: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/clients/<int:client_id>', methods=['DELETE'])
def delete_client_route(client_id):
    try:
        result = delete_client(client_id)
        if result:
            return jsonify({"success": True})
        return jsonify({"error": "Client not found"}), 404
    except Exception as e:
        logging.error(f"Error deleting client {client_id}: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Initiative routes
@app.route('/initiatives')
def initiative_page():
    return render_template('initiatives.html')

@app.route('/api/initiative-categories', methods=['GET'])
def get_initiative_categories():
    return jsonify(initiative_categories)

@app.route('/api/initiatives', methods=['GET'])
def get_initiatives():
    try:
        category_filter = request.args.get('category')
        status_filter = request.args.get('status')
        all_initiatives = get_all_initiatives(category_filter, status_filter)
        return jsonify(all_initiatives)
    except Exception as e:
        logging.error(f"Error getting initiatives: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/initiatives/<int:initiative_id>', methods=['GET'])
def get_initiative(initiative_id):
    try:
        initiative = get_initiative_by_id(initiative_id)
        if initiative:
            return jsonify(initiative)
        return jsonify({"error": "Initiative not found"}), 404
    except Exception as e:
        logging.error(f"Error getting initiative {initiative_id}: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/initiatives', methods=['POST'])
def add_initiative():
    try:
        data = request.json
        result = create_initiative(
            data.get('title'), 
            data.get('description'), 
            data.get('category'),
            data.get('status', InitiativeStatus.PENDING),
            data.get('priority', 3)
        )
        return jsonify(result), 201
    except Exception as e:
        logging.error(f"Error creating initiative: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/initiatives/<int:initiative_id>', methods=['PUT'])
def update_initiative_route(initiative_id):
    try:
        data = request.json
        result = update_initiative(
            initiative_id,
            data.get('title'), 
            data.get('description'), 
            data.get('category'),
            data.get('status'),
            data.get('priority')
        )
        if result:
            return jsonify(result)
        return jsonify({"error": "Initiative not found"}), 404
    except Exception as e:
        logging.error(f"Error updating initiative {initiative_id}: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/initiatives/<int:initiative_id>', methods=['DELETE'])
def delete_initiative_route(initiative_id):
    try:
        result = delete_initiative(initiative_id)
        if result:
            return jsonify({"success": True})
        return jsonify({"error": "Initiative not found"}), 404
    except Exception as e:
        logging.error(f"Error deleting initiative {initiative_id}: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Mentorship routes
@app.route('/mentorships')
def mentorship_page():
    return render_template('mentorships.html')

@app.route('/api/mentorships', methods=['GET'])
def get_mentorships():
    try:
        client_id = request.args.get('client_id')
        status_filter = request.args.get('status')
        if client_id:
            client_id = int(client_id)
        all_mentorships = get_all_mentorships(client_id, status_filter)
        return jsonify(all_mentorships)
    except Exception as e:
        logging.error(f"Error getting mentorships: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/mentorships/<int:mentorship_id>', methods=['GET'])
def get_mentorship(mentorship_id):
    try:
        mentorship = get_mentorship_by_id(mentorship_id)
        if mentorship:
            return jsonify(mentorship)
        return jsonify({"error": "Mentorship not found"}), 404
    except Exception as e:
        logging.error(f"Error getting mentorship {mentorship_id}: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/mentorships', methods=['POST'])
def add_mentorship():
    try:
        data = request.json
        result = create_mentorship(
            data.get('client_id'), 
            data.get('title'), 
            data.get('description'),
            data.get('status', MentorshipStatus.INITIAL_CONTACT)
        )
        return jsonify(result), 201
    except Exception as e:
        logging.error(f"Error creating mentorship: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/mentorships/<int:mentorship_id>', methods=['PUT'])
def update_mentorship_route(mentorship_id):
    try:
        data = request.json
        result = update_mentorship(
            mentorship_id,
            data.get('client_id'),
            data.get('title'), 
            data.get('description'),
            data.get('status'),
            data.get('meetings'),
            data.get('documents')
        )
        if result:
            return jsonify(result)
        return jsonify({"error": "Mentorship not found"}), 404
    except Exception as e:
        logging.error(f"Error updating mentorship {mentorship_id}: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/mentorships/<int:mentorship_id>', methods=['DELETE'])
def delete_mentorship_route(mentorship_id):
    try:
        result = delete_mentorship(mentorship_id)
        if result:
            return jsonify({"success": True})
        return jsonify({"error": "Mentorship not found"}), 404
    except Exception as e:
        logging.error(f"Error deleting mentorship {mentorship_id}: {str(e)}")
        return jsonify({"error": str(e)}), 500


# Export API Routes
@app.route('/api/export/clients', methods=['POST'])
def export_clients_api():
    """Export clients data in various formats"""
    try:
        from flask import make_response
        import csv
        import json
        from datetime import datetime
        import io
        
        data = request.get_json()
        format_type = data.get('format', 'csv')
        
        # Get clients data
        clients = get_all_clients()
        
        # Convert to exportable format
        export_data = []
        for client in clients:
            export_data.append({
                'Nome': client.name,
                'Email': client.email,
                'Telefone': client.phone,
                'Status': client.status.value,
                'Notas': client.notes,
                'Data_Criacao': datetime.now().strftime('%d/%m/%Y')
            })
        
        if format_type == 'csv':
            output = io.StringIO()
            writer = csv.DictWriter(output, fieldnames=export_data[0].keys())
            writer.writeheader()
            writer.writerows(export_data)
            
            response = make_response(output.getvalue())
            response.headers['Content-Type'] = 'text/csv; charset=utf-8'
            response.headers['Content-Disposition'] = f'attachment; filename=clientes_{datetime.now().strftime("%Y%m%d")}.csv'
            return response
        elif format_type == 'json':
            response = make_response(json.dumps(export_data, ensure_ascii=False, indent=2))
            response.headers['Content-Type'] = 'application/json; charset=utf-8'
            response.headers['Content-Disposition'] = f'attachment; filename=clientes_{datetime.now().strftime("%Y%m%d")}.json'
            return response
        else:
            return jsonify({'error': 'Formato não suportado'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500
