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