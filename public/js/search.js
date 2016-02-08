$(document).ready(function(){

    $(".advance").click(function () {
       $(".hidden").toggle("fast");
    });

    $('#searchbtn').click( function(e) {
        //alert( $(".hidden").is(':visible') );
        $("#show").empty();
        if( $("#Search").val() != ""){
            $.ajax({
                url: "/sendrequest",
                type: "GET",
                dataType: 'json',
                data: { "Search": $("#Search").val() },
                success: function (result) {
                    if( result.length != 0 )
                        printdata(result);
                    else{
                        $("#show").append('<h2 style="color:white" align="center"> App Name Not Found </h2>');
                    }
                }//sendrequest success
            });//end sendrequest
            //dojob();
        }
        else
            alert("Please Enter Appname To Search");
    });//end sendrequest

    function dojob(len){

        $.ajax({
            url: "/datacount",
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                //alert(result);
                var record = result;
                var currentPage = 0;
                var dataPerPage = 5;
                var NumberOfPages  = Math.ceil( record / dataPerPage);

                //getdata( dataPerPage , currentPage );

                $('table.myTable').each(function() {

                    var $table = $(this);
                    $table.trigger('createPaging');
                    var $pager = $('<div class="pager" align="center" ></div>');

                    for (var page = 0; page < NumberOfPages; page++) {
                        $('<span class="page-number"></span>').text(page + 1).bind('click', {
                            Page: page
                        },  function(event) {
                                currentPage = event.data['Page'];
                                //getdata( dataPerPage , currentPage );
                                $table.trigger('createPaging');
                                $(this).addClass('active').siblings().removeClass('active');
                            }).appendTo($pager).addClass('clickable');
                    }
                    $pager.insertAfter($table).find('span.page-number:first').addClass('active');
                });//end table.myTable
            }//success
        });//end ajax

    }//end dojob

    function getdata( ){
        $.ajax({
            url: "/data",
            type: "GET",
            //data: { 'dpp' : dataPerPage , 'cp' : currentPage },
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                printdata(result);
            }//success
        });//end ajax
   }//end getdata

   function printdata( data ){
        var body = '<table class="myTable" id="myTable" border="10" cellpadding="5" cellspacing="5" style="width:30% border-color: #FFFFFF" align="center"> <thead> <tr> <th style="color:white" title="This is AppName">AppName</th> <th style="color:white" title="This is Key">Key</th> <th style="color:white" title="This is Value">Value</th> </tr> </thead> <tbody>';
        $.each(data, function(key, val) {
            body += '<tr><td style="color:white" align="center" width="100" title="App name is '+val.appname+' ">' + val.appname +'</td><td style="color:white" align="center" width="150" title="Key is '+val.key+'">'+ val.key +'</td><td style="color:white" align="center" width="100" title="Value is '+val.value+'">'+ val.value +'</td></tr>';
        });
        body += '</tbody> </table>';
        $("#show").append(body);
   }//end printdata
});
