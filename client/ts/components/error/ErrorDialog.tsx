import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { createPortal } from 'react-dom'


type ErrorDialogProps = {
  error: Error
  closeDialog: () => void
}

export const ErrorDialog = ({ error, closeDialog }: ErrorDialogProps) =>
  createPortal(
    <div className="grid justify-center items-center relative top-0 left-0 w-screen h-screen bg-black/50">
      <dialog
        className="block"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <h2 id="modal-title" className="text-2xl">
          The following error has occurred:{' '}
        </h2>
        <p id="modal-description" className="my-4">
          {error.message}
        </p>
        <button
          className="bg-theme-blue p-2 w-full text-white"
          aria-label="close"
          title="Dismiss"
          onClick={() => closeDialog()}
        >
          <FontAwesomeIcon className="mr-2" color="white" icon={faXmark} />
          Dismiss
        </button>
      </dialog>
    </div>,
    document.getElementById('modal-root')!
  )
