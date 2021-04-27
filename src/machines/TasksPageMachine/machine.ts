import { MachineConfig, MachineOptions } from 'xstate';
import * as actions from './actions';
import * as guards from './guards';
import { TasksEvents, BOOT } from './events';
import {
  MAIN_VIEW_STATE,
  MAIN_VIEW_STARTUP_STATE,
  HAS_TODAY_ONLY_TASKS_STATE,
  HAS_OVERDUE_ONLY_TASKS_STATE,
  HAS_OVERDUE_AND_TODAY_TASKS_STATE,
  HAS_NO_TASKS_STATE,
  ADD_NEW_TASK_STATE,
  MODAL_VIEW_STATE,
  EDIT_EXISTING_TASK_STATE
} from './stateKeys';
import { TasksContext } from './context';
import contextInitialState from './contextInitialState';
import { TasksStateSchema } from './states';
import {
  hasNoOverdueAndSomeToday,
  hasSomeOverdueAndNoToday,
  hasSomeOverdueAndSomeToday,
  hasNoOverdueAndNoToday
} from './guards';

export function createMachineConfig(
  context?: Partial<TasksContext>
): MachineConfig<TasksContext, TasksStateSchema, TasksEvents> {
  return {
    id: 'todos',
    initial: MAIN_VIEW_STATE,
    context: context
      ? {
          ...contextInitialState,
          ...context
        }
      : contextInitialState,
    states: {
      [MAIN_VIEW_STATE]: {
        id: `${MAIN_VIEW_STATE}Id`,
        initial: MAIN_VIEW_STARTUP_STATE,
        states: {
          [MAIN_VIEW_STARTUP_STATE]: {
            on: {
              [BOOT]: [
                {
                  target: HAS_TODAY_ONLY_TASKS_STATE,
                  cond: hasNoOverdueAndSomeToday
                },
                {
                  target: HAS_OVERDUE_ONLY_TASKS_STATE,
                  cond: hasSomeOverdueAndNoToday
                },
                {
                  target: HAS_OVERDUE_AND_TODAY_TASKS_STATE,
                  cond: hasSomeOverdueAndSomeToday
                },
                {
                  target: HAS_NO_TASKS_STATE,
                  cond: hasNoOverdueAndNoToday
                }
              ]
            }
          },
          [HAS_NO_TASKS_STATE]: {},
          [HAS_TODAY_ONLY_TASKS_STATE]: {},
          [HAS_OVERDUE_ONLY_TASKS_STATE]: {},
          [HAS_OVERDUE_AND_TODAY_TASKS_STATE]: {}
        },
        on: {
          COMPLETE_TASK: {
            actions: ['completeTask', 'saveTaskListToLocalStorage'],
            target: `${MAIN_VIEW_STATE}.${MAIN_VIEW_STARTUP_STATE}`
          },
          DELETE_TASK: {
            actions: ['deleteTask', 'saveTaskListToLocalStorage'],
            target: `${MAIN_VIEW_STATE}.${MAIN_VIEW_STARTUP_STATE}`
          },
          SHOW_EDIT_TASK: {
            actions: ['addTaskIdToContext'],
            target: `${MODAL_VIEW_STATE}.${EDIT_EXISTING_TASK_STATE}`
          },
          SHOW_ADD_TASK: `${MODAL_VIEW_STATE}.${ADD_NEW_TASK_STATE}`
        }
      },
      [MODAL_VIEW_STATE]: {
        states: {
          [EDIT_EXISTING_TASK_STATE]: {},
          [ADD_NEW_TASK_STATE]: {}
        },
        on: {
          ADD_TASK: {
            actions: ['addTask', 'saveTaskListToLocalStorage'],
            target: [MAIN_VIEW_STATE]
          },
          EDIT_TASK: {
            actions: ['editTask', 'saveTaskListToLocalStorage'],
            target: [MAIN_VIEW_STATE]
          },
          CLOSE_ADD_EDIT_TASK_MODAL: {
            target: [MAIN_VIEW_STATE]
          }
        }
      }
    }
  };
}

export function createDefaultMachineOptions(): Partial<MachineOptions<TasksContext, TasksEvents>> {
  return {
    actions,
    guards
  };
}

export default createMachineConfig;
