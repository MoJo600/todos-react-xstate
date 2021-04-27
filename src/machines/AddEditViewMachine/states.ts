export interface IAddEditStateSchema {
  states: {
    editingTask: {
      states: {
        startup: {};
        invalidTask__showValidations: {};
        invalidTask: {};
        validTask: {};
      };
    };
    editingTaskDone: {};
  };
}
