import {
  IonPage,
  IonContent,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonText,
  IonLabel,
  IonIcon,
  useIonToast,
  IonModal,
  IonSearchbar,
  IonList,
  IonLoading,
} from "@ionic/react";
import { useFormik } from "formik";
import { useHistory, useParams } from "react-router-dom";
import { initialValues, validationSchema } from "./CreateFactura.form";
import { useState, useEffect } from "react";
import CustomHeader from "../../../../components/Header/CustomHeader";
import {
  cashOutline,
  cardOutline,
  receiptOutline,
  calendarOutline,
  checkmarkOutline,
} from "ionicons/icons";
import "./CreateFactura.scss";
import {
  createFactura,
  updateFactura,
  getFacturaById,
  Factura,
} from "../../../../services/facturaService";
import {
  fetchReservations,
  Reservation,
} from "../../../../services/reservationService";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function CreateFactura() {
  const history = useHistory();
  const { id } = useParams<{ id?: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);
  const [present] = useIonToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<
    Reservation[]
  >([]);
  const [showReservationSearch, setShowReservationSearch] = useState(false);
  const [reservationSearchTerm, setReservationSearchTerm] = useState("");

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        const [reservationsData] = await Promise.all([fetchReservations()]);

        setReservations(reservationsData);
        setFilteredReservations(reservationsData);

        // Si hay ID, cargar datos de la factura
        if (id) {
          const facturaData = await getFacturaById(parseInt(id));
          formik.setValues({
            descripcion: facturaData.descripcion,
            metodoPago: facturaData.metodoPago,
            estadoPago: facturaData.estadoPago,
            reservacionId: facturaData.reservacion.id,
            status: facturaData.status,
            montoTotal: facturaData.montoTotal || 0,
          });
        }
      } catch (error) {
        present({
          message: "Error cargando datos",
          duration: 3000,
          position: "top",
          color: "danger",
        });
        if (id) history.push("/facturas");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  // Filtrar reservaciones
  useEffect(() => {
    if (reservationSearchTerm) {
      setFilteredReservations(
        reservations.filter(
          (reservation) =>
            reservation.id?.toString().includes(reservationSearchTerm) ||
            reservation.cliente
              ?.toString()
              .toLowerCase()
              .includes(reservationSearchTerm.toLowerCase()) ||
            reservation.sitioTuristico
              ?.toString()
              .toLowerCase()
              .includes(reservationSearchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredReservations(reservations);
    }
  }, [reservationSearchTerm, reservations]);

  const generarPDF = (facturaData: Factura, reservacionData?: Reservation) => {
    const doc = new jsPDF();

    // Configuración inicial
    const marginLeft = 14;
    let currentY = 20;

    // Logo de la empresa
    const logoUrl = "https://www.pngkey.com/png/full/74-740215_avion-icon.png";
    try {
      doc.addImage(logoUrl, "PNG", marginLeft, currentY, 30, 30);
    } catch (e) {
      console.warn("No se pudo cargar el logo, continuando sin él");
    }

    // Encabezado de la factura
    doc.setFontSize(20);
    doc.setTextColor(41, 128, 185); // Azul corporativo
    doc.text("Explora Neiva", marginLeft + 35, currentY + 15);
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100); // Gris oscuro
    doc.text(
      "Agencia de Turismo Especializada",
      marginLeft + 35,
      currentY + 22
    );

    // Línea divisoria
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(marginLeft, currentY + 30, 200, currentY + 30);
    currentY += 40;

    // Información de la factura
    doc.setFontSize(14);
    doc.setTextColor(41, 128, 185);
    doc.text("FACTURA", marginLeft, currentY);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Número: ${facturaData.id || "PENDIENTE"}`, 140, currentY);
    currentY += 7;
    doc.text(`Fecha: ${new Date().toLocaleDateString("es-ES")}`, 140, currentY);
    currentY += 15;

    // Información del cliente (si hay reservación)
    if (reservacionData && reservacionData.cliente) {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("DATOS DEL CLIENTE", marginLeft, currentY);
      currentY += 7;

      doc.setFontSize(10);
      doc.text(
        `Nombre: ${reservacionData.cliente.fullName || "No disponible"}`,
        marginLeft,
        currentY
      );
      currentY += 7;
      doc.text(
        `Documento: ${reservacionData.cliente.documentType || ""} ${
          reservacionData.cliente.documentNumber || ""
        }`,
        marginLeft,
        currentY
      );
      currentY += 7;
      doc.text(
        `Email: ${reservacionData.cliente.email || "No disponible"}`,
        marginLeft,
        currentY
      );
      currentY += 15;
    }

    // Detalles de la reservación
    if (reservacionData) {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("DETALLES DE LA RESERVACIÓN", marginLeft, currentY);
      currentY += 7;

      doc.setFontSize(10);
      doc.text(`Número: ${reservacionData.id}`, marginLeft, currentY);
      currentY += 7;
      doc.text(`Fecha: ${reservacionData.fecha}`, marginLeft, currentY);
      currentY += 7;
      doc.text(
        `Sitio Turístico: ${
          reservacionData.sitioTuristico?.title || "No disponible"
        }`,
        marginLeft,
        currentY
      );
      currentY += 7;
      doc.text(`Tipo: ${reservacionData.tipoReserva}`, marginLeft, currentY);
      currentY += 15;
    }

    // Tabla de detalles de la factura
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("DETALLES DE FACTURACIÓN", marginLeft, currentY);
    currentY += 10;

    autoTable(doc, {
      startY: currentY,
      head: [["Descripción", "Valor"]],
      body: [
        ["Descripción del servicio", facturaData.descripcion],
        ["Método de Pago", facturaData.metodoPago],
        ["Estado de Pago", facturaData.estadoPago],
        [
          "Monto Total",
          `$${facturaData.montoTotal?.toLocaleString("es-ES") || "0"}`,
        ],
      ],
      margin: { left: marginLeft },
      styles: {
        cellPadding: 5,
        fontSize: 10,
        valign: "middle",
        halign: "left",
        textColor: [0, 0, 0],
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { cellWidth: "auto", fontStyle: "bold" },
        1: { cellWidth: "auto" },
      },
    });

    // Obtener posición final de la tabla
    currentY = (doc as any).lastAutoTable.finalY + 15;

    // Notas importantes
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("Notas:", marginLeft, currentY);
    currentY += 5;
    doc.text(
      "- Esta factura es válida como comprobante de pago.",
      marginLeft,
      currentY
    );
    currentY += 5;
    doc.text(
      "- Para reclamos o devoluciones, presentar este documento.",
      marginLeft,
      currentY
    );
    currentY += 5;
    doc.text(
      "- Gracias por preferir nuestros servicios turísticos.",
      marginLeft,
      currentY
    );

    // Pie de página
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Explora Neiva - Agencia de Turismo", marginLeft, 285);
    doc.text(
      "Tel: +57 123 456 7890 | Email: info@exploraneiva.com",
      marginLeft,
      290
    );
    doc.text("Nit: 123.456.789-0 | Regimen: Simplificado", marginLeft, 295);

    // Guardar el PDF
    doc.save(
      `Factura_${facturaData.id || "nueva"}_${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`
    );
  };

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        const facturaData = {
          descripcion: values.descripcion,
          metodoPago: values.metodoPago,
          estadoPago: values.estadoPago,
          status: true,
          reservacion: {
            id: values.reservacionId,
          },
          montoTotal: values.montoTotal,
        };

        let response: Factura;
        if (id) {
          // Modo edición
          response = await updateFactura(parseInt(id), facturaData);
          present({
            message: "Factura actualizada correctamente",
            duration: 3000,
            position: "top",
            color: "success",
          });
        } else {
          // Modo creación
          response = await createFactura(facturaData);
          present({
            message: "Factura creada correctamente",
            duration: 3000,
            position: "top",
            color: "success",
          });
        }

        const reservacionSeleccionada = reservations.find(
          (r) => r.id === values.reservacionId
        );

        generarPDF(response, reservacionSeleccionada);
        setShowSuccessModal(true);
      } catch (error: any) {
        present({
          message: error.message || "Error al procesar la factura",
          duration: 5000,
          position: "top",
          color: "danger",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <IonPage>
      <CustomHeader
        pageName={id ? "Editar Factura" : "Crear Factura"}
        showMenuButton={true}
        showLogoutButton={true}
      />

      <IonContent className="factura-page ion-padding">
        <IonLoading isOpen={isLoading} message="Cargando datos..." />

        <h2>{id ? "Editar Factura" : "Nueva Factura"}</h2>

        {/* Descripción */}
        <IonItem className="custom-item">
          <IonIcon icon={receiptOutline} slot="start" className="custom-icon" />
          <IonLabel>Descripción</IonLabel>
        </IonItem>
        <IonInput
          value={formik.values.descripcion}
          placeholder="Descripción del servicio"
          onIonChange={(e) =>
            formik.setFieldValue("descripcion", e.detail.value)
          }
        />
        {formik.errors.descripcion && (
          <IonText className="error">{formik.errors.descripcion}</IonText>
        )}

        {/* Método de Pago */}
        <IonItem className="custom-item" lines="full">
          <IonIcon icon={cardOutline} slot="start" className="custom-icon" />
          <IonLabel position="stacked">Método de Pago</IonLabel>
          <IonSelect
            value={formik.values.metodoPago}
            onIonChange={(e) =>
              formik.setFieldValue("metodoPago", e.detail.value)
            }
            placeholder="Seleccione método"
            interface="alert"
          >
            <IonSelectOption value="Tarjeta de crédito">
              Tarjeta de crédito
            </IonSelectOption>
            <IonSelectOption value="Efectivo">Efectivo</IonSelectOption>
            <IonSelectOption value="Transferencia">
              Transferencia bancaria
            </IonSelectOption>
            <IonSelectOption value="PSE">PSE</IonSelectOption>
          </IonSelect>
        </IonItem>
        {formik.errors.metodoPago && (
          <IonText className="error">{formik.errors.metodoPago}</IonText>
        )}

        {/* Estado de Pago */}
        <IonItem className="custom-item" lines="full">
          <IonIcon icon={cashOutline} slot="start" className="custom-icon" />
          <IonLabel position="stacked">Estado de Pago</IonLabel>
          <IonSelect
            value={formik.values.estadoPago}
            onIonChange={(e) =>
              formik.setFieldValue("estadoPago", e.detail.value)
            }
            interface="alert"
          >
            <IonSelectOption value="Pendiente">Pendiente</IonSelectOption>
            <IonSelectOption value="Pagado">Pagado</IonSelectOption>
            <IonSelectOption value="Cancelado">Cancelado</IonSelectOption>
          </IonSelect>
        </IonItem>
        {formik.errors.estadoPago && (
          <IonText className="error">{formik.errors.estadoPago}</IonText>
        )}

        {/* Selector de Reservación */}
        <IonItem
          className="custom-item"
          button
          onClick={() => setShowReservationSearch(true)}
        >
          <IonIcon
            icon={calendarOutline}
            slot="start"
            className="custom-icon"
          />
          <IonLabel>Reservación</IonLabel>
          <IonLabel
            slot="end"
            color={formik.values.reservacionId ? undefined : "medium"}
          >
            {formik.values.reservacionId
              ? `Reservación #${formik.values.reservacionId}`
              : "Seleccione reservación"}
          </IonLabel>
        </IonItem>
        {formik.errors.reservacionId && (
          <IonText className="error">{formik.errors.reservacionId}</IonText>
        )}

        {/* Modal de búsqueda de reservaciones */}
        <IonModal
          isOpen={showReservationSearch}
          onDidDismiss={() => {
            setShowReservationSearch(false);
            setReservationSearchTerm("");
          }}
          className="search-modal"
        >
          <IonContent>
            <IonSearchbar
              value={reservationSearchTerm}
              onIonChange={(e) =>
                setReservationSearchTerm(e.detail.value || "")
              }
              placeholder="Buscar reservación..."
            />
            <IonList>
              {filteredReservations.map((reservation) => (
                <IonItem
                  key={reservation.id}
                  button
                  detail={false}
                  onClick={() => {
                    formik.setFieldValue("reservacionId", reservation.id);
                    setShowReservationSearch(false);
                  }}
                >
                  <IonLabel>
                    <h2>Reservación #{reservation.id}</h2>
                    <p>
                      Cliente:{" "}
                      {reservation.cliente.fullName || reservation.cliente.id}
                    </p>
                    <p>
                      Sitio:{" "}
                      {reservation.sitioTuristico.title ||
                        reservation.sitioTuristico.id}
                    </p>
                    <p>Fecha: {reservation.fecha}</p>
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          </IonContent>
        </IonModal>

        {/* Botones */}
        <div className="button-row">
          <IonButton
            expand="block"
            fill="outline"
            onClick={() => history.goBack()}
            disabled={isSubmitting}
          >
            Cancelar
          </IonButton>

          <IonButton
            expand="block"
            onClick={() => formik.handleSubmit()}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Procesando..."
              : id
              ? "Actualizar Factura"
              : "Crear Factura"}
          </IonButton>
        </div>
      </IonContent>

      {/* Modal de éxito */}
      <IonModal isOpen={showSuccessModal} className="success-modal">
        <div className="modal-content">
          <IonIcon
            icon={checkmarkOutline}
            color="success"
            style={{ fontSize: "3rem", marginBottom: "16px" }}
          />
          <h2 className="modal-title">
            {id ? "¡Factura actualizada!" : "¡Factura generada!"}
          </h2>
          <p className="modal-message">
            {id
              ? "La factura ha sido actualizada correctamente."
              : "La factura ha sido creada correctamente."}
          </p>
          <div className="modal-buttons">
            <IonButton
              expand="block"
              onClick={() => {
                setShowSuccessModal(false);
                history.push("/facturas");
              }}
            >
              Aceptar
            </IonButton>
          </div>
        </div>
      </IonModal>
    </IonPage>
  );
}
