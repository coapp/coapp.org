$(document).ready(function () {
        $("#SearchLink").mouseover(function () {
            $("#SearchField").animate({ right: parseInt($("#SearchField").css('right'), 10) == $("#SearchLink").outerWidth() ? -$("#SearchContainer").outerWidth() : $("#SearchLink").outerWidth() });
        });
        $("#SearchContainer").mouseleave(function () {
            $("#SearchField").animate({ right: -$("#SearchContainer").outerWidth()});
        });
    });
    
