function Button({ title, className, onClick }: any): React.ReactElement {
  return (
    <button className={className} onClick={onClick} type="button">
      {title}
    </button>
  );
}

export default Button;
