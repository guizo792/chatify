import { ChangeEventHandler } from 'react';

export type InputProps = {
  labelFor: string;
  label: string;
  inputType: string;
  inputName: string;
  inputPlaceholder: string;
  inputId: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  value: string;
};

const FormInput = ({
  labelFor,
  label,
  inputType,
  inputName,
  inputPlaceholder,
  inputId,
  onChange,
  value,
}: InputProps) => {
  return (
    <div className="form-control">
      <label htmlFor={labelFor}>{label}</label>
      <input
        onChange={onChange}
        type={inputType}
        name={inputName}
        id={inputId}
        placeholder={inputPlaceholder}
        value={value}
        required
      />
    </div>
  );
};

export default FormInput;
