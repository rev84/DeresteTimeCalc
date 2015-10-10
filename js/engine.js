// Generated by CoffeeScript 1.9.3
var date4google, getDateStr, getLink4google, getPatternId, getTime, getToretikeDate, sec2HourMin, update, zerofill,
  modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

$().ready(function() {
  var hide, show;
  if ($.cookie('maxStm') != null) {
    $('#maxStm').val($.cookie('maxStm'));
  }
  if ($.cookie('groupId') != null) {
    $('#groupId').val($.cookie('groupId'));
  }
  $('#maxStm').on('change', function() {
    $.cookie('maxStm', $(this).val(), {
      expires: 365 * 100
    });
    return update();
  });
  $('#groupId').on('change', function() {
    $.cookie('groupId', $(this).val(), {
      expires: 365 * 100
    });
    return update();
  });
  $('#nowStm').on('change', function() {
    $('#nowStmInputTime').val(getTime());
    return update();
  });
  $('#googleCalendar').on('click', function() {
    var date;
    if (+new Date($('#calendarDate').val() < +new Date())) {
      return;
    }
    date = new Date(Number($('#calendarDate').val()));
    return window.open(getLink4google(date));
  });
  setInterval(update, 1000);
  show = 'QRコードを表示する';
  hide = 'QRコードを非表示にする';
  $('#qrbutton').on('click', (function(_this) {
    return function() {
      if ($('#qrbutton').text() === show) {
        $('#qrbutton').text(hide);
      } else {
        $('#qrbutton').text(show);
      }
      return $('#code').slideToggle();
    };
  })(this));
  $('#code').qrcode({
    render: "table",
    text: location.href
  });
  return $('#qrbutton').text(show);
});

update = function() {
  var atStr, d, dates, groupId, i, inputDate, inputTime, len, maxDate, maxStm, nowDate, nowStm, reqSec, reqStr, toreAtStr, toreReqStr, toreTime;
  inputTime = Number($('#nowStmInputTime').val());
  if (inputTime === 0) {
    return;
  }
  maxStm = Number($('#maxStm').val());
  nowStm = Number($('#nowStm').val());
  groupId = Number(Number($('#groupId').val()));
  reqSec = (maxStm - nowStm) * 60 * 5;
  reqStr = sec2HourMin(reqSec * 1000);
  reqStr = reqStr === '' ? ' はやく消化しなきゃ' : reqStr;
  $('#reqStr').html(reqStr);
  nowDate = new Date();
  inputDate = new Date(inputTime * 1000);
  maxDate = new Date((inputTime + reqSec) * 1000);
  atStr = '';
  if (reqSec <= 0) {
    atStr += 'もう時間だ';
  } else {
    atStr += maxDate.getDate() !== inputDate.getDate() ? '明日 ' : '今日 ';
    atStr += zerofill(maxDate.getHours()) + ':' + zerofill(maxDate.getMinutes());
  }
  $('#atStr').html(atStr);
  toreReqStr = '';
  toreAtStr = '';
  if (groupId >= 0) {
    dates = getToretikeDate(nowDate, groupId);
    for (i = 0, len = dates.length; i < len; i++) {
      d = dates[i];
      toreTime = +d - +nowDate;
      if ((-1000 * 60 * 60 < toreTime && toreTime <= 0)) {
        toreAtStr = 'いまトレチケタイム';
        toreReqStr = 'あと' + sec2HourMin(toreTime + 1000 * 60 * 60);
        break;
      } else if (0 < toreTime) {
        toreAtStr += d.getDate() !== inputDate.getDate() ? '明日 ' : '今日 ';
        toreAtStr += zerofill(d.getHours()) + ':' + zerofill(d.getMinutes());
        toreReqStr = sec2HourMin(toreTime);
        break;
      }
    }
  }
  $('#toreReqStr').html(toreReqStr);
  $('#toreAtStr').html(toreAtStr);
  return $('#calendarDate').val(+maxDate);
};

getLink4google = function(date) {
  return 'http://www.google.com/calendar/event?' + 'action=' + 'TEMPLATE' + '&text=' + encodeURIComponent('デレステスタミナMAX') + '&details=' + encodeURIComponent('デレステのスタミナがMAXになった') + '&location=' + encodeURIComponent('アプリ') + '&dates=' + date4google(date) + '/' + date4google(date) + '&trp=' + 'false' + '&sprop=' + encodeURIComponent(location.href) + '&sprop=' + 'name:' + encodeURIComponent('デレステスタミナ計算機');
};

sec2HourMin = function(time) {
  var res, sec;
  res = '';
  sec = time / 1000;
  res += sec >= 60 * 60 ? '' + Math.floor(sec / 60 / 60) + ' 時間' : '';
  res += sec >= 60 && Math.floor(sec / 60 % 60) !== 0 ? '' + Math.floor(sec / 60 % 60) + ' 分' : '';
  return res;
};

getTime = function() {
  return Math.floor(+new Date() / 1000);
};

getDateStr = function(date) {
  if (date == null) {
    date = null;
  }
  if (date === null) {
    date = new Date();
  }
  return '' + date.getFullYear() + '-' + zerofill(date.getMonth() + 1) + '-' + zerofill(date.getDate());
};

date4google = function(date) {
  return date.getUTCFullYear() + zerofill(date.getUTCMonth() + 1) + zerofill(date.getUTCDate()) + 'T' + zerofill(date.getUTCHours()) + zerofill(date.getUTCMinutes()) + zerofill(date.getUTCSeconds()) + 'Z';
};

zerofill = function(num) {
  return ('0' + num).slice(-2);
};

getPatternId = function(nowDate) {
  var baseDate, dayCount, patternId;
  baseDate = new Date('2015-10-01 00:00:00');
  patternId = 3;
  nowDate = new Date(getDateStr(nowDate) + ' 00:00:00');
  dayCount = (+nowDate - +baseDate) / (1000 * 60 * 60 * 24);
  return modulo(patternId - dayCount, 4);
};

getToretikeDate = function(nowDate, groupId) {
  var hour, i, index, j, len, len1, patternId, ref, ref1, res, timeTable, tomorrowDate;
  timeTable = [[8, 12, 19], [9, 13, 20], [10, 14, 21], [11, 15, 22]];
  patternId = getPatternId(nowDate);
  res = [];
  index = modulo(groupId - patternId, 4);
  ref = timeTable[index];
  for (i = 0, len = ref.length; i < len; i++) {
    hour = ref[i];
    res.push(new Date(getDateStr(nowDate) + ' ' + zerofill(hour) + ':00:00'));
  }
  tomorrowDate = new Date(+nowDate + 1000 * 60 * 60 * 24);
  index = modulo(groupId - getPatternId(tomorrowDate), 4);
  ref1 = timeTable[index];
  for (j = 0, len1 = ref1.length; j < len1; j++) {
    hour = ref1[j];
    res.push(new Date(getDateStr(tomorrowDate) + ' ' + zerofill(hour) + ':00:00'));
  }
  return res;
};
