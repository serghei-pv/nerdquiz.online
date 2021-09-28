const Button = ({ title, className, onClick }: any) => {
  return (
    <button className={className} onClick={onClick} type="button">
      {title}
    </button>
  );
};

export default Button;
