import { useState, useEffect } from 'react';
import ConfirmDialog from '../../components/ConfirmDialog';
import NewChatModal from '../../components/HomeChat/NewChatModal';
import { DropDownProps } from '../../types/chat';
import { useAppDispatch } from '../../redux/hooks';
import { deleteUser } from '../../redux/userActions'
import { useRouter } from 'next/dist/client/router';
import { LoadStart } from '../../components/Loading';

function ConfigDropdown(dropDownProps: DropDownProps) {
  const { getChatsData, userData, isOpen } = dropDownProps;
  
  const router = useRouter()
  const [prevUser] = useState(userData)
  const dispatch = useAppDispatch()
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
      1. Get current user data - DONE in HomeChat component
      2. Delete user - DONE
    */
    dispatch(deleteUser(userData))
    LoadStart()    
  };

  useEffect(() => {
    if (prevUser && prevUser.userId && prevUser.userId !== userData.userId) {
      router.push('/')
    } 
  }, [userData])

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
