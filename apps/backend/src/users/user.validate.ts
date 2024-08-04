import * as yup from 'yup';
// Definir el esquema de validación con Yup
const loginSchema = yup.object().shape({
    password: yup.string().required('La constraseña es obligatoria'),
    email: yup.string().email('El email no es válido').required('El email es obligatorio'),
  });
// Definir el esquema de validación con Yup
const userSchema = yup.object().shape({
    password: yup.string().required('La constraseña es obligatoria'),
    email: yup.string().email('El email no es válido').required('El email es obligatorio'),
    name:yup.string().required("El nombre es obligatoria")
  });

  export default {
    userSchema,
    loginSchema
  };