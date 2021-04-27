import * as React from 'react';
import * as ReactDOM from 'react-dom';
import classnames from 'classnames';

const modalRoot = document.getElementById('portal-root');
const appRoot = document.getElementById('root');

export interface IPortalViewProps {
  withModalView?: boolean;
  className?: string;
}

export class Portal extends React.Component<IPortalViewProps> {
  constructor(props: IPortalViewProps) {
    super(props);
    const classNames = classnames({
      [this.props.className as any]: true
    });
    this.el = document.createElement('div');
    this.el.className = classNames;
    if (appRoot && this.props.withModalView) {
      appRoot.style.filter = 'blur(5px)';
    }
  }

  el: HTMLElement;

  componentDidMount() {
    if (modalRoot) {
      modalRoot.appendChild(this.el);
    } else {
      throw new Error('Attempting to render a modal view when no modal root exists');
    }
  }

  componentWillUnmount() {
    if (modalRoot) {
      modalRoot.removeChild(this.el);
      if (appRoot && this.props.withModalView) {
        appRoot.style.filter = 'none';
      }
    } else {
      throw new Error('Attempting to unmount a modal view when no modal root exists');
    }
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}
