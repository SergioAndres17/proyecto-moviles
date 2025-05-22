import * as Yup from "yup";

export const initialValues = () => ({
  email: "",
});

export const validationSchema = () =>
  Yup.object({
    email: Yup.string()
      .email("Por favor ingresa un correo electrónico válido")
      .required("El correo electrónico es requerido"),
  });
