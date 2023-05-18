// To prevent SpreadJS from overwriting existing dropdowns when pasting content, you can use the following code:

var spread = new GC.Spread.Sheets.Workbook(document.getElementById("ss"), {sheetCount: 1});
var activeSheet = spread.getActiveSheet();

activeSheet.bind(GC.Spread.Sheets.Events.ClipboardPasting, function (sender, args) {
    var pastedData = args.pasteData;
    var selectedRange = activeSheet.getSelections()[0];
    var dropdowns = activeSheet.getDropDowns();
    var dropdownsInRange = dropdowns.filter(function (dropdown) {
        return dropdown.range.intersect(selectedRange);
    });
    var dropdownValues = dropdownsInRange.map(function (dropdown) {
        return dropdown.value();
    });
    pastedData.forEach(function (row, rowIndex) {
        row.forEach(function (cell, colIndex) {
            if (typeof cell === "string" && dropdownValues.indexOf(cell) !== -1) {
                args.cancel = true;
                alert("Pasting this data would overwrite an existing dropdown value.");
                return;
            }
        });
    });
});