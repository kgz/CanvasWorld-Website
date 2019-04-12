$(function () {
    $.get("/static/CanvasWorld/" + t + "/scripts/index.js", function (data) {
        $("#code pre code").text(data)
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
        });

    })

});

// $(document).on("keypress", ".container input", (e) => {
//     console.log(e)
// })

