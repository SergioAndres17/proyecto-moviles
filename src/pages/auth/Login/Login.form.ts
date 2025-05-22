import * as Yup from 'yup';

export const initialValues = () => ({
  email: '',
  password: '',
});

export const validationSchema = () => 
  Yup.object({
    email: Yup.string()
      .email('Por favor ingresa un correo electrónico válido')
      .required('El correo electrónico es requerido'),
    password: Yup.string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .required('La contraseña es requerida'),
  });