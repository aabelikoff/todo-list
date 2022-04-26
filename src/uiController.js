import elements from './elements';
import dataController from './dataController';
import forms from './forms';
import {format} from 'date-fns';

elements.init();

const uiController = (function(){
    let oldName = '';//содержит старое имя проекта
    let currentId='';//содержит id редактируемого задания
    
    const isEmptyField = (node) =>{
        return node.value === '';
    }
    //Очищает поле со списком заданий
    const clearTasks = () =>{
        elements.constants.tasks.innerHTML = '';
    }
    //Вставляет обработчики событий в отдельно взятом элементе (редактирование, удаление, отметка о выполнении)
    const taskControlsEvents = (taskDiv) => {
        taskDiv.addEventListener('mouseover',divLarger);
        taskDiv.addEventListener('mouseout',divSmaller);
        let subs = Array.from(taskDiv.children);
        subs.reduce((acc,elem,ind)=>{
            switch (elem.getAttribute('action')){
                case 'edit':
                    elem.addEventListener('click', function(){
                        currentId = this.parentElement.getAttribute('taskid');
                        createOptionList();
                        setPrioritySelectedIndex(currentId);
                        setProjectSelectedIndex(parseInt(currentId,10));
                        forms.clearTaskForm();
                        forms.setTaskForm(dataController.inbox.findTaskByKey('id',currentId));
                        elements.showPopUp(elements.constants.taskPopup);
                        elements.constants.taskPopup.setAttribute('status','edit');
                    });
                    break;
                case 'remove':
                    elem.addEventListener('click',function(){
                        let taskId = this.parentElement.getAttribute('taskid');
                        dataController.deleteTask('id',taskId);
                        showTasks();
                    });
                    break;
                case 'complete':
                    elem.addEventListener('change', function (e){
                        let taskId = this.parentElement.getAttribute('taskid');
                        let val = e.target.checked;
                        dataController.setComplete(taskId,val);
                        changeTaskColour();
                    });
            }
        },0);
    }

    const changeTaskColour = () =>{
        let taskDivs = Array.from(document.querySelectorAll('.task'));
        taskDivs.forEach(div => {
            let taskid = div.getAttribute('taskid');
            let task = dataController.inbox.findTaskByKey('id', taskid);
            div.setAttribute('class','task');
            if(task.complete) {div.classList.add('completed'); return;};
            div.classList.add(task.priority);
        })
    }
    //Обработчик события окна формы задания (сабмит)    
    const createTask = () => { //
        let status = elements.constants.taskPopup.getAttribute('status');//в зависимости от статуса- редактирование или добавление
        if (!forms.validateForm(document.querySelectorAll('#taskForm input'))){return;};
        if (status === 'add'){
            dataController.createTask(forms.getTaskForm());
        }
        else if(status === 'edit'){
            dataController.editTask('id',currentId);
            currentId = '';
        }
        clearTasks();
        showTasks();
        forms.taskFormCancel();
    }
    //Связывает поиск проекта и вывод его задач
    const showTasks = ( pName = 'Inbox') =>{
        clearTasks();
        let proj = dataController.projContainer[dataController.findProjectIndex(pName)];
        proj.taskList.reduce((acc,task) =>{
            let taskDiv = elements.createTaskDiv(task);
            taskDiv.childNodes[1].textContent= 'expires '+ dataController.timeLeftStr(task);
            taskControlsEvents(taskDiv);
            elements.constants.tasks.appendChild(taskDiv);
        },0)
        changeTaskColour();
    }
    showTasks();
    //Creates available list of projects in taskform
    const createOptionList = () => {
        removeOptionList();
        dataController.projContainer.reduce((opt, proj, ind)=>{
            elements.constants.selectProject.add(new Option(proj.name, proj.name));
        },null)
    }
 
    const removeOptionList = () =>{
        elements.constants.selectProject.innerHTML = '';
    }

    const setProjectSelectedIndex = (id)=>{
        let projName = dataController.inbox.findTaskByKey('id',`${id}`).project;
        let ind = dataController.projContainer.reduce((acc, proj, index) =>{
            if (proj.name === projName){ 
                acc = index; 
            }
            return acc;
        },0);
        elements.constants.selectProject.selectedIndex = ind;
        return ind;
    }

    const setPrioritySelectedIndex = (id) =>{
        let prior = dataController.inbox.findTaskByKey('id',`${id}`).priority;
        let ind = Array.from(elements.constants.selectPriority.options).findIndex(opt => {return opt.value === prior});
        if (ind >=0){
            elements.constants.selectPriority.selectedIndex = ind;
        }
        else {
            elements.constants.selectPriority.selectedIndex = 0;
        }
        return ind;
    }

    const getSelectedIndex = ()=>{
        let opt = Array.from(elements.constants.selectProject.options);
        return opt.selectedIndex;
    }

    const createProjList = () =>{
        dataController.projContainer.reduce((li,proj,ind)=>{
            if (ind === 0) return;
            li = elements.createProjListItem(proj.name);
            let chDivs = Array.from(li.children);
            chDivs[2].addEventListener('click',function(){
                removeProject(li.getAttribute('projName'));
            });
            chDivs[1].addEventListener('click', function(){
                oldName = elements.constants.projName.value = this.parentElement.getAttribute('projname');
                elements.showPopUp(elements.constants.projPopUp);
                elements.constants.projPopUp.setAttribute('status','edit');
            }); 
            chDivs[0].addEventListener('click', function(){
                let projName = this.parentElement.getAttribute('projname');
                showTasks(projName);
            });//write a function to show only tasks belonged to this proj.    
        },null)
    }
    createProjList();
       
    function removeProject (name) {
        dataController.deleteProject(name);
        elements.removeProjList(dataController.findProject(name));
        createProjList();
        showTasks();
    }

    function projSubmit (){
        if (isEmptyField(elements.constants.projName)) {
            elements.constants.projName.setCustomValidity("Project name must be entered!");
            return;
        };
        
        if (elements.constants.projPopUp.getAttribute('status') === 'add'){
            dataController.addProject();
        }
        else if(elements.constants.projPopUp.getAttribute('status') === 'edit'){
            dataController.editProject(oldName);
        }
        elements.removeProjList.call(elements);
        createProjList();
        forms.projFormCancel();
    }
    //Shows filtered task by date
    function showFilteredTodayTask (){
        clearTasks();
        let filteredTasks = dataController.filterTodayTask();
        filteredTasks.forEach((task) =>{
            let taskDiv = elements.createTaskDiv(task);
            taskControlsEvents(taskDiv);
            taskDiv.childNodes[1].textContent= 'expires '+ dataController.timeLeftStr(task);
            elements.constants.tasks.appendChild(taskDiv);
        });
        changeTaskColour();
    }

    function showCurDate (){
        let dateStr = format(new Date(), 'dd-MM-yyyy');
        let day = dateStr.split('-')[0];
        elements.constants.curDay.textContent = day;
        elements.constants.curDate.textContent = dateStr;
    }
    showCurDate();

    function showError(){
        if(elements.constants.inputTitle.validity.valueMissing){
            elements.constants.errorTitle.textContent = "Missing value!";
            elements.constants.errorTitle.className = 'error active';
        }
        if(elements.constants.inputDueDate.validity.valueMissing){
            elements.constants.errorDueDate.textContent = "Missing value!";
            elements.constants.errorDueDate.className = 'error active';
        }
        else if(elements.constants.inputDueDate.validity.rangeUnderflow){
            elements.constants.errorDueDate.textContent = "Incorrect value!";
            elements.constants.errorDueDate.className = 'error active';
        } 
    }
    function divLarger (){
        this.classList.remove('smaller');
        // this.removeAttribute('class');
        this.classList.add('larger');
    }

    function divSmaller (){
        this.classList.remove('larger');
        // this.removeAttribute('class');
        this.classList.add('smaller');
    }

    function iconLarger (){
        this.removeAttribute('class');
        this.classList.add('larger');
    }

    function iconSmaller (){
        this.removeAttribute('class');
        this.classList.add('smaller');
    }
    //Eventlisteners
    
    elements.constants.curDay.addEventListener('mouseover',function(){
        iconLarger.call(this.parentElement.children[0]);
    });

    elements.constants.curDay.addEventListener('mouseout',function(){
        iconSmaller.call(this.parentElement.children[0]);
    });

    Array.from(document.querySelectorAll('.panel ul li a img')).forEach(elem=>{
        if(elem !== document.querySelector('#newProject a img')){
            elem.addEventListener('mouseover', iconLarger);
            elem.addEventListener('mouseout', iconSmaller);
        }
    });
    
    elements.constants.iconChevron.addEventListener('click', () => elements.showProjects.call(elements));
    
    elements.constants.newProjectElement.addEventListener('click', ()=>{
        elements.constants.projPopUp.setAttribute('status','add');
        elements.hidePopUp(elements.constants.taskPopup);
        elements.showPopUp(elements.constants.projPopUp);
    });

    document.querySelector('#newProject a img').addEventListener('mouseover', function(event){
        event.target.removeAttribute('class');
        event.target.classList.add('rotated');
        
    });

    document.querySelector('#newProject a img').addEventListener('mouseout', function(event){
        event.target.classList.add('antirotated');
    });

    elements.constants.projSubmit.addEventListener('click', projSubmit);
    
    elements.constants.projCancel.addEventListener('click',forms.projFormCancel);

    elements.constants.addTaskElement.addEventListener('click',function(){
        forms.clearTaskForm();
        elements.constants.taskPopup.setAttribute('status','add');
        createOptionList();
        elements.hidePopUp(elements.constants.projPopUp);
        elements.showPopUp(elements.constants.taskPopup);
    });

    elements.constants.taskSubmit.addEventListener('click',createTask);

    elements.constants.projName.addEventListener('input', function(event){
        if(event.target.validity.valueMissing){
            event.target.setCustomValidity("Project name must be entered!");
        }
        else{
            event.target.setCustomValidity("");
        }
    });

    elements.constants.taskCancel.addEventListener('click',forms.taskFormCancel);

    elements.constants.inboxElement.addEventListener('click',()=>{showTasks();});

    elements.constants.todayElement.addEventListener('click', showFilteredTodayTask);
    
    document.querySelector('#title').addEventListener('input',function (event){
        if(elements.constants.inputTitle.validity.valid){
            elements.constants.errorTitle.textContent = '';
            elements.constants.errorTitle.className = 'error';
        }
        else{
            showError();
        }
    });

    elements.constants.taskForm.addEventListener('submit', function (event){
        if (!elements.constants.inputTitle.validity.valid || !elements.constants.inputDueDate.validity.valid ){
            showError();
            event.preventDefault();
        }
    });

    document.querySelector('#dueDate').addEventListener('input',function (event){
        if(elements.constants.inputDueDate.validity.valid){
            elements.constants.errorDueDate.textContent = '';
            elements.constants.errorDueDate.className = 'error';
        }
        else{
            showError();
        }
    });
    return {showTasks, createProjList, createOptionList}
})();

export default uiController;