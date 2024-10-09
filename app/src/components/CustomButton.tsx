const CustomButton = ({
  image,
  title,
  customStyles,
  customTextStyle,
  handleClick,
}: {
  image?: string;
  title: string;
  customStyles?: string;
  customTextStyle?: string;
  handleClick?: () => void;
}) => {
  return (
    <div
      onClick={handleClick}
      className={`flex items-center justify-center py-2 space-x-2 border-[1px] border-slate-300 rounded-lg cursor-pointer ${customStyles}`}
    >
      <p className={`text-center ${customTextStyle}`}>{title}</p>
      {image && <img src={image} className='w-4 h-4' />}
    </div>
  );
};

export default CustomButton;
