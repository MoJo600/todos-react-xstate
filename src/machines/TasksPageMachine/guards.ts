import { TasksContext } from './context';
import { TasksEvents } from './events';
import moment from 'moment';

export const hasOverdueTodos = (context: TasksContext): boolean => {
  return (
    context.allTasks.filter((todo) => {
      return moment(todo.due).isBefore(context.todayDate, 'day') && !todo.completed;
    }).length > 0
  );
};

export const hasTodayTodos = (context: TasksContext): boolean => {
  return (
    context.allTasks.filter((todo) => {
      return moment(todo.due).isSame(context.todayDate, 'day') && !todo.completed;
    }).length > 0
  );
};

export const hasNoOverdueAndSomeToday = (context: TasksContext, event: TasksEvents) => {
  return !hasOverdueTodos(context) && hasTodayTodos(context);
};

export const hasNoOverdueAndNoToday = (context: TasksContext, event: TasksEvents) => {
  return !hasOverdueTodos(context) && !hasTodayTodos(context);
};

export const hasSomeOverdueAndSomeToday = (context: TasksContext, event: TasksEvents) => {
  return hasOverdueTodos(context) && hasTodayTodos(context);
};

export const hasSomeOverdueAndNoToday = (context: TasksContext, event: TasksEvents) => {
  return hasOverdueTodos(context) && !hasTodayTodos(context);
};
