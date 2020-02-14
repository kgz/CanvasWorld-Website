$(function () {
    var tds = document.getElementsByTagName('td');
    var rows = document.getElementsByTagName('tr');

    console.log(tds);
   



    $(window).on("load resize", function () {

        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        var v1Width = $("#v1").width()


        $("#v1").resizable({
            minWidth: 50,
            maxWidth: windowWidth - 80,
            maxHeight: windowHeight * (.83),
            handles: "e, s"
        }).on("resize", function () {

            if (v1Width == $("#v1").width()) {
                $("#v2").height(0)
            }
            v1Width = $("#v1").width()
        });

        $("#v2").resizable({
            maxHeight: windowHeight * (.83),
            handles: "s"
        }).on("resize", function () {
            $("#v1").height(0)
        });

    });
});