const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

function createPDF(id_cotizacion, id_proveedores, rut_usuario, estadoSeguimiento, solicitud) {
  try {
    const pdfPath = path.join(__dirname, `BoletaPedidoCotizacion${id_cotizacion}.pdf`);
    const pdfDoc = new PDFDocument();

    // Pipe the PDF document to a writable stream to save it to a file
    pdfDoc.pipe(fs.createWriteStream(pdfPath));

    // Content definition
    const docContent = [
      { text: 'Boleta de Pedido de Cotización', style: 'header' },
      { text: 'Detalles del Pedido:', style: 'subheader' },
      { text: `ID Cotización: ${id_cotizacion}` },
      { text: `ID Proveedor: ${id_proveedores}` },
      { text: `RUT Usuario: ${rut_usuario}` },
      { text: 'Detalles de Seguimiento:', style: 'subheader' },
      { text: `Estado de Seguimiento: ${estadoSeguimiento}` },
      { text: 'Solicitud:', style: 'subheader' },
      {
        table: {
          body: [
            ['Nombre del Producto', 'Cantidad Solicitada'],
            ...solicitud.map(item => [item.nombre_producto, item.cantidad_solicitada])
          ]
        }
      }
    ];

    // Apply styles
    pdfDoc.font('Helvetica-Bold');
    pdfDoc.fontSize(18);
    pdfDoc.text(docContent);

    // End and close the document
    pdfDoc.end();

    console.log(`PDF creado correctamente en: ${pdfPath}`);
    return pdfPath;
  } catch (error) {
    console.error('Error al crear el PDF:', error);
    throw error; // Propagate the error for handling at a higher level
  }
}

module.exports = createPDF;
