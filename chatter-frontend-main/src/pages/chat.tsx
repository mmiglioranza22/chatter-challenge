import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/dist/client/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile, faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { IoMdSettings } from 'react-icons/io';
import { HiPhoneMissedCall } from 'react-icons/hi';

import { socket } from '../sockets'; 
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { 
  getChats,
  setIsAllowedExpand,
  fetchUserChats,
  deleteChat,
  createChat,
  sendMessage
} from '../redux/chatsSlice';
import {
  getUser,
  deleteUser,
  setLogoutData,
  fetchUserData,
  setLoginData
} from '../redux/userSlice'

import empty from '../assets/images/empty.png';
import MyProfile from '../components/MyProfile';
import ChatHeader from '../components/HomeChat/ChatHeader';
import ConfigDropdown from '../layout/Dropdowns/Config';
import SearchBar from '../components/SearchBar';
import ChatTab from '../components/HomeChat/ChatTab';
import ChatMessages from '../components/HomeChat/ChatMessages';
import { LoadRemove, LoadStart } from '../components/Loading';
import { NotificationFailure, NotificationSuccess, NotificationWarning } from '../components/Notifications';
import { useSessionStorage } from '../utils/customHooks';
import { Chat, LogoType, FormDataType } from '../types/chat';
import { UserDataState } from '../types/types';


