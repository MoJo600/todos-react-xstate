import * as React from 'react';
import styled from 'styled-components';

export interface IHeaderProps {
  className?: string;
}

export class Header extends React.Component<IHeaderProps> {
  constructor(props: IHeaderProps, context?: any) {
    super(props, context);
  }

  render() {
    return (
      <div className={this.props.className}>
        <header>
          <h2>Todos</h2>
          <hr></hr>
        </header>
      </div>
    );
  }
}

export default styled(Header)`
  h2 {
    position: relative;
    display: flex;
    width: 100%;
    font-size: 50px;
    font-weight: 300;
    text-align: center;
    color: rgba(175, 47, 47, 0.3);
    -webkit-text-rendering: optimizeLegibility;
    -moz-text-rendering: optimizeLegibility;
    -ms-text-rendering: optimizeLegibility;
    text-rendering: optimizeLegibility;
  }

  header {
    padding-left: 30px;
  }

  hr {
    border-top: 1px inset rgb(64, 118, 119);
    width: 100%;
  }
`;
