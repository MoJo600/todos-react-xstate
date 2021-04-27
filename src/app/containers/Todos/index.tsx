import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import moment from 'moment';
import { Machine, interpret, Interpreter } from 'xstate';
import TodoPageComponent from '~/app/containers/Todos/components/TodosPage';
import LoadingComponent from '~/app/containers/Todos/components/Loading';
import { GlobalStyleComponent } from '~/app/components/GlobalStyles';
import { createDefaultMachineOptions, createMachineConfig } from '~machines/TasksPageMachine/machine';
import { TasksContext, ITodoModel } from '~machines/TasksPageMachine/context';
import contextInitialState from '~machines/TasksPageMachine/contextInitialState';
import { TasksStateSchema } from '~machines/TasksPageMachine/states';
import { ITodoInfo } from '~machines/TasksPageMachine/context';
import {
  TasksEvents,
  ADD_TASK,
  EDIT_TASK,
  SHOW_ADD_TASK,
  CLOSE_ADD_EDIT_TASK_MODAL,
  SHOW_EDIT_TASK,
  DELETE_TASK,
  COMPLETE_TASK
} from '~machines/TasksPageMachine/events';
import {
  ModalMode,
  ADD_TASK_MODE,
  EDIT_TASK_MODE
} from '~app/containers/AddEditTodo/models/AddTaskModels';
import { TODOS_LOCAL_STORAGE_KEY } from '~app/constants';
import { MODAL_VIEW_STATE, ADD_NEW_TASK_STATE, EDIT_EXISTING_TASK_STATE } from '~machines/TasksPageMachine/stateKeys';

export interface ITaskItemActions {
  onCompleteTask: (todoId: string) => void;
  onRemoveTask: (todoId: string) => void;
  onClickTask?: (todoId: string) => void;
}

export interface ITaskModalActions {
  onSaveTask: (todo: ITodoInfo) => void;
  onCancelTask: () => void;
}
export interface ITodoStateMachineActions extends ITaskItemActions, ITaskModalActions {
  onClickAddNewTask: () => void;
}

export interface ITodosContainerProps extends RouteComponentProps {}

export interface ITaskState extends TasksContext {}

export class TodosContainer extends React.Component<ITodosContainerProps, ITaskState> {
  constructor(props: ITodosContainerProps, context?: any) {
    super(props, context);
    this.stateMachine = this.createStateMachine();
    this.initializeStateBasedOnRoute();
  }

  private isComponentMounted: boolean = false;

  /**
   * Contains basic logic for showing add/edt views; could be extended for
   * more complex scenarios. Keeping the route in sync with the state machine is a
   * tricky business; for our scenario, we can allow to keep things light, but in the
   * future a well thought-out solution needs to be developed to bridge this gap.
   */
  initializeStateBasedOnRoute = () => {
    const currentLocation = this.props.location.pathname;
    if (currentLocation === '/add') {
      return this.onClickAddNewTask();
    }
    if (currentLocation.includes('edit')) {
      const todoId = currentLocation.split('/').pop();
      return this.onEditExistingTask(todoId);
    }
  };

  state: ITaskState = {
    ...contextInitialState
  };

  get currentMachineState() {
    return this.stateMachine.initialized ? this.stateMachine.state : null;
  }

  componentDidMount() {
    this.isComponentMounted = true;
  }

  /**
   *  A quirk to get around the fact that the state machine is initialized
   *  before the component mounts, since this runs on the constructor call.
   *  It doesn't look good.
   */
  updateState = (stateContext: TasksContext) => {
    if (this.isComponentMounted) {
      this.setState({
        ...stateContext
      });
    } else {
      this.state = {
        ...this.state,
        ...stateContext
      };
    }
  };

  private stateMachine: Interpreter<TasksContext, TasksStateSchema, TasksEvents>;

  fetchTasksFromStorage = () => {
    const storedTasks = window.localStorage.getItem(TODOS_LOCAL_STORAGE_KEY);
    const parsedTasks = storedTasks ? JSON.parse(storedTasks) : [];
    return parsedTasks;
  };

  createStateMachine = () => {
    const allPreviousTasks: ITodoModel[] = this.fetchTasksFromStorage();
    const initialState: Partial<TasksContext> = {
      allTasks: allPreviousTasks
    };
    const config = createMachineConfig(initialState);
    const options = createDefaultMachineOptions();
    const machine = Machine<TasksContext, TasksStateSchema, TasksEvents>(config, options);
    const service: Interpreter<TasksContext, TasksStateSchema, TasksEvents> = interpret(machine)
      .onTransition((state) => this.updateState(state.context))
      .onChange((context) => this.updateState(context))
      .start();
    return service;
  };

  routeToRoot = () => this.props.history.push('/');

