import * as React from 'react';
import { Portal } from '../../../../components/Portal';
import styled from 'styled-components';

export interface IFooterProps {
  toggleAddTodoView?: any;
  className?: string;
}

export class FooterComponent extends React.Component<IFooterProps> {
  constructor(props: IFooterProps, context?: any) {
    super(props, context);
  }

  handleAddTodo = () => {
    this.props.toggleAddTodoView && this.props.toggleAddTodoView(true);
  };

  render() {
    return (
      <Portal className={this.props.className}>
        <footer>
          <button title="Add a task" onClick={this.handleAddTodo} />
        </footer>
      </Portal>
    );
  }
}

export default styled(FooterComponent)`
  footer {
    position: fixed;
    bottom: 0;
    left: calc(50% - 70px);
  }

  footer button {
    position: relative;
    width: 70px;
    height: 70px;
    font-size: 30px;
    color: #cc9a9a;
    margin-bottom: 11px;
    transition: color 0.2s ease-out;
    border-radius: 50%;
    border: 1px solid #af5b5e;
  }

  footer button:hover {
    color: white;
    background-color: #af5b5e;
  }

  footer button:after {
    content: '+';
  }
`;
