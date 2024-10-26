const clientData = {
    name: "John",
    lastName: "Doe",
    email: "johndoe@example.com",
    password: "veryHardPassword",
    address: "123 Random Street", 
    phoneNumber: 123456789,
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

function loadProfileData() {
    document.getElementById('name').placeholder = clientData.name;
    document.getElementById('lastName').placeholder = clientData.lastName;
    document.getElementById('email').placeholder = clientData.email;
    document.getElementById('address').placeholder = clientData.address;
    document.getElementById('phoneNumber').placeholder = clientData.phoneNumber;
}

function updateProfile() {
    clientData.name = document.getElementById('name').value || clientData.name;
    clientData.lastName = document.getElementById('lastName').value || clientData.lastName;
    document.getElementById('email').placeholder = clientData.email;
    clientData.address = document.getElementById('address').value || clientData.address;
    clientData.phoneNumber = document.getElementById('phoneNumber').value || clientData.phoneNumber;
    alert('Profile updated successfully');
}

function deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        // Clear clientData or redirect to account deletion logic
        alert('Account deleted');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Call your functions here
    if (document.querySelector('.future-appointments')) {
        displayAppointments();
    }
    if (document.querySelector('.past-appointments')) {
        displayPastAppointments();
    }
    loadProfileData();
});

displayAppointments();
displayPastAppointments();
