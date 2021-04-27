import * as React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

export interface ITodoTextInputProps {
  text?: string;
  placeholder?: string;
  newTodo?: boolean;
  onChange: (text: string) => void;
  onClickEnter: () => void;
  className?: string;
}

export class TodoTextInput extends React.Component<ITodoTextInputProps> {
  constructor(props: ITodoTextInputProps, context?: any) {
    super(props, context);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.which === 13) {
      this.props.onClickEnter();
    }
  }

  handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    this.props.onChange(event.target.value);
    // this.setState({ text: event.target.value });
  }

  handleBlur(event: React.FocusEvent<HTMLTextAreaElement>) {
    const text = event.target.value.trim();
    this.props.onChange(text);
  }

  render() {
    const classes = classNames({
      [this.props.className as any]: true
    });

    return (
      <textarea
        className={classes}
        autoFocus
        placeholder={this.props.placeholder}
        value={this.props.text}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onKeyDown={this.handleSubmit}
      />
    );
  }
}

export default styled(TodoTextInput)`
  position: relative;
  margin: 70px 0 0 0;
  resize: none;
  width: 100%;
  font-size: 24px;
  font-family: inherit;
  font-weight: inherit;
  line-height: 1.4em;
  outline: none;
  color: inherit;
  box-sizing: border-box;
  font-smoothing: antialiased;
  padding: 16px 16px 16px 60px;
  border: none;
  background: rgba(0, 0, 0, 0.003);
  box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);

  &::placeholder {
    font-style: italic;
    font-weight: 100;
  }
`;