function HomeChat() {
  const chatHeaderInitialState: Chat = {
    messages: [],
    messageIdToDisplay: '',
    image: '',
    name: ''
  };
  
  const router = useRouter()
  const [tokenSession] = useSessionStorage('tokenSession', '')
  const [userSession] = useSessionStorage('userSession', '')

  const [msgEntry, setMsgEntry] = useState<string>('');
  const [selectedChat, setSelectedChat] = useState<string>('');
  const [userChatData, setUserChatData] = useState(chatHeaderInitialState);
  const [configOpen, setConfigOpen] = useState<Boolean>(false);

  const ref = useRef<any>();

  const userData = useAppSelector(getUser);
  const chats = useAppSelector(getChats);
  const dispatch = useAppDispatch();

  const positionRef = useRef<any>();

  const logo = empty as unknown as LogoType;

  useEffect(() => {
    /* 
      TODO: 
      1. Get user data -> DONE by selector and on mount 
      2. Get chats data -> DONE
    */
    socket.connect();

    if (tokenSession && userSession) {
      const data: UserDataState = {
        userId: userSession,
        authToken: tokenSession
      }
      dispatch(setLoginData(data))
      dispatch(fetchUserData(data))
    } else {
      // Hack to protect routes, not the best though
      router.push('/')
      NotificationFailure('Not authorized. Please log in.')
    }
    return () => {
      socket.disconnect();
    }
  }, []);


  // SOCKETS
  const onConnect = () => {
    // eslint-disable-next-line no-console
  console.debug('Conectado a socket del servidor')
  }

  const onDisconnect = () => {
    // eslint-disable-next-line no-console
    console.debug('Conexión perdida.')
    NotificationWarning('Conexión perdida con el servidor. Reconectando...')
  }

  async function onChatCreate(value: any) {
    // Fetches all messages, since user can receive messages in different chats while being in one specific.
    getChatsData()
    if (value.action === 'error') {
      NotificationFailure(value.error || 'An error ocurred while fetching messages.')
    }
  }
    

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
      setConfigOpen((isOpen) => isOpen && chats.isAllowedExpand); 

      // Update scroll position
      positionRef.current.scrollIntoView();

      /*
        TODO: 
          1. Listen the socket - DONE
          2. Get chat data ---> DONE
          3. Set the socket off and return void to prevent useless renders - DONE
      */

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('chats', onChatCreate);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('chats', onChatCreate);
    }

    }
  }, [chats]);

  const handleMsgEntry = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsgEntry(e.target.value);
  };

  const handleSendMsg = () => {
    if (msgEntry !== '') {
      setMsgEntry('');
      /*
        TODO:
        1. Send message -> DONE
      */
     const messageData = { 
      chatId: selectedChat, 
      userData, 
      message: msgEntry 
    }
     dispatch(sendMessage(messageData))
    } else {
      /* TODO: 
        1. Show error notification -> DONE
      */
      NotificationWarning('Por favor escriba un mensaje.')
    }
  };

  const handleChatClick = (chatId: string) => {
    setSelectedChat(chatId);
  };

  const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSendMsg();
  };


  const handleOpenConfig = (e: React.MouseEvent<HTMLDivElement>) => {
    setConfigOpen(!configOpen);
    dispatch(setIsAllowedExpand(true));
    e.stopPropagation();
  };

  const getChatsData = () => {
    /* TODO: 
      Get all chats data -> DONE
    */
    dispatch(fetchUserChats(userData))
  };

  const handleDeleteUser = async () => {
    LoadStart()
    const resultAction: any = await dispatch(deleteUser(userData))
      if (deleteUser.fulfilled.match(resultAction)) {
        dispatch(setLogoutData());
        router.push('/')
        NotificationSuccess(resultAction.payload.message || 'User deleted successfully!')
        LoadRemove()
      } else {
        if (resultAction.payload) {
          const message = `${resultAction.payload.message}.
          (${resultAction.payload.status} ${resultAction.payload.statusText}).`
          NotificationFailure(message)
        } else {
          NotificationFailure(`${resultAction.error.message}`)
        }
        LoadRemove()
      }
  }

  const handleCreateChat = async (chatData: FormDataType) => {
    LoadStart()
    const resultAction: any = await dispatch(createChat({ chatData, userData: userData }))
    if (createChat.fulfilled.match(resultAction)) {
      getChatsData()
      NotificationSuccess(resultAction.payload.message || 'User deleted successfully!')
      LoadRemove()
    } else {
      if (resultAction.payload) {
        const message = `${resultAction.payload.message}.
        (${resultAction.payload.status} ${resultAction.payload.statusText}).`
        NotificationFailure(message)
      } else {
        NotificationFailure(`${resultAction.error.message}`)
      }
      LoadRemove()
    }
  }

  const handleDeleteChat = async (chatId: string) => {
    const resultAction: any = await dispatch(deleteChat({ chatId, userData }))
    if (deleteChat.fulfilled.match(resultAction)) {
      getChatsData()
      NotificationSuccess(resultAction.payload.message || 'Chat deleted successfully!')
    } else {
      if (resultAction.payload) {
        const message = `${resultAction.payload.message}.
        (${resultAction.payload.status} ${resultAction.payload.statusText}).`
        NotificationFailure(message)
      } else {
        NotificationFailure(`${resultAction.error.message}`)
      }
    } 
  }

  return (
    <div className="main-wrapper-chat d-flex row flex-grow-1 w-85" data-aos="zoom-in">
      <div className="chat-left-side bg-chats-background d-flex flex-column w-30 p-0">
        <div className="profile-container bg-chatter-green px-3 d-flex justify-content-between align-items-center py-2">
          <MyProfile
            name={userData?.name}
            lastName={userData?.lastName}
            email={userData?.email}
            photo={userData?.photo}
          />
          <div className="position-relative cursor-pointer d-flex">
            <span
              className="iconHover fs-3 align-self-center justify-self-center"
              onClick={handleOpenConfig}
            >
              <IoMdSettings aria-label="Boton de Configuracion" />
            </span>
            <ConfigDropdown
              isOpen={configOpen}
              userData={userData}
              getChatsData={getChatsData}
              createNewChat={handleCreateChat}
              deleteUser={handleDeleteUser}
            />
          </div>
        </div>

        <SearchBar userId={userData.userId} chatId={selectedChat} />

        <div className="chatsDiv d-flex flex-grow-1 flex-column" ref={ref}>
          <div ref={positionRef} />
          {chats && chats.chats.length > 0 ? (
            chats.chats.map((tab: any, i: any) => (
              <ChatTab
                key={i}
                name={tab.name}
                image={tab.photo}
                chatId={tab.chatId}
                messages={tab.messages}
                userData={userData}
                selectedChat={selectedChat}
                onClick={() => handleChatClick(tab.chatId)}
                deleteChat={handleDeleteChat}
              />
            ))
          ) : (
            <div className="text-chatter-black opacity-25 fs-smaller text-center h-100 d-flex justify-content-center align-items-center text-no-selection">
              <div>No hay chats disponibles</div>
            </div>
          )}
        </div>
      </div>

      {selectedChat === '' ? (
        <div className="chat-right-side empty-chats w-70 d-flex flex-column justify-content-center align-items-center align-content-center p-0 position-relative text-no-selection overflow-hidden">
          <img className="opacity-50" src={logo.src} alt="background" />
          <div className="d-flex flex-column align-items-center justify-content-center text-chatter-black opacity-75">
            <div className="fs-3 fw-bold">CHATTER</div>
            <div className="my-1">¡Comunicate con tus amigos sin costo alguno!</div>
            <div className="division-line bg-chatter-black opacity-25 my-3"></div>
            <div className="fs-smaller d-flex justify-content-center align-items-center gap-2">
              <HiPhoneMissedCall />
              Llamadas Deshabilitadas
            </div>
          </div>
          <div className="empty-chat-line" />
        </div>
      ) : (
        <div className="chat-right-side w-70 d-flex flex-column p-0">
          <ChatHeader {...userChatData} />

          <ChatMessages chatId={selectedChat} chatsData={chats} setUserChatData={setUserChatData} />

          <div className="d-flex flex-row align-items-center justify-content-center bg-chatter-green px-4 py-2">
            <div className="black-icon cursor-pointer text-chatter-black fs-3 opacity-75">
              <FontAwesomeIcon icon={faSmile} />
            </div>

            <div className="w-100 px-3">
              <input
                placeholder="Escribe tu mensaje"
                value={msgEntry}
                className="user-chat-input px-4 py-4 w-100 bg-white"
                onChange={handleMsgEntry}
                onKeyDown={handleEnterPress}
                disabled={selectedChat ? false : true}
              />
            </div>

            <div
              className="black-icon text-chatter-black fs-3 opacity-75 cursor-pointer"
              onClick={handleSendMsg}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default HomeChat;
