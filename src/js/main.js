// Elementos da DOM
const modal = document.getElementById('modal-overlay');
const form = document.getElementById('schedule-form');
const btnOpenModal = document.getElementById('btn-open-modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const dateFilter = document.getElementById('date-filter');
const formDate = document.getElementById('form-date');

// Inicialização (Quando a página carrega)
window.addEventListener('DOMContentLoaded', () => {
    // Define a data de hoje como padrão nos inputs de data
    const today = new Date().toISOString().split('T')[0];
    dateFilter.value = today;
    formDate.value = today;

    // Gera as opções de horas no select do modal e renderiza a tela
    generateTimeOptions();
    renderSchedule();
});

// Atualiza a lista quando muda a data no filtro superior
dateFilter.addEventListener('change', renderSchedule);

// ABRIR Modal
btnOpenModal.addEventListener('click', () => {
    modal.classList.remove('hidden');
    // Dá foco no primeiro campo automaticamente
    setTimeout(() => form.tutor.focus(), 100); 
});

// FECHAR Modal (no botão X ou clicando fora)
function closeModal() {
    modal.classList.add('hidden');
    form.reset(); // Limpa os campos ao fechar
    formDate.value = dateFilter.value; // Restaura a data atual
}

btnCloseModal.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
    // Se clicou exatamente no fundo escuro, fecha
    if (event.target === modal) closeModal(); 
});

// ENVIO DO FORMULÁRIO (Criar Agendamento)
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Evita recarregar a página
    
    // Captura os dados preenchidos
    const formData = new FormData(form);
    const newAppointment = {
        id: new Date().getTime(), // Gera um ID único baseado no milissegundo atual
        tutor: formData.get('tutor'),
        pet: formData.get('pet'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        date: formData.get('date'),
        hour: formData.get('hour')
    };

    // Tenta salvar. Se addAppointment retornar true (sem conflitos), fecha e limpa
    if (addAppointment(newAppointment)) {
        closeModal();
    }
});