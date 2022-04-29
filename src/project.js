class Project {
  constructor (name) {
    this.name = name;
    this.taskList = [];
  }

  addTask (task) {
    this.taskList.push(task);
  }

  remTask (index) {
    this.taskList.splice(index, 1);
  }

  remTasks (key, value) {
    let index = this.findTaskIndexByKey(key, value);
    while (index >= 0) {
      this.remTask(index);
      index = this.findTaskIndexByKey(key, value);
    }
  }
    
  findTaskIndexByKey (key, value) {
    return this.taskList.findIndex(elem => { return elem[key] === value; });
  }

  findTaskByKey (key, value) {
    return this.taskList.find(elem => { return elem[key] === value; });
  }

  sortTaskByKey (key, increase = true) {
    this.taskList.sort(function (a, b) {
      if (a[key] < b[key]) {
        return increase ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return increase ? 1 : -1;
      }
      return 0;
    });
  }
}

export default Project;

