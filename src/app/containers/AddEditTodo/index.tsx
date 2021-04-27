import * as React from 'react';
import { Portal } from '~/app/components/Portal';
import classNames from 'classnames';
import TodoTextInput from './components/TodoTextInput';
import DatePickerComponent from './components/DatePicker';
import styled from 'styled-components';
import { Interpreter, Machine, interpret } from 'xstate';
import { IAddEditContext, ITodoData } from '~machines/AddEditViewMachine/context';
import { IAddEditStateSchema } from '~machines/AddEditViewMachine/states';
import {
  IAddEditTasksEvents,
  CHANGE_TASK_NAME,
  CHANGE_TASK_DATE,
  FINISH_ADDING_TASK
} from '~machines/AddEditViewMachine/events';
import initialState from '~machines/AddEditViewMachine/contextInitialState';
import { createMachineConfig, createMachineOptions } from '~machines/AddEditViewMachine/machine';
import { ModalMode, EDIT_TASK_MODE } from '~app/containers/AddEditTodo/models/AddTaskModels';

export interface IAddEditTodoModal {
  initialState: ITodoData;
  mode: ModalMode;
  onCancelTask: () => void;
  onSaveTask?: (data: ITodoData) => void;
  className?: string;
}

export interface IAddEditTodoModalState extends IAddEditContext {}

export class AddEditTodoContainer extends React.Component<IAddEditTodoModal, IAddEditTodoModalState> {
  constructor(props: IAddEditTodoModal, context?: any) {
    super(props, context);
    this.stateMachine = this.createStateMachine();
  }

  private stateMachine: Interpreter<IAddEditContext, IAddEditStateSchema, IAddEditTasksEvents>;

  fetchInitialMachineState = (): ITodoData => ({
    text: this.props.initialState.text,
    due: this.props.initialState.due
  })

  createStateMachine = () => {
    const initialState = this.fetchInitialMachineState()
    const config = createMachineConfig(initialState)
    const options = createMachineOptions()
    const machine = Machine<IAddEditContext, IAddEditStateSchema, IAddEditTasksEvents>(
        config,
        options
    );
    const service = interpret(machine)
      .onTransition((state) => this.updateState(state.context))
      .onChange((state) => this.updateState(state))
      .onDone((_) => {
        this.props.onSaveTask &&
          this.props.onSaveTask({
            text: this.state.text,
            due: this.state.due
          });
      });
    return service;
  };

  componentDidMount() {
    this.stateMachine.start();
  }

  updateState = (state: IAddEditContext) => {
    this.setState({
      ...state
    });
  };

  onClose = () => {
    this.props.onCancelTask();
  };

  onSave = () => {
    this.stateMachine.send({
      type: FINISH_ADDING_TASK
    });
  };

  state = initialState;

  setText = (text: string) => {
    this.stateMachine.send({
      type: CHANGE_TASK_NAME,
      data: text
    });
  };

  setDate = (date: string) => {
    this.stateMachine.send({
      type: CHANGE_TASK_DATE,
      data: date
    });
  };

  getRootClassNames = () => {
    return classNames({
      addRoot: true,
      normal: true
    });
  };

  getButtonClassNames = (buttonClass: any) => {
    return classNames({
      [buttonClass]: true,
      button: true
    });
  };

  getModalTitle = () => {
    if (this.props.mode === EDIT_TASK_MODE) {
      return 'Edit Task';
    }
    return 'Add Task';
  };

  getOnSaveButtonTitle = () => {
    if (this.props.mode === EDIT_TASK_MODE) {
      return 'Edit';
    }
    return 'Add';
  };

  inValidationMode = () =>
    this.stateMachine.initialized &&
    this.stateMachine.state.matches('editingTask.invalidTask__showValidations');

  hasTextValidation = () => this.state.validations.includes('INVALID_NAME');

  hasDateValidation = () => this.state.validations.includes('INVALID_DATE');

  shouldShowTextValidation = () => {
    return this.inValidationMode() && this.hasTextValidation();
  };

  shouldShowDateValidation = () => {
    return this.inValidationMode() && this.hasDateValidation();
  };

  renderTextValidationMessage = () => {
    if (this.shouldShowTextValidation()) {
      return <div className="text-validation">Please enter a name for your task.</div>;
    }
    return null;
  };

  renderDateValidationMessage = () => {
    if (this.shouldShowDateValidation()) {
      return <div className="text-validation">Please enter a valid date for your task.</div>;
    }
    return null;
  };

  renderButtons = () => (
    <div className="buttons">
      <button className={this.getButtonClassNames('addButton')} onClick={this.onSave}>
        {' '}
        {this.getOnSaveButtonTitle()}
      </button>
      <button className={this.getButtonClassNames('cancelButton')} onClick={this.onClose}>
        Cancel
      </button>
    </div>
  );

  render() {
    return (
      <Portal withModalView className={this.props.className}>
        <div className={this.getRootClassNames()}>
          <button
            className="destroy"
            onClick={() => {
              this.props.onCancelTask();
            }}
          />
          <h2>{this.getModalTitle()}</h2>
          <TodoTextInput
            newTodo
            onChange={this.setText}
            placeholder={`What is your task?`}
            text={this.state.text}
            onClickEnter={this.onClose}
          />
          {this.renderTextValidationMessage()}
          <DatePickerComponent
            newTodo
            onChange={this.setDate}
            placeholder={'When is it due on?'}
            value={this.state.due}
            onClickEnter={this.onClose}
          />
          {this.renderDateValidationMessage()}
          {this.renderButtons()}
        </div>
      </Portal>
    );
  }
}

export default styled(AddEditTodoContainer)`
  h2 {
    position: relative;
    display: flex;
    width: 100%;
    font-size: 50px;
    font-weight: 300;
    text-align: center;
    justify-content: center;
    color: rgba(175, 47, 47, 0.3);
    -webkit-text-rendering: optimizeLegibility;
    -moz-text-rendering: optimizeLegibility;
    -ms-text-rendering: optimizeLegibility;
    text-rendering: optimizeLegibility;
  }

  .normal {
    background: #fff;
    margin: 20px 0 0 30px;
    position: relative;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
  }

  .addRoot {
    position: fixed;
    top: 50%;
    left: 50%;
    margin: -250px;
    width: 500px;
    height: 500px;
  }

  .addRoot .destroy {
    display: none;
    position: absolute;
    top: 0;
    right: 5px;
    bottom: 0;
    width: 40px;
    height: 40px;
    font-size: 30px;
    color: #cc9a9a;
    margin-bottom: 11px;
    transition: color 0.2s ease-out;
  }

  .addRoot .destroy:hover {
    color: #af5b5e;
  }

  .addRoot .destroy:after {
    content: '×';
  }

  .addRoot:hover .destroy {
    display: block;
  }

  .addRoot .text {
  }

  .addRoot .buttons {
    position: absolute;
    bottom: 20px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .addRoot .buttons .addButton {
    margin-left: 30px;
  }

  .addRoot .buttons .cancelButton {
    margin-right: 30px;
  }

  .addRoot .text-validation {
    color: red;
    margin: 0 30px;
  }

  .addRoot .buttons .button {
    width: 140px;
    height: 45px;
    font-family: 'Roboto', sans-serif;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 2.5px;
    font-weight: 500;
    color: #000;
    background-color: #fff;
    border: none;
    border-radius: 45px;
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease 0s;
    cursor: pointer;
    outline: none;
  }

  .addRoot .buttons .button:hover {
    background-color: #2ee59d;
    box-shadow: 0px 15px 20px rgba(46, 229, 157, 0.4);
    color: #fff;
    transform: translateY(-7px);
  }
`;
