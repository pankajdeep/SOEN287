// Default data

const clientData = {
    name: "John",
    lastName: "Doe",
    email: "johndoe@example.com",
    password: "veryHardPassword",
    address: "123 Random Street", 
    appointedServices: [
        { date: "10 October 2024", time: "3:00 PM", service: "Deep Cleaning", address: "123 Main St", price: "$150", paid: true },
        { date: "15 October 2024", time: "11:00 AM", service: "Window Cleaning", address: "456 Elm St", price: "$80", paid: false },
        { date: "27 October 2024", time: "10:00 AM", service: "Regular Interior Cleaning", address: "789 Oak St", price: "$100", paid: true },
        { date: "5 November 2024", time: "2:00 PM", service: "Major Interior Cleaning", address: "101 Pine St", price: "$50", paid: false }
    ]
};

// Menu Options

function clickOptions(option) {

    let profile = document.getElementById("profile");
    let modifyServices = document.getElementById("modify-services");
    let history = document.getElementById("history");
    let billReceipts = document.getElementById("bill-receipts");

    switch (option) {
        case "Profile":
            profile.style.display = "flex";
            modifyServices.style.display = "none";
            history.style.display = "none";
            billReceipts.style.display = "none";
            break;
        case "Services":
            profile.style.display = "none";
            modifyServices.style.display = "block";
            history.style.display = "none";
            billReceipts.style.display = "none";
            break;
        case "History":
            profile.style.display = "none";
            modifyServices.style.display = "none";
            history.style.display = "block";
            billReceipts.style.display = "none";
            break;
        case "Receipts":
            profile.style.display = "none";
            modifyServices.style.display = "none";
            history.style.display = "none";
            billReceipts.style.display = "block";
    }
}


// Edit profile

function editProfile() {
    
    let profileTable = document.getElementById('profile-table');
    let editProfileButton = document.getElementById('editProfileInfo');
    
    profileTable.style.display = "none";
    editProfileButton.style.display = "flex";

    let profileName = document.getElementById('profile-name');
    document.getElementById('name').defaultValue = profileName.textContent;

    let profileEmail = document.getElementById('profile-email');
    document.getElementById('email').defaultValue = profileEmail.textContent;

    let profilePhone = document.getElementById('profile-phone');
    document.getElementById('phone_number').defaultValue = profilePhone.textContent;

    let profileBirthday = document.getElementById('profile-birthday');
    document.getElementById('birthday').valueAsDate = new Date(profileBirthday.textContent);
}


// Save Changes

function saveChanges() {

    let nameInfo = document.profile.name.value;
    let emailInfo = document.profile.email.value;
    let phoneInfo = document.profile.phone_number.value;
    let birthdayInfo = document.profile.birthday.value;

    document.getElementById('profile-name').textContent = nameInfo;
    document.getElementById('profile-email').textContent = emailInfo;
    document.getElementById('profile-phone').textContent = phoneInfo;
    document.getElementById('profile-birthday').textContent = birthdayInfo;

    let profileTable = document.getElementById('profile-table');
    let editProfileButton = document.getElementById('editProfileInfo');

    profileTable.style.display = "flex";
    editProfileButton.style.display = "none";
}


// Upload Logos
let logoFile = document.getElementById('logo-file');
logoFile.addEventListener('change', function(event) {
    let fileName = event.target.files[0].name;
    let fileInfo =  document.getElementById('file-info');
    let changeFileInfo = `
        <strong>Chosen file:</strong>
        <span id="file-name">${fileName}</span>
    `;
    let changeFileContainer = document.getElementById('change-file');
    let changeButton = document.createElement('button');
    changeButton.id = "changeLogoBTN";
    changeButton.textContent = "Change Logo";
    changeButton.onclick = function() {
        changeLogo(fileName);
    };
    fileInfo.innerHTML = changeFileInfo;
    changeFileContainer.appendChild(changeButton);
});

