export interface TasksStateSchema {
  states: {
    mainView: {
      states: {
        startup: {};
        hasNoTasks: {};
        hasTodayTasksOnly: {};
        hasOverdueTasksOnly: {};
        hasOverdueAndTodayTasks: {};
      };
    };
    modalView: {
      states: {
        editExistingTask: {};
        addNewTask: {};
      };
    };
  };
}
