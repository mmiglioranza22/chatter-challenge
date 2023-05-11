import { Modal } from 'react-bootstrap';
import { TicketData } from '../../types/chat';
import styled from 'styled-components';


function Ticket(ticketProps: TicketData) {
  const {
    id,
    title,
    description,
    tag,
    brand,
    isOpen,
    handleClose,
    date,
    priority,
    status
  } = ticketProps
  
const handleClickOutside = () => {
  if (handleClose) {
    handleClose()
  }
}

const LeftSide = 

  return (
    <Modal className="text-chatter-black" show={isOpen} centered onHide={handleClickOutside}>
      <Modal.Header className="justify-content-center" closeButton>
        <Modal.Title>Title</Modal.Title>
      </Modal.Header>
      <Modal.Body className="justify-content-center text-center">
      <div>{id}</div>
      <div>{title}</div>
      <div>{description}</div>
      <div>{tag}</div>
      <div>{brand}</div>
      <div>{date?.toString()}</div>
      <div>{priority}</div>
      <div>{status}</div>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        Footer
      </Modal.Footer>
    </Modal>

  )

}

export default Ticket;