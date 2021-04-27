import { IAddEditContext } from './context';
import { IAddEditTasksEvents } from './events';

export const isTaskValid = (context: IAddEditContext, event: IAddEditTasksEvents) => {
  return context.validations.length === 0;
};

export const isTaskNotValid = (context: IAddEditContext, event: IAddEditTasksEvents) => {
  return !isTaskValid(context, event);
};

export const isAddTaskView = (context: IAddEditContext, event: IAddEditTasksEvents) => {
  return context.due === '' && context.text === '';
};

export const isEditTaskView = (context: IAddEditContext, event: IAddEditTasksEvents) => {
  return !isAddTaskView(context, event);
};
