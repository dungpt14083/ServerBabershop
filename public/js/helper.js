function setCookie(name, value, days = 30) {
    if (days) {
        var date = new Date()
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
        var expires = "; expires=" + date.toGMTString()
    } else var expires = ""
    document.cookie = name + "=" + value + expires + "; path=/"
}

function getCookie(name) {
    var match = document.cookie.match(RegExp("(?:^|;\\s*)" + escapehtml(name) + "=([^;]*)"))
    return match ? match[1] : null
}

function escapehtml(s) {
    return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, "\\$1")
}

const is_login = getCookie("is_login");
console.log(typeof is_login)
if (is_login === 'true') {
    $("#replaceButton").empty();
    $("#replaceButton").append(`
                   <a type="submit" class="nav-link justify-content-md-center btn btn-warning" href="/admin/logout" style="color: black;background-color: #F9E323">
                        <img src="https://cdn-icons-png.flaticon.com/128/1144/1144760.png" style="width: 25px; height: 25px ; margin-right: 10px">
                        <span id="status_login">Đăng xuất</span>
                    </a>
                `)
    $("#status_login").html('Đăng xuất') // chỗ này e xử lý gì thì tùy
} else {
    $("#replaceButton").empty();
    $("#replaceButton").append(`
                   <a class="nav-link justify-content-md-center btn btn-warning" href="/admin/login" style="color: black;background-color: #F9E323">
                        <img src="https://cdn-icons-png.flaticon.com/128/1144/1144760.png" style="width: 25px; height: 25px ; margin-right: 10px">
                        <span id="status_login">Đăng nhập</span>
                    </a>
                `)
    $("#status_login").html('Đăng nhập')
}