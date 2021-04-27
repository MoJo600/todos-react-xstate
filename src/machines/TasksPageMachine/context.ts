// machine state

export interface ITodoInfo {
  completed?: boolean;
  text: string;
  due: string;
}

export interface ITodoModel extends ITodoInfo {
  id: string;
}

export interface IUpdateTaskContext {
  taskToUpdateId?: string;
}

export interface TasksContext extends IUpdateTaskContext {
  todayDate: string | number;
  allTasks: Array<ITodoModel>;
}
