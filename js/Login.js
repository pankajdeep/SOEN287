const client_login_email="johndoe@example.com";
const client_password="123";

const business_login_email="business@gmail.com";
const business_password ="abc";

function CheckLogInInfoBusiness(){
    const login_info = document.forms[0];
    
    if((login_info.elements[0].value==business_login_email)&&(login_info.elements[1].value==business_password)){
        document.location="./LandingPage.html";
    }else{
        const warning = document.getElementById("Warning");
        warning.innerHTML="* Wrong log in email or password.";
    }
}

function CheckLogInInfoClient(){
    const login_info = document.forms[0];
    
    if((login_info.elements[0].value==client_login_email)&&(login_info.elements[1].value==client_password)){
        document.location="./Client_Dashboard.html";
    }else{
        const warning = document.getElementById("Warning");
        warning.innerHTML="* Wrong log in email or password.";
    }
}