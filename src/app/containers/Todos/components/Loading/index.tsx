import * as React from 'react';
import styled from 'styled-components';

export interface ILoadingProps {
  className?: string;
}

export class Loading extends React.Component<ILoadingProps> {
  constructor(props: ILoadingProps, context?: any) {
    super(props, context);
  }

  render() {
    return (
      <div className={this.props.className}>
        <div className="loading">Loading...</div>
      </div>
    );
  }
}

export default styled(Loading)`
  .loading {
    position: relative;
    display: flex;
    height: 100vh;
    justify-content: center;
    align-items: center;
  }
`;
