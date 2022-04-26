import elements from './elements';

const forms = (function () {
    //Возвращает объект из формы задачи
    const getTaskForm = function () {
        return Array.from(document.querySelectorAll('#taskForm input')).reduce((objForm, input) =>
            Object.assign(objForm, { [input.id]: input.value })
            , {});
    }
    //Заполняет форму задачи из объекта task
    const setTaskForm = function (task) {
        Array.from(document.querySelectorAll('#taskForm input')).reduce((acc, input) => {
            input.value = task[input.id];
        }, 0);
    }

    const getSelectedOption = (opt) => {
        if (opt === elements.constants.selectProject && opt.selectedIndex <= 0) {
            return '';
        }
        else {
            return opt[opt.selectedIndex].value;
        }
    }
    //Getting an object with key "project name" and its value from task form
    const getProjOption = function () {
        let projName = elements.constants.selectProject.options[elements.constants.selectProject.selectedIndex].value;
        return { project: projName }
    }
    //Selects proper project name in task form fo existing tasks
    const selectProjOption = function (task) {
        let select = Array.from(elements.constants.selectProject.options);
        select.reduce((projName, elem, index) => {
            if (elem.value === projName) {
                elem.selected = true;
            }
            else {
                elem.selected = false;
            }
        }, task.project);
    }
    //Очищает форму задачи
    const clearTaskForm = function () {
        Array.from(document.querySelectorAll('#taskForm input')).reduce((acc, input) => {
            input.value = '';
            if (input === elements.constants.inputTitle || input === elements.constants.inputDueDate){
                if (!input.validity.valid){
                    input.nextElementSibling.textContent = '';
                    input.nextElementSibling.className = 'error';
                }
            }
        }, 0)
    }
    //Закрывает форму задачи
    function taskFormCancel() {
        elements.constants.taskPopup.setAttribute('status', '');
        clearTaskForm();
        elements.hidePopUp(elements.constants.taskPopup);
        return;
    }
    //Получение имени фомы проекта
    const getProjForm = () => {
        return elements.constants.projName.value;
    }
    //Заполнение формы проекта
    const setProjForm = (name) => {
        elements.constants.projName.value = name;
    }
    //Закрывает форму проектаа
    function projFormCancel() {
        elements.constants.projPopUp.setAttribute('status', '');
        elements.constants.projName.value = '';
        elements.hidePopUp(elements.constants.projPopUp);
        return;
    }
    //tas
    function validateForm (inputCollection){
        return Array.from(inputCollection).reduce((val,input)=>{
            if(input.validity.valueMissing || input.validity.rangeUnderFlow){
                val = false;
            }
            return val;
        },true);
    }

    return { getTaskForm, setTaskForm, clearTaskForm, getProjForm, setProjForm, projFormCancel, 
             taskFormCancel, getSelectedOption, validateForm }

})();

export default forms;
