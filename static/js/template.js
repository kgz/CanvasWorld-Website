$(function () {
    $("#canvas").innerHeight($(window).innerHeight());
    $.ajax({
        url: 'https://api.github.com/repos/kgz/CanvasWorld/contents/'+TNAME+'/README.md',//https://api.github.com/repos/kgz/CanvasWorld/readme',
        headers: { 'Accept': 'application/vnd.github.html' }
      }).done(function(data) {
         $("#code").append(data.replace( new RegExp("sample.gif", 'g'), "/sample/" + TNAME))
        $(".splitter div").eq(1).click();

      });

    $.get($(".source").attr("src"), function (data) {
        $("#code .code code").text(data)
        document.querySelectorAll('.code code').forEach((block) => {
            hljs.highlightBlock(block);
        });

    })



});


function map(n, start1, stop1, start2, stop2){
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
}



$(document).on("click", ".splitter div", function (){
    $(".splitter div").css("background", "#949393")
    $(this).css("background", "#F0F0F0")
    if($(this).attr("data-href") == "code"){
        $(".code").show();
        $("#file").hide();
    }else{
        $(".code").hide();
        $("#file").show();
    }

})
// $(document).on("keypress", ".container input", (e) => {
//     console.log(e)
// })

