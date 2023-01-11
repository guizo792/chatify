export type InputProps = {
  labelFor: string;
  label: string;
  inputType: string;
  inputName: string;
  inputPlaceholder: string;
  inputId: string;
};

const FormInput = ({
  labelFor,
  label,
  inputType,
  inputName,
  inputPlaceholder,
  inputId,
}: InputProps) => {
  return (
    <div className="form-control">
      <label htmlFor={labelFor}>{label}</label>
      <input
        type={inputType}
        name={inputName}
        id={inputId}
        placeholder={inputPlaceholder}
        required
      />
    </div>
  );
};

export default FormInput;
