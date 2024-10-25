const clientData = {
    name: "John",
    lastName: "Doe",
    email: "johndoe@example.com",
    password: "veryHardPassword",
    address: "123 Random Street", 
    pastAppointments: [
        { date: "10 October 2024", time: "3:00 PM", service: "Deep Cleaning", address: "123 Main St", price: "$150", paid: true },
        { date: "15 October 2024", time: "11:00 AM", service: "Window Cleaning", address: "456 Elm St", price: "$80", paid: false }
    ],
    futureAppointments: [
        { date: "27 October 2024", time: "10:00 AM", service: "Regular Interior Cleaning", address: "789 Oak St", price: "$100", paid: true },
        { date: "5 November 2024", time: "2:00 PM", service: "Major Interior Cleaning", address: "101 Pine St", price: "$50", paid: false }
    ]
};

function displayAppointments() {
    const futureAppointmentsContainer = document.querySelector('.future-appointments');
    futureAppointmentsContainer.innerHTML = ''; // Clear any previous content

    clientData.futureAppointments.forEach(appointment => {
        const appointmentCard = document.createElement('div');
        appointmentCard.classList.add('appointment-card');

        appointmentCard.innerHTML = `
            <div class="date"><strong>Date:</strong> ${appointment.date} - ${appointment.time}</div>
            <div class="service-info">
                <span class="service" style="color: blue;">${appointment.service}</span>
                <div class="address" style="font-size: smaller;">Address: ${appointment.address}</div>
            </div>
            <div class="price-status">
                <span class="price"><strong>Price:</strong> ${appointment.price}</span>
                <span class="status" style="color: ${appointment.paid ? 'green' : 'red'};">
                    ${appointment.paid ? 'Paid' : 'Unpaid'}
                </span>
            </div>
        `;
        futureAppointmentsContainer.appendChild(appointmentCard);
    });
}

function displayPastAppointments() {
    const pastAppointmentsContainer = document.querySelector('.past-appointments');
    pastAppointmentsContainer.innerHTML = ''; // Clear any previous content

    clientData.pastAppointments.forEach(appointment => {
        const appointmentCard = document.createElement('div');
        appointmentCard.classList.add('appointment-card');

        appointmentCard.innerHTML = `
            <div class="date"><strong>Date:</strong> ${appointment.date} - ${appointment.time}</div>
            <div class="service-info">
                <span class="service" style="color: blue;">${appointment.service}</span>
                <div class="address" style="font-size: smaller;">Address: ${appointment.address}</div>
            </div>
            <div class="price-status">
                <span class="price"><strong>Price:</strong> ${appointment.price}</span>
                <span class="status" style="color: ${appointment.paid ? 'green' : 'red'};">
                    ${appointment.paid ? 'Paid' : 'Unpaid'}
                </span>
            </div>
        `;
        pastAppointmentsContainer.appendChild(appointmentCard);
    });
}

displayAppointments();
displayPastAppointments();
