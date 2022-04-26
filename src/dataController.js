import elements from './elements';
import storage from './storage';
import Task from './task';
import Project from './project';
import forms from './forms';
import { format, formatDistanceToNow, parse } from 'date-fns';

const dataController = (function(){
    let projContainer = [];
    //Searching for available storage
    if(storage.availableStorage()){
        projContainer = storage.loadProjContainer();
    }
    else {
        projContainer.push(new Project('Inbox'));
        storage.backupProjContainer(projContainer);
    }
    
    const inbox = projContainer[0];
    //Find the time left for end of task
    const timeLeftStr = (task) =>{
        if (task.dueDate !== ''){
            return formatDistanceToNow(parse(task.dueDate,  'yyyy-MM-dd', new Date()),{includeSeconds: false, addSuffix: true});
        }
    }
   //Создает новую задачу и добавляет в нулевой проект Инбокс 
    const createTask = (objForm) =>{
        let newTask = new Task(objForm);
        let projName = forms.getSelectedOption(elements.constants.selectProject);
        if (projName !== ''){
            newTask.project = projName;
            addTaskToProject(newTask,projName);
        }
        newTask.priority = forms.getSelectedOption(elements.constants.selectPriority);
        inbox.addTask(newTask);
        storage.taskSaver(newTask);
        storage.tasksIdSaver(inbox);
        return newTask;
    }
    //Удаляет задачу
    const deleteTask = (key, value) =>{
        storage.taskRemover(inbox.findTaskByKey(key,value));
        projContainer.reduce((ind, proj) => {
            ind = proj.findTaskIndexByKey(key, value);
            proj.remTask(ind);
        },0);
    }
    
    const deleteTasks = (key, value) =>{
        projContainer.reduce((ind, proj)=>{
            proj.remTasks(key,value);
            ind++;
        },0);
    }

    const setComplete = (id,value) =>{
        let task = inbox.findTaskByKey('id',id);
        task.complete = value;
        storage.taskSaver(task);
    }
    //редактор задачи
    const editTask = (key,value) =>{
        let task = inbox.findTaskByKey(key,value);
        
        let objForm = forms.getTaskForm();
        
        objForm.priority = forms.getSelectedOption(elements.constants.selectPriority);
        let projName = forms.getSelectedOption(elements.constants.selectProject);
        objForm.project = projName;
        task.changeTask(objForm);
        if (projName !== ''){
            addTaskToProject(task,projName);
        }
        storage.taskSaver(task);
    }

    const editTasks = (key, oldValue, newValue) => {
        inbox.taskList.reduce((ind, elem) => {
            if(elem[key] === oldValue){
                elem[key] = newValue;
                storage.taskSaver(elem);//в случае еcли не меняется id задачи
            }  
        },0);
    }

    const addProject = ()=>{
        projContainer.push(new Project(forms.getProjForm()));
        storage.projectSaver(projContainer);
    }
    
    const addTaskToProject = (task,name)=>{
        task.project = name;
        findProject(name).addTask(task);
        storage.taskSaver(task);
    }

    const findProject = (value = "Inbox") =>{
        return projContainer.find(elem => {return elem.name === value});
    }

    const findProjectIndex = (pName) =>{
        return projContainer.findIndex((elem) => {return elem.name === pName;});
    }

    const editProject = (oldName) =>{
        let newName = forms.getProjForm();
        findProject(oldName).name = newName;
        editTasks('project',oldName, newName);
        storage.projectSaver(projContainer);
    }

    const deleteProject = (name) =>{
        storage.projectRemover(findProject(name));
        projContainer.splice(findProjectIndex(name),1);
        deleteTasks('project', name);
    }

    const filterTodayTask = () =>{
        let dateStr = format(new Date(),'yyyy-MM-dd');
        return inbox.taskList.filter(task => task.dueDate === dateStr);
    }
        
    return {
        projContainer, inbox, createTask, addProject, findProject, addTaskToProject, deleteTask,
        editTask, editProject, findProjectIndex, deleteTasks, deleteProject, setComplete, filterTodayTask,
        timeLeftStr
    }

})();

export default dataController;