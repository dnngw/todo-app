// Configuration
const STORAGE_KEY = 'todoList';
let todos = loadStorage();
let uniqueId = nextId();
let currentFilter = "all";


// DOM Variabel
const inputData = document.querySelector('.todo-app__input');
const submitButton = document.querySelector('.todo-app__submit-button');
const allFilter = document.querySelectorAll('.todo-app__filter-button')[0];
const activeFilter = document.querySelectorAll('.todo-app__filter-button')[1];
const completedFilter = document.querySelectorAll('.todo-app__filter-button')[2];
const taskListContainer = document.querySelector('.todo-app__task-list');
const deleteButton = document.querySelector('.delete-button');
const totalTaskCount = document.querySelector('.todo-app__task-total');
const activeTaskCount = document.querySelector('.todo-app__task-active');
const completedTaskCount = document.querySelector('.todo-app__task-completed');


// local storage
function saveToStorage(){
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }catch(err){
    console.log('Gagal menyimpan ke local storage', err);
  }
}

function loadStorage(){
  try{
    const stored = localStorage.getItem(STORAGE_KEY);
    return JSON.parse(stored ?? '[]');

  }catch(err){
    console.log('Gagal memuat localstorage', err);
    return [];
  }
}

//counter id
function nextId(){
  const maxId = todos.length > 0 ? Math.max(...todos.map(todosValue => todosValue.id)) : 0;
  return maxId + 1;
}


// add new Task
function addTodo(taskValue){
  if(!taskValue.trim()){
    alert("input tidak boleh kosong");
    return;
  }

  const newTodo = {
    id: uniqueId++,
    text: taskValue.trim(),
    isCompleted: false,
    createdAt : new Date().toLocaleDateString('id-ID')
  };

  todos.push(newTodo);

  saveToStorage();
  renderTodos();

  inputData.value = "";

}


// delete todo
function deleteTodo(id){
  todos = todos.filter(item => item.id !== id);
  saveToStorage();
  renderTodos();
}

// change filter value
function setFilter(filter){
  currentFilter = filter;
  renderTodos();
}

// get filtered todo
function getFilteredTodos(){
  switch(currentFilter){
    case 'active':
      return todos.filter(item => !item.isCompleted);

    case 'completed':
      return todos.filter(item => item.isCompleted);

    default:
      return todos; 
  }
}

// render list of todo
function renderTodos(){
  const filteredData = getFilteredTodos();
  filterHover()
  //reset todos
   taskListContainer.innerHTML = '';

   if (filteredData.length === 0){
    const noTask = document.createElement('div');
    noTask.className = 'todo-app__no-task';
    noTask.innerHTML = `
        <img src="./assets/img/to-do-list.png" alt="no task" class="todo-app__no-task-logo">
        <div class="todo-app__no-task-description">
          <h3 class="todo-app__no-task-title">
            ${currentFilter === "all" ? "no task yet" : 
              currentFilter === "active" ? "no active task yet" : "no completed task yet"}
          </h3>
          <p>
          ${currentFilter === "all" || currentFilter === "active" ? "Add a new task to get started!" :
            "add a completed task to see the list"
          }
          </p>
        </div>
    `;
    
    countTodos();

    taskListContainer.appendChild(noTask);

    return;
   }

  // loop for the new todos 
  filteredData.forEach(todo => {
    const todoItem = document.createElement('div');
    todoItem.className = `todo-item ${todo.isCompleted ? 'completed' : ''}`;
    todoItem.innerHTML = `
        <input type="checkbox" class="check-btn" ${todo.isCompleted ? 'checked' : ''} onclick="toggleTodo(${todo.id})">
        <span class="todo-text ${todo.isCompleted ? 'completed' : ''}">${todo.text}</span>
        <span class="todo-date">${todo.createdAt}</span>
        <button class="delete-button" onclick="deleteTodo(${todo.id})">x</button>
    `;

    taskListContainer.appendChild(todoItem);
  });

  countTodos();
}

// change condition todo (active/completed)
function toggleTodo(id){
  const todo = todos.find(item => item.id === id);

  if(todo){
    todo.isCompleted = !todo.isCompleted;

    saveToStorage();
    renderTodos();
  }
}

// total all, active, and completed
function countTodos(){
  let activeTodos = todos.filter(item => !item.isCompleted).length;
  let compeletedTodos = todos.filter(item => item.isCompleted).length;
  let allTodos = todos.filter(item => true).length;

  totalTaskCount.textContent = allTodos;
  activeTaskCount.textContent = activeTodos;
  completedTaskCount.textContent = compeletedTodos;
}

// filter condition
function filterHover(){
  allFilter.classList.remove("currentFilter");
  activeFilter.classList.remove("currentFilter");
  completedFilter.classList.remove("currentFilter");

  if(currentFilter === "all"){
    allFilter.classList.add("currentFilter");
  }else if(currentFilter === "active"){
    activeFilter.classList.add("currentFilter");
  }else{
    completedFilter.classList.add("currentFilter");
  }
}

// Event listener

// add new task
submitButton.addEventListener('click', () => {
  addTodo(inputData.value);
});

// filter button
allFilter.addEventListener('click', () => setFilter('all'));
activeFilter.addEventListener('click', () => setFilter('active'));
completedFilter.addEventListener('click', () => setFilter('completed'));

//default condition
renderTodos();
