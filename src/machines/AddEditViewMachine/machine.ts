import { MachineConfig, Machine } from 'xstate';
import * as actions from './actions';
import * as guards from './guards';
import { IAddEditTasksEvents, BOOT } from './events';

import { IAddEditContext, ITodoData } from './context';
import contextInitialState from './contextInitialState';
import { IAddEditStateSchema } from './states';
import { isTaskValid, isTaskNotValid } from './guards';
import {
  EDITING_TASK_STATE,
  ADD_EDIT_VIEW_STARTUP_STATE,
  VALID_TASK_STATE,
  INAVLID_TASK_STATE,
  INAVLID_TASK_SHOW_VALIDATIONS_STATE,
  EDITING_TASK_FINISHED_STATE
} from './stateKeys';

export const createMachineConfig = (context?: ITodoData): MachineConfig<IAddEditContext, IAddEditStateSchema, IAddEditTasksEvents> => {
  return {
    id: 'addEditView',
    initial: EDITING_TASK_STATE,
    context: context
      ? {
          ...contextInitialState,
          ...context
        }
      : contextInitialState,
    states: {
      [EDITING_TASK_STATE]: {
        id: 'editingTaskId',
        onEntry: ['validateTask'],
        initial: ADD_EDIT_VIEW_STARTUP_STATE,
        states: {
          [ADD_EDIT_VIEW_STARTUP_STATE]: {
            on: {
              [BOOT]: [
                {
                  target: VALID_TASK_STATE,
                  cond: isTaskValid
                },
                {
                  target: INAVLID_TASK_STATE,
                  cond: isTaskNotValid
                }
              ]
            }
          },
          [INAVLID_TASK_SHOW_VALIDATIONS_STATE]: {
            on: {
              CHANGE_TASK_NAME: {
                actions: ['changeTaskName', 'validateTask', 'transitionIfValidTask']
              },
              TRANSITION_IF_VALID: {
                target: [VALID_TASK_STATE],
                cond: isTaskValid
              },
              CHANGE_TASK_DATE: {
                actions: ['changeTaskDate', 'validateTask', 'transitionIfValidTask']
              },
              FINISH_ADDING_TASK: {}
            }
          },
          [INAVLID_TASK_STATE]: {
            on: {
              CHANGE_TASK_NAME: {
                actions: ['changeTaskName', 'validateTask', 'transitionIfValidTask']
              },
              TRANSITION_IF_VALID: {
                target: VALID_TASK_STATE,
                cond: isTaskValid
              },
              CHANGE_TASK_DATE: {
                actions: ['changeTaskDate', 'validateTask', 'transitionIfValidTask']
              },
              FINISH_ADDING_TASK: {
                target: INAVLID_TASK_SHOW_VALIDATIONS_STATE
              }
            }
          },
          [VALID_TASK_STATE]: {
            on: {
              CHANGE_TASK_NAME: {
                actions: ['changeTaskName', 'validateTask', 'transitionIfInValidTask']
              },
              TRANSITION_IF_INVALID: {
                target: INAVLID_TASK_STATE,
                cond: isTaskNotValid
              },
              CHANGE_TASK_DATE: {
                actions: ['changeTaskDate', 'validateTask', 'transitionIfInValidTask']
              },
              FINISH_ADDING_TASK: {
                target: '#editingTaskDone'
              }
            }
          }
        }
      },
      [EDITING_TASK_FINISHED_STATE]: {
        id: 'editingTaskDone',
        type: 'final',
        data: {
          text: (context: IAddEditContext, _: IAddEditTasksEvents) => context.text,
          due: (context: IAddEditContext, _: IAddEditTasksEvents) => context.due
        }
      }
    }
  }
}

export const createMachineOptions = () => {
  return {
    actions,
    guards
  }
}

function machineBuilder(
  context?: ITodoData
): [MachineConfig<IAddEditContext, IAddEditStateSchema, IAddEditTasksEvents>, any] {
  console.log('context initial here', context);
  return [
    {
      id: 'addEditView',
      initial: EDITING_TASK_STATE,
      context: context
        ? {
            ...contextInitialState,
            ...context
          }
        : contextInitialState,
      states: {
        [EDITING_TASK_STATE]: {
          id: 'editingTaskId',
          onEntry: ['validateTask'],
          initial: ADD_EDIT_VIEW_STARTUP_STATE,
          states: {
            [ADD_EDIT_VIEW_STARTUP_STATE]: {
              on: {
                [BOOT]: [
                  {
                    target: VALID_TASK_STATE,
                    cond: isTaskValid
                  },
                  {
                    target: INAVLID_TASK_STATE,
                    cond: isTaskNotValid
                  }
                ]
              }
            },
            [INAVLID_TASK_SHOW_VALIDATIONS_STATE]: {
              on: {
                CHANGE_TASK_NAME: {
                  actions: ['changeTaskName', 'validateTask', 'transitionIfValidTask']
                },
                TRANSITION_IF_VALID: {
                  target: [VALID_TASK_STATE],
                  cond: isTaskValid
                },
                CHANGE_TASK_DATE: {
                  actions: ['changeTaskDate', 'validateTask', 'transitionIfValidTask']
                },
                FINISH_ADDING_TASK: {}
              }
            },
            [INAVLID_TASK_STATE]: {
              on: {
                CHANGE_TASK_NAME: {
                  actions: ['changeTaskName', 'validateTask', 'transitionIfValidTask']
                },
                TRANSITION_IF_VALID: {
                  target: VALID_TASK_STATE,
                  cond: isTaskValid
                },
                CHANGE_TASK_DATE: {
                  actions: ['changeTaskDate', 'validateTask', 'transitionIfValidTask']
                },
                FINISH_ADDING_TASK: {
                  target: INAVLID_TASK_SHOW_VALIDATIONS_STATE
                }
              }
            },
            [VALID_TASK_STATE]: {
              on: {
                CHANGE_TASK_NAME: {
                  actions: ['changeTaskName', 'validateTask', 'transitionIfInValidTask']
                },
                TRANSITION_IF_INVALID: {
                  target: INAVLID_TASK_STATE,
                  cond: isTaskNotValid
                },
                CHANGE_TASK_DATE: {
                  actions: ['changeTaskDate', 'validateTask', 'transitionIfInValidTask']
                },
                FINISH_ADDING_TASK: {
                  target: '#editingTaskDone'
                }
              }
            }
          }
        },
        [EDITING_TASK_FINISHED_STATE]: {
          id: 'editingTaskDone',
          type: 'final',
          data: {
            text: (context: IAddEditContext, _: IAddEditTasksEvents) => context.text,
            due: (context: IAddEditContext, _: IAddEditTasksEvents) => context.due
          }
        }
      }
    },
    {
      actions,
      guards
    }
  ];
}

const basicConfig = machineBuilder();
export const addEditViewStateMachine = Machine(basicConfig[0], basicConfig[1]);

export default machineBuilder;
