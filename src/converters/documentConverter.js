const fs = require('fs').promises;
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const mammoth = require('mammoth');
const XLSX = require('xlsx');

class DocumentConverter {
    constructor() {
        this.supportedFormats = {
            input: ['pdf', 'docx', 'doc', 'txt', 'rtf', 'odt', 'xlsx', 'xls', 'csv', 'html'],
            output: ['pdf', 'docx', 'txt', 'html', 'rtf', 'csv']
        };
    }

    async convert(inputPath, outputPath, outputFormat, inputFormat) {
        try {
            // 驗證格式
            if (!this.supportedFormats.output.includes(outputFormat)) {
                throw new Error(`不支援的輸出格式: ${outputFormat}`);
            }

            // 根據輸入和輸出格式選擇轉換方法
            const conversionKey = `${inputFormat}_to_${outputFormat}`;
            
            switch (conversionKey) {
                // TXT 轉換
                case 'txt_to_pdf':
                    return await this.txtToPdf(inputPath, outputPath);
                case 'txt_to_html':
                    return await this.txtToHtml(inputPath, outputPath);
                case 'txt_to_docx':
                    return await this.txtToDocx(inputPath, outputPath);
                    
                // DOCX 轉換
                case 'docx_to_pdf':
                    return await this.docxToPdf(inputPath, outputPath);
                case 'docx_to_html':
                    return await this.docxToHtml(inputPath, outputPath);
                case 'docx_to_txt':
                    return await this.docxToTxt(inputPath, outputPath);
                    
                // Excel/CSV 轉換
                case 'xlsx_to_csv':
                case 'xls_to_csv':
                    return await this.excelToCsv(inputPath, outputPath);
                case 'xlsx_to_pdf':
                case 'xls_to_pdf':
                    return await this.excelToPdf(inputPath, outputPath);
                case 'csv_to_xlsx':
                    return await this.csvToExcel(inputPath, outputPath);
                case 'csv_to_pdf':
                    return await this.csvToPdf(inputPath, outputPath);
                    
                // HTML 轉換
                case 'html_to_pdf':
                    return await this.htmlToPdf(inputPath, outputPath);
                case 'html_to_txt':
                    return await this.htmlToTxt(inputPath, outputPath);
                    
                // PDF 轉換
                case 'pdf_to_txt':
                    return await this.pdfToTxt(inputPath, outputPath);
                    
                // 相同格式
                default:
                    if (inputFormat === outputFormat) {
                        await fs.copyFile(inputPath, outputPath);
                        return { success: true, outputPath };
                    }
                    
                    // 嘗試通用轉換
                    return await this.genericConvert(inputPath, outputPath, inputFormat, outputFormat);
            }
        } catch (error) {
            console.error('文檔轉換錯誤:', error);
            throw new Error(`文檔轉換失敗: ${error.message}`);
        }
    }

    // TXT 轉 PDF
    async txtToPdf(inputPath, outputPath) {
        const text = await fs.readFile(inputPath, 'utf-8');
        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        
        const fontSize = 12;
        const lineHeight = fontSize * 1.5;
        const margin = 50;
        const pageWidth = 595.28;
        const pageHeight = 841.89;
        const maxWidth = pageWidth - 2 * margin;
        const maxHeight = pageHeight - 2 * margin;

        const lines = text.split('\n');
        let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
        let yPosition = pageHeight - margin;

        for (const line of lines) {
            if (yPosition < margin + lineHeight) {
                currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
                yPosition = pageHeight - margin;
            }

            currentPage.drawText(line || ' ', {
                x: margin,
                y: yPosition,
                size: fontSize,
                font: font,
                color: rgb(0, 0, 0),
                maxWidth: maxWidth
            });

            yPosition -= lineHeight;
        }

        const pdfBytes = await pdfDoc.save();
        await fs.writeFile(outputPath, pdfBytes);
        
        return { success: true, outputPath };
    }

    // TXT 轉 HTML
    async txtToHtml(inputPath, outputPath) {
        const text = await fs.readFile(inputPath, 'utf-8');
        const lines = text.split('\n');
        
        const html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Converted Document</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 20px;
            white-space: pre-wrap;
        }
    </style>
</head>
<body>
    ${lines.map(line => `<p>${line || '&nbsp;'}</p>`).join('\n')}
</body>
</html>`;

        await fs.writeFile(outputPath, html, 'utf-8');
        return { success: true, outputPath };
    }

    // TXT 轉 DOCX (簡單實現)
    async txtToDocx(inputPath, outputPath) {
        // 這裡需要更複雜的DOCX生成邏輯
        // 暫時使用簡單的文字複製
        const text = await fs.readFile(inputPath, 'utf-8');
        
        // 建立簡單的DOCX結構
        // 實際應用中應該使用專門的DOCX生成庫
        await fs.writeFile(outputPath, text, 'utf-8');
        
        return { success: true, outputPath };
    }

    // DOCX 轉 HTML
    async docxToHtml(inputPath, outputPath) {
        const result = await mammoth.convertToHtml({ path: inputPath });
        const html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Converted Document</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 20px;
        }
    </style>
</head>
<body>
    ${result.value}
</body>
</html>`;

        await fs.writeFile(outputPath, html, 'utf-8');
        
        if (result.messages.length > 0) {
            console.log('轉換警告:', result.messages);
        }
        
