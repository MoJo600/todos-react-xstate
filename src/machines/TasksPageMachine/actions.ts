import { TasksContext } from './context';
import { TasksEvents } from './events';
import { SHOW_EDIT_TASK } from './events';
import { actions } from 'xstate';
import { TODOS_LOCAL_STORAGE_KEY } from '~app/constants';

export const addTaskIdToContext = actions.assign<TasksContext, TasksEvents>((_, event) => {
  return {
    taskToUpdateId: event.data
  };
});

export const saveTaskListToLocalStorage = (context: TasksContext, event: TasksEvents) => {
  window.localStorage.setItem(TODOS_LOCAL_STORAGE_KEY, JSON.stringify(context.allTasks));
};

export const addTask = actions.assign<TasksContext, TasksEvents>((ctx, event) => {
  return {
    allTasks: ctx.allTasks.concat([
      {
        id: `new-task-${Date.now()}`,
        ...event.data,
        completed: false
      }
    ])
  };
});

// TODO: check what to do with this
export const editTask = actions.assign<TasksContext, TasksEvents>((ctx, event) => {
  const originalTodo = ctx.allTasks.find((todo) => todo.id === event.data.id);
  const newContext = {
    ...ctx,
    allTasks: ctx.allTasks
      .filter((todo) => todo.id !== event.data.id)
      .concat([
        {
          ...originalTodo,
          ...event.data
        }
      ])
  };
  delete newContext.taskToUpdateId;
  return newContext;
});

export const addEditViewInitialData = (context: TasksContext, event: TasksEvents) => {
  if (event.type === SHOW_EDIT_TASK) {
    return {
      text: event.data.text,
      due: event.data.due,
      id: event.data.id
    };
  }
  return {
    text: '',
    due: ''
  };
};

export const completeTask = actions.assign<TasksContext, TasksEvents>(
  (ctx: TasksContext, event: TasksEvents) => {
    const task = ctx.allTasks.find((todo) => todo.id === event.data);
    if (task) {
      task.completed = !task.completed;
      return {
        allTasks: ctx.allTasks
      };
    }
    return ctx;
  }
);

export const deleteTask = actions.assign<TasksContext, TasksEvents>((ctx, event: TasksEvents) => {
  const task = ctx.allTasks.find((todo) => todo.id === event.data);
  if (task) {
    return {
      allTasks: ctx.allTasks.filter((todo) => todo.id !== task.id)
    };
  }
  return ctx;
});
