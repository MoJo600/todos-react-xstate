// machine state

export interface ITodoData {
  text: string;
  due: string;
}

export interface IAddEditContext extends ITodoData {
  validations: Array<'INVALID_NAME' | 'INVALID_DATE'>;
}