function changeLogo(fileName) {
    let currentLogo = document.getElementById('current-logo');
    currentLogo.src = `./Images/${fileName}`;

    let changeFileContainer = document.getElementById('change-file');
    changeFileContainer.removeChild(changeFileContainer.children[1]);

    let fileInfo =  document.getElementById('file-info');
    fileInfo.innerHTML = '';
}

// Modify Services

function addData() {
    // Get input values
    let name = document.services.serviceName.value;
    let description = document.services.description.value;
    let price = document.services.price.value;

    // Get the table and insert a new row at the end
    let table = document.getElementById("serviceTable");
    let newRow = table.insertRow(table.rows.length);

    // Insert data into cells of the new row
    newRow.insertCell(0).innerHTML = name;
    newRow.insertCell(1).innerHTML = description;
    newRow.insertCell(2).innerHTML = `$${price}`;
    newRow.insertCell(3).innerHTML =
        '<button class="table-btn" onclick="editData(this)">Edit</button>' +
        '<button class="table-btn" onclick="deleteData(this)">Delete</button>';

    // Clear input fields
    clearInputs();
}

function editData(button) {

    // Get the parent row of the clicked button
    let row = button.parentNode.parentNode;

    // Get the cells within the row
    let nameCell = row.cells[0];
    let descriptionCell = row.cells[1];
    let priceCell = row.cells[2];

    // Prompt the user to enter updated values
    let nameInput =
        prompt("Enter the updated name:",
            nameCell.innerHTML);
    let descriptionInput =
        prompt("Enter the updated description:",
            descriptionCell.innerHTML);
    let priceInput =
        prompt("Enter the updated price:",
            priceCell.innerHTML);

    // Update the cell contents with the new values
    nameCell.innerHTML = nameInput;
    descriptionCell.innerHTML = descriptionInput;
    priceCell.innerHTML = priceInput;
}

function deleteData(button) {

    // Get the parent row of the clicked button
    let row = button.parentNode.parentNode;

    // Remove the row from the table
    row.parentNode.removeChild(row);
}

function clearInputs() {

    // Clear input fields
    document.getElementById("serviceName").value = "";
    document.getElementById("description").value = "";
    document.getElementById("price").value = "";
}


// History

function displayHistory() {
    const pastServicesContainer = document.querySelector('#past-services');

    clientData.appointedServices.forEach(appointment => {

        const currentDate = new Date();
        const specificDate = new Date(appointment.date);

        if (specificDate < currentDate) {
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
            pastServicesContainer.appendChild(appointmentCard);
        }
    });
}

// Bill & Receipts

function displayReceipts() {
    const appointedServicesContainer = document.querySelector('#appointed-services');

    clientData.appointedServices.forEach((appointment, i) => {
        const appointmentCard = document.createElement('div');
        appointmentCard.classList.add('appointment-card');
        appointmentCard.id = `appointedService${i + 1}`;

        appointmentCard.innerHTML = `
            <div class="date"><strong>Date:</strong> ${appointment.date} - ${appointment.time}</div>
            <div class="service-info">
                <span class="service" style="color: blue;">${appointment.service}</span>
                <div class="address" style="font-size: smaller;">Address: ${appointment.address}</div>
            </div>
            <div class="price-status">
                <span class="price"><strong>Price:</strong> ${appointment.price}</span>
            </div>
            <div class="checkbox-container">
                <input type="checkbox" class="checkbox-input" />
                <label class="check-label" >Check if the execution of service is done.</label>
            </div>
            <div class="sign-and-print">
                <div class="signature">
                    <label class="sign-label">Signature:</label>
                    <input type="text" />
                </div>
                <button type="button" class="print-btn" onclick="printReceipt('appointedService${i + 1}')">Print</button>
            </div>
        `;
        appointedServicesContainer.appendChild(appointmentCard);
    });
}

function printReceipt(containerId) {
    // Get the container content
    var printContent = document.getElementById(containerId).innerHTML;
    // Open a new window
    var printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<!DOCTYPE html><html><head><title>Printed Receipt</title>');
    printWindow.document.write('</head><body>');
    // Write the container's content to the new window
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();

}

displayHistory();
displayReceipts();