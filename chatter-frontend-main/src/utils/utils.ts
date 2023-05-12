import { APIResponse } from "../types/chat"
import { LoginData } from "../types/login"
import { RegisterData } from "../types/register" 
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

// https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
export const validateRegister = (values: RegisterData) => {
  const error: Record<any, string> = {}
  const { email, password, name, lastName } = values
  const validEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
  const strongPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
  
  if (!name.length) {
    error.name = 'Ingrese su nombre'
  }
  if (!lastName.length) {
    error.lastName = 'Ingrese su apellido'
  }
  if (!email.length) {
    error.email = 'Ingrese su email'
  }
  if (email.length && !validEmail.test(email)) {
    error.email = 'Formato de email inválido'
  } 
  if (!password.length) {
    error.password = 'Ingrese su contraseña'
  }
  if (password.length && !strongPassword.test(password)) {
    error.password = 'Ingrese mínimo 8 caracteres, al menos 1 letra, 1 número y 1 caracter especial.'
  } 
  // image check not implemented, checked by API
  return error
}

export const generateApiErrorResponse = (error: any | unknown): APIResponse => {
  const { response } = error  
  return {
    message: response.data.message,
    status: response.status,
    statusText: response.statusText
  }
}