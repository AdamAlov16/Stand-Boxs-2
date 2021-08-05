function date_from_string(dt) {
    var df = dt.split(' ');
    var d = df[0].split('-');
    var t = df[1].split(':');
    return d1 = new Date(d[0], d[1] - 1, d[2], t[0], t[1], t[2]);
}
var difference = date_from_string(server_time) - new Date();
function diff_date(d1) {
    var localTime = new Date();
    var ms = localTime.getTime() + difference;
    var r = (new Date(ms) - d1) / 1000;
    var tt = {
        sec: ['{} секунд', '{} секунда', '{} секунды'],
        min: ['{} минут', '{} минута', '{} минуты'],
        hour: ['{} часов', '{} час', '{} часа'],
        day: ['{} дней', '{} день', '{} дня']
    }

    function sec(x, dtt) {
        var r;
        x = x.toFixed(0);
        if (x >= 11 && x <= 14) r = null
        else {
            var s = '' + x;
            if (s.length > 1) s = s.substring(1);
            r = {'1': dtt[1], '2': dtt[2], '3': dtt[2], '4': dtt[2]}[s];
        }
        if (!r) r = dtt[0];
        return r.replace('{}', x)
    }

    if (r < 60)return sec(r, tt.sec) + ' назад';
    r = r / 60;
    if (r < 60)return sec(r, tt.min) + ' назад';
    r = r / 60;
    if (r < 24)return sec(r, tt.hour) + ' назад';
    r = r / 24;
    if (r < 1)return 'сегодня';
    if (r < 2)return 'вчера';
    return sec(r, tt.day) + ' назад';
}
function get_stats() {
    $.post("/api/getStats", function (msg) {
        $(".live-drops .live-drops-list").html(msg.wins);
        $('.statistics-item__value #allcases').animateNumber({number: parseInt(msg.count_wins)});
        $('.statistics-item__value #allusers').animateNumber({number: parseInt(msg.count_users)});
        $('.statistics-item__value #allonline').animateNumber({number: parseInt(msg.count_users_online)});
        get_time();
    });
}
function get_time() {
    $(".slider ul li").each(function (indx, element) {
        time = $(element).find('.slider_time');
        $(time).html(diff_date(date_from_string($(time).attr('data-time'))));
    });
}
$(function () {
    get_stats();
    $("#wordshift").mouseover(function () {
        $("#wordshift").text("Получить");
    });
    $("#wordshift").mouseout(function () {
        $("#wordshift").text("Получено");
    });
    setInterval(get_time, 5 * 1000);
    setInterval(get_stats, 10 * 1000);
    $('.type_pay .offer_pay-col > a').click(function (e) {
        e.preventDefault();
        if ($(this).hasClass('disabled'))return false;
        $('.type_pay a.active').removeClass('active');
        $(this).addClass('active');
        $('#curr').val($(this).data('curr'));
    })
    $("#pay input[name=sum]").keydown(function (e) {
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 || (e.keyCode == 65 && e.ctrlKey === true) || (e.keyCode == 67 && e.ctrlKey === true) || (e.keyCode == 88 && e.ctrlKey === true) || (e.keyCode >= 35 && e.keyCode <= 39)) {
            return;
        }
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
    $("#pay input[name=sum]").change(function () {
        if ($(this).val() < parseFloat(min_bet)) {
            $(this).val(min_bet);
        }
    })
    $('.lk-nav-tab span').click(function () {
        $('.tab-content').hide();
        $('#' + $(this).attr('data-tab')).show();
        $('.lk-nav-tab span').addClass('noactive');
        $(this).removeClass('noactive');
    });
});
