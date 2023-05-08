import { LoginData } from "../types/login"
export const validateLogin = (values: LoginData) => {
  const error: Record<any, string> = {}
  const { email, password } = values
  const validEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
  
  if (!email.length) {
    error.email = 'Ingrese su email'
  }

  if (email.length && !validEmail.test(email)) {
    error.email = 'Email inválido'
  }
  if (!password.length) {
    error.password = 'Ingrese su contraseña'
  }
  return error
}