const taskBtn = document.getElementById('task-btn');
const newtask = document.getElementById('newtask');
const newtaskcontent = document.getElementById('newtask-content');

const addBtn = document.getElementById('addbtn');
const inputTask = document.getElementById('input-task')

const taskList = document.querySelector("#tasks-list");

const registrBtn = document.getElementById("showRegistr");
const LoginBtn = document.getElementById("showLogin");
const logintext = document.getElementById("logintext");
const registtext = document.getElementById("registrtext");

const registrForm = document.getElementById("registrForm");
const loginForm = document.getElementById("loginForm");

const firstBtn = document.getElementById('first_btn');
const card = document.querySelector('.card');

const customAlert = document.getElementById("customAlert");
const alertMessage = document.getElementById("alertMessage");
const closeAlert = document.getElementById("closeAlert");


firstBtn.addEventListener('click', (event)=>{
    event.stopPropagation();
    card.classList.toggle('active');
})

document.addEventListener('click', (event)=>{
    if(!card.contains(event.target) && event.target !== photobtn){
        card.classList.remove('active');
    }
})

registrBtn.addEventListener("click", (event)=> {
    event.preventDefault();
    registrForm.style.display="block";
    loginForm.style.display="none";

    logintext.style.display="flex";
    registtext.style.display="none";

});
LoginBtn.addEventListener("click", (event)=> {
    event.preventDefault();
    registrForm.style.display="none";
    loginForm.style.display="flex";

    logintext.style.display="none";
    registtext.style.display="flex";
});

registrForm.addEventListener("submit", function(event){
    event.preventDefault();
    const username = registrForm.username.value;
    const password = registrForm.password.value;

    const userdata ={
        username: username,
        password: password,
    }

    fetch('http://127.0.0.1:5000/registr', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userdata)
    })
    .then(response => {
    
    return response.json().then(data => {
        if (!response.ok) {
            throw new Error(data.message || "Ошибка сервера");
        }
        return data; 
    });
    })
    .then(data => {
        showAlert(data.message);
    })
    .catch(error =>{
        console.error('Детали:', error);
        showAlert(error.message);
    })
});

loginForm.addEventListener("submit", function(event){
    event.preventDefault();

    const username = loginForm.username.value;
    const password = loginForm.password.value; 

    const logindata = {
        username: username,
        password: password
    }

        fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(logindata)
    })
    .then(response => {
        return response.json().then(data => {
            if (!response.ok) {
                throw new Error(data.message || "Ошибка входа");
            }
            return data;
        });
    })
    .then(data => {
        console.log("Ответ от сервера:", data); // Посмотри, что в консоли F12!

        if (data.user_id) {
        localStorage.setItem('current_user_id', data.user_id);
        localStorage.setItem('current_username', data.username);
        console.log('Данные записываются')
        setTimeout(() => {
            window.location.href = 'tasks.html';
        }, 100);
        
        }   
    })
    .catch(error =>{
        console.error('Детали:', error);
        showAlert(error.message);
    })

});

function showAlert(message) {
    alertMessage.textContent = message;
    customAlert.style.display = "flex";
}

closeAlert.addEventListener("click", () => {
    customAlert.style.display = "none";
});

