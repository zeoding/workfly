// 葡萄城


// 停止切换
var b= 0
spread.bind(GC.Spread.Sheets.Events.ActiveSheetChanging, function (sender, args) {
    if(b > 4){
        args.cancel = true;
    } else {
        b +=1
    }
});

// 获取当前表格
var sheet = spread.getActiveSheet();

// 获取表格的行数和列数
var rowCount = sheet.getRowCount();
var colCount = sheet.getColumnCount();

// 从最后一行开始往上遍历，如果整行都是空白则删除该行
for (var i = rowCount - 1; i >= 0; i--) {
    var isBlank = true;
    for (var j = 0; j < colCount; j++) {
        var cellValue = sheet.getValue(i, j);
        if (cellValue !== null && cellValue !== undefined && cellValue !== '') {
            isBlank = false;
            break;
        }
    }
    if (isBlank) {
        sheet.deleteRows(i, 1);
    }
}