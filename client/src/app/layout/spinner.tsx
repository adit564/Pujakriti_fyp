interface Props {
  message?: string;
}

export default function Spinner({ message = "Loading..." }: Props) {
  return (
    <div className="spinner-container">
      <span className="loader"></span>
       <div className="loading-text">{message}</div>
    </div>
  );
}
