﻿import { jsPDF } from "jspdf"
var callAddFont = function () {
this.addFileToVFS('NotoSans-Italic-VariableFont_wdth,wght-normal.ttf', font);
this.addFont('NotoSans-Italic-VariableFont_wdth,wght-normal.ttf', 'NotoSans-Italic-VariableFont_wdth,wght', 'normal');
};
jsPDF.API.events.push(['addFonts', callAddFont])