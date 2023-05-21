async function result() {
    var api_url = 'https://script.google.com/macros/s/AKfycbyO8biVdBlOkZo4A17HsyC1d29adWapDeRew8HglVcqdUmIVw9eBz1adZc6Z5MoWjauig/exec'; //生成したAPIのURLを指定
    
    await fetch(api_url)
    .then(response => {
        return response.json();
    })
    .then(data => {
        
        var rankTable = document.getElementById("rankTable");

        for (i = 0; i < data.length; ++i) {
            console.log(data[i]);
            var tr = rankTable.insertRow(-1); //引数-1 : 表の一番最後に1行追加

            // 順位を表示
            td0 = tr.insertCell(0);
            td0.innerHTML = i+1 ;
            td0.setAttribute("class","rankData rankDataBold");

            // ニックネームを取得
            td1 = tr.insertCell(1);
            td1.innerHTML = data[i].nickname;
            td1.setAttribute("class","rankData rankDataBold");

            // 合計得点を取得
            td2 = tr.insertCell(2);
            td2.innerHTML = data[i].sumPointValue;
            td2.setAttribute("class","rankData rankDataBold");

            // 図鑑範囲を取得
            var dictMaxValue;
            switch (data[i].dictMax) {
                case "151":
                    dictMaxValue = "カントー図鑑まで<br>(151匹)";
                    break;
                case "251":
                    dictMaxValue = "ジョウト図鑑まで<br>(251匹)";
                    break;
                case "386":
                    dictMaxValue = "ホウエン図鑑まで<br>(386匹)";
                    break;
                case "493":
                    dictMaxValue = "シンオウ図鑑まで<br>(493匹)";
                    break;
                case "649":
                    dictMaxValue = "イッシュ図鑑まで<br>(649匹)";
                    break;
                case "721":
                    dictMaxValue = "カロス図鑑まで<br>(721匹)";
                    break;
                case "809":
                    dictMaxValue = "アローラ図鑑まで<br>(809匹)";
                    break;
                case "898":
                    dictMaxValue = "ガラル図鑑まで<br>(898匹)";
                    break;
                case "905":
                    dictMaxValue = "ヒスイ図鑑まで<br>(905匹)";
                    break;
                case "1008":
                    dictMaxValue = "パルデア図鑑まで<br>(1008匹)";
                    break;
                default:
                    dictMaxValue = "";
            }

            td3 = tr.insertCell(3);
            td3.innerHTML = dictMaxValue;
            td3.setAttribute("class","rankData");

            // 画像タイプを取得
            var imageTypeValue;
            if (data[i].imageType === "TRUE") {
                imageTypeValue = "ドット絵";
            } else if (data[i].imageType === "FALSE") {
                imageTypeValue = "イラスト";
            } else {
                imageTypeValue ="";
            }

            td4 = tr.insertCell(4);
            td4.innerHTML = imageTypeValue;
            td4.setAttribute("class","rankData");

            // 回転を取得
            var rotateValue;
            if (data[i].rotate === "TRUE") {
                rotateValue = "あり";
            } else if (data[i].rotate === "FALSE") {
                rotateValue = "なし";
            } else {
                rotateValue = "";
            }

            td5 = tr.insertCell(5);
            td5.innerHTML = rotateValue;
            td5.setAttribute("class","rankData");

            // 正解数を取得
            td6 = tr.insertCell(6);
            td6.innerHTML = data[i].correctNum;
            td6.setAttribute("class","rankData");

            // 回答数を取得
            td7 = tr.insertCell(7);
            td7.innerHTML = data[i].sumNum;
            td7.setAttribute("class","rankData");

            // 回答時間を取得
            td8 = tr.insertCell(8);
            td8.innerHTML = data[i].timerValue;
            td8.setAttribute("class","rankData");

            // 回答時刻を取得
            var nowTimeValue;
            if (data[i].nowTime != "") {
                var nowTimeIso = Date.parse(data[i].nowTime);
                var nowTime = new Date(nowTimeIso);
                nowTimeValue = formatDate(nowTime, "yyyy/MM/dd HH:mm:ss");
            } else {
                nowTimeValue ="";
            }
            td9 = tr.insertCell(9);
            td9.innerHTML = nowTimeValue;
            td9.setAttribute("class","rankData");

            // タイプ色選択肢を取得
            var typeColorValue;
            if (data[i].typeColor === "FALSE") {
                typeColorValue = "なし";
            } else if (data[i].typeColor === "TRUE") {
                typeColorValue = "あり";
            } else {
                typeColorValue = "";
            }

            td10 = tr.insertCell(10);
            td10.innerHTML = typeColorValue;
            td10.setAttribute("class","rankData");

            // 選択肢の数を取得
            td11 = tr.insertCell(11);
            td11.innerHTML = data[i].choiceNum;
            td11.setAttribute("class","rankData");            
        }

    })
    .catch(error => {
        console.log(error);
    });
}

// 日付のフォーマット変換
function formatDate(date, format) {
    format = format.replace(/yyyy/g, date.getFullYear());
    format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
    format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2));
    format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2));
    format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
    format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
    format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3));
    return format;
};

result();