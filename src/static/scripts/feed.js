
jQuery(function () {

    jQuery.getPackageFeed({
        url: '/proxy/packages.xml',
        failure: function (feed) {

        },
        success: function (feed) {
            var html = '';

            for (var i = 0; i < feed.items.length && i < 5; i++) {
                with( feed.items[i]) {
                    html += '<h3><a href="{0}">{1}</a></h3><div class="updated">{2}</div><div>{3}</div>'.Format(link, title, updated, description);
                }
            }

            jQuery('#result').append(html);
        }
    });
});
