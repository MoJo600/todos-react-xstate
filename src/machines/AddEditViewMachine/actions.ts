import { actions } from 'xstate';
import { IAddEditContext } from './context';
import { IAddEditTasksEvents, TRANSITION_IF_VALID, TRANSITION_IF_INVALID } from './events';

export const resetModalState = actions.assign<IAddEditContext, IAddEditTasksEvents>((ctx, _) => {
  return {
    text: '',
    due: ''
  };
});

export const changeTaskName = actions.assign<IAddEditContext, IAddEditTasksEvents>((ctx, event) => {
  console.log('changing task name!!!', ctx, event);
  return {
    text: event.data
  };
});

export const updateModalWithTaskData = actions.assign<IAddEditContext, IAddEditTasksEvents>(
  (ctx, event: IAddEditTasksEvents) => {
    return {
      text: event.data.text,
      due: event.data.text
    };
  }
);

export const transitionIfValidTask = actions.send<IAddEditContext, IAddEditTasksEvents>(
  TRANSITION_IF_VALID
);

export const transitionIfInValidTask = actions.send<IAddEditContext, IAddEditTasksEvents>(
  TRANSITION_IF_INVALID
);

export const changeTaskDate = actions.assign<IAddEditContext, IAddEditTasksEvents>((ctx, event) => {
  console.log('changing task date!!!', ctx, event);
  return {
    due: event.data
  };
});

export const validateTask = actions.assign<IAddEditContext, IAddEditTasksEvents>((ctx, _) => {
  let validations: Array<'INVALID_NAME' | 'INVALID_DATE'> = [];
  if (ctx.due === undefined || ctx.due === '') {
    validations.push('INVALID_DATE');
  }
  if (ctx.text === undefined || ctx.text.length === 0) {
    validations.push('INVALID_NAME');
  }
  return {
    validations
  };
});
