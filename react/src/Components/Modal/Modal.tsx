import { Button } from 'Components/Button/Button';
import { useState } from 'react';
import './Modal.scss';

export interface ModalProps {
  title?: string;
  modalClass?: string;
  onSubmit?: Function;
  onCancel?: Function
  children?: any;
  showShare?: boolean;
  showModal: boolean;
  showFooter?: boolean;
  size?: 'sm' | 'lg' | 'xl';
}

const Modal = function ({
  modalClass = '',
  title = 'title',
  showModal,
  showFooter = false,
  ...props
}: ModalProps) {
  const [show, setShow] = useState<boolean>(showModal || false);

  return (
    <>
      <div className={['custom-modal', modalClass, showModal ? 'show' : 'hidden'].join(' ')} aria-modal="true" role="dialog" onClick={() => setShow(false)}>
        <div className={["modal-dialog modal-dialog-centered", props.size].join(' ')}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="text-xl font-medium leading-normal text-gray-800" id="exampleModalScrollableLabel">
                {title}
              </h5>
              <p>{show}</p>
              <Button className="btn-close" onClick={() => setShow(false)} />
            </div>
            <div className="modal-body relative p-4">
              {props.children}
            </div>
            {showFooter ? (
              <div
                className="modal-footer">
                <Button className="modal-control-close" label="Close" onClick={() => setShow(false)} />
                <Button className="modal-control-submit" label="Save Changes" onClick={() => setShow(false)} />
              </div>
            ) : <></>}
          </div>
        </div>
      </div>
    </>
  );
};

Modal.Footer = ({ children }: any) => {
  return (
    <div className="modal-footer">
      {children}
    </div>
  )
}

export { Modal };