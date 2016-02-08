$(document).ready(function(){

    $('#submitbtn').click( function(e) {
        if( $("#Keyspace").val() != "" && $("#Table").val() != "" && $("#Rows").val() != ""){
            if(isInt($("#Rows").val())){
                //$("#submitbtn").attr("disabled",true);
                $.ajax({
                    url: "/sendrequest",
                    type: "GET",
                    dataType: 'json',
                    data: { "Keyspace":$("#Keyspace").val() , "Table":$("#Table").val() , "Rows": $("#Rows").val() },
                    success: function (result) {
                        //alert("success");
                    }//sendrequest success
                });//end sendrequest
                dojob();
            }
            else{
                alert("Row is not number");
            }
        }
        else {
            alert("Please Enter All Field");
        }
    });//end sendrequest

    function isInt(value) {
        return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
    }

    function dojob(){

        $.ajax({
            url: "/datacount",
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                //alert(result);
                var record = result;
                var currentPage = 0;
                var dataPerPage = $("#Rows").val();
                var NumberOfPages  = Math.ceil( record / dataPerPage);

                getdata( dataPerPage , currentPage );

                $('table.myTable').each(function() {


                    var $table = $(this);
                    $table.trigger('createPaging');
                    var $pager = $('<div class="pager" align="center" ></div>');

                    for (var page = 0; page < NumberOfPages; page++) {
                        $('<span class="page-number"></span>').text(page + 1).bind('click', {
                            Page: page
                        },  function(event) {
                                currentPage = event.data['Page'];
                                getdata( dataPerPage , currentPage );
                                $table.trigger('createPaging');
                                $(this).addClass('active').siblings().removeClass('active');
                            }).appendTo($pager).addClass('clickable');
                    }
                    $pager.insertAfter($table).find('span.page-number:first').addClass('active');
                });//end table.myTable
            }//success
        });//end ajax
    }//end dojob

    function getdata( dataPerPage,currentPage ){
        $.ajax({
            url: "/data",
            type: "GET",
            data: { 'dpp' : dataPerPage , 'cp' : currentPage },
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                printdata(result);
            }//success
        });//end ajax
   }//end getdata

   function printdata( data ){
        $("#myTable tbody").empty();
        var body = '<tbody>';
        $.each(data, function(key, val) {
            body += '<tr><td align="center" width="100" title="App name is '+val.appname+' ">' + val.appname +'</td><td align="center" width="150" title="Key is '+val.key+'">'+ val.key +'</td><td align="center" width="100" title="Value is '+val.value+'">'+ val.value +'</td></tr>';
        });
        body += '</tbody>';
        $("#myTable").append(body);
   }//end printdata
});
