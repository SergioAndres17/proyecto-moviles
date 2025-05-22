import * as Yup from "yup";
import { Client } from "../../../../services/clientService";

export function initialValues(client?: Client) {
  return {
    status: client?.status ?? true,
    documentType: client?.documentType ?? "",
    documentNumber: client?.documentNumber ?? "",
    fullName: client?.fullName ?? "",
    birthDate: client?.birthDate ?? "",
    email: client?.email ?? "",
    phone: client?.phone ?? ""
  };
}

export function validationSchema() {
  return Yup.object().shape({
    documentType: Yup.string()
      .required("Tipo de documento es requerido")
      .oneOf(
        ["CC", "CE", "TI", "PP", "NIT"], 
        "Tipo de documento no válido"
      ),
      
    documentNumber: Yup.string()
      .required("Número de documento es requerido")
      .matches(/^[0-9]+$/, "Solo se permiten números")
      .min(5, "Debe tener al menos 5 dígitos")
      .max(20, "No puede exceder 20 dígitos"),
      
    fullName: Yup.string()
      .required("Nombre completo es requerido")
      .min(5, "El nombre debe tener al menos 5 caracteres")
      .max(100, "El nombre no puede exceder 100 caracteres"),
      
    birthDate: Yup.string()
      .required("Fecha de nacimiento es requerida")
      .test(
        'valid-date',
        'La fecha no puede ser en el futuro',
        value => !value || new Date(value) <= new Date()
      ),
      
    email: Yup.string()
      .email("Ingrese un email válido")
      .required("Email es requerido")
      .max(100, "El email no puede exceder 100 caracteres"),
      
    phone: Yup.string()
      .required("Teléfono es requerido")
      .matches(/^[0-9]+$/, "Solo se permiten números")
      .min(7, "El teléfono debe tener al menos 7 dígitos")
      .max(15, "El teléfono no puede exceder 15 dígitos")
  });
}