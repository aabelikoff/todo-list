import {format, parse, formatDistance, subDays} from 'date-fns'
import uk from 'date-fns/locale/uk';
class Task {
    constructor (taskForm){
        this.title = taskForm.title;
        this.description = taskForm.description;
        this.dueDate = taskForm.dueDate;
        this.fromDate = format(new Date(),'yyyy-MM-dd');
        this.priority = taskForm.priority;
        this.id = format(new Date(),'T');
        this.complete = taskForm.complete === 'true' ? true : false;
        this.project = taskForm.project === undefined ? '' : taskForm.project;
    }

    changeTask (taskForm){
        for (let key in taskForm){
            this[key] = taskForm[key];
        }
    }

    getTaskObjByKey = function (key, value){
        return this[key] === value ? this : false;
    }

    getTaskObj = function (value){
        for (let key in this) {
            if (this[key] === value){
                return this.task;
            }
        }
    }
}

export default Task;
