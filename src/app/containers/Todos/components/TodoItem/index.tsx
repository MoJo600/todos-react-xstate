import * as React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { ITodoModel } from '~machines/TasksPageMachine/context';
import styled from 'styled-components';
import { ITaskItemActions } from '../..';

export interface ITodoItemProps extends ITaskItemActions {
  todo: ITodoModel;
  showDueDate: boolean;
  className?: string;
}

export class TodoItem extends React.Component<ITodoItemProps, ITodoItemProps> {
  constructor(props: ITodoItemProps, context?: any) {
    super(props, context);
  }

  getDueDate = () => {
    const momentDate = moment(this.props.todo.due);
    return momentDate.format('MMM DD');
  };

  renderDueDate = () => {
    if (this.props.showDueDate) {
      return <label>{this.getDueDate()}</label>;
    }
    return;
  };

  toggleCompleteStatus = () => {
    console.log('here', this.props.todo.id, this.props.onCompleteTask);
    this.props.todo.id &&
      this.props.onCompleteTask &&
      this.props.onCompleteTask(this.props.todo.id);
  };

  editTodo = () => {
    this.props.onClickTask && this.props.onClickTask(this.props.todo.id);
  };

  removeTodo = () => {
    this.props.todo.id && this.props.onRemoveTask && this.props.onRemoveTask(this.props.todo.id);
  };

  render() {
    const { todo } = this.props;
    const listItemClasses = classNames({
      [this.props.className as any]: true,
      completed: todo.completed
    });

    return (
      <li className={listItemClasses}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={todo.completed}
            onChange={this.toggleCompleteStatus}
          />
          <label onClick={this.editTodo}>{todo.text}</label>
          {this.renderDueDate()}
          <button className="delete" onClick={this.removeTodo} />
        </div>
      </li>
    );
  }
}

export default styled(TodoItem)`
  .view {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }

  .toggle {
    text-align: center;
    width: 40px;
    height: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto 0;
    border: none;
    appearance: none;
  }

  .toggle:after {
    content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" stroke="%23ededed" stroke-width="3"/></svg>');
  }

  .toggle:checked:after {
    content: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" stroke="%23bddad5" stroke-width="3"/><path fill="%235dc2af" d="M72 25L42 71 27 56l-4 4 20 20 34-52z"/></svg>');
  }

  label {
    white-space: pre-line;
    word-break: break-all;
    padding: 15px 60px 15px 15px;
    margin-left: 45px;
    display: block;
    line-height: 1.2;
    transition: color 0.4s;
  }

  .delete {
    display: none;
    position: absolute;
    top: 0;
    right: 10px;
    bottom: 0;
    width: 40px;
    height: 40px;
    margin: auto 0;
    font-size: 30px;
    color: #cc9a9a;
    margin-bottom: 11px;
    transition: color 0.2s ease-out;
  }

  .delete:hover {
    color: #af5b5e;
  }

  .delete:after {
    content: '×';
  }

  &:hover .delete {
    display: block;
  }

  .view {
    display: flex;
    justify-content: space-between;
  }

  &.completed label {
    color: #d9d9d9;
    text-decoration: line-through;
  }

  @media screen and (-webkit-min-device-pixel-ratio: 0) {
    .toggle {
      background: none;
    }
    .toggle {
      height: 40px;
    }
  }
`;
