$(function (){

    let checkreg = (text) => {
        let searc = $(".searchinput").val().trim().toLowerCase();
        let low = text.trim().toLowerCase()
        let test = low.split(" ")
        test.push(low)
        for (const i  of test) {
            if(i.indexOf(searc) > -1)
            return true
        }
        a = FuzzySet(low.split(" ").push(low), false);
        k = a.get(low)
        if(!k) return false
        for (let index = 0; index < k.length; index+=2) {
            if(k[index] > 0.8) return true
            
        }
        return false
    }
    $(".container input").keyup(function (){
        for(const c of $(".tile"))
            {checkreg($(c).find('.tab-header').text()) ? $(c).show() : $(c).hide();}

        // $(".tile").map(c=> (c) => {checkreg($(c).find('.tab-header').text()) ? $(c).show() : $(c).hide()})
          
    })
})