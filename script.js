<<<<<<< HEAD
const taskBtn = document.getElementById('task-btn');
const newtask = document.getElementById('newtask');
const newtaskcontent = document.getElementById('newtask-content');

const addBtn = document.getElementById('addbtn');
const inputTask = document.getElementById('input-task')
const inputData = document.getElementById('input-data')

const taskList = document.querySelector("#tasks-list");

const logoutbtn = document.getElementById('logoutbtn')

taskBtn.addEventListener('click', (event)=>{
    newtask.classList.toggle('active');
    document.getElementById('newtask').style.display = 'flex'
});

document.addEventListener('click', (event)=>{
    if(event.target === newtask){
        newtask.classList.remove('active');
    }
});

taskList.addEventListener('click', (event)=>{
    if(event.target.classList.contains('delete-btn')){
        try {
            const taskItem = event.target.closest('.task-item');
            const text = taskItem.querySelector('span').innerText; 
            const userId = localStorage.getItem('current_user_id');

            fetch('http://127.0.0.1:5000/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({taskContainer:text, user_id:userId})
            })
            .then(response =>{
            return response.json().then(data =>{
                if(!response.ok){
                    throw new Error(data.message|| "Ошибка сервера");
                }
            });
            })
            .then(data =>{
                
                taskItem.style.height = taskItem.offsetHeight + 'px';
                requestAnimationFrame(() => {
                    taskItem.classList.add('removing');
                });
                setTimeout(() => {
                    taskItem.remove();
                }, 400);

            })

        }catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось удалить задачу: ' + error.message);
    }
}});


window.onload = async () => {

    const userId = localStorage.getItem('current_user_id');

    const response = await fetch(`http://127.0.0.1:5000/get_tasks?user_id=${userId}`);
    const tasks = await response.json();

    tasks.forEach(task => {

        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';

        taskItem.innerHTML = `
            <span class="text_task">${task.taskText}</span>
            <button class="delete-btn">✕</button>
            <span class="deadline">${task.deadline}</span>
            <span class="time_left">${task.time_left}</span>
        `;

        taskList.append(taskItem);

    });

};

addBtn.addEventListener('click', (event) => {
    const text_task = inputTask.value.trim();
    const deadline = inputData.value.trim();
    const taskContainer = document.querySelector('#tasks-list');

    try {
        if (text_task === '') {
        alert('Поле не может быть пустым!');
        return;
         };

        fetch('http://127.0.0.1:5000/logic', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({taskContainer:text_task, user_id: localStorage.getItem('current_user_id'), deadline: deadline})
        })


        .then(response => {
        return response.json().then(data => {
            if (!response.ok) {
                throw new Error(data.message || "Ошибка сервера");
            }
            return data; 
        });
    })
        .then(data =>{
            const taskItem = document.createElement('div');
            taskItem.className = 'task-item';
            taskItem.innerHTML = `
            <span class="text_task">${text_task}</span>
            <button class="delete-btn">✕</button>
            <span class = "deadline">${deadline}</span>
            <span class = "time_left">${data.time_left}</span>`;

            taskContainer.appendChild(taskItem);

            inputTask.value = '';
            inputData.value = '';
            newtask.classList.remove('active');
        })
    }catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось добавить задачу: ' + error.message);
    }
});

logoutbtn.addEventListener('click', (event)=> {
    localStorage.clear();
    setTimeout(() => {
            window.location.href = 'index.html';
        }, 100);

})




=======
const taskBtn = document.getElementById('task-btn');
const newtask = document.getElementById('newtask');
const newtaskcontent = document.getElementById('newtask-content');

const addBtn = document.getElementById('addbtn');
const inputTask = document.getElementById('input-task')
const inputData = document.getElementById('input-data')

const taskList = document.querySelector("#tasks-list");

const logoutbtn = document.getElementById('logoutbtn')

taskBtn.addEventListener('click', (event)=>{
    newtask.classList.toggle('active');
    document.getElementById('newtask').style.display = 'flex'
});

document.addEventListener('click', (event)=>{
    if(event.target === newtask){
        newtask.classList.remove('active');
    }
});

taskList.addEventListener('click', (event)=>{
    if(event.target.classList.contains('delete-btn')){
        try {
            const taskItem = event.target.closest('.task-item');
            const text = taskItem.querySelector('span').innerText; 
            const userId = localStorage.getItem('current_user_id');

            fetch('http://127.0.0.1:5000/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({taskContainer:text, user_id:userId})
            })
            .then(response =>{
            return response.json().then(data =>{
                if(!response.ok){
                    throw new Error(data.message|| "Ошибка сервера");
                }
            });
            })
            .then(data =>{
                
                taskItem.style.height = taskItem.offsetHeight + 'px';
                requestAnimationFrame(() => {
                    taskItem.classList.add('removing');
                });
                setTimeout(() => {
                    taskItem.remove();
                }, 400);

            })

        }catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось удалить задачу: ' + error.message);
    }
}});


window.onload = async () => {

    const userId = localStorage.getItem('current_user_id');

    const response = await fetch(`http://127.0.0.1:5000/get_tasks?user_id=${userId}`);
    const tasks = await response.json();

    tasks.forEach(task => {

        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';

        taskItem.innerHTML = `
            <span class="text_task">${task.taskText}</span>
            <button class="delete-btn">✕</button>
            <span class="deadline">${task.deadline}</span>
            <span class="time_left">${task.time_left}</span>
        `;

        taskList.append(taskItem);

    });

};

addBtn.addEventListener('click', (event) => {
    const text_task = inputTask.value.trim();
    const deadline = inputData.value.trim();
    const taskContainer = document.querySelector('#tasks-list');

    try {
        if (text_task === '') {
        alert('Поле не может быть пустым!');
        return;
         };

        fetch('http://127.0.0.1:5000/logic', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({taskContainer:text_task, user_id: localStorage.getItem('current_user_id'), deadline: deadline})
        })


        .then(response => {
        return response.json().then(data => {
            if (!response.ok) {
                throw new Error(data.message || "Ошибка сервера");
            }
            return data; 
        });
    })
        .then(data =>{
            const taskItem = document.createElement('div');
            taskItem.className = 'task-item';
            taskItem.innerHTML = `
            <span class="text_task">${text_task}</span>
            <button class="delete-btn">✕</button>
            <span class = "deadline">${deadline}</span>
            <span class = "time_left">${data.time_left}</span>`;

            taskContainer.appendChild(taskItem);

            inputTask.value = '';
            inputData.value = '';
            newtask.classList.remove('active');
        })
    }catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось добавить задачу: ' + error.message);
    }
});

logoutbtn.addEventListener('click', (event)=> {
    localStorage.clear();
    setTimeout(() => {
            window.location.href = 'index.html';
        }, 100);

})




>>>>>>> ea33d61154747836ca1b7859b0eb249432afc005
