// Lista única de documentos del formulario de vinculación.
// La usan tanto la página (para pintar los campos) como el endpoint
// (para nombrar los archivos en Drive), así no se desincronizan.

export interface CampoDocumento {
  /** Nombre del campo en el formulario y clave en el JSON que envía el navegador. */
  name: string;
  /** Etiqueta visible y base del nombre del archivo en Drive. */
  label: string;
  nota?: string;
  siAplica?: boolean;
}

export const DOCUMENTOS: CampoDocumento[] = [
  { name: 'camara_comercio', label: 'Certificado Cámara de Comercio', nota: 'Vigencia máxima de 1 mes' },
  { name: 'rut', label: 'Registro Único Tributario (RUT)' },
  { name: 'cedula_representante', label: 'Documento de Identidad del Representante Legal' },
  { name: 'certificacion_bancaria', label: 'Certificación Bancaria' },
  { name: 'referencia_comercial', label: 'Referencia Comercial' },
  { name: 'certificado_basc_iso', label: 'Certificado BASC, ISO u otros', siAplica: true },
  { name: 'resolucion_habilitacion', label: 'Resolución de Habilitación', siAplica: true },
  { name: 'declaracion_renta', label: 'Declaración de Renta' },
  { name: 'balance_estados', label: 'Balance General y Estados de Resultados' },
  { name: 'dictamen_revisor', label: 'Dictamen o Notas del Revisor Fiscal' },
  { name: 'tarjeta_contador', label: 'Copia de la Tarjeta Profesional del Contador' },
  { name: 'tarjeta_revisor', label: 'Copia de la Tarjeta Profesional del Revisor Fiscal' },
  { name: 'antecedentes_contador', label: 'Certificado de Antecedentes del Contador' },
  { name: 'antecedentes_revisor', label: 'Certificado de Antecedentes del Revisor Fiscal' },
];

export const FORMATOS_FIRMADOS: CampoDocumento[] = [
  { name: 'firmado_circular_170', label: 'Circular 170 - Conocimiento de Cliente' },
  { name: 'firmado_acuerdo_seguridad', label: 'Acuerdo de Seguridad' },
  { name: 'firmado_visita_seguridad', label: 'Formato de Visita de Seguridad' },
  { name: 'firmado_contrato_agenciamiento', label: 'Contrato de Agenciamiento' },
];

/** Campos de texto de la empresa, en el orden en que van al resumen. */
export const CAMPOS_EMPRESA: Array<{ name: string; label: string }> = [
  { name: 'tipo_vinculacion', label: 'Tipo de vinculación' },
  { name: 'razon_social', label: 'Razón social' },
  { name: 'nit', label: 'NIT' },
  { name: 'direccion', label: 'Dirección' },
  { name: 'ciudad', label: 'Ciudad / País' },
  { name: 'representante', label: 'Representante legal' },
  { name: 'email', label: 'Correo electrónico' },
  { name: 'telefono', label: 'Teléfono / WhatsApp' },
  { name: 'observaciones', label: 'Observaciones' },
];

/** Subcarpeta donde van los cuatro formatos firmados. */
export const SUBCARPETA_FIRMADOS = 'Firmados';

/** Quita caracteres que Drive maneja mal en nombres de archivo. */
export function limpiarNombre(valor: string): string {
  return valor.replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/g, ' ').trim();
}
