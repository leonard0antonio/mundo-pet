const modal = document.getElementById('modal-overlay');
const form = document.getElementById('schedule-form');

// Abrir Modal
document.getElementById('btn-open-modal').onclick = () => {
    modal.classList.remove('hidden');
    form.tutor.focus(); // Foco inicial no primeiro campo
};

// Fechar Modal
document.getElementById('btn-close-modal').onclick = () => modal.classList.add('hidden');

// Envio do Formulário
form.onsubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const newOrder = {
        id: new Date().getTime(),
        tutor: formData.get('tutor'),
        pet: formData.get('pet'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        date: formData.get('date'),
        hour: formData.get('hour')
    };

    if (addAppointment(newOrder)) {
        form.reset();
        modal.classList.add('hidden');
    }
};

// Inicialização
document.getElementById('date-filter').onchange = renderSchedule;
renderSchedule();