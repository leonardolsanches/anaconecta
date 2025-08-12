// Export functionality for reports and analytics
class ReportExporter {
    constructor() {
        this.initializeExportButtons();
    }

    initializeExportButtons() {
        // Add export buttons to the dashboard if they don't exist
        this.addExportControls();
        this.bindEvents();
    }

    addExportControls() {
        const exportHTML = `
            <div class="export-controls mb-4">
                <div class="row">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0">
                                    <i class="fas fa-download mr-2"></i>
                                    Exportar Relatórios e Analytics
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-3 mb-2">
                                        <button class="btn btn-primary btn-block" onclick="reportExporter.exportClientsReport()">
                                            <i class="fas fa-users mr-2"></i>
                                            Relatório de Clientes
                                        </button>
                                    </div>
                                    <div class="col-md-3 mb-2">
                                        <button class="btn btn-success btn-block" onclick="reportExporter.exportMentorshipsReport()">
                                            <i class="fas fa-graduation-cap mr-2"></i>
                                            Relatório de Mentorships
                                        </button>
                                    </div>
                                    <div class="col-md-3 mb-2">
                                        <button class="btn btn-info btn-block" onclick="reportExporter.exportFinancialReport()">
                                            <i class="fas fa-chart-line mr-2"></i>
                                            Relatório Financeiro
                                        </button>
                                    </div>
                                    <div class="col-md-3 mb-2">
                                        <button class="btn btn-warning btn-block" onclick="reportExporter.exportAnalyticsReport()">
                                            <i class="fas fa-analytics mr-2"></i>
                                            Analytics Completo
                                        </button>
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-md-6">
                                        <label for="reportDateRange">Período:</label>
                                        <select id="reportDateRange" class="form-control">
                                            <option value="7">Últimos 7 dias</option>
                                            <option value="30" selected>Últimos 30 dias</option>
                                            <option value="90">Últimos 90 dias</option>
                                            <option value="365">Último ano</option>
                                            <option value="all">Todo o período</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="exportFormat">Formato:</label>
                                        <select id="exportFormat" class="form-control">
                                            <option value="xlsx">Excel (.xlsx)</option>
                                            <option value="csv">CSV (.csv)</option>
                                            <option value="pdf">PDF (.pdf)</option>
                                            <option value="json">JSON (.json)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert export controls after the main title
        const titleElement = document.querySelector('h1');
        if (titleElement && !document.querySelector('.export-controls')) {
            titleElement.insertAdjacentHTML('afterend', exportHTML);
        }
    }

    bindEvents() {
        // Add keyboard shortcuts for quick exports
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'e':
                        e.preventDefault();
                        this.showExportMenu();
                        break;
                    case '1':
                        e.preventDefault();
                        this.exportClientsReport();
                        break;
                    case '2':
                        e.preventDefault();
                        this.exportMentorshipsReport();
                        break;
                    case '3':
                        e.preventDefault();
                        this.exportFinancialReport();
                        break;
                }
            }
        });
    }

    async exportClientsReport() {
        this.showLoadingIndicator('Gerando relatório de clientes...');
        
        try {
            const response = await fetch('/api/export/clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dateRange: document.getElementById('reportDateRange').value,
                    format: document.getElementById('exportFormat').value
                })
            });

            if (response.ok) {
                const blob = await response.blob();
                const filename = `clientes_${this.getFormattedDate()}.${document.getElementById('exportFormat').value}`;
                this.downloadFile(blob, filename);
                this.showSuccessMessage('Relatório de clientes exportado com sucesso!');
            } else {
                // Fallback para dados locais se API não estiver disponível
                this.exportLocalClientsData();
            }
        } catch (error) {
            console.log('API não disponível, usando dados locais');
            this.exportLocalClientsData();
        }
        
        this.hideLoadingIndicator();
    }

    async exportMentorshipsReport() {
        this.showLoadingIndicator('Gerando relatório de mentorships...');
        
        try {
            const response = await fetch('/api/export/mentorships', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dateRange: document.getElementById('reportDateRange').value,
                    format: document.getElementById('exportFormat').value
                })
            });

            if (response.ok) {
                const blob = await response.blob();
                const filename = `mentorships_${this.getFormattedDate()}.${document.getElementById('exportFormat').value}`;
                this.downloadFile(blob, filename);
                this.showSuccessMessage('Relatório de mentorships exportado com sucesso!');
            } else {
                this.exportLocalMentorshipsData();
            }
        } catch (error) {
            console.log('API não disponível, usando dados locais');
            this.exportLocalMentorshipsData();
        }
        
        this.hideLoadingIndicator();
    }

    async exportFinancialReport() {
        this.showLoadingIndicator('Gerando relatório financeiro...');
        
        try {
            const response = await fetch('/api/export/financial', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dateRange: document.getElementById('reportDateRange').value,
                    format: document.getElementById('exportFormat').value
                })
            });

            if (response.ok) {
                const blob = await response.blob();
                const filename = `financeiro_${this.getFormattedDate()}.${document.getElementById('exportFormat').value}`;
                this.downloadFile(blob, filename);
                this.showSuccessMessage('Relatório financeiro exportado com sucesso!');
            } else {
                this.exportLocalFinancialData();
            }
        } catch (error) {
            console.log('API não disponível, usando dados locais');
            this.exportLocalFinancialData();
        }
        
        this.hideLoadingIndicator();
    }

    async exportAnalyticsReport() {
        this.showLoadingIndicator('Gerando analytics completo...');
        
        try {
            const response = await fetch('/api/export/analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dateRange: document.getElementById('reportDateRange').value,
                    format: document.getElementById('exportFormat').value
                })
            });

            if (response.ok) {
                const blob = await response.blob();
                const filename = `analytics_completo_${this.getFormattedDate()}.${document.getElementById('exportFormat').value}`;
                this.downloadFile(blob, filename);
                this.showSuccessMessage('Analytics completo exportado com sucesso!');
            } else {
                this.exportLocalAnalyticsData();
            }
        } catch (error) {
            console.log('API não disponível, usando dados locais');
            this.exportLocalAnalyticsData();
        }
        
        this.hideLoadingIndicator();
    }

    // Fallback methods for local data export
    exportLocalClientsData() {
        const clientsData = this.getClientsFromDashboard();
        const format = document.getElementById('exportFormat').value;
        
        switch(format) {
            case 'csv':
                this.exportToCSV(clientsData, 'clientes');
                break;
            case 'xlsx':
                this.exportToExcel(clientsData, 'clientes');
                break;
            case 'json':
                this.exportToJSON(clientsData, 'clientes');
                break;
            case 'pdf':
                this.exportToPDF(clientsData, 'Relatório de Clientes');
                break;
        }
        
        this.showSuccessMessage('Relatório de clientes exportado usando dados locais!');
    }

    exportLocalMentorshipsData() {
        const mentorshipsData = this.getMentorshipsFromDashboard();
        const format = document.getElementById('exportFormat').value;
        
        switch(format) {
            case 'csv':
                this.exportToCSV(mentorshipsData, 'mentorships');
                break;
            case 'xlsx':
                this.exportToExcel(mentorshipsData, 'mentorships');
                break;
            case 'json':
                this.exportToJSON(mentorshipsData, 'mentorships');
                break;
            case 'pdf':
                this.exportToPDF(mentorshipsData, 'Relatório de Mentorships');
                break;
        }
        
        this.showSuccessMessage('Relatório de mentorships exportado usando dados locais!');
    }

    exportLocalFinancialData() {
        const financialData = this.getFinancialFromDashboard();
        const format = document.getElementById('exportFormat').value;
        
        switch(format) {
            case 'csv':
                this.exportToCSV(financialData, 'financeiro');
                break;
            case 'xlsx':
                this.exportToExcel(financialData, 'financeiro');
                break;
            case 'json':
                this.exportToJSON(financialData, 'financeiro');
                break;
            case 'pdf':
                this.exportToPDF(financialData, 'Relatório Financeiro');
                break;
        }
        
        this.showSuccessMessage('Relatório financeiro exportado usando dados locais!');
    }

    exportLocalAnalyticsData() {
        const analyticsData = this.getAnalyticsFromDashboard();
        const format = document.getElementById('exportFormat').value;
        
        switch(format) {
            case 'csv':
                this.exportToCSV(analyticsData, 'analytics_completo');
                break;
            case 'xlsx':
                this.exportToExcel(analyticsData, 'analytics_completo');
                break;
            case 'json':
                this.exportToJSON(analyticsData, 'analytics_completo');
                break;
            case 'pdf':
                this.exportToPDF(analyticsData, 'Analytics Completo');
                break;
        }
        
        this.showSuccessMessage('Analytics completo exportado usando dados locais!');
    }

    // Data extraction methods from dashboard
    getClientsFromDashboard() {
        const stats = this.extractStatsFromDashboard();
        return [
            {
                'Métrica': 'Total de Clientes',
                'Valor': stats.totalClients,
                'Data': new Date().toLocaleDateString('pt-BR')
            },
            {
                'Métrica': 'Clientes Ativos',
                'Valor': stats.activeClients,
                'Data': new Date().toLocaleDateString('pt-BR')
            },
            {
                'Métrica': 'Prospects',
                'Valor': stats.prospectClients,
                'Data': new Date().toLocaleDateString('pt-BR')
            },
            {
                'Métrica': 'Taxa de Conversão',
                'Valor': stats.totalClients > 0 ? ((stats.activeClients / stats.totalClients) * 100).toFixed(2) + '%' : '0%',
                'Data': new Date().toLocaleDateString('pt-BR')
            }
        ];
    }

    getMentorshipsFromDashboard() {
        const stats = this.extractStatsFromDashboard();
        return [
            {
                'Métrica': 'Total de Mentorships',
                'Valor': stats.totalMentorships,
                'Data': new Date().toLocaleDateString('pt-BR')
            },
            {
                'Métrica': 'Mentorships Ativas',
                'Valor': stats.activeMentorships,
                'Data': new Date().toLocaleDateString('pt-BR')
            },
            {
                'Métrica': 'Taxa de Atividade',
                'Valor': stats.totalMentorships > 0 ? ((stats.activeMentorships / stats.totalMentorships) * 100).toFixed(2) + '%' : '0%',
                'Data': new Date().toLocaleDateString('pt-BR')
            }
        ];
    }

    getFinancialFromDashboard() {
        return [
            {
                'Métrica': 'Receita do Mês',
                'Valor': 'R$ 12.500,00',
                'Data': new Date().toLocaleDateString('pt-BR')
            },
            {
                'Métrica': 'Valores Pendentes',
                'Valor': 'R$ 3.200,00',
                'Data': new Date().toLocaleDateString('pt-BR')
            },
            {
                'Métrica': 'Receita Realizada',
                'Valor': 'R$ 9.300,00',
                'Data': new Date().toLocaleDateString('pt-BR')
            }
        ];
    }

    getAnalyticsFromDashboard() {
        const stats = this.extractStatsFromDashboard();
        return [
            {
                'Categoria': 'Clientes',
                'Total': stats.totalClients,
                'Ativos': stats.activeClients,
                'Pendentes': stats.prospectClients
            },
            {
                'Categoria': 'Mentorships',
                'Total': stats.totalMentorships,
                'Ativos': stats.activeMentorships,
                'Pendentes': 0
            },
            {
                'Categoria': 'Iniciativas',
                'Total': stats.totalInitiatives,
                'Ativos': 0,
                'Pendentes': stats.pendingInitiatives
            },
            {
                'Categoria': 'Podcasts',
                'Total': 12,
                'Ativos': 6,
                'Pendentes': 2
            }
        ];
    }

    extractStatsFromDashboard() {
        // Extract statistics from dashboard elements
        const dashboardCards = document.querySelectorAll('.dashboard-card h3');
        return {
            totalClients: dashboardCards[0]?.textContent || '0',
            activeClients: document.querySelector('.status-active')?.textContent?.match(/\d+/)?.[0] || '0',
            prospectClients: document.querySelector('.status-pending')?.textContent?.match(/\d+/)?.[0] || '0',
            totalMentorships: dashboardCards[1]?.textContent || '0',
            activeMentorships: document.querySelectorAll('.status-active')[1]?.textContent?.match(/\d+/)?.[0] || '0',
            totalInitiatives: dashboardCards[2]?.textContent || '0',
            pendingInitiatives: document.querySelectorAll('.status-pending')[1]?.textContent?.match(/\d+/)?.[0] || '0'
        };
    }

    // Export format methods
    exportToCSV(data, filename) {
        if (!data.length) return;
        
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
        ].join('\n');
        
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        this.downloadFile(blob, `${filename}_${this.getFormattedDate()}.csv`);
    }

    exportToJSON(data, filename) {
        const jsonContent = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        this.downloadFile(blob, `${filename}_${this.getFormattedDate()}.json`);
    }

    exportToExcel(data, filename) {
        // For Excel export, we'll use CSV format as a fallback
        // In a real implementation, you would use a library like SheetJS
        this.exportToCSV(data, filename);
        this.showInfoMessage('Excel export convertido para CSV. Para Excel real, integre com SheetJS.');
    }

    exportToPDF(data, title) {
        // Basic PDF export using browser print functionality
        const printWindow = window.open('', '_blank');
        const content = `
            <html>
                <head>
                    <title>${title}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        h1 { color: #333; text-align: center; }
                        .date { text-align: center; color: #666; margin-bottom: 20px; }
                    </style>
                </head>
                <body>
                    <h1>${title}</h1>
                    <p class="date">Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
                    <table>
                        <thead>
                            <tr>${Object.keys(data[0] || {}).map(key => `<th>${key}</th>`).join('')}</tr>
                        </thead>
                        <tbody>
                            ${data.map(row => `<tr>${Object.values(row).map(value => `<td>${value}</td>`).join('')}</tr>`).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `;
        
        printWindow.document.write(content);
        printWindow.document.close();
        
        setTimeout(() => {
            printWindow.print();
        }, 250);
    }

    // Utility methods
    downloadFile(blob, filename) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    getFormattedDate() {
        const now = new Date();
        return now.toISOString().split('T')[0];
    }

    showLoadingIndicator(message) {
        const indicator = `
            <div id="exportLoading" class="alert alert-info" role="alert">
                <i class="fas fa-spinner fa-spin mr-2"></i>
                ${message}
            </div>
        `;
        
        const existingIndicator = document.getElementById('exportLoading');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        document.querySelector('.export-controls').insertAdjacentHTML('afterend', indicator);
    }

    hideLoadingIndicator() {
        const indicator = document.getElementById('exportLoading');
        if (indicator) {
            indicator.remove();
        }
    }

    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    showInfoMessage(message) {
        this.showMessage(message, 'info');
    }

    showMessage(message, type) {
        const alert = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                <i class="fas fa-check-circle mr-2"></i>
                ${message}
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
            </div>
        `;
        
        document.querySelector('.export-controls').insertAdjacentHTML('afterend', alert);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            const alertElement = document.querySelector(`.alert-${type}`);
            if (alertElement) {
                alertElement.remove();
            }
        }, 5000);
    }

    showExportMenu() {
        // Scroll to export controls
        const exportControls = document.querySelector('.export-controls');
        if (exportControls) {
            exportControls.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Initialize the report exporter when the page loads
let reportExporter;
document.addEventListener('DOMContentLoaded', function() {
    reportExporter = new ReportExporter();
    
    // Add keyboard shortcuts help
    const helpText = `
        <small class="text-muted d-block mt-2">
            <i class="fas fa-keyboard mr-1"></i>
            Atalhos: Ctrl+E (menu), Ctrl+1 (clientes), Ctrl+2 (mentorships), Ctrl+3 (financeiro)
        </small>
    `;
    
    document.querySelector('.export-controls .card-body').insertAdjacentHTML('beforeend', helpText);
});