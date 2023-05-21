// formの送信による再読み込みでループさせる

// ホーム画面で入力される値
var dictMin = 1; // 図鑑の最小値(未実装)
var dictMax = 1008; // 図鑑の最大値
var choiceNum = 4; // 選択肢の数(β版)
var rotate = "true"; // 回転の有無
var imageType = "true"; // 画像タイプ
var questionNum = 1; // 問題数(β版)
var nickname; // ニックネーム
var typeColor = "false"; // タイプ色選択肢(β版)

var choiceNumMax = 8; //HTMLでの選択肢の最大数をここに記入

// 結果画面で使う値
var correctNum = 0; // 現在の正解数
var sumNum = 0; // 現在の回答数

// 変数初期化
var nameList =[]; //選択肢の名前リスト
var randomNumber; // 正解の選択肢
var imgElem; //問題の画像
var usedNum = []; // 既に問題に使用された図鑑番号

let startTime; // 開始時間
let stopTime = 0; // 停止時間
let timeoutID; // タイムアウトID

// 文字用のタイプ色
const darkColors = {
    normal: '#6D6D4E',
    fire: '#9C531F',
    water: '#445E9C',
    grass: '#4E8234',
    electric: '#A1871F',
    ice: '#638D8D',
    fighting: '#7D1F1A',
    poison: '#682A68',
    ground: '#927D44',
    flying: '#6D5E9C',
    psychic: '#A13959',
    bug: '#6D7815',
    rock: '#786824',
    ghost: '#493963',
    dragon: '#4924A1',
    dark: '#49392F',
    steel: '#787887',
    fairy: '#9B6470'
}
// 枠用のタイプ色
const colors = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC'
}
// 背景用のタイプ色
const lightColors = {
    normal: '#C6C6A7',
    fire: '#F5AC78',
    water: '#9DB7F5',
    grass: '#A7DB8D',
    electric: '#FAE078',
    ice: '#BCE6E6',
    fighting: '#D67873',
    poison: '#C183C1',
    ground: '#EBD69D',
    flying: '#C6B7F5',
    psychic: '#FA92B2',
    bug: '#C6D16E',
    rock: '#D1C17D',
    ghost: '#A292BC',
    dragon: '#A27DFA',
    dark: '#A29288',
    steel: '#D1D1E0',
    fairy: '#F4BDC9'
}

// ホーム画面
async function displayHome() {
    // ホーム画面を表示
    document.getElementById("home").style.display ="block";
    // 問題情報を非表示
    document.getElementById("testInfo").style.display ="none";
    // 問題画面を非表示
    document.getElementById("test").style.display ="none";
    // 結果画面を非表示
    document.getElementById("result").style.display ="none";

    // 図鑑範囲の画像を表示
    var dictList = ["1","4","7","152","155","158","252","255","258","387","390","393","495","498","501","650","653","656","722","725","728","810","813","816","906","909","912"];
    for(var i = 0; i < dictList.length; i++) {
        getImage(dictList[i]);
    }

    // 画像タイプの画像を表示、ピカチュウ
    var res = await fetch("https://pokeapi.co/api/v2/pokemon/25");
    var data = await res.json();
    // official-artworkを表示
    var imgSrcPika1 = data['sprites']['front_default'];
    imgPika1 = document.createElement('img');
    imgPika1.src = imgSrcPika1;
    var divPika1 = document.getElementById('Pika1');
    divPika1.appendChild(imgPika1);

    // front_defaultを表示
    var imgSrcPika2 = data['sprites']['other']['official-artwork']['front_default'];
    imgPika2 = document.createElement('img');
    imgPika2.src = imgSrcPika2;
    var divPika2 = document.getElementById('Pika2');
    divPika2.appendChild(imgPika2);
}

