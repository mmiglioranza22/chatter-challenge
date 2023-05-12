import { Modal } from 'react-bootstrap';
import { TicketData, TicketStatus } from '../../types/chat';
import styled from 'styled-components';
import TicketSvg from './TicketSvg';



const LeftSide = styled.div`
  min-width: 335px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
  padding: 16px;
  flex-grow: 1;
` 

const RightSide = styled.div`
  min-width: 92px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-around;
  padding: 16px;
  flex-grow: 1;
`

const Description = styled.div`
  max-width: 256px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const Title = styled.div`
  font-weight: 700;
`

const Tag = styled.div`
  border: 1px solid #FFF;
  border-bottom-color: transparent;
  border-top-color: transparent;
  border-right-color: transparent;
  padding: 0px 12px;
  margin-left: 16px;
`
const SubContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

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

const Container = styled.div`
  position: relative;
  background: ${status === TicketStatus.CLOSED ? '#01db77' : '#ff3633'};
  display: flex;
  color: #FFF;
  min-width: 335px;
  min-height: 130px;
`

const Brand = styled.div`
  background: #FFF;
  border: 1px solid transparent;
  border-radius: 6px;
  color: ${status === TicketStatus.OPEN ? '#63656A' : '#01db77'};
  padding: 0px 5px;
`

  return (
    <Modal className="text-chatter-black" show={isOpen} centered onHide={handleClickOutside}>
      <Modal.Header className="justify-content-center" closeButton />
      <Modal.Body className="justify-content-center text-center">
        <Container>
          <LeftSide>
            <Title>{title}</Title>
            <Description>{description}</Description>
            <SubContainer>
              <Brand>{brand?.toUpperCase()}</Brand><Tag>{tag?.toUpperCase()}</Tag>
            </SubContainer>
          </LeftSide>
            <TicketSvg />
          <RightSide>
            <div>{date?.toLocaleDateString()}</div>
            <Brand>{priority === 0 ? 'ALTA' : 'BAJA'}</Brand>
            <div>#{id}</div>
          </RightSide>
        </Container>
      </Modal.Body>
    </Modal>

  )

}

export default Ticket;