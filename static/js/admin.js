var data = [];

$(document).ready(function () {

    let load = () => {
        $.get("/db", data,
            function (data, textStatus, jqXHR) {
                // app 0

                $('table').DataTable({
                    data: data.map(a => {
                        a['x'] = "<div data-id='" +a.id + "' class='rem'>X</div>"   
                                         
                        return Object.values(a)
                    }),
                    columns: Object.keys(data[0]).map(a => {
                        return {
                            title: a
                        }
                    }),
                    "initComplete": function () {
                        $('.iplist').fadeIn();
                    }
                });


                //app 1
                for (const d of data) d["m"] = moment().unix() - moment(d.time).valueOf()/1000
                
                for (const i of data) {
                    if(i.m < 86400) {
                        $(".last24 .data").eq(0).attr("data-count", parseInt($(".last24 .data").eq(0).attr("data-count")) + 1)
                        $(".last24 .data").eq(0).html("<b>24 Hours</b><br>" + $(".last24 .data").eq(0).attr("data-count") );
                    } 
                    if(i.m < 604800) {
                        $(".last24 .data").eq(1).attr("data-count", parseInt($(".last24 .data").eq(1).attr("data-count")) + 1)
                        $(".last24 .data").eq(1).html("<b>7 days</b><br>" + $(".last24 .data").eq(1).attr("data-count") );
                    } 
                    if(i.m < 2628000) {
                        $(".last24 .data").eq(2).attr("data-count", parseInt($(".last24 .data").eq(2).attr("data-count")) + 1)
                        $(".last24 .data").eq(2).html("<b>Month</b><br>" + $(".last24 .data").eq(2).attr("data-count") );
                    } 
                    if(i.m < 15770000) {
                        $(".last24 .data").eq(3).attr("data-count", parseInt($(".last24 .data").eq(3).attr("data-count")) + 1)
                        $(".last24 .data").eq(3).html("<b>6 Months</b><br>" + $(".last24 .data").eq(3).attr("data-count") );
                    } 
                }
                //$(".last24 .data").text(data.map(a => {return a.m < 86400}).length)
            },
            "json"
        );
    }

    load();
    $(document).on('click', '.rem', function(){
            console.log($(this).attr('data-id'))
    })
    // for (const i in data) {
    //     data[i]["sdate"] = moment();
    // }

    // console.log(data)
});