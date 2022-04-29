import iconInbox from './icons/icons8-inbox-50.png';
import iconCalendar from './icons/icons8-calendar-64.png';
import iconProjects from './icons/icons8-calendar-66.png';
import iconPlus from './icons/icons8-plus-48.png';
import iconChevronDown from './icons/icons8-chevron-down-30.png';
import iconEdit from './icons/icons8-edit-30.png';
import iconTrash from './icons/icons8-trash-24.png';
import iconChevron from './icons/icons8-chevron-up-30.png';
import iconLogo from './icons/logo.png';
import './styles/style.css';
import { format } from 'date-fns';

class Elements {
  static createHeader () {
    let div = document.createElement('div');
    div.classList.add('header');
    div.innerHTML = `<div class="logo"><a href="#"><img src="${iconLogo}"/></a><div>`;
    div.appendChild(Elements.createRoundPlus());
    return div;
  }

  static createPanel () {
    let div = document.createElement('div');
    div.classList.add('panel');
    div.innerHTML =
        `<ul>
            <li id="inbox"><a href="#"><img src="${iconInbox}"/>Inbox</a></li>
            <li id="today"><a href="#"><img src="${iconCalendar}"/>Today<span id="curDate"></span><span id="curDay"></span></a></li>
            <li id="projects"><a href="#"><img src="${iconProjects}"/>Projects<img id="iconChevron"src="${iconChevronDown}"/></a>
                <ul id="projList"></ul>
            </li>
            <li id="newProject"><a href="#"><img src="${iconPlus}"/>New Project</a></li>
        </ul>`;
    return div;
  }

  static createTaskField () {
    let div = document.createElement('div');
    div.classList.add('tasks');
    return div;
  }

  static createAddTask () {
    let div = document.createElement('div');
    div.classList.add('plus');
    div.setAttribute('id', 'addTask');
    return div;
  }

  static createContent () {
    let div = document.createElement('div');
    div.classList.add('content');
    div.appendChild(Elements.createPanel());
    div.appendChild(Elements.createTaskField());
    return div;
  }

  static createRoundPlus () {
    let div = document.createElement('div');
    div.setAttribute('id', 'addtask');
    div.classList.add('round');
    div.innerHTML = '<a href="#"></a>';
    return div;
  }

  static createProjPopup() {
    let div = document.createElement('div');
    div.classList.add('projPopup');
    div.innerHTML = `<p>Enter project name:</p>
        <form name="projname" id="projname">
            <input type="text" id="name" name="name" size="25" placeholder="Project name" required value="">
        <div>
        <button id="projSubmit">Submit</button>
        <button id="projCancel">Cancel</button>
        </div>
        </form>`;
    div.setAttribute('status', '');
    document.body.appendChild(div);
    return div;
  }

  static createTaskPopup() {
    let div = document.createElement('div');
    div.classList.add('taskPopup');
    let minDate = format(new Date(), 'yyyy-MM-dd');
    div.innerHTML = `<h2>Task form</h2>
        <form id="taskForm" novalidate>
            <div>
                <label for="title">Title:</label>
                <input type="text" id="title" name="title" size="25" maxlength="25" placeholder="Title" required value="">
                <span class="error" aria-live="polite"></span>
            </div>
            <div>
                <label for="description">Description:</label>
                <input type="textarea" id="description" name="description" size="25" rows="4" maxlength="100" placeholder="Description" value="">
            </div>
            <div>
                <label for="dueDate">Due date:</label>
                <input type="date" id="dueDate" name="dueDate" size="25" min="${minDate}" placeholder="Due date" required value="">
                <span class="error" aria-live="polite"></span>
            </div>
            <div>
                <label for="priority">Priority:</label>
                <select id='selectPriority' name='selectPriority'>
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                </select>
            </div>
            <div>
                <label for="selectProject">Project:</label>
                <select id='selectProject' name='selectProject'>

                </select>
            </div>
            <div>
                <button id="taskSubmit">Submit</button>
                <button id="taskCancel">Cancel</button>
            <div>
        </form>`;
    document.body.appendChild(div);
    return div;
  }

  showPopUp(node) {
    node.style.display = 'flex';
  }

  hidePopUp(node) {
    node.style.display = 'none';
  }
    