  routeToAddView = () => this.props.history.push('/add');

  routeToEditView = (id: string) => this.props.history.push(`/edit/${id}`);

  getOverdueTodos = () => {
    return this.state.allTasks
      ? this.state.allTasks.filter((todo) => {
          return moment(todo.due).isBefore(this.state.todayDate, 'day');
        })
      : [];
  };

  getTodayTodos = () => {
    return this.state.allTasks
      ? this.state.allTasks.filter((todo) => {
          return moment(todo.due).isSame(this.state.todayDate, 'day');
        })
      : [];
  };

  isValidTaskId = (taskId: string) => this.state.allTasks.find((todo) => todo.id === taskId);

  editTask = (data: ITodoInfo) => {
    this.stateMachine.send({
      type: EDIT_TASK,
      data: {
        ...data,
        id: this.state.taskToUpdateId
      }
    });
    this.routeToRoot();
  };

  addTask = (data: ITodoInfo) => {
    this.stateMachine.send({
      type: ADD_TASK,
      data
    });
    this.routeToRoot();
  };

  isAddView = (): boolean => {
    const targetState = `${MODAL_VIEW_STATE}.${ADD_NEW_TASK_STATE}`
    return Boolean(
      this.currentMachineState && this.currentMachineState.matches(targetState)
    );
  };

  shouldShowModal = () => {
    return this.isAddView() || this.isEditView();
  };

  isEditView = (): boolean => {
    const targetState = `${MODAL_VIEW_STATE}.${EDIT_EXISTING_TASK_STATE}`
    return Boolean(
      this.currentMachineState && this.currentMachineState.matches(targetState)
    );
  };

  getModalInitialState = (): ITodoInfo => {
    const emptyTodo = {
      text: '',
      due: ''
    };
    if (this.isEditView()) {
      return this.getTaskData(this.state.taskToUpdateId, emptyTodo);
    }
    return emptyTodo;
  };

  getTaskData = (
    todoId: string | undefined,
    defaultEmptyTask: ITodoInfo = { text: '', due: '' }
  ): ITodoInfo => {
    const todoElement = this.state.allTasks.find((todo) => todo.id === todoId);
    return todoElement ? { text: todoElement.text, due: todoElement.due } : defaultEmptyTask;
  };

  onRemoveTask = (id: any) => {
    this.stateMachine.send({
      type: DELETE_TASK,
      data: id
    });
  };

  onCompleteTask = (id: any) => {
    this.stateMachine.send({
      type: COMPLETE_TASK,
      data: id
    });
  };

  onSaveTask = (data: ITodoInfo) => {
    if (this.isEditView()) {
      this.editTask(data);
    }
    if (this.isAddView()) {
      this.addTask(data);
    }
  };

  onCloseAddEditModal = () => {
    this.stateMachine.send({
      type: CLOSE_ADD_EDIT_TASK_MODAL
    });
    this.routeToRoot();
  };

  getModalMode = (): ModalMode => {
    if (this.isEditView()) {
      return EDIT_TASK_MODE;
    }
    return ADD_TASK_MODE;
  };

  onClickAddNewTask = () => {
    this.stateMachine.send({
      type: SHOW_ADD_TASK
    });
    this.routeToAddView();
  };

  onEditExistingTask = (id: any) => {
    if (this.isValidTaskId(id)) {
      this.stateMachine.send({
        type: SHOW_EDIT_TASK,
        data: id
      });
      return this.routeToEditView(id);
    } else {
      return this.routeToRoot();
    }
  };

  renderLoadingComponent = () => {
    return <LoadingComponent />;
  };

  get allActions(): ITodoStateMachineActions {
    return {
      onCompleteTask: this.onCompleteTask,
      onRemoveTask: this.onRemoveTask,
      onSaveTask: this.onSaveTask,
      onClickTask: this.onEditExistingTask,
      onCancelTask: this.onCloseAddEditModal,
      onClickAddNewTask: this.onClickAddNewTask
    };
  }

  renderMainContent = () => {
    return this.stateMachine.initialized ? this.renderTasksPage() : this.renderLoadingComponent();
  };

  renderTasksPage = () => {
    const overdueTodos = this.getOverdueTodos();
    const todayTodos = this.getTodayTodos();
    return (
      <TodoPageComponent
        overdueTodos={overdueTodos}
        todayTodos={todayTodos}
        showAddEditModal={this.shouldShowModal()}
        modalMode={this.getModalMode()}
        modalInitialState={this.getModalInitialState()}
        {...this.allActions}
      />
    );
  };

  render() {
    console.log('parent state machine', this.stateMachine);
    return (
      <>
        <GlobalStyleComponent />
        {this.renderMainContent()}
      </>
    );
  }
}

export default TodosContainer;
