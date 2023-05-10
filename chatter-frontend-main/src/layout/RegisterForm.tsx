import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import FormData from 'form-data';
import { RegisterData } from '../types/register';
import Field from '../components/Home/Field';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { createUser } from '../redux/userSlice'
import { useRouter } from 'next/dist/client/router';
import { validateRegister } from '../utils/utils';
import { NotificationFailure, NotificationSuccess } from '../components/Notifications';
import { LoadRemove, LoadStart } from '../components/Loading';

function Register() {
  const initialValues: RegisterData = {
    name: '',
    lastName: '',
    email: '',
    password: ''
  };
  const router = useRouter()
  const [error, setError] = useState<any | undefined>();
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [formData, setFormData] = useState<RegisterData>(initialValues);
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const user = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()

  const data = new FormData();
  useEffect(() => {
  // eslint-disable-next-line no-console
  // console.log('register', user)
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files != null) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileClick = () => {
    if (hiddenFileInput.current != null) {
      hiddenFileInput.current.click();
    }
  };

  const handleRegister = async () => {
    const hasError = validateRegister(formData)
    data.append('image', selectedImage);
    data.append('name', formData.name);
    data.append('lastName', formData.lastName);
    data.append('email', formData.email.trim()); // API checks exact match
    data.append('password', formData.password);
    /* 
      TODO: 
      1. Make a new user - DONE
      2. Display a success notification (or error). - DONE
    */
    if (!Object.keys(hasError).length) {
      LoadStart()
      const resultAction: any = await dispatch(createUser(data))
      if (createUser.fulfilled.match(resultAction)) {
        router.push('/')
        NotificationSuccess(resultAction.payload.message || 'User created successfully!')
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
    } else {
      setError(hasError)
    }
  };

  return (
    <div
      id="register"
      className="right-side d-flex flex-column justify-content-start w-50 bg-chatter-green h-100 py-4 fs-1 fw-bold scroll-y"
    >
      <Field
        title="NOMBRE"
        type="text"
        name="name"
        placeholder="Ingresa tu nombre"
        onChange={handleInputChange}
        value={formData.name}
        error={error}
      />

      <Field
        title="APELLIDO"
        type="text"
        name="lastName"
        placeholder="Ingresa tu apellido"
        onChange={handleInputChange}
        value={formData.lastName}
        error={error}
      />

      <Field
        title="E-MAIL"
        type="email"
        name="email"
        placeholder="Ingresa tu correo electrónico"
        onChange={handleInputChange}
        value={formData.email}
        error={error}
      />

      <div className="content d-flex flex-column mb-4" data-aos="fade">
        <span>FOTO DE PERFIL</span>
        <label className="file">
          <button className="btn btn-input-file" onClick={handleFileClick}>
            Seleccionar Archivo
          </button>
          <input
            type="file"
            ref={hiddenFileInput}
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
        </label>
      </div>

      <Field
        title="CONTRASEÑA"
        type="password"
        name="password"
        placeholder="Ingresa tu contraseña"
        onChange={handleInputChange}
        value={formData.password}
        error={error}
      />

      <div className="content d-flex flex-column mb-3 d-flex align-items-start" data-aos="fade">
        <button className="btn btn-primary" onClick={handleRegister}>
          Registrarse
        </button>
      </div>

      <div className="content text d-flex flex-row gap-2 fs-6 fst-italic" data-aos="fade">
        <span>¿Ya tienes una cuenta?</span>
        <Link href="/" className="text-chatter-blue">
          Inicia sesión aquí
        </Link>
      </div>
    </div>
  );
}

export default Register;