  addIcon (node, icon, cl, attr) {
    let  div = document.createElement('div');
    div.classList.add(cl);
    div.setAttribute('action', attr);
    div.innerHTML = `<a href="#"><img src="${icon}" /></a>`;
    node.appendChild(div);
  }
    
  createTaskDiv (obj) {
    let div = document.createElement('div');

    div.setAttribute('taskId', obj.id);

    div.classList.add('task');
        
    let title = document.createElement('div');
    title.style.cssText = 'width:30%';
    title.textContent = obj.title;
    div.appendChild(title);

    let timeLeft = document.createElement('div');
    timeLeft.style.cssText = 'width: 20%';
    timeLeft.setAttribute('class', 'timeLeft');
    div.appendChild(timeLeft);

    let dueDate = document.createElement('div');
    dueDate.textContent = obj.dueDate;
    dueDate.style.cssText = 'width:30%; text-align: center';
    div.appendChild(dueDate);
        
    this.addIcon(div, iconEdit, 'round', 'edit');
    this.addIcon(div, iconTrash, 'round', 'remove');
             
    let fin = document.createElement('input');
    fin.setAttribute('type', 'checkbox');
    fin.setAttribute('action', 'complete');
    if (obj.complete) {
      fin.setAttribute('checked', 'true');
    }
    div.appendChild(fin);
       
    return div;
  }

  createProjListItem (name) {
    let parentUl = document.querySelector('#projects ul');
    let li = document.createElement('li');
    li.setAttribute('projName', `${name}`);
    li.innerHTML = `<div><a href="#">${name}</a></div>`;
    this.addIcon(li, iconEdit, 'round', 'edit');
    this.addIcon(li, iconTrash, 'round', 'remove');
    parentUl.appendChild(li);
    return li;
  }

  removeProjList () {
    this.constants.projList.innerHTML = '';
  }
  //Change picture above projects list
  changeChevron () {
    if (this.constants.iconChevron.getAttribute('src') === iconChevron) {
      this.constants.iconChevron.setAttribute('src', `${iconChevronDown}`);
      return false;
    }
    else {
      this.constants.iconChevron.setAttribute('src', `${iconChevron}`);
      return true;
    }
  }
  //Opens all projects
  showProjects () {
    this.constants.projList.style.display = !this.changeChevron() ? 'none' : 'block';
  }
  
  init () {
    document.body.appendChild(Elements.createHeader());
    document.body.appendChild(Elements.createContent());
        
    this.hidePopUp(this.constants.projList);
    Elements.createProjPopup();
    Elements.createTaskPopup();
  }

  get constants () {
    const headerElement = document.querySelector('.header');
    const contentElement = document.querySelector('.content');
    const panelElement = document.querySelector('.panel');
    const tasks = document.querySelector('.tasks');
    const inboxElement = document.querySelector('#inbox');
    const todayElement = document.querySelector('#today');
    const projects = document.querySelector('#projects');
    const newProjectElement = document.querySelector('#newProject');
    const addTaskElement = document.querySelector('#addtask');
    const projPopUp = document.querySelector('.projPopup');
    const projName = document.querySelector('#name');
    const projList = document.getElementById('projList');
    const projSubmit = document.getElementById('projSubmit');
    const projCancel = document.getElementById('projCancel');
    const iconChevron = document.querySelector('#iconChevron');
    const taskForm = document.getElementById('taskForm');
    const taskSubmit = document.getElementById('taskSubmit');
    const taskCancel = document.getElementById('taskCancel');
    const taskPopup = document.querySelector('.taskPopup');
    const selectProject = document.getElementById('selectProject');
    const selectPriority = document.getElementById('selectPriority');
    const inputTitle = document.querySelector('#title');
    const errorTitle = document.querySelector('#title + span.error');
    const inputDueDate = document.querySelector('#dueDate');
    const errorDueDate = document.querySelector('#dueDate + span.error');
    const curDate = document.querySelector('#curDate');
    const curDay = document.querySelector('#curDay');
    
    return {
      headerElement, contentElement, panelElement, tasks,
      inboxElement, todayElement, projects, newProjectElement,
      addTaskElement, projPopUp, projName, projList, projSubmit,
      projCancel, iconChevron, taskForm, taskSubmit, taskCancel,
      taskPopup, selectProject, selectPriority, inputTitle, inputDueDate,
      errorDueDate, errorTitle, curDate, curDay
    };
  }
}

let elements = new Elements();

export default elements;
