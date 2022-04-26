import Task from './task';
import Project from './project';

const storage = (function(){
//Defines if storage available
    function availableStorage (){
        if (!localStorage.length || localStorage.getItem('projects') === null || localStorage.getItem('projects').length === 0){
            return false;
        };
        return true;
    }
//Save task keys in local storage with id item 
    function taskSaver (task){
        localStorage.setItem(`${task.id}`,
        `title:${task.title}#description:${task.description}#dueDate:${task.dueDate}#fromDate:${task.fromDate}#priority:${task.priority}#id:${task.id}#complete:${task.complete}#project:${task.project}`);
    }
//Saves all tasks id in project in taskId key item
function tasksIdSaver (proj){
    localStorage.setItem('tasksId',makeTasksIdString(proj));
}
//removes task data from storage
    function taskRemover (task){
        localStorage.removeItem(`${task.id}`);
        let newStr = localStorage.getItem('tasksId');
        newStr = newStr.replace(`${task.id}`,'');
        newStr = newStr.replace('##','#')
        if (newStr.charAt(newStr.length-1) === '#') {newStr = newStr.slice(0,-1)};
        localStorage.setItem('tasksId',newStr);
    }
//removes project
    function projectRemover (project){
        let newStr = localStorage.getItem('projects')
        newStr = newStr.replace(`${project.name}`,'');
        newStr = newStr.replace('##','#');
        if (newStr.charAt(newStr.length-1) === '#') {newStr = newStr.slice(0,-1)};
        localStorage.setItem('projects', newStr);
        project.taskList.forEach (elem =>{
            taskRemover(elem);
        });
    }
//saves all project names in projects key item
    function projectSaver (projContainer) {
        localStorage.setItem('projects', makeProjNamesString(projContainer));
    }
//creates a string with all task id in project separating them by #
    function makeTasksIdString (project){
        return project.taskList.reduce((string, elem, ind)=>{
            return string+= elem.id + '#';
        },'').slice(0,-1);
    }
//creates a string with all project names
    function makeProjNamesString (projContainer){
        return projContainer.reduce((string,elem,ind)=>{
            return string+= elem.name + '#';
        },'').slice(0,-1);
    }
//extracts pairs of key:value strings into array by splitter symbol
    function arrayOfStrings (string, splitter){
        return string.split(splitter);
    }
//creates an Task using its id
    function loadTaskById (id) {
        let array = arrayOfStrings(localStorage.getItem(id),'#');
        let taskForm = array.reduce((obj,elem)=>{
            let arr = elem.split(':');
            obj[arr[0]] = arr[1];
            return obj;
        },{});
        let task =  new Task(taskForm);
        task.id = id;
        return task;
    }
//creates a project from name
    function loadProject (name){
        return new Project(name);
    }
//loads projContainer from localStorage
    function loadProjContainer(){
        let projContainer = [];
        let projNamesArr = arrayOfStrings(localStorage.getItem('projects'),'#');
        projNamesArr.forEach((elem) => {
            projContainer.push(new Project(elem));
        });
        let tasksIdStr = localStorage.getItem('tasksId');
        if(tasksIdStr === null || !tasksIdStr.length) {return projContainer;}
        
        let tasksIdStrArr = arrayOfStrings(tasksIdStr,'#');
        tasksIdStrArr.forEach((elem)=>{
            let task = loadTaskById(elem);
            projContainer[0].taskList.push(task);
            if (task.project !== ''){
                projContainer.find((elem) => {return elem.name === task.project;}).taskList.push(task);
            }
        });
        return projContainer;
    }
//creates backup of projContainer
    function backupProjContainer (projContainer){
        projectSaver(projContainer);
        tasksIdSaver(projContainer[0]);
        projContainer[0].taskList.forEach(elem=>{
            taskSaver(elem);
        })
    }
    
    return {loadProjContainer, backupProjContainer, availableStorage, taskRemover, projectRemover, taskSaver, tasksIdSaver,
            projectSaver}
})();

export default storage;