//ホーム画面で画像を表示
async function getImage(dictNum) {
    // APIでjsonを取得
    var res = await fetch("https://pokeapi.co/api/v2/pokemon/" + dictNum);
    var data = await res.json();
    // HTMLのimg要素を生成
    var imgSrc = data['sprites']['front_default'];
    var dictImg = document.createElement('img');
    dictImg.src = imgSrc;
    // 画像を表示
    var dictName = "dict" + dictNum;
    var div = document.getElementById(dictName);
    div.appendChild(dictImg);

    //同じ画像を表示する場合
    var dictName2 = dictName + "-2";
    var div2 = document.getElementById(dictName2);
    if (div2 != null) {
        var dictImg2 = document.createElement('img');
        dictImg2.src = imgSrc;
        div2.appendChild(dictImg2);
    }
}

// 結果画面
async function displayResult() {
    // 問題情報を非表示
    document.getElementById("testInfo").style.display ="none";
    // 問題画面を非表示
    document.getElementById("test").style.display ="none";
    // 結果画面を表示
    document.getElementById("result").style.display ="block";

    // ホームに戻るボタンを非活性化
    var backButton = document.getElementById("backButton");
    backButton.disabled = true;

    // POST通信の情報を表示
    var postInfo = document.getElementById("postInfo");
    postInfo.innerText = "結果送信中\nそのままお待ちください\n更新や移動をすると、結果が保存されない場合があります";

    // 正解数と回答数を表示
    correctAndSum();

    //　タイマーの値を取得
    const timer = document.getElementById('time');
    var timerValue = timer.textContent;
    // 現在時刻を取得
    var nowTime = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
    // 日付のフォーマットを変換
    var nowTimeValue = formatDate(nowTime, "yyyy/MM/dd HH:mm:ss");
    // ISOに変換
    var nowTimeIso = nowTime.toISOString();

    // 図鑑範囲を変換
    var dictMaxValue;
    var dictMaxCalc = 0;
    switch (dictMax) {
        case "151":
            dictMaxValue = "カントー図鑑まで(151匹)";
            dictMaxCalc = 151;
            break;
        case "251":
            dictMaxValue = "ジョウト図鑑まで(251匹)";
            dictMaxCalc = 251;
            break;
        case "386":
            dictMaxValue = "ホウエン図鑑まで(386匹)";
            dictMaxCalc = 386;
            break;
        case "493":
            dictMaxValue = "シンオウ図鑑まで(493匹)";
            dictMaxCalc = 493;
            break;
        case "649":
            dictMaxValue = "イッシュ図鑑まで(649匹)";
            dictMaxCalc = 649;
            break;
        case "721":
            dictMaxValue = "カロス図鑑まで(721匹)";
            dictMaxCalc = 721;
            break;
        case "809":
            dictMaxValue = "アローラ図鑑まで(809匹)";
            dictMaxCalc = 809;
            break;
        case "898":
            dictMaxValue = "ガラル図鑑まで(898匹)";
            dictMaxCalc = 898;
            break;
        case "905":
            dictMaxValue = "ヒスイ図鑑まで(905匹)";
            dictMaxCalc = 909;
            break;
        case "1008":
            dictMaxValue = "パルデア図鑑まで(1008匹)";
            dictMaxCalc = 1008;
            break;
        default:
            dictMaxValue = "";
            dictMaxCalc = 0;
    }
    dictMaxCalc = dictMaxCalc ** 0.5;

    // 画像タイプを変換
    var imageTypeValue;
    var imageTypeCalc = 0;
    if (imageType === 'true') {
        imageTypeValue = "ドット絵";
        imageTypeCalc = 3/2;
    } else {
        imageTypeValue = "イラスト";
        imageTypeCalc = 2/2;
    }

    // 回転を変換
    var rotateValue;
    var rotateCalc = 0;
    if (rotate === 'true') {
        rotateValue = "あり";
        rotateCalc = 2/2;
    } else {
        rotateValue = "なし";
        rotateCalc = 2/3;
    }

    // 正解数を変換
    var correctNumCalc = correctNum ** 0.75;
    // 回答数を変換
    var sumNumCalc = sumNum ** 0.1;

    // 回答時間を変換
    const hour = parseInt(timerValue.substring(0, 2));
    const min = parseInt(timerValue.substring(3, 5));
    const sec = parseFloat(timerValue.substring(6, 12));
    var endTimeValue = (hour * 60 + min) * 60 + sec;
    var endTimeValueCalc = endTimeValue ** 0.5;
    
    // タイプ色選択肢を変換
    var typeColorValue;
    var typeColorCalc = 0;
    if (typeColor === 'false') {
        typeColorValue = "なし";
        typeColorCalc = 2/2;
    } else {
        typeColorValue = "あり";
        typeColorCalc = 2/3;
    }

    // 選択肢の数を変換
    var choiceNumCalc = choiceNum / 4;

    // 合計得点計算
    var sumPointValue = dictMaxCalc * imageTypeCalc *rotateCalc * correctNumCalc * sumNumCalc * typeColorCalc * choiceNumCalc / endTimeValueCalc;
    sumPointValue = sumPointValue.toFixed(3);

    // 合計得点表示
    var sumPointId = document.getElementById("resultSumValue");
    sumPointId.innerText = sumPointValue;

    // 合計得点によってメッセージを変更
    var resultMessageValue;
    if (sumPointValue >= 150) {
        resultMessageValue = "きたえた！";
    } else if (sumPointValue >= 100) {
        resultMessageValue = "さいこう";
    } else if (sumPointValue > 93.75) {
        resultMessageValue = "すばらしい";
    } else if (sumPointValue > 81.25) {
        resultMessageValue = "すごくいい";
    } else if (sumPointValue > 50) {
        resultMessageValue = "かなりいい";
    } else if (sumPointValue > 0) {
        resultMessageValue = "まあまあ";
    } else {
        resultMessageValue = "ダメかも";
    }
    var resultMessage = document.getElementById("resultMessage");
    resultMessage.innerText = resultMessageValue;

    // 結果画面に表示する項目のリスト
    var resultItems = ["ニックネーム", "図鑑範囲", "画像タイプ", "回転", "正解数", "回答数", "回答時間", "回答時刻", "タイプ色選択肢", "選択肢の数"];
    // 結果画面に表示する結果のリスト
    var resultDataValue = [nickname, dictMaxValue, imageTypeValue, rotateValue, correctNum, sumNum, timerValue, nowTimeValue, typeColorValue, choiceNum];
    // 結果画面に表示する得点のリスト
    var resultDataCalc = ["-", "× " + dictMaxCalc.toFixed(2), "× " + imageTypeCalc.toFixed(2), "× " + rotateCalc.toFixed(2), "× " + correctNumCalc.toFixed(2), "× " + sumNumCalc.toFixed(2), "÷ " + endTimeValueCalc.toFixed(2), "-", "× " + typeColorCalc.toFixed(2), "× " + choiceNumCalc.toFixed(2)];
    
    // 表を作成
    var resultTable = document.getElementById("resultTable");
    for (i = 0; i < resultDataValue.length; ++i) {
        var tr = resultTable.insertRow(-1); //引数-1 : 表の一番最後に1行追加

        var th = document.createElement("th");
        var thText = document.createTextNode(resultItems[i]);
        th.appendChild(thText);
        tr.appendChild(th);
        
        td1 = tr.insertCell(1);
        td1.innerHTML = resultDataValue[i];
        td1.setAttribute("class","resultDataValue");
        
        td2 = tr.insertCell(2);
        td2.innerHTML = resultDataCalc[i];
        td2.setAttribute("class","resultDataCalc");
    }

    // GAS経由でGoogleスプレッドシートに記入
    const data = new FormData();
    data.set('nickname', nickname);
    data.set('dictMax', dictMax);
    data.set('imageType', imageType);
    data.set('rotate', rotate);
    data.set('correctNum', correctNum);
    data.set('sumNum', sumNum);
    data.set('timerValue', timerValue);
    data.set('nowTime', nowTimeIso);
    data.set('typeColor', typeColor);
    data.set('choiceNum', choiceNum);
    data.set('sumPointValue', sumPointValue);

    var api_url = 'https://script.google.com/macros/s/AKfycbyO8biVdBlOkZo4A17HsyC1d29adWapDeRew8HglVcqdUmIVw9eBz1adZc6Z5MoWjauig/exec'; //生成したAPIのURLを指定

    await fetch(api_url, {  // 送信先URL
        method: 'POST', // 通信メソッド
        body: data // JSON形式のデータ
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        if (data.message === "success") {
            postInfo.innerText = "結果送信完了！";
        } else {
            postInfo.innerText = "結果送信エラーの可能性あり\nこの画面のスクリーンショットを撮って\n上記お問い合わせフォームに送信してください。\n" + data;
        }
    })
    .catch(error => {
        postInfo.innerText = "結果送信エラー\nこの画面のスクリーンショットを撮って\n上記お問い合わせフォームに送信してください。\n" + error;
    });

    // ホームに戻るボタンを活性化
    backButton.disabled = false;
}

// 問題画面（ランダムなポケモンの画像を表示する関数）
async function display() {
    // スタートした時の操作
    if (sumNum < 1) {
        startTest();
    }
    else {
        // 選択肢のフォントを初期化
        for (i = 0; i < choiceNum; i++) {
            var correctId = "name" + i;
            var correctElem = document.getElementById(correctId);
            correctElem.style.backgroundColor = "";
            correctElem.style.color = "";
            correctElem.style.border = "";
        }
    }

    // 正解数と回答数を表示
    correctAndSum();

    // 現在何問中何問目か表示
    var sumNumValue = document.getElementById("nowSum");
    sumNumValue.innerText = sumNum + 1;
    var correctNumValue = document.getElementById("questionNumValue");
    correctNumValue.innerText = questionNum;

    // 進捗バーを表示
    document.getElementById("progress").max = questionNum;
    document.getElementById("progress").value = sumNum + 1;
    
    // ランダムな図鑑番号を入れるリストを初期化
    var randoms = [];
    // 重複チェックしながら選択肢分の乱数作成
    for(i = dictMin; i <= choiceNum; i++) {
        while(true){
            var tmp = intRandom(dictMin, dictMax);
            if(!randoms.includes(tmp) && !usedNum.includes(tmp)){
                randoms.push(tmp);
                break;
            }
        }
    }
    // 正解の選択肢をランダムに決定
    randomNumber = intRandom(0, choiceNum-1);
    // 正解の選択肢を使用済みリストに追加
    usedNum.push(randoms[randomNumber]);
    // APIでjsonを取得
    var res = await fetch("https://pokeapi.co/api/v2/pokemon/" + randoms[randomNumber]);
    var data = await res.json();
    // HTMLのimg要素を生成
    if (imageType === 'true') {
        var imgSrc = data['sprites']['front_default'];
    } else {
        var imgSrc = data['sprites']['other']['official-artwork']['front_default'];
    }
    imgElem = document.createElement('img');
    imgElem.src = imgSrc;
    // 画像を表示
    var div = document.getElementById('image');
    div.appendChild(imgElem);
    if (rotate === 'true') {
        imgElem.style.transform = "rotate(" + intRandom(1, 180) + "deg)";
    }

    // 選択肢の名前取得
    for (i = 0; i < randoms.length; ++i) {
        // APIでjsonを取得
        var res = await fetch("https://pokeapi.co/api/v2/pokemon-species/" + randoms[i]);
        var nameData = await res.json();
        
        // ポケモン名取得
        for (j = 0; j < 20; ++j) {
            // 日本語の名前を検索して実行
            if (nameData['names'][j]['language']['name'] == "ja") {
                nameList.push(nameData['names'][j]["name"]);
                break;
            }
        }

        // タイプによって選択肢の色を変える
        if (typeColor === 'true') {
            typeColorChange(randoms[i], i);
        }
    }

    // 選択肢を表示
    buttonVisibility("visible");
    // 選択肢に反映
    for (i = 0; i < nameList.length; ++i) {
        var idName = "name" + i;
        var selectName = document.getElementById(idName);
        selectName.innerText = nameList[i];
    }

    // ボタンを活性化する
    buttonDisabled(false);

    // タイマーをスタート
    startTime = Date.now();
    displayTime();
}

// 問題がスタートした時の操作
function startTest() {
    // ボタンを非活性化する
    buttonDisabled(true);

    // 全選択肢を非表示にするため
    choiceNum = choiceNumMax;
    // 選択肢を非表示
    buttonVisibility("hidden");

    // ホーム画面を非表示
    document.getElementById("home").style.display ="none";
    // 問題情報を表示
    document.getElementById("testInfo").style.display ="block";
    // 問題画面を表示
    document.getElementById("test").style.display ="block";

    // ホーム画面での設定の値の引き渡し
    dictMax = getRadioChecked('dict');
    imageType = getRadioChecked('imageType');
    rotate = getRadioChecked('rotate');
    nickname = document.getElementById('nickname').value;
    typeColor = getRadioChecked('typeColor');
    questionNum = getRadioChecked('questionNum');
    choiceNum = getRadioChecked('choiceNum');


    // 使わない選択肢を非表示
    for (let i = choiceNumMax-1 ; i > choiceNum-1 ; i--) {
        var buttonId = "name" + i;
        var button = document.getElementById(buttonId);
        button.style.display ="none";
    }
}

// 正解数と回答数を表示
function correctAndSum() {
    // 正解数を表示
    var correctNumValue = document.getElementById("correct");
    correctNumValue.innerText = correctNum;
    // 回答数を表示
    var sumNumValue = document.getElementById("sum");
    sumNumValue.innerText = sumNum;
}

