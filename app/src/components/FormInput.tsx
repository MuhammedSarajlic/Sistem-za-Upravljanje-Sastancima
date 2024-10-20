const FormInput = ({
  inputName,
  inputType,
  handleChange,
  customStyles,
  placeholderText,
}: {
  inputName: string;
  inputType: string;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  customStyles?: string | null;
  placeholderText?: string;
}) => {
  return (
    <div className='space-y-2'>
      <p className='font-medium text-sm'>{inputName}</p>
      <input
        required
        onChange={handleChange}
        name={inputName}
        type={inputType}
        placeholder={placeholderText}
        className={`w-[360px] h-8 px-2 border-[1px] border-slate-300 rounded-lg ${customStyles}`}
      />
    </div>
  );
};

export default FormInput;
