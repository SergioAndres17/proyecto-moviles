import * as Yup from "yup";

export function initialValues() {
  return {
    documentType: "",
    documentNumber: "",
    fullName: "",
    birthDate: "",
    email: "",
    phone: "",
    password: "", // Nuevo campo
    confirmPassword: "", // Nuevo campo
  };
}

export function validationSchema() {
  return Yup.object().shape({
    documentType: Yup.string().required("Campo requerido"),
    documentNumber: Yup.string().required("Campo requerido"),
    fullName: Yup.string().required("Campo requerido"),
    birthDate: Yup.date()
      .required("Campo requerido")
      .max(new Date(), "La fecha no puede ser futura"),
    email: Yup.string()
      .email("Email no válido")
      .required("Campo requerido"),
    phone: Yup.string().required("Campo requerido"),
    password: Yup.string()
      .required("Campo requerido")
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .matches(/[A-Z]/, "Debe contener al menos una letra mayúscula")
      .matches(/[0-9]/, "Debe contener al menos un número")
      .matches(/[@$!%*?&]/, "Debe contener al menos un carácter especial (@$!%*?&)"),
      confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
      .required("Confirme su contraseña")
      
  });
}