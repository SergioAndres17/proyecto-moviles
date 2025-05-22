import * as Yup from "yup";
import { Factura } from "../../../../services/facturaService";

export function initialValues(factura?: Factura) {
  return {
    descripcion: factura?.descripcion ?? "",
    metodoPago: factura?.metodoPago ?? "",
    estadoPago: factura?.estadoPago ?? "", // Valor por defecto
    reservacionId: factura?.reservacion.id ?? 0,
    status: factura?.status ?? true,
    montoTotal: factura?.montoTotal ?? 0
  };
}

export function validationSchema() {
  return Yup.object().shape({
    descripcion: Yup.string()
      .required("La descripción es requerida")
      .max(500, "Máximo 500 caracteres"),
    metodoPago: Yup.string()
      .required("Seleccione un método de pago")
      .oneOf(
        ["Tarjeta de crédito", "Efectivo", "Transferencia", "PSE"],
        "Método no válido"
      ),
    estadoPago: Yup.string()
      .required("Seleccione un estado")
      .oneOf(["Pendiente", "Pagado", "Cancelado"], "Estado no válido"),
    reservacionId: Yup.number()
      .required("Seleccione una reservación")
      .min(1, "Reservación inválida"),
    status: Yup.boolean().required("Estado requerido"),
    montoTotal: Yup.number()
      .required("Monto requerido")
      .min(0, "No puede ser negativo")
      .typeError("Debe ser un número válido")
  });
}