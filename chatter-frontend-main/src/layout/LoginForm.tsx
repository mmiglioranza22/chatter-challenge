import Field from '../components/Home/Field';
import React, { useState, useEffect } from 'react';
import FormData from 'form-data';
import Link from 'next/link';
import { LoginData } from '../types/login';
import { UserDataState } from '../types/types'
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { loginUser, fetchUserData } from '../redux/userActions'
// import { loginUser, } from '../redux/userSlice';
// import { setUserData } from '../redux/userSlice';
import { validateLogin } from '../utils/utils';
import { useSessionStorage } from '../utils/customHooks';
import { useRouter } from 'next/dist/client/router';
import { LoadStart, LoadRemove } from '../components/Loading';


function LoginForm() {
  const initialValues: LoginData = {
    email: '',
    password: ''
  };
  const router = useRouter()
  const user = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  const [token, setToken] = useSessionStorage('token', '')

  const [formData, setFormData] = useState<LoginData>(initialValues);
  const [error, setError] = useState<any | undefined>();

  const data: FormData = new FormData();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // token is cleaned upon mounting, so all redirects to '/' clear session token.
  useEffect(() => {
    setToken('') 
  }, [])
  
  useEffect(() => {
    const { authToken, userId } = user
    if (authToken && userId) {
      setToken(authToken)
      handleFetchUserData(user)
      LoadStart()
      LoadRemove(2000)
      router.push('/chat')
    }
  }, [user.userId, user.authToken])

  const handleLogin = () => {
    resetForm();
    const hasError = validateLogin(formData)
    data.append('email', formData.email.trim());
    data.append('password', formData.password);
    /* 
      TODO: 
      1. Check login  - DONE
      2. Handle errors (if there is at least one) - DONE
    */
    if (!Object.keys(hasError).length) {
      // dispatch(loginUser(data))
      dispatch(loginUser(data))
    } else {
      setError(hasError)
    }
  };

  const handleFetchUserData = (user: UserDataState) => {
    dispatch(fetchUserData(user))
  }


  const resetForm = () => {
    // data.delete('email');
    // data.delete('password');
    // data.append('email', '');
    // data.append('password', '');
    // dispatch(loginUser(data))
    setFormData(initialValues);
  };

  return (
    <div
      id="login"
      className="right-side d-flex flex-column justify-content-center w-50 bg-chatter-green h-100 py-5 fs-1 fw-bold"
    >
      <Field
        title="E-MAIL"
        type="email"
        name="email"
        placeholder="Ingresa tu correo electrónico"
        onChange={handleInputChange}
        value={formData.email}
        error={error}
      />

      <Field
        title="CONTRASEÑA"
        type="password"
        name="password"
        placeholder="Ingresa tu contraseña"
        onChange={handleInputChange}
        value={formData.password}
        error={error}
      />

      <div className="content d-flex flex-column mb-5 d-flex align-items-start" data-aos="fade">
        <button type="submit" className="btn btn-primary" onClick={handleLogin}>
          Ingresar
        </button>
      </div>

      <div className="content text d-flex flex-row gap-2 mb-5 fs-6 fst-italic" data-aos="fade">
        <span>No tienes una cuenta?</span>
        <Link href="/register" className="text-chatter-blue">
          Registrate aquí
        </Link>
      </div>

      <div></div>
    </div>
  );
}

export default LoginForm;
