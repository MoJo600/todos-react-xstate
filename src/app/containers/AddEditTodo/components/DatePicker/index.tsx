import * as React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';

export interface IDatePickerProps {
  value?: string;
  placeholder?: string;
  newTodo?: boolean;
  editing?: boolean;
  onChange: (date: string) => void;
  onClickEnter: () => void;
  className?: string;
}

export class DatePickerComponent extends React.Component<IDatePickerProps> {
  constructor(props: IDatePickerProps, context?: any) {
    super(props, context);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.which === 13) {
      this.props.onClickEnter();
    }
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.props.onChange(event.target.value);
  }

  handleBlur(event: React.FocusEvent<HTMLInputElement>) {
    const text = event.target.value.trim();
    this.props.onChange(text);
  }

  render() {
    const classes = classNames({
      new: this.props.newTodo
    });

    return (
      <div className={this.props.className}>
        <h3 className="dueOn">Due on (select date): </h3>
        <input
          className={classes}
          autoFocus
          type="date"
          placeholder={this.props.placeholder}
          value={this.props.value}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onKeyDown={this.handleSubmit}
        />
      </div>
    );
  }
}

export default styled(DatePickerComponent)`
  display: flex;
  flex-direction: row;
  margin: 0 30px;

  .dueOn {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 300px;
  }

  .new {
    position: relative;
    resize: none;
    width: 100%;
    font-size: 24px;
    font-family: inherit;
    font-weight: inherit;
    line-height: 1.4em;
    border: 0;
    outline: none;
    color: inherit;
    padding: 6px;
    border: 1px solid #999;
    box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    font-smoothing: antialiased;
  }

  .new {
    padding: 16px 16px 16px 60px;
    border: none;
    background: rgba(0, 0, 0, 0.003);
    box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
  }

  .new::placeholder {
    font-style: italic;
    font-weight: 100;
  }
`;
