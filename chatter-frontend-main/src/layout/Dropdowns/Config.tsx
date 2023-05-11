import { useState, useEffect } from 'react';
import ConfirmDialog from '../../components/ConfirmDialog';
import NewChatModal from '../../components/HomeChat/NewChatModal';
import { DropDownProps } from '../../types/chat';

function ConfigDropdown(dropDownProps: DropDownProps) {
  const { getChatsData, userData, isOpen, createNewChat, deleteUser } = dropDownProps;
  
  const [prevUser] = useState(userData)
  const [delDialogIsOpen, setDelDialogIsOpen] = useState(false);
  const [newChatModalIsOpen, setNewChatModalIsOpen] = useState(false);
  
  const handleDeleteUser = () => {
    setDelDialogIsOpen(true);
  };

  const handleNewChatModal = () => {
    setNewChatModalIsOpen(true);
  };

  const handleConfirmDelete = () => {
    /* 
      TODO: 
      1. Get current user data -> DONE in HomeChat component
      2. Delete user -> DONE
    */
    deleteUser()
  };

  return (
    <div className={isOpen ? 'configDropdown scale1' : 'configDropdown'}>
      <ul>
        <li onClick={handleNewChatModal}>
          <div>Nuevo chat</div>
        </li>
        <li onClick={handleDeleteUser}>
          <div>Eliminar cuenta</div>
        </li>
      </ul>

      <NewChatModal
        isOpen={newChatModalIsOpen}
        setIsOpen={setNewChatModalIsOpen}
        userData={userData}
        getChatsData={getChatsData}
        createNewChat={createNewChat}
      />
      <ConfirmDialog
        title="Eliminar Usuario"
        text="¿Está seguro que desea eliminar la cuenta?"
        isOpen={delDialogIsOpen}
        handleCancel={setDelDialogIsOpen}
        handleOk={handleConfirmDelete}
      />
    </div>
  );
}

export default ConfigDropdown;
