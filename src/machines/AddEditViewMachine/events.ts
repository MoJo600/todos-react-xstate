export const CHANGE_TASK_NAME = 'CHANGE_TASK_NAME';
export const CHANGE_TASK_DATE = 'CHANGE_TASK_DATE';

export type CHANGE_TASK_NAME = typeof CHANGE_TASK_NAME;
export type CHANGE_TASK_DATE = typeof CHANGE_TASK_DATE;

export const TRANSITION_IF_VALID = 'TRANSITION_IF_VALID';
export type TRANSITION_IF_VALID = typeof TRANSITION_IF_VALID;

export const TRANSITION_IF_INVALID = 'TRANSITION_IF_INVALID';
export type TRANSITION_IF_INVALID = typeof TRANSITION_IF_INVALID;

export const BOOT = '';
export type BOOT = typeof BOOT;

export const FINISH_ADDING_TASK = 'FINISH_ADDING_TASK';
export type FINISH_ADDING_TASK = typeof FINISH_ADDING_TASK;

export type Events =
  | CHANGE_TASK_DATE
  | CHANGE_TASK_NAME
  | TRANSITION_IF_VALID
  | TRANSITION_IF_INVALID
  | BOOT
  | FINISH_ADDING_TASK

export interface IAddEditTasksEvents {
  type: Events;
  data?: any;
}
