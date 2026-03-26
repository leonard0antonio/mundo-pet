// Busca os dados salvos no navegador (LocalStorage) ou cria um array vazio
let appointments = JSON.parse(localStorage.getItem("@mundo-pet/appointments")) || [];

// Definição dos períodos e horários válidos
const periods = [
    { id: 'morning', name: 'Manhã', range: [9, 12], icon: '🌅' },
    { id: 'afternoon', name: 'Tarde', range: [13, 18], icon: '🌤️' },
    { id: 'night', name: 'Noite', range: [19, 21], icon: '🌙' }
];

// Preenche o Select de Horas com opções válidas (9h às 21h)
function generateTimeOptions() {
    const select = document.getElementById('hour-select');
    select.innerHTML = ''; // Limpa antes de preencher
    
    for(let h = 9; h <= 21; h++) {
        const hourString = `${h.toString().padStart(2, '0')}:00`;
        const option = document.createElement('option');
        option.value = hourString;
        option.textContent = hourString;
        select.appendChild(option);
    }
}

// Salva um novo agendamento
function addAppointment(data) {
    // Regra: Não permitir dois agendamentos no mesmo horário e data
    const hasConflict = appointments.some(ap => ap.date === data.date && ap.hour === data.hour);
    
    if (hasConflict) {
        alert("Já existe um agendamento para este horário nesta data!");
        return false;
    }

    appointments.push(data);
    saveAndRender();
    return true; // Retorna sucesso
}

// Remove agendamento pelo ID
function removeAppointment(id) {
    appointments = appointments.filter(ap => ap.id !== id);
    saveAndRender();
}

// Salva no LocalStorage e atualiza a tela
function saveAndRender() {
    localStorage.setItem("@mundo-pet/appointments", JSON.stringify(appointments));
    renderSchedule();
}

// Função principal que desenha a agenda na tela
function renderSchedule() {
    const selectedDate = document.getElementById('date-filter').value;
    const container = document.getElementById('schedule-list');
    container.innerHTML = ""; // Limpa a tela

    periods.forEach(period => {
        // Filtra os agendamentos do dia selecionado e que pertencem a este período
        const periodAppointments = appointments
            .filter(ap => ap.date === selectedDate)
            .filter(ap => {
                const hourNum = parseInt(ap.hour.split(':')[0]);
                return hourNum >= period.range[0] && hourNum <= period.range[1];
            })
            // Ordena do menor horário para o maior
            .sort((a, b) => a.hour.localeCompare(b.hour));

        // Só cria a seção (Manhã/Tarde/Noite) se houver agendamentos nela
        if (periodAppointments.length > 0) {
            const sectionHTML = `
                <section class="period-section">
                    <div class="period-header">
                        <div class="period-title">
                            <span>${period.icon}</span> ${period.name}
                        </div>
                        <div>${period.range[0]}h-${period.range[1]}h</div>
                    </div>
                    <div>
                        ${periodAppointments.map(ap => `
                            <div class="schedule-item">
                                <div class="item-time">${ap.hour}</div>
                                <div class="item-info">
                                    <strong>${ap.pet}</strong>
                                    <span>/ ${ap.tutor}</span>
                                </div>
                                <div class="item-service">${ap.service}</div>
                                <button class="btn-remove" onclick="removeAppointment(${ap.id})">Remover agendamento</button>
                            </div>
                        `).join('')}
                    </div>
                </section>
            `;
            container.insertAdjacentHTML('beforeend', sectionHTML);
        }
    });

    // Se não houver nada no dia, mostra mensagem amigável
    if (container.innerHTML === "") {
        container.innerHTML = `<p style="text-align:center; color: var(--text-muted); margin-top: 2rem;">Nenhum agendamento para esta data.</p>`;
    }
}