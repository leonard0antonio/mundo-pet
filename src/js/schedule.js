// Simulação de Banco de Dados (LocalStorage)
let appointments = JSON.parse(localStorage.getItem("@mundo-pet/appointments")) || [];

// 1. Função para salvar agendamento
function addAppointment(data) {
    // Validação de Conflito: Mesma data e hora
    const conflict = appointments.find(ap => ap.date === data.date && ap.hour === data.hour);
    
    if (conflict) {
        alert("Já existe um agendamento para este horário!");
        return false;
    }

    appointments.push(data);
    saveAndRefresh();
    return true;
}

// 2. Função para remover agendamento
function removeAppointment(id) {
    appointments = appointments.filter(ap => ap.id !== id);
    saveAndRefresh();
}

// 3. Persistência e Atualização da Tela
function saveAndRefresh() {
    localStorage.setItem("@mundo-pet/appointments", JSON.stringify(appointments));
    renderSchedule();
}

// 4. Renderização da Agenda por Período
function renderSchedule() {
    const selectedDate = document.getElementById('date-filter').value;
    const container = document.getElementById('schedule-list');
    container.innerHTML = ""; // Limpa a lista

    const periods = [
        { name: 'Manhã', range: [9, 12], icon: '☀️' },
        { name: 'Tarde', range: [13, 18], icon: '⛅' },
        { name: 'Noite', range: [19, 21], icon: '🌙' }
    ];

    periods.forEach(period => {
        // Filtra agendamentos do período e data selecionada
        const filtered = appointments
            .filter(ap => ap.date === selectedDate)
            .filter(ap => {
                const hour = parseInt(ap.hour.split(':')[0]);
                return hour >= period.range[0] && hour <= period.range[1];
            })
            .sort((a, b) => a.hour.localeCompare(b.hour));

        if (filtered.length > 0) {
            container.innerHTML += createPeriodSection(period, filtered);
        }
    });
}