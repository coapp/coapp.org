
function close_modal(pkg_id)
{
    $("#more_info_" + pkg_id).modal('hide');
}

function show_more_info(pkg_id)
{
    $("#more_info_" + pkg_id).slideToggle(600);
}

function get_pkg_last_updated_formatted(pkg)
{
    var latest_updated = pkg.updated;
    
    var latest_updated_timestamp = Date.parse(latest_updated);
    
    var latest_updated_date = new Date();
    
    latest_updated_date.setTime(latest_updated_timestamp);
    
    var latest_updated_date_str = '';
    
    if(latest_updated_date != null)
    {
        //latest_updated_date_str = latest_updated_date.toString();
        
        //latest_updated_date_str = latest_updated_date.getFullYear() + '-' + latest_updated_date.getMonth() + '-' + latest_updated_date.getDate() + ' ' + latest_updated_date.getHours() + ':' + latest_updated_date.getMinutes();
        
        var latest_updated_ar = latest_updated.split('T');
        
        latest_updated_date_str = latest_updated_ar[0] + ' ' + latest_updated_ar[1].substring(0, latest_updated_ar[1].length - 4) + ' UTC';
    }
    
    return latest_updated_date_str;
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

function get_pkg_header(num_flavors, flavors_plain, flavors, num_archs, archs_plain, archs, latest_version, latest_version_link, pkg_name)
{
    var header_html = '';
    
    if(num_flavors <= 1 && num_archs <= 1 && latest_version != null)
    {
        header_html += '<a href="' + latest_version_link + '">';
        
        header_html += pkg_name;
        
        header_html += '</a>';
        
        if(latest_version != null) header_html += ' <span style="color: #AAA;">' + latest_version + '</span>';
        
        if(flavors_plain.length > 0) header_html += ' <span style="color: #AAA;">' + flavors_plain.join('') + '</span>';
        else if(archs_plain.length > 0 && archs_plain[0] != 'any') header_html += ' <span style="color: #AAA;">' + archs_plain.join('') + '</span>';
    }
    else
    {
        header_html += pkg_name;
        
        if(latest_version != null) header_html += ' <span style="color: #AAA;">' + latest_version + '</span>';
        
        if(flavors.length > 1)
        {
            //header_html += ' <span style="color: #AAA;">[ ' + flavors.join(' | ') + ' ]</span>';
            
            header_html += '<div style="margin-left: 15px; font-size: 16px;">';
            
            header_html += ' ' + flavors.join('<br />') + '';
            
            header_html += '</div>';
            
        }
        else if(flavors.length > 0) header_html += ' <span style="color: #AAA;">' + flavors.join(' | ') + '</span>';
        else if(archs.length > 1) header_html += ' <span style="color: #AAA;">[ ' + archs.join(' | ') + ' ]</span>';
        else if(archs.length > 0) header_html += ' <span style="color: #AAA;">' + archs.join(' | ') + '</span>';
    }
    
    return header_html;
}

function get_pkg_details(latest_pkg, package_ids, pkg_num, pkg_flavors_html, pkg_html)
{
    var latest_updated_date = null;
    
    var latest_updated_date_str = '';
    
    var desc = '';
    var author = '';
    var dependencies = new Array();
    var link = '';
    
    if(latest_pkg != null)
    {
        latest_updated_date_str = get_pkg_last_updated_formatted(latest_pkg);
                                        
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
                                if(package_ids[ dependency_id ].pkg.name != 'CoApp.Toolkit')
                                {
                                    dependencies.push( package_ids[ dependency_id ].pkg.name );
                                }
                            }
                        }
                );
            }
        }
        
        link = latest_pkg.link;
    }
    
    var pkg_details_html = '';
    
    pkg_details_html += '<div id="more_info_' + pkg_num + '" class="more_content modal hide fade">';// style="display: none;"
    
    //var name = latest_pkg.pkg.name;
    var name = latest_pkg.pkg.displayName;
    var architecture = latest_pkg.pkg.architecture;
    var version = latest_pkg.pkg.version;
    var flavor = latest_pkg.pkg.flavor;
    
    pkg_details_html += '<div class="modal-header">';
    pkg_details_html += '<a href="#" class="close">&times;</a>';
    
    var pkg_name = new Array();
    
    if(name != '') pkg_name.push( name );
    if(version != '') pkg_name.push( version );
    if(flavor != '') pkg_name.push( flavor );
    if(architecture != '') pkg_name.push( architecture );
    
    var pkg_name = pkg_name.join(' ');
    
    if(link != '') pkg_name = '<a href="' + link + '">' + pkg_name + '</a>';
    
    pkg_details_html += '<h3>' + pkg_name + '</h3>';
    
    pkg_details_html += '</div>';
    
    pkg_details_html += '<div class="modal-body">';
    
    pkg_details_html += '<ul class="tabs" data-tabs="tabs">';
    pkg_details_html += '<li class="active"><a href="#desc_' + pkg_num + '">Description</a></li>';
    if(dependencies.length > 0) pkg_details_html += '<li><a href="#dependencies_' + pkg_num + '">Dependencies</a></li>';
    if(pkg_flavors_html != '') pkg_details_html += '<li><a href="#prev_versions_' + pkg_num + '">Previous Versions</a></li>';
    pkg_details_html += '<li><a href="#details_' + pkg_num + '">Details</a></li>';
    if(typeof pkg_html != 'undefined') pkg_details_html += '<li><a href="#variations_' + pkg_num + '">Variations</a></li>';
    pkg_details_html += '</ul>';
    
    pkg_details_html += '<div class="tab-content">';// style="border-bottom: 1px solid #DDD; margin-bottom: 9px;"
    
    pkg_details_html += '<div class="active tab-pane" id="desc_' + pkg_num + '">' + desc + '</div>';
    
    if(dependencies.length > 0)
    {
        pkg_details_html += '<div class="tab-pane" id="dependencies_' + pkg_num + '"><pre>';
        pkg_details_html += dependencies.join('\n');
        pkg_details_html += '</pre></div>';
    }
    
    if(pkg_flavors_html != '')
    {
        pkg_details_html += '<div class="tab-pane" id="prev_versions_' + pkg_num + '">';
        pkg_details_html += '<pre>' + pkg_flavors_html + '</pre>';
        pkg_details_html += '</div>';
    }
    
    pkg_details_html += '<div class="tab-pane" id="details_' + pkg_num + '"><pre>';
    if(author != '') pkg_details_html += 'Author: ' + author + '\n';
    pkg_details_html += 'Last Updated: ' + latest_updated_date_str + '\n';
    
    if(latest_pkg != null)
    {
        pkg_details_html += 'Binding Policy Max Version: ' + latest_pkg.pkg.bindingPolicyMaxVersion + '\n';
        pkg_details_html += 'Binding Policy Min Version: ' + latest_pkg.pkg.bindingPolicyMinVersion + '\n';
        pkg_details_html += 'Bug Tracker: ' + latest_pkg.pkg.bugTracker + '\n';
        pkg_details_html += 'NSFW: ' + latest_pkg.pkg.nsfw + '\n';
        pkg_details_html += 'Stability: ' + latest_pkg.pkg.stability + '\n';
    }
    
    pkg_details_html += '</pre></div>';
    
    if(typeof pkg_html != 'undefined')
    {
        pkg_details_html += '<div class="tab-pane" id="variations_' + pkg_num + '">';// style="margin-left: 15px;"
        
        pkg_details_html += pkg_html;
        
        pkg_details_html += '</div>';
    }
    
    pkg_details_html += '</div>';//tab-content
    
    pkg_details_html += '</div>';//modal-body
    
    pkg_details_html += '<div class="modal-footer">';
    if(link != '') pkg_details_html += '<a href="' + link + '" class="btn primary">Download</a>';
    //pkg_details_html += '<a href="javascript:close_modal(\''+pkg_num+'\');" class="btn secondary">Close</a>';
    pkg_details_html += '</div>';
    
    pkg_details_html += '</div>';//more_info
    
    return pkg_details_html;
}

function get_pkg_listing(pkg_header_html, pkg_num, show_details_link, pkg_details_html)
{
    var package_html = '';
    
    //package_html += '<div style="float: right; color: #AAA; font-size: 12px;" class="updated">' + latest_updated_date_str + '</div>';
    
    package_html += '<h3>';// style="line-height: 27px; padding: 4px 0px;"
    
    package_html += pkg_header_html;
    
    if(show_details_link)
    {
        //package_html += '<div style="margin-bottom: 9px;">';
        
        package_html += ' ' + more_details_link(pkg_num);
        
        //package_html += '</div>';
    }
    
    package_html += '</h3>';
    
    if(typeof pkg_details_html != 'undefined')
    {
        package_html += pkg_details_html;
    }
    
    return package_html;
}

function get_arch_version_details_html(package_arch_versions, package_ids, latest_pkg, latest_version, variation_pkg_html)
{
    var pkg_html = '';
    
    var sub_pkg_name = latest_pkg.pkg.name;
    
    jQuery.each( package_arch_versions[sub_pkg_name] ,
        function(package_arch, package_versions)
            {
                var arch_versions = new Array();
                
                //package_versions = sortObj(package_versions);
                
                var arch_latest_pkg = null;
                var arch_latest_updated_timestamp = 0;
                
                jQuery.each( package_versions ,
                    function(package_version, package_version_pkg)
                        {
                            if(package_version != latest_version)
                            {
                                var link = package_version_pkg.link;
                                
                                var pkg_arch_version_updated_date_str = get_pkg_last_updated_formatted(package_version_pkg);
                                
                                var pkg_arch_version_link = '<a href="' + link + '">' + package_version + '</a> <span style="color: #AAA;">' + pkg_arch_version_updated_date_str + '</span>';
                                
                                arch_versions.push( pkg_arch_version_link );
                            }
                            
                            var updated = package_version_pkg.updated;
                            
                            var updated_timestamp = Date.parse(updated);
                            
                            if(updated_timestamp > arch_latest_updated_timestamp)
                            {
                                arch_latest_updated_timestamp = updated_timestamp;
                                
                                arch_latest_pkg = package_version_pkg;
                            }
                        }
                );
                
                //console.log(sub_pkg_name + ":"+ package_arch);
                
                var arch_latest_pkg_id = arch_latest_pkg.id;
                
                arch_versions = arch_versions.join('\n');
                
                pkg_html += get_pkg_details(arch_latest_pkg, package_ids, arch_latest_pkg_id, arch_versions, variation_pkg_html);
            }
    );
    
    return pkg_html;
}

function more_details_link(pkg_num)
{
    return '<a class="show_more warning" data-controls-modal="more_info_'+pkg_num+'" data-backdrop="true" data-keyboard="true" style="color: #F89406;">+</a>';
    //return '<span class="show_more label" data-controls-modal="more_info_'+pkg_num+'" data-backdrop="true" data-keyboard="true">+</span>';
}

function check_variation_validity(variation)
{
    if(variation == 'dev' || variation == 'dev-common' || variation == 'common' || variation == 'core')
    {
        return true;
    }
    else
    {
        return false;
    }
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
            var package_arch_versions = {};

            for (var i = feed.items.length-1; i >= 0 && i > 0; i--) {
            
                var pkg_id = feed.items[i].id;
                
                package_ids[ pkg_id ] = feed.items[i];
                
                var pkg = feed.items[i].pkg;
                
                var name = pkg.shortName;
                var architecture = pkg.architecture;
                var version = pkg.version;
                
                var variation = pkg.variation;
                var flavor = pkg.flavor;
                
                if(typeof packages[name] == 'undefined')
                {
                    packages[name] = {};
                }
                
                var package_names = packages[name];
                
                if(typeof package_names[variation] == 'undefined')
                {
                    package_names[variation] = {};
                }
                
                var package_variations = package_names[variation];
                
                if(typeof package_variations[flavor] == 'undefined')
                {
                    package_variations[flavor] = {};
                }
                
                var package_flavors = package_variations[flavor];
                
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
                
                var name = pkg.name;
                
                if(typeof package_arch_versions[name] == 'undefined')
                {
                    package_arch_versions[name] = {};
                }
                
                var package_arch_versions_names = package_arch_versions[name];
                
                if(typeof package_arch_versions_names[architecture] == 'undefined')
                {
                    package_arch_versions_names[architecture] = {};
                }
                
                var package_arch_versions_archs = package_arch_versions_names[architecture];
                
                if(typeof package_arch_versions_archs[version] == 'undefined')
                {
                    package_arch_versions_archs[version] = null;
                }
            }
            
            //packages = sortObj(packages);
            
            var test = 1;
            
            var pkg_num = 0;
            
            jQuery.each( packages ,
                function(pkg_name, pkg_variations)
                    {
                        pkg_variations = sortObj(pkg_variations);
                        
                        var pkg_variations_html = '';
                        
                        var base_variation = {};
                        
                        var variations = new Array();
                        var variations_plain = new Array();
                        
                        var num_variations = 0;
                        var has_base_variation = false;
                        
                        jQuery.each( pkg_variations ,
                            function(pkg_variation, pkg_falvors)
                                {
                                        num_variations++;
                                        
                                        if(pkg_variation == '') has_base_variation = true;
                                }
                        );
                        
                        var pkg_html = '';
                        
                        var all_pkg_details_html = '';
                        
                        var pkg_header_html = '';
                        var pkg_details_html = '';
                        
                        var author = '';
                        
                        jQuery.each( pkg_variations ,
                            function(pkg_variation, pkg_falvors)
                                {
                                    //pkg_num++;
                                    
                                    pkg_falvors = sortObj(pkg_falvors);
                                    
                                    var pkg_flavors_html = '';
                                    
                                    var latest_pkg = null;
                                    var latest_updated_timestamp = 0;
                                    
                                    var latest_version = null;
                                    var latest_version_link = null;
                                    
                                    var flavors = new Array();
                                    var flavors_plain = new Array();
                                    
                                    var flavor_latest_pkgs = new Array();
                                    
                                    var archs = new Array();
                                    var archs_plain = new Array();
                                    
                                    var num_flavors = 0;
                                    var num_archs = 0;
                                    
                                    var output_normal = true;
                                    
                                    if(num_variations > 1)
                                    {
                                        if(has_base_variation)
                                        {
                                            if(pkg_variation == '')
                                            {
                                                output_normal = false;
                                            }
                                        }
                                    }
                                    
                                    jQuery.each( pkg_falvors ,
                                        function(pkg_falvor, pkg_versions)
                                            {
                                                num_flavors++;
                                                
                                                var pkg_version_html = new Array();
                                                
                                                var flavor_latest_pkg = null;
                                                var flavor_latest_updated_timestamp = 0;
                                                
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
                                                            
                                                            var version_latest_pkg = null;
                                                            var version_latest_updated_timestamp = 0;
                                                            
                                                            var pkg_arch_html = new Array();
                                                            
                                                            jQuery.each( pkg_archs ,
                                                                function(pkg_arch, pkgs)
                                                                    {
                                                                        if(store_archs) num_archs++;
                                                                        
                                                                        var link = null;
                                                                        
                                                                        jQuery.each( pkgs ,
                                                                            function(arch_pkg_num, pkg)
                                                                                {
                                                                                    if(link == null)
                                                                                    {
                                                                                        link = pkg.link;
                                                                                    }
                                                                                    
                                                                                    var sub_pkg_name = pkg.pkg.name;
                                                                                                                                                                        
                                                                                    var updated = pkg.updated;
                                                                                    
                                                                                    var updated_timestamp = Date.parse(updated);
                                                                                    
                                                                                    if(updated_timestamp > latest_updated_timestamp)
                                                                                    {
                                                                                        latest_updated_timestamp = updated_timestamp;
                                                                                        
                                                                                        latest_pkg = pkg;
                                                                                        
                                                                                        pkg_num = pkg.id;
                                                                                    }
                                                                                    
                                                                                    if(updated_timestamp > version_latest_updated_timestamp)
                                                                                    {
                                                                                        version_latest_updated_timestamp = updated_timestamp;
                                                                                            
                                                                                        version_latest_pkg = pkg;
                                                                                    }
                                                                                    
                                                                                    if(updated_timestamp > flavor_latest_updated_timestamp)
                                                                                    {
                                                                                        flavor_latest_updated_timestamp = updated_timestamp;
                                                                                            
                                                                                        flavor_latest_pkg = pkg;
                                                                                    }
                                                                                    
                                                                                    if( package_arch_versions[sub_pkg_name][pkg_arch][pkg_version] == null )
                                                                                    {
                                                                                        package_arch_versions[sub_pkg_name][pkg_arch][pkg_version] = pkg;
                                                                                    }
                                                                                }
                                                                        );
                                                                        
                                                                        var pkg_arch_link = pkg_arch;
                                                                        
                                                                        if(pkgs.length >= 1)
                                                                        {
                                                                            pkg_arch_link = '<a href="' + link + '">' + pkg_arch + '</a> ' + more_details_link(pkg_num);
                                                                        }
                                                                        
                                                                        if(store_archs)
                                                                        {
                                                                            archs.push( pkg_arch_link );
                                                                            archs_plain.push( pkg_arch );
                                                                        }
                                                                        
                                                                        pkg_arch_html.push( pkg_arch_link );
                                                                    }
                                                            );
                                                            
                                                            var version_latest_updated_date_str = '';
                                                            
                                                            version_latest_updated_date_str = get_pkg_last_updated_formatted(version_latest_pkg);
                                                            
                                                            pkg_version_html.push( pkg_version + ' [ ' + pkg_arch_html.join(', ') + ' ] <span style="color: #AAA;">' + version_latest_updated_date_str + '</span>' );
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
                                                
                                                //console.log('_ ' + pkg_name + ' ' + pkg_variation + ' ' + pkg_falvor);
                                                
                                                if(output_normal)
                                                {
                                                    //console.log('1');
                                                    
                                                    var arch_version_details_html = get_arch_version_details_html(package_arch_versions, package_ids, latest_pkg, latest_version);
                                                    
                                                    all_pkg_details_html += arch_version_details_html;
                                                }
                                                else
                                                {
                                                    flavor_latest_pkgs.push( flavor_latest_pkg );
                                                }
                                            }
                                    );
                                    
                                    var latest_updated_date = null;
                                    
                                    var latest_updated_date_str = '';
                                    
                                    if(latest_pkg != null)
                                    {
                                        latest_updated_date_str = get_pkg_last_updated_formatted(latest_pkg);
                                                                        
                                        latest_version_link = latest_pkg.link;
                                        
                                        if(typeof latest_pkg.author != 'undefined')
                                        {
                                            if(latest_pkg.author != null)
                                            {
                                                author = latest_pkg.author.name;
                                            }
                                        }
                                    }
                                    
                                    if(output_normal)
                                    {
                                        /*
                                        var pkg_display_name = pkg_name;
                                        
                                        if(pkg_variation != '') pkg_display_name += '-' + pkg_variation;
                                        */
                                        
                                        var pkg_display_name = latest_pkg.pkg.displayName;
                                        
                                        pkg_header_html = get_pkg_header(num_flavors, flavors_plain, flavors, num_archs, archs_plain, archs, latest_version, latest_version_link, pkg_display_name);
                                        
                                        if(num_flavors <= 1 && num_archs <= 1 && latest_version != null) var show_details_link = true;
                                        else var show_details_link = false;
                                        
                                        pkg_html += get_pkg_listing(pkg_header_html, pkg_num, show_details_link);//, pkg_details_html
                                    }
                                    else
                                    {
                                        base_variation.flavor_latest_pkgs = flavor_latest_pkgs;
                                        
                                        base_variation.pkg_num = pkg_num;
                                        
                                        base_variation.latest_pkg = latest_pkg;
                                        base_variation.pkg_flavors_html = pkg_flavors_html;
                                        
                                        base_variation.num_flavors = num_flavors;
                                        base_variation.flavors_plain = flavors_plain;
                                        base_variation.flavors = flavors;
                                        
                                        base_variation.num_archs = num_archs;
                                        base_variation.archs_plain = archs_plain;
                                        base_variation.archs = archs;
                                        
                                        base_variation.latest_version = latest_version;
                                        base_variation.latest_version_link = latest_version_link;
                                        
                                        base_variation.pkg_name = pkg_name;
                                        
                                        base_variation.pkg_header_html = pkg_header_html;
                                        base_variation.author = author;
                                    }
                                }
                        );
                        
                        if(num_variations > 1 && has_base_variation)
                        {
                            var flavor_latest_pkgs = base_variation.flavor_latest_pkgs;
                            
                            var base_pkg_num = base_variation.pkg_num;
                            
                            var latest_pkg = base_variation.latest_pkg;
                            var pkg_flavors_html = base_variation.pkg_flavors_html;
                            
                            var num_flavors = base_variation.num_flavors;
                            var flavors_plain = base_variation.flavors_plain;
                            var flavors = base_variation.flavors;
                            var num_archs = base_variation.num_archs;
                            var archs_plain = base_variation.archs_plain;
                            var archs = base_variation.archs;
                            
                            var latest_version = base_variation.latest_version;
                            var latest_version_link = base_variation.latest_version_link;
                            
                            var pkg_name = base_variation.pkg_name;
                            
                            var pkg_header_html = base_variation.pkg_header_html;
                            var author = base_variation.author;
                            
                            //console.log('2');
                            
                            jQuery.each(flavor_latest_pkgs,
                                function( flavor_latest_pkg_num, flavor_latest_pkg )
                                    {
                                        pkg_details_html += get_arch_version_details_html(package_arch_versions, package_ids, flavor_latest_pkg, latest_version, pkg_html);
                                    }
                            );
                            
                            var pkg_display_name = latest_pkg.pkg.displayName;
                            
                            pkg_header_html = get_pkg_header(num_flavors, flavors_plain, flavors, num_archs, archs_plain, archs, latest_version, latest_version_link, pkg_display_name);
                            
                            if(num_flavors <= 1 && num_archs <= 1 && latest_version != null) var show_details_link = true;
                            else var show_details_link = false;
                            
                            pkg_html = get_pkg_listing(pkg_header_html, base_pkg_num, show_details_link, pkg_details_html);
                        }
                        
                        pkg_html += all_pkg_details_html;
                        
                        html[ pkg_name ] = {};
                        html[ pkg_name ]['html'] = pkg_html;
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
