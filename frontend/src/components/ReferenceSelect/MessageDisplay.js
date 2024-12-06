function MessageDisplay({ message }) {
  if (!message) return null;
  
  return (
    <p className="mt-4 text-center text-red-600">
      {message}
    </p>
  );
}

export default MessageDisplay;