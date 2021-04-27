import * as React from 'react';
import { ITodoInfo, ITodoModel } from '~machines/TasksPageMachine/context';
import { ModalMode } from '~app/containers/AddEditTodo/models/AddTaskModels';
import TodoGroupComponent, { TodoGroupTypes } from '../TodoGroup';
import Header from '../Header';
import AddTodoComponent from '~/app/containers/AddEditTodo';
import FooterComponent from '../Footer';
import styled from 'styled-components';
import { ITodoStateMachineActions } from '~/app/containers/Todos';

export interface ITodosPageProps extends ITodoStateMachineActions {
  className?: string;
  overdueTodos: Array<ITodoModel>;
  todayTodos: Array<ITodoModel>;
  showAddEditModal: boolean;
  modalMode: ModalMode;
  modalInitialState: ITodoInfo;
}

export class TodoPageComponent extends React.Component<ITodosPageProps> {
  constructor(props: ITodosPageProps, context?: any) {
    super(props, context);
  }

  isIncompleteTodo = (todo: ITodoModel) => !todo.completed;

  sortByCompleteStatus = (todoA: ITodoModel, todoB: ITodoModel) => {
    if (todoA.completed === todoA.completed) return 0;

    if (todoA.completed === false && todoB.completed === true) return -1;

    return -1;
  };

  renderAddTodoModal = () => {
    if (this.props.showAddEditModal) {
      return (
        <AddTodoComponent
          mode={this.props.modalMode}
          initialState={this.props.modalInitialState}
          onSaveTask={this.props.onSaveTask}
          onCancelTask={this.props.onCancelTask}
        />
      );
    }
    return;
  };

  renderFooter = () => {
    if (!this.props.showAddEditModal) {
      return (
        <>
          <FooterComponent toggleAddTodoView={this.props.onClickAddNewTask} />
        </>
      );
    }
    return;
  };

  render() {
    const todayTodos = this.props.todayTodos.sort(this.sortByCompleteStatus);
    const incompleteToday = todayTodos.filter(this.isIncompleteTodo);
    const overdueTodos = this.props.overdueTodos.sort(this.sortByCompleteStatus);
    const incompleteOverdue = overdueTodos.filter(this.isIncompleteTodo);

    return (
      <div className={this.props.className}>
        <Header />
        <TodoGroupComponent
          groupType={TodoGroupTypes.TODAY}
          numOfIncompleteTodos={incompleteToday.length}
          todos={todayTodos}
          onClickTask={this.props.onClickTask}
          onCompleteTask={this.props.onCompleteTask}
          onRemoveTask={this.props.onRemoveTask}
        />
        <TodoGroupComponent
          groupType={TodoGroupTypes.OVERDUE}
          numOfIncompleteTodos={incompleteOverdue.length}
          todos={overdueTodos}
          onClickTask={this.props.onClickTask}
          onCompleteTask={this.props.onCompleteTask}
          onRemoveTask={this.props.onRemoveTask}
        />
        {this.renderAddTodoModal()}
        {this.renderFooter()}
      </div>
    );
  }
}

export default styled(TodoPageComponent)`
  margin: 30px;
  position: relative;
  display: flex;
  flex-direction: column;
`;
