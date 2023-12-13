interface ModalProps {
  onClose: () => void;
  show: boolean;
  children?: React.ReactNode; // This will type the children prop
}

const Modal: React.FC<ModalProps> = ({ onClose, show, children }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="modal-header">Node Configuration</span>
        <button className="modal-close-button" onClick={onClose}>
          X
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
