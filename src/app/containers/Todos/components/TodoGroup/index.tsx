import * as React from 'react';
import { ITodoModel } from '~machines/TasksPageMachine/context';
import TodoList from '../TodoList';
import styled from 'styled-components';
import { ITaskItemActions } from '../..';

export interface ITodoGroupProps extends ITaskItemActions {
  className?: string;
  todos: ITodoModel[];
  numOfIncompleteTodos: number;
  toggleAddTodoView?: () => void;
  groupType: TodoGroupTypes;
}

export enum TodoGroupTypes {
  OVERDUE = 'Overdue',
  TODAY = 'Today'
}

export class TodoGroupComponent extends React.Component<ITodoGroupProps> {
  constructor(props: ITodoGroupProps, context?: any) {
    super(props, context);
  }

  renderHeaderText = () => `${this.props.groupType} - ${this.props.numOfIncompleteTodos} Tasks`;

  renderHeaderSection = () => {
    return (
      <section className="header">
        <h3>{this.renderHeaderText()}</h3>
        <hr />
      </section>
    );
  };

  allActions: ITaskItemActions = {
    onCompleteTask: this.props.onCompleteTask,
    onRemoveTask: this.props.onRemoveTask,
    onClickTask: this.props.onClickTask
  };

  canShowDueDate = () => this.props.groupType === TodoGroupTypes.OVERDUE;

  renderTodoList = () => {
    return (
      <div className="todoList">
        <TodoList
          todos={this.props.todos}
          showDueDate={this.canShowDueDate()}
          actions={this.allActions}
        />
      </div>
    );
  };

  renderNoTodosText = () => {
    if (this.props.groupType === TodoGroupTypes.OVERDUE) {
      return `You don't have any Overdue todos.`;
    }
    return `You don't have any todos due today.`;
  };

  renderNoTodos = () => {
    return <div className="noTodos">{this.renderNoTodosText()}</div>;
  };

  renderListSection = () => {
    if (this.props.todos.length > 0) {
      return this.renderTodoList();
    }
    return this.renderNoTodos();
  };

  render() {
    return (
      <div className={this.props.className}>
        {this.renderHeaderSection()}
        {this.renderListSection()}
      </div>
    );
  }
}

export default styled(TodoGroupComponent)`
  margin: 20px 0;

  .header {
    padding-left: 30px;
  }

  .noTodos {
    text-align: center;
    font-weight: 300;
    font-size: x-large;
    padding: 30px 0;
  }

  .todoList {
    background: #fff;
    margin: 20px 0 0 30px;
    position: relative;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
  }
`;
