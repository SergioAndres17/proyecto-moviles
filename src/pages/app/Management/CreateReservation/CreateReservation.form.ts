import * as Yup from "yup";
import { Reservation } from "../../../../services/reservationService";

export function initialValues(reservation?: Reservation) {
  return {
    fecha: reservation?.fecha ? `${reservation.fecha}T00:00:00` : new Date().toISOString(),
    hora: reservation?.hora ? `2000-01-01T${reservation.hora}` : new Date().toISOString(),
    numeroPersonas: reservation?.numeroPersonas ?? 0,
    observaciones: reservation?.observaciones ?? "",
    tipoReserva: reservation?.tipoReserva ?? "",
    status: reservation?.status ?? true,
    user: {
      id: reservation?.user.id ?? 0
    },
    cliente: {
      id: reservation?.cliente.id ?? 0
    },
    sitioTuristico: {
      id: reservation?.sitioTuristico.id ?? 0
    }
  };
}

export function validationSchema() {
  return Yup.object().shape({
    fecha: Yup.string()
      .required("La fecha es requerida")
      .test(
        'valid-date',
        'La fecha no puede ser en el pasado',
        value => !value || new Date(value) >= new Date(new Date().setHours(0, 0, 0, 0))
      ),
    hora: Yup.string().required("La hora es requerida"),
    numeroPersonas: Yup.number()
      .required("El número de personas es requerido")
      .min(1, "Debe haber al menos 1 persona")
      .max(50, "No puede exceder 50 personas"),
    observaciones: Yup.string()
      .max(500, "Las observaciones no pueden exceder 500 caracteres"),
    tipoReserva: Yup.string()
      .required("El tipo de reserva es requerido")
      .oneOf(
        ["Servicio de viaje", "Tour guiado", "Paquete turístico", "Hospedaje"],
        "Tipo de reserva no válido"
      ),
    cliente: Yup.object().shape({
      id: Yup.number()
        .required("Debe seleccionar un cliente")
        .min(1, "ID inválido")
    }),
    sitioTuristico: Yup.object().shape({
      id: Yup.number()
        .required("Debe seleccionar un sitio turístico")
        .min(1, "ID inválido")
    })
  });
}