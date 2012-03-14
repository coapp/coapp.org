
function show_prev_version(pkg_id)
{
    $("#prev_version_" + pkg_id).slideToggle(600);
}


function show_more_info(pkg_id)
{
    $("#more_info_" + pkg_id).slideToggle(600);
}

function sortObj(arr)
{
    // Setup Arrays
    var sortedKeys = new Array();
    var sortedObj = {};

    // Separate keys and sort them
    for (var i in arr)
    {
        sortedKeys.push(i);
    }
    sortedKeys.sort();

    // Reconstruct sorted obj based on keys
    for (var i in sortedKeys)
    {
        sortedObj[sortedKeys[i]] = arr[sortedKeys[i]];
    }
    return sortedObj;
}

jQuery(function () {

    jQuery.getPackageFeed({
        url: '/proxy/packages.xml',
        failure: function (feed) {

        },
        success: function (feed) {
            var html = {};
            
            var packages = {};
            var package_ids = {};

            for (var i = feed.items.length-1; i >= 0 && i > 0; i--) {
            
                var pkg_id = feed.items[i].id;
                
                package_ids[ pkg_id ] = feed.items[i];
                
                var pkg = feed.items[i].pkg;
                
                var name = pkg.name;
                var architecture = pkg.architecture;
                var version = pkg.version;
                
                var flavor = '';
                
                var last_begin_bracket = name.lastIndexOf('[');
                var last_end_bracket = name.lastIndexOf(']');
                
                if(last_begin_bracket != -1)
                {
                    flavor = name.slice(last_begin_bracket + 1, last_end_bracket);
                    name = name.slice(0, last_begin_bracket);
                }
                
                if(typeof packages[name] == 'undefined')
                {
                    packages[name] = {};
                }
                
                var package_names = packages[name];
                
                if(typeof package_names[flavor] == 'undefined')
                {
                    package_names[flavor] = {};
                }
                
                var package_flavors = package_names[flavor];
                
                if(typeof package_flavors[version] == 'undefined')
                {
                    package_flavors[version] = {};
                }
                
                var package_versions = package_flavors[version];
                
                if(typeof package_versions[architecture] == 'undefined')
                {
                    package_versions[architecture] = new Array();
                }
                
                package_versions[architecture].push( feed.items[i] );
            }
            
            //packages = sortObj(packages);
            
            var test = 1;
            
            var pkg_num = 0;
            
            jQuery.each( packages ,
                function(pkg_name, pkg_falvors)
                    {
                        pkg_num++;
                        
                        pkg_falvors = sortObj(pkg_falvors);
                        
                        var pkg_flavors_html = '';
                        
                        var latest_updated = '';
                        var latest_updated_timestamp = 0;
                        
                        var latest_pkg = null;
                        
                        var desc = '';
                        
                        var latest_version = null;
                        var latest_version_link = null;
                        
                        var flavors = new Array();
                        var flavors_plain = new Array();
                        
                        var archs = new Array();
                        var archs_plain = new Array();
                        
                        var num_flavors = 0;
                        var num_archs = 0;
                        
                        jQuery.each( pkg_falvors ,
                            function(pkg_falvor, pkg_versions)
                                {
                                    num_flavors++;
                                    
                                    var pkg_version_html = new Array();
                                    
                                    var version_set = false;
                                    var store_archs = false;
                                    archs = new Array();
                                    
                                    jQuery.each( pkg_versions ,
                                        function(pkg_version, pkg_archs)
                                            {
                                                if(!version_set)
                                                {
                                                    if(latest_version == null)
                                                    {
                                                        latest_version = pkg_version;
                                                        store_archs = true;
                                                    }
                                                    else if(latest_version != pkg_version) latest_version = null;
                                                    else store_archs = true;
                                                }
                                                else
                                                {
                                                    store_archs = false;
                                                }
                                                
                                                version_set = true;
                                                
                                                pkg_archs = sortObj(pkg_archs);
                                                
                                                var pkg_arch_html = new Array();
                                                
                                                jQuery.each( pkg_archs ,
                                                    function(pkg_arch, pkgs)
                                                        {
                                                            if(store_archs) num_archs++;
                                                            
                                                            var link = null;
                                                            
                                                            jQuery.each( pkgs ,
                                                                function(pkg_num, pkg)
                                                                    {
                                                                        var updated = pkg.updated;
                                                                        if(link == null) link = pkg.link;
                                                                        
                                                                        var updated_timestamp = Date.parse(updated);
                                                                        
                                                                        if(updated_timestamp > latest_updated_timestamp)
                                                                        {
                                                                            latest_updated_timestamp = updated_timestamp;
                                                                            latest_updated = updated;
                                                                            
                                                                            latest_pkg = pkg;
                                                                        }
                                                                    }
                                                            );
                                                            
                                                            var pkg_arch_link = pkg_arch;
                                                            
                                                            if(pkgs.length >= 1)
                                                            {
                                                                pkg_arch_link = '<a href="' + link + '">' + pkg_arch + '</a>';
                                                            }
                                                            
                                                            if(store_archs)
                                                            {
                                                                archs.push( pkg_arch_link );
                                                                archs_plain.push( pkg_arch );
                                                            }
                                                            
                                                            pkg_arch_html.push( pkg_arch_link );
                                                        }
                                                );
                                                
                                                pkg_version_html.push( pkg_version + ' [ ' + pkg_arch_html.join(', ') + ' ]' );
                                            }
                                    );
                                    
                                    if(pkg_falvor != '')
                                    {
                                        flavors.push(pkg_falvor + ' : ' + archs.join(' , ') );
                                        
                                        flavors_plain.push(pkg_falvor + '-' + archs_plain.join('') );
                                    }
                                    
                                    if(pkg_falvor != '')
                                    {
                                        pkg_flavors_html += pkg_falvor + '\n\t' + pkg_version_html.join('\n\t') + '\n';
                                    }
                                    else
                                    {
                                        pkg_flavors_html += pkg_version_html.join('\n') + '\n';
                                    }
                                }
                        );
                        
                        latest_updated = Date.parse(latest_updated);
                        
                        var latest_updated_date = new Date();
                        
                        latest_updated_date.setTime(latest_updated);
                        
                        var author = '';
                        var dependencies = new Array();
                        
                        if(latest_pkg != null)
                        {
                                latest_version_link = latest_pkg.link;
                                
                                desc = latest_pkg.description;
                                
                                if(typeof latest_pkg.author != 'undefined')
                                {
                                        if(latest_pkg.author != null)
                                        {
                                                author = latest_pkg.author.name;
                                        }
                                }
                                
                                if(typeof latest_pkg.pkg.dependencies != 'undefined')
                                {
                                        if(latest_pkg.pkg.dependencies != null)
                                        {
                                                jQuery.each( latest_pkg.pkg.dependencies ,
                                                    function(dependency_num, dependency_id)
                                                        {
                                                                if(typeof package_ids[ dependency_id ] != 'undefined')
                                                                {
                                                                        dependencies.push( package_ids[ dependency_id ].pkg.name );
                                                                }
                                                        }
                                                );
                                        }
                                }
                        }
                        
                        var package_html = '';
                        
                        package_html += '<h3>';
                        
                        package_html += '<div style="float: right; color: #AAA; font-size: 12px;" class="updated">' + latest_updated_date.toString() + '</div>';
                        
                        if(num_flavors <= 1 && num_archs <= 1 && latest_version != null)
                        {
                                package_html += '<a href="' + latest_version_link + '">';
                                
                                package_html += pkg_name;
                                
                                package_html += '</a>';
                                
                                if(latest_version != null) package_html += ' <span style="color: #AAA;">' + latest_version + '</span>';
                                
                                if(flavors_plain.length > 0) package_html += ' <span style="color: #AAA;">' + flavors_plain.join('') + '</span>';
                                else if(archs_plain.length > 0 && archs_plain[0] != 'any') package_html += ' <span style="color: #AAA;">' + archs_plain.join('') + '</span>';
                        }
                        else
                        {
                                package_html += pkg_name;
                                
                                if(latest_version != null) package_html += ' <span style="color: #AAA;">' + latest_version + '</span>';
                                
                                if(flavors.length > 0) package_html += ' <span style="color: #AAA;">[ ' + flavors.join(' | ') + ' ]</span>';
                                else if(archs.length > 0) package_html += ' <span style="color: #AAA;">[ ' + archs.join(' | ') + ' ]</span>';
                        }
                        
                        package_html += '</h3>';
                        
                        if(author != '') package_html += '<div style="margin-bottom: 9px;">' + author + '</div>';
                        
                        package_html += '<div style="margin-bottom: 9px;"><a class="show_more" href="javascript:show_more_info('+pkg_num+');">+ details</a></div>';
                        
                        package_html += '<div id="more_info_' + pkg_num + '" class="more_content" style="display: none;">';
                        
                        package_html += '<ul class="tabs" data-tabs="tabs">';
                        package_html += '<li class="active"><a href="#desc_' + pkg_num + '">Description</a></li>';
                        if(dependencies.length > 0) package_html += '<li><a href="#dependencies_' + pkg_num + '">Dependencies</a></li>';
                        package_html += '<li><a href="#prev_versions_' + pkg_num + '">Previous Versions</a></li>';
                        package_html += '</ul>';
                        
                        package_html += '<div class="tab-content">';
                        
                        package_html += '<div class="active tab-pane" id="desc_' + pkg_num + '">' + desc + '</div>';
                        
                        if(dependencies.length > 0)
                        {
                                //package_html += '<div>Dependencies:</div>';
                                package_html += '<div class="tab-pane" id="dependencies_' + pkg_num + '"><pre>';
                                package_html += dependencies.join('\n');
                                package_html += '</pre></div>';
                        }
                        
                        //package_html += '<div style="margin-bottom: 18px;"><a class="show_more" href="javascript:show_prev_version('+pkg_num+');">toggle previous versions</a></div>';
                        
                        //package_html += '<div id="prev_version_' + pkg_num + '" class="more_content" style="display: none;">';
                        package_html += '<div class="tab-pane" id="prev_versions_' + pkg_num + '">';
                        package_html += '<pre>' + pkg_flavors_html + '</pre>';
                        package_html += '</div>';
                        
                        package_html += '</div>';//tab-content
                        
                        package_html += '</div>';//more_info
                        
                        html[ pkg_name ] = {};
                        html[ pkg_name ]['html'] = package_html;
                        //html[ pkg_name ]['sort'] = latest_updated_timestamp;
                        html[ pkg_name ]['sort'] = pkg_name;
                    }
            );
            
            var sortedKeys = new Array();
            var sortedHTML = new Array();
            
            // Separate keys and sort them
            for (var i in html){
            	sortedKeys.push([ i, html[i]['sort'] ]);
            }
                
            sortedKeys.sort(
                function (a, b)
                {
                    //return b[1] - a[1];
                    if (a[1] < b[1]) return -1;
                    else if (a[1] > b[1]) return 1;
                    else return 0;
                }
            );
            
            // Reconstruct sorted obj based on keys
            for (var i in sortedKeys){
            	sortedHTML.push( html[ sortedKeys[i][0] ]['html'] );
            }
            
            html = sortedHTML.join('\n');
            
            /*
            html += '<a href="{link}">{title}</a>'.Format(feed.items[i]);
            html += '<div>{description}</div>\n'.Format(feed.items[i]);
            */

            jQuery('#result').append(html);
            
            $('.tabs').tabs()
        }
    });
});
