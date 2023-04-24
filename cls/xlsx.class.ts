// @ts-ignore
import XLSX from 'xlsx/dist/xlsx.full.min.js';

export class XLSXParser {
  // 브라우저에서 엑셀파일을 JSON으로 읽어오는 함수
  readfile(file: File, sheetindex?: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[sheetindex ?? 0];
        const worksheet = workbook.Sheets[sheetName];
        const result = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        resolve(result);
      };
      reader.onerror = e => {
        reject(e);
      };
      reader.readAsBinaryString(file);
    });
  }

  // JSON 데이터를 엑셀파일로 변환하는 함수
  writefile(sheets: [string, any][], filename: string) {
    const workbook = XLSX.utils.book_new();
    for (const [name, sheet] of sheets) {
      XLSX.utils.book_append_sheet(workbook, sheet, name);
    }
    XLSX.writeFile(workbook, filename);
  }

  createSheet(data: any[]) {
    return XLSX.utils.json_to_sheet(data);
  }
}
