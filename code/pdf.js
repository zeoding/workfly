const generatePDF = async () => {
  const pdf = new jsPDF({
    orientation: 'landscape',
    format: 'a4',
  });
  const elements = Array.from(document.querySelectorAll('.list-item .item'));
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  let yPosition = 0;
  const addImageToPDF = (canvas) => {
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    let remainingHeight = imgHeight;
    let srcY = 0;

    while (remainingHeight > 0) {
      const availableHeight = pdfHeight - yPosition;
      const addHeight = Math.min(availableHeight, remainingHeight);

      // 创建子canvas
      const subCanvas = document.createElement('canvas');
      subCanvas.width = canvas.width;
      subCanvas.height = (addHeight / pdfWidth) * canvas.width;
      const subCtx = subCanvas.getContext('2d');
      subCtx.drawImage(canvas, 0, srcY, canvas.width, subCanvas.height, 0, 0, canvas.width, subCanvas.height);

      const dataUrl = subCanvas.toDataURL('image/png');
      pdf.addImage(dataUrl, 'PNG', 0, yPosition, pdfWidth, addHeight);

      yPosition += addHeight;
      srcY += subCanvas.height;
      remainingHeight -= addHeight;

      if (yPosition >= pdfHeight) {
        pdf.addPage();
        yPosition = 0;
      }
    }
    // 不同图片之间增加10pt距离
    yPosition += 10;
    if (yPosition >= pdfHeight) {
      pdf.addPage();
      yPosition = 0;
    }
  };

  for (const element of elements) {
    const canvas = await htmlToImage.toCanvas(element, { quality: 1, pixelRatio: 2 });
    addImageToPDF(canvas)
  }

  pdf.save('document.pdf');
};