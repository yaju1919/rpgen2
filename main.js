(function() {
    'use strict';
    var loaded = false,
        g_dqFile = '', g_dqObj = {},
        g_dqList = {
            "初期位置": "HERO",
            "BGM": "BGM",
            "背景": "BGIMG",
            "地面": "FLOOR",
            "物": "MAP",
            "人": "HUMAN",
            "宝箱": "TBOX",
            "マップ移動": "MPOINT",
            "しらべる": "SPOINT",
            "イベント": "EPOINT",
        };
    var h = $("<div>").appendTo($("body")).css({
        "text-align": "center",
        padding: "1em"
    });
    $("<h1>").text("RPGEN edit tool 2").appendTo(h);
    $("<div>").text("MAPのURLバーにjを入力した後に、Bookmarkletを貼り付けてEnter押してください。").appendTo(h);
    function addBtn(parentNode, title, func){
        return $("<button>",{text: title}).appendTo(parentNode||h).click(func);
    }
    var h_ui = $("<div>").appendTo(h),
        tabA = $("<div>").text("MAPデータを読み込ませてね"),
        tabB = $("<div>").text("outputを押してね"),
        tabC = $("<div>").text("outputを押してね");
    yaju1919.addTab(h,{
        list: {
            "Edit": tabA,
            "Output": tabB,
            "Bookmarklet": tabC,
        }
    });
    yaju1919.addInputText(h_ui,{
        title: "MAPデータを取得するBookmarklet",
        value: window.Bookmarklet.getMapData(),
        readonly: true
    });
    addBtn(h_ui,"clear",function(){
        $("#load").val('');
    });
    yaju1919.addInputText(h_ui,{
        id: "load",
        title: "load",
        change: function(v){
            if(!loaded) return;
            analysis(LZString.decompressFromEncodedURIComponent(v.replace(/^L1/,'')));
        }
    });
    function analysis(dqFile){
        g_dqFile = dqFile;
        g_dqObj = {};
        Object.keys(g_dqList).forEach(function(k){
            var key = g_dqList[k];
            var m = dqFile.match(new RegExp('(?<=#' + key + ')(.|\n)*?(?=#END)', 'g'));
            g_dqObj[key] = m ? m.map(v=>"#" + key + '\n' + v + "#END").join('\n\n') : '';
        });
    }
    var g_editingKey = '';
    yaju1919.addSelect(tabA,{
        title: "編集する項目",
        list: g_dqList,
        change: function(key){
            g_editingKey = key;
            $("#dq").val(g_dqObj[key]).trigger("change");
        }
    });
    yaju1919.addInputText(tabA,{
        title: "edit",
        id: "dq",
        textarea: true,
        hankaku: false,
        change: function(v){
            g_dqObj[g_editingKey] = v;
        }
    });
    addBtn(h_ui,"output",function(){
        var result = window.Bookmarklet.writeMapData(Object.keys(g_dqObj).join('\n\n'));
        yaju1919.addInputText(tabB.empty(),{
            value: result[0],
            textarea: true,
            readonly: true
        });
        yaju1919.addInputText(tabC.empty(),{
            value: result[1],
            textarea: true,
            readonly: true
        });
    }).css({
        color:"yellow",
        backgroundColor:"red",
        fontSize: "2em",
    });
    h_ui.children().after("<br>");
    loaded = true;
})();