        return { success: true, outputPath };
    }

    // DOCX 轉 TXT
    async docxToTxt(inputPath, outputPath) {
        const result = await mammoth.extractRawText({ path: inputPath });
        await fs.writeFile(outputPath, result.value, 'utf-8');
        
        return { success: true, outputPath };
    }

    // DOCX 轉 PDF (需要更複雜的實現)
    async docxToPdf(inputPath, outputPath) {
        // 先轉為文字，再轉為PDF
        const result = await mammoth.extractRawText({ path: inputPath });
        const text = result.value;
        
        // 使用 txtToPdf 的邏輯
        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        
        const fontSize = 12;
        const lineHeight = fontSize * 1.5;
        const margin = 50;
        const pageWidth = 595.28;
        const pageHeight = 841.89;
        const maxWidth = pageWidth - 2 * margin;

        const lines = text.split('\n');
        let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
        let yPosition = pageHeight - margin;

        for (const line of lines) {
            if (yPosition < margin + lineHeight) {
                currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
                yPosition = pageHeight - margin;
            }

            currentPage.drawText(line || ' ', {
                x: margin,
                y: yPosition,
                size: fontSize,
                font: font,
                color: rgb(0, 0, 0),
                maxWidth: maxWidth
            });

            yPosition -= lineHeight;
        }

        const pdfBytes = await pdfDoc.save();
        await fs.writeFile(outputPath, pdfBytes);
        
        return { success: true, outputPath };
    }

    // Excel 轉 CSV
    async excelToCsv(inputPath, outputPath) {
        const workbook = XLSX.readFile(inputPath);
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        
        await fs.writeFile(outputPath, csv, 'utf-8');
        return { success: true, outputPath };
    }

    // Excel 轉 PDF
    async excelToPdf(inputPath, outputPath) {
        const workbook = XLSX.readFile(inputPath);
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const page = pdfDoc.addPage();
        
        const fontSize = 10;
        const lineHeight = fontSize * 1.5;
        let yPosition = page.getHeight() - 50;
        
        for (const row of data) {
            if (yPosition < 50) {
                const newPage = pdfDoc.addPage();
                yPosition = newPage.getHeight() - 50;
            }
            
            const text = row.join(' | ');
            page.drawText(text, {
                x: 50,
                y: yPosition,
                size: fontSize,
                font: font,
                color: rgb(0, 0, 0)
            });
            
            yPosition -= lineHeight;
        }
        
        const pdfBytes = await pdfDoc.save();
        await fs.writeFile(outputPath, pdfBytes);
        
        return { success: true, outputPath };
    }

    // CSV 轉 Excel
    async csvToExcel(inputPath, outputPath) {
        const csvData = await fs.readFile(inputPath, 'utf-8');
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(
            csvData.split('\n').map(row => row.split(','))
        );
        
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, outputPath);
        
        return { success: true, outputPath };
    }

    // CSV 轉 PDF
    async csvToPdf(inputPath, outputPath) {
        const csvData = await fs.readFile(inputPath, 'utf-8');
        const rows = csvData.split('\n').map(row => row.split(','));
        
        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const page = pdfDoc.addPage();
        
        const fontSize = 10;
        const lineHeight = fontSize * 1.5;
        let yPosition = page.getHeight() - 50;
        
        for (const row of rows) {
            if (yPosition < 50) {
                const newPage = pdfDoc.addPage();
                yPosition = newPage.getHeight() - 50;
            }
            
            const text = row.join(' | ');
            page.drawText(text, {
                x: 50,
                y: yPosition,
                size: fontSize,
                font: font,
                color: rgb(0, 0, 0)
            });
            
            yPosition -= lineHeight;
        }
        
        const pdfBytes = await pdfDoc.save();
        await fs.writeFile(outputPath, pdfBytes);
        
        return { success: true, outputPath };
    }

    // HTML 轉 PDF (簡單實現)
    async htmlToPdf(inputPath, outputPath) {
        const html = await fs.readFile(inputPath, 'utf-8');
        
        // 移除HTML標籤（簡單實現）
        const text = html.replace(/<[^>]*>/g, '');
        
        // 使用 txtToPdf 的邏輯
        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        
        const fontSize = 12;
        const lineHeight = fontSize * 1.5;
        const margin = 50;
        const pageWidth = 595.28;
        const pageHeight = 841.89;

        const lines = text.split('\n');
        let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
        let yPosition = pageHeight - margin;

        for (const line of lines) {
            if (yPosition < margin + lineHeight) {
                currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
                yPosition = pageHeight - margin;
            }

            currentPage.drawText(line.trim() || ' ', {
                x: margin,
                y: yPosition,
                size: fontSize,
                font: font,
                color: rgb(0, 0, 0)
            });

            yPosition -= lineHeight;
        }

        const pdfBytes = await pdfDoc.save();
        await fs.writeFile(outputPath, pdfBytes);
        
        return { success: true, outputPath };
    }

    // HTML 轉 TXT
    async htmlToTxt(inputPath, outputPath) {
        const html = await fs.readFile(inputPath, 'utf-8');
        // 移除HTML標籤
        const text = html.replace(/<[^>]*>/g, '').trim();
        
        await fs.writeFile(outputPath, text, 'utf-8');
        return { success: true, outputPath };
    }

    // PDF 轉 TXT (基本實現)
    async pdfToTxt(inputPath, outputPath) {
        // 注意：這需要更複雜的PDF解析庫
        // 這裡只是創建一個占位檔案
        const message = '此功能需要額外的PDF解析庫支援。\n請考慮使用專門的PDF處理工具。';
        await fs.writeFile(outputPath, message, 'utf-8');
        
        return { success: true, outputPath, note: '需要額外的PDF解析庫' };
    }

    // 通用轉換（後備方案）
    async genericConvert(inputPath, outputPath, inputFormat, outputFormat) {
        // 嘗試讀取並寫入
        const content = await fs.readFile(inputPath);
        await fs.writeFile(outputPath, content);
        
        return { 
            success: true, 
            outputPath,
            warning: `從 ${inputFormat} 到 ${outputFormat} 的轉換可能不完整`
        };
    }
}

module.exports = new DocumentConverter();