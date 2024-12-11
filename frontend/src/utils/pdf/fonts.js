import '@fontsource/noto-sans';

export const setupFonts = (doc) => {
  try {
    // Add normal font
    doc.addFont(
      'node_modules/@fontsource/noto-sans/files/noto-sans-latin-400-normal.woff',
      'NotoSans',
      'normal'
    );

    // Add bold font
    doc.addFont(
      'node_modules/@fontsource/noto-sans/files/noto-sans-latin-700-normal.woff',
      'NotoSans',
      'bold'
    );

    // Set default font
    doc.setFont('NotoSans');
    
    return true;
  } catch (error) {
    console.error('Error setting up fonts:', error);
    return false;
  }
};