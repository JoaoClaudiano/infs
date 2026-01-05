// Configurações
const GITHUB_USER = 'JoaoClaudiano';
const BACKEND_URL = window.location.origin; // Assume que a API está no mesmo domínio

// 1. Inicializar gráfico AntV (com dados de exemplo)
function initAntVChart() {
    const container = document.getElementById('antv-language-chart');
    // Dados de exemplo. Substitua por uma chamada real à API do GitHub depois.
    const data = [
        { language: 'JavaScript', value: 45, color: '#f1e05a' },
        { language: 'Python', value: 25, color: '#3572A5' },
        { language: 'HTML/CSS', value: 20, color: '#e34c26' },
        { language: 'Outros', value: 10, color: '#6e7681' }
    ];

    // Renderização básica do AntV. Consulte a documentação para templates avançados[citation:1].
    const infographic = new Infographic({
        container,
        width: '100%',
        height: 400,
        theme: 'light',
    });
    infographic.render(`
        infographic donut-progress-multiple
        data
            items
                - label JavaScript
                  value 45
                  color "#f1e05a"
                - label Python
                  value 25
                  color "#3572A5"
    `);
}

// 2. Carregar dados do WakaTime via nossa API segura
async function loadWakaTimeData() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/wakatime`);
        const wakaData = await response.json();
        const container = document.getElementById('wakatime-container');

        if (wakaData.data) {
            const topLang = wakaData.data.languages?.[0]?.name || 'N/A';
            const totalTime = wakaData.data.human_readable_total_including_other_language || 'N/A';
            container.innerHTML = `
                <div style="font-size: 2rem; font-weight: bold; color: #58a6ff;">${totalTime}</div>
                <p>Total de codificação nos últimos 7 dias</p>
                <p><strong>Linguagem principal:</strong> ${topLang}</p>
            `;
        }
    } catch (error) {
        console.error('Erro ao carregar WakaTime:', error);
        document.getElementById('wakatime-container').innerHTML = '<p>Não foi possível carregar os dados de tempo.</p>';
    }
}

// 3. Inicializar gráfico Chart.js (Atividade Semanal - exemplo)
function initWeeklyActivityChart() {
    const ctx = document.getElementById('weekly-activity-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            datasets: [{
                label: 'Commits',
                data: [3, 7, 2, 9, 5, 4, 8],
                borderColor: 'rgb(88, 166, 255)',
                backgroundColor: 'rgba(88, 166, 255, 0.1)',
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });
}

// Inicializar tudo quando a página carregar
document.addEventListener('DOMContentLoaded', async () => {
    initAntVChart();
    initWeeklyActivityChart();
    await loadWakaTimeData();
});
