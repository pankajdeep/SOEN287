const clientData = {
    name: "John",
    lastName: "Doe",
    email: "johndoe@example.com",
    password: "veryHardPassword",
    address: "123 Random Street", 
    phoneNumber: 1234567890,
    pastAppointments: [
        { date: "10 October 2024", time: "3:00 PM", service: "Deep Cleaning", address: "123 Main St", price: "$150", paid: true },
        { date: "15 October 2024", time: "11:00 AM", service: "Window Cleaning", address: "456 Elm St", price: "$80", paid: false }
    ],
    futureAppointments: [
        { date: "27 October 2024", time: "10:00 AM", service: "Regular Interior Cleaning", address: "789 Oak St", price: "$100", paid: true },
        { date: "5 November 2024", time: "2:00 PM", service: "Major Interior Cleaning", address: "101 Pine St", price: "$50", paid: false }
    ],
    unpaidAppointments: [], //Updated with categorizeAppointments()
    paidAppointments: [],   //Updated with categorizeAppointments()
    totalDue: 0,
    totalPaid: 0
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
    pastAppointmentsContainer.innerHTML = ''; // Removes the random space below the sidebar for some reasons

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

// Populate form fields with client data as placeholders
function loadProfileData() {
    document.getElementById('name').placeholder = clientData.name;
    document.getElementById('lastName').placeholder = clientData.lastName;
    document.getElementById('email').placeholder = clientData.email;
    document.getElementById('address').placeholder = clientData.address;
    document.getElementById('phoneNumber').placeholder = clientData.phoneNumber;
}

// Update clientData when form is submitted
function updateProfile() {
    if (newPassword) {
        clientData.password = newPassword;
        alert('Password updated successfully');
    }
    alert('Profile updated successfully');
}

// Delete account function
function deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        // Clear clientData or redirect to account deletion logic
        alert('Account deleted');
    }
}

document.addEventListener('DOMContentLoaded', () => {
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

// Categorize appointments
function categorizeAppointments() {
    clientData.unpaidAppointments = [];
    clientData.paidAppointments = [];
    clientData.totalDue = 0;
    clientData.totalPaid = 0;

    const allAppointments = [...clientData.pastAppointments, ...clientData.futureAppointments];

    allAppointments.forEach(appointment => {
        const price = parseFloat(appointment.price.replace('$', ''));

        if (appointment.paid) {
            clientData.paidAppointments.push(appointment);
            clientData.totalPaid += price;
        } else {
            clientData.unpaidAppointments.push(appointment);
            clientData.totalDue += price;
        }
    });
}

function displayUnpaidAppointments() {
    const unpaidAppointmentsContainer = document.querySelector('.unpaid-appointments');
    unpaidAppointmentsContainer.innerHTML = ''; // Clear any previous content

    clientData.unpaidAppointments.forEach(appointment => {
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
                <span class="status" style="color: red;">Unpaid</span>
                <button onclick="payForAppointment('${appointment.service}')">Pay</button>
            </div>
        `;
        unpaidAppointmentsContainer.appendChild(appointmentCard);
    });

    // Display total due
    const totalDueContainer = document.querySelector('.total-due');
    totalDueContainer.innerHTML = `<strong>Total Amount Due:</strong> $${clientData.totalDue.toFixed(2)}`;
}

function displayPaidAppointments() {
    const paidAppointmentsContainer = document.querySelector('.paid-appointments');
    paidAppointmentsContainer.innerHTML = ''; // Clear any previous content

    clientData.paidAppointments.forEach(appointment => {
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
                <span class="status" style="color: green;">Paid</span>
            </div>
        `;
        paidAppointmentsContainer.appendChild(appointmentCard);
    });

    // Display total paid
    const totalPaidContainer = document.querySelector('.total-paid');
    totalPaidContainer.innerHTML = `<strong>Total Amount Paid:</strong> $${clientData.totalPaid.toFixed(2)}`;
}

// Function to pay for an appointment
function payForAppointment(service) {
    const appointment = clientData.unpaidAppointments.find(app => app.service === service);
    if (appointment) {
        appointment.paid = true;
        alert(`Payment for ${service} successful.`);
        categorizeAppointments();
        displayUnpaidAppointments();
        displayPaidAppointments();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    categorizeAppointments(); 
    displayUnpaidAppointments();
    displayPaidAppointments();
    loadProfileData(); 
});


// Functions for Settings
function bookService() {alert('Service booked');}
function cancelService() {alert('Service canceled');}