// ラジオボタンでチェックされた値を取得
function getRadioChecked(getByName) {
    let elements = document.getElementsByName(getByName);
    let len = elements.length;
    let checkValue = '';

    for (let i = 0; i < len; i++){
        if (elements.item(i).checked){
            checkValue = elements.item(i).value;
        }
    }
    return checkValue
}

// 時間を表示する関数
function displayTime() {
    const currentTime = new Date(Date.now() - startTime + stopTime);
    const h = String(currentTime.getUTCHours()).padStart(2, '0');
    const m = String(currentTime.getUTCMinutes()).padStart(2, '0');
    const s = String(currentTime.getUTCSeconds()).padStart(2, '0');
    const ms = String(currentTime.getUTCMilliseconds()).padStart(3, '0');
    
    time.textContent = `${h}:${m}:${s}.${ms}`;
    timeoutID = setTimeout(displayTime, 10);
}

// min以上max以下の整数値の乱数を返す関数
function intRandom(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ボタンの表示・非表示を切り替え、visibleかhidden
function buttonVisibility(v) {
    for (let i = 0; i < choiceNum; i++) {
        var buttonId = "name" + i;
        var button = document.getElementById(buttonId);
        button.style.visibility = v;
    }
}

// ボタンの活性・非活性を切り替え
function buttonDisabled(d) {
    for (let i = 0; i < choiceNum; i++) {
        var buttonId = "name" + i;
        var button = document.getElementById(buttonId);
        button.disabled = d;
    }
}

// 回答された時の処理
function checkAnswer(selectNumber) {

    // ボタンを非活性化する
    buttonDisabled(true);

    // タイマーをストップ
    clearTimeout(timeoutID);
    stopTime += (Date.now() - startTime);

    // 画像をカラーにする
    imgElem.style.filter = "brightness(100%)";

    // 正解の選択肢や、選択した選択肢の色を変更
    if (typeColor === 'true') {
        for (let i = 0; i < choiceNum; i++) {
            // 選択肢がタイプ色の時は、上記以外の回答も暗い灰色にする
            if (i != selectNumber && i != randomNumber) {
                var nonSelectId = "name" + i;
                var nonSelectElem = document.getElementById(nonSelectId);
                nonSelectElem.style.backgroundColor = "darkgray";
                nonSelectElem.style.color = "white";
                nonSelectElem.style.border = "2px solid darkgray";
            } else if (i == selectNumber) {
                var selectId = "name" + i;
                var selectElem = document.getElementById(selectId);
                selectElem.style.backgroundColor = "dimgray";
                selectElem.style.color = "white";
                selectElem.style.border = "2px solid dimgray";
            }
        }
    } else {
        // 選択した回答を灰色で表示
        var selectId = "name" + selectNumber;
        var selectElem = document.getElementById(selectId);
        selectElem.style.backgroundColor = "gray";
        selectElem.style.color = "white";
        selectElem.style.border = "2px solid gray";
    }
    //正解を赤く表示
    var correctId = "name" + randomNumber;
    var correctElem = document.getElementById(correctId);
    correctElem.style.backgroundColor = "#ff4c4ced";
    correctElem.style.color = "white";
    correctElem.style.border = "2px solid #ff4c4ced";

    sumNum ++;

    // 正解判定する
    if (selectNumber ===  randomNumber) {
        correctNum ++;
        maruBatuImage("maru");
    } else {
        maruBatuImage("batu");
    }

    // 画面遷移
    transition();
}

// マルかバツの画像を表示
function maruBatuImage(maruBatu) {
    var maruBatuElem = document.createElement('img');
    maruBatuElem.src = "./img/" + maruBatu + ".png";
    var judgeElem = document.getElementById('judge');
    judgeElem.appendChild(maruBatuElem);
}

// 次の問題か結果画面表示か判定し処理
function transition() {
    if (sumNum < questionNum) {
        setTimeout(reset, 2000);
        setTimeout(display, 2500);
    } else {
        setTimeout(reset, 2000);
        setTimeout(displayResult, 2500);
    }
}

// リセット関数
function reset() {
    // 画像を消す（img要素を消去）
    var image = document.getElementById('image');
    image.innerHTML = ""; // 親要素内のHTMLを空にする
    // 選択肢を非表示
    buttonVisibility("hidden");
    // 選択肢の文字を消去する
    for (i = 0; i < choiceNum; ++i) {
        var idName = "name" + i;
        var selectName = document.getElementById(idName);
        selectName.innerText = "";
    }
    // 名前リストを初期化
    nameList.length = 0;
    // 正誤判定の画像を消去する
    var judgeElem = document.getElementById('judge');
    judgeElem.innerHTML = ""; // 親要素内のHTMLを空にする
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

// 選択肢の色を変更
async function typeColorChange(randomsI, i) {
    // APIでjsonを取得
    var res2 = await fetch("https://pokeapi.co/api/v2/pokemon/" + randomsI);
    var data2 = await res2.json();
    // タイプを取得
    var type = data2['types'][0]['type']['name'];
    // 色に変換
    var color = colors[type];
    var lightColor = lightColors[type];
    var darkColor = darkColors[type];
    // 選択肢の色を変更
    var typeId = "name" + i;
    var typeElem = document.getElementById(typeId);
    typeElem.style.backgroundColor = lightColor;
    typeElem.style.border = "2px solid " + color;
    typeElem.style.color = darkColor;
    // CSSの適応を変更するため、選択肢のクラス名を変更
    typeElem.className += ' choice2';
}

// ホーム画面を初期表示
displayHome();