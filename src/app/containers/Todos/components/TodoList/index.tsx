import * as React from 'react';
import { ITodoModel } from '~machines/TasksPageMachine/context';
import styled from 'styled-components';
import TodoItem from '../TodoItem';
import { ITaskItemActions } from '~/app/containers/Todos';

export interface ITodoListProps {
  todos: ITodoModel[];
  actions: ITaskItemActions;
  showDueDate: boolean;
  className?: string;
}

export class TodoList extends React.Component<ITodoListProps> {
  renderTodoRows = () => {
    if (this.props.todos) {
      return this.props.todos.map((todo, index) => (
        <TodoItem
          key={index}
          todo={todo}
          showDueDate={this.props.showDueDate}
          onClickTask={this.props.actions.onClickTask}
          onCompleteTask={this.props.actions.onCompleteTask}
          onRemoveTask={this.props.actions.onRemoveTask}
        />
      ));
    }
    return;
  };

  render() {
    return (
      <section className={this.props.className}>
        <ul className="todo-item">{this.renderTodoRows()}</ul>
      </section>
    );
  }
}

export default styled(TodoList)`
  position: relative;
  border-top: 1px solid #e6e6e6;

  .todo-item {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .todo-item li {
    position: relative;
    font-size: 24px;
    border-bottom: 1px solid #ededed;
  }

  .todo-item li:last-child {
    border-bottom: none;
  }

  .todo-item li label {
    white-space: pre-line;
    word-break: break-all;
    padding: 15px 60px 15px 15px;
    margin-left: 45px;
    display: block;
    line-height: 1.2;
    transition: color 0.4s;
  }

  .todo-item li.completed label {
    color: #d9d9d9;
    text-decoration: line-through;
  }

  .todo-item li .destroy {
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

  .todo-item li .destroy:hover {
    color: #af5b5e;
  }

  .todo-item li .destroy:after {
    content: '×';
  }

  .todo-item li:hover .destroy {
    display: block;
  }

  .todo-item li .edit {
    display: none;
  }

  .todo-item li.editing:last-child {
    margin-bottom: -1px;
  }

  @media screen and (-webkit-min-device-pixel-ratio: 0) {
    .todo-item li .toggle {
      background: none;
    }
    .todo-item li .toggle {
      height: 40px;
    }
  }
`;
