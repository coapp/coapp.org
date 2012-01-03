/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/blog/simple-javascript-inheritance/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function ($) {
    (function () {
        var initializing = false, fnTest = /xyz/.test(function () { xyz; }) ? /\b_super\b/ : /.*/;
        // The base Class implementation (does nothing)
        this.Class = function () {
        };

        // Create a new Class that inherits from this class
        Class.extend = function (prop) {
            var _super = this.prototype;

            // Instantiate a base class (but only create the instance,
            // don't run the init constructor)
            initializing = true;
            var prototype = new this();
            initializing = false;

            // Copy the properties over onto the new prototype
            for (var name in prop) {
                // Check if we're overwriting an existing function
                prototype[name] = typeof prop[name] == "function" &&
                    typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                    (function (name, fn) {
                        return function () {
                            var tmp = this._super;

                            // Add a new ._super() method that is the same method
                            // but on the super-class
                            this._super = _super[name];

                            // The method only need to be bound temporarily, so we
                            // remove it when we're done executing
                            var ret = fn.apply(this, arguments);
                            this._super = tmp;

                            return ret;
                        };
                    })(name, prop[name]) :
                    prop[name];
            }

            // The dummy class constructor

            function Class() {
                // All construction is actually done in the init method
                if (!initializing && this.init)
                    this.init.apply(this, arguments);
            }

            // Populate our constructed prototype object
            Class.prototype = prototype;

            // Enforce the constructor to be what we expect
            Class.prototype.constructor = Class;

            // And make this class extendable
            Class.extend = arguments.callee;

            return Class;
        };
    })();


    String.prototype.Format = function () {
        var args = (arguments.length == 1 && typeof (arguments[0]) == "object") ? arguments[0] : arguments;

        return this.replace(/{(.*?)}/g, function (match, param) {
            var v = args[param];
            
            if (!IsNullOrUndefined(v)) {
                return v;
            }
            
            try {
                return eval(param);
            } catch (err) {
                for (var i = 0; i < args.length; i++) {
                    v = args[i][param];
                    if (!IsNullOrUndefined(v)) {
                        return v;
                    }
                }
            }
            return match;
        });
    };

    //+ Jonas Raoni Soares Silva
    //@ http://jsfromhell.com/string/pad [rev. #1]
    /// Returns the string with a substring padded on the left, right or both sides.
    /// length: amount of characters that the string must have
    /// substring: string that will be concatenated
    /// type: specifies the side where the concatenation will happen, where: 0 = left, 1 = right and 2 = both sides
    String.prototype.pad = function (l, s, t) {
        return s || (s = " "), (l -= this.length) > 0 ? (s = new Array(Math.ceil(l / s.length)
        + 1).join(s)).substr(0, t = !t ? l : t == 1 ? 0 : Math.ceil(l / 2))
        + this + s.substr(0, l - t) : this;
    };

    String.prototype.Trim = function () {
        return (this || "").replace(/^\s+|\s+$/g, "");
    };

    function IsNullOrEmpty(str) {
        return str === null || str === "" || str == undefined;
    };

    function IsNullOrUndefined(str) {
        return str === null || str == undefined;
    };

    var Person = Class.extend({
        name: '',
        uri: '',
        email: '',
        init: function (entry) {
            if (entry != null) {
                this.name = entry.find('name').eq(0).text();
                this.uri = entry.find('uri').eq(0).text();
                this.email = entry.find('email').eq(0).text();
            }
        }
    });

    var Item = Class.extend({
        id: '',
        title: '',
        summary: '',
        updated: '',
        published: '',
        author: {},
        link: '',
        links: [],
        description: '',
        categories: [],
        pkg: {},

        formatTextAsHtml: function (text, textType) {
            if ((textType == "text") || text.indexOf('<') == -1 || text.indexOf('>') == -1) {
                return '<pre>{0}</pre>'.Format(text);
            }
            return text;
        },

        init: function (entry) {
            this.id = entry.find('id').eq(0).text();
            this.title = entry.find('title').eq(0).text();
            var sum = entry.find('summary').eq(0);
            // this.summary = sum.attr('type') == 'html' ? sum.text() : '<pre>' + sum.text() + '</pre>';

            this.summary = this.formatTextAsHtml(sum.text(), sum.attr('type'));

            this.updated = entry.find('updated').eq(0).text();
            this.published = entry.find('published').eq(0).text();
            this.author = new Person(entry.find('author').eq(0));

            var links = this.links;
            entry.find('link').each(function () {
                var link = jQuery(this);
                if (link.attr('rel') == 'enclosure') {
                    links.push(new Link(jQuery(this)));
                }
            });

            this.link = entry.find('link').eq(0).attr('href');
            var desc = entry.find('content').eq(0);
            this.description = this.formatTextAsHtml(desc.text(), desc.attr('type'));

            var categories = this.categories;
            entry.find('category').each(function () {
                categories.push(new Category(jQuery(this)));
            });
        }
    });

    var Link = Class.extend({
        url: '',
        title: '',

        init: function (entry) {
            if (entry != null) {
                url = entry.attr('href');
                title = entry.attr('title');
            }
        }
    });

    var Category = Class.extend({
        term: '',
        label: '',
        scheme: '',

        init: function (entry) {
            if (entry != null) {
                term = entry.attr('term');
                label = entry.attr('label');
                scheme = entry.attr('scheme');
            }
        }
    });

    var Package = Class.extend({
        name: '',
        architecture: '',
        version: '',
        publicKeyToken: '',
        displayName: '',
        publisherDirectory: '',

        bindingPolicyMinVersion: 0,
        bindingPolicyMaxVersion: 0,

        dependencies: [],
        features: [],
        requiredFeatures: [],
        packageFeeds: [],
        authorVersion: '',
        bugTracker: '',
        icon: '',
        licenses: [],
        nsfw: false,
        stability: 0,

        init: function (entry) {
        }
    });

    var AtomFeed = Class.extend({
        type: 'atom',
        version: '',
        title: '',
        link: '',
        description: '',

        init: function (xml) {
            if (jQuery.browser.msie) {
                var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.loadXML(xml);
                xml = xmlDoc;
            }

            var channel = jQuery('feed', xml).eq(0);

            this.version = '1.0';
            this.title = jQuery(channel).find('title:first').text();
            this.link = jQuery(channel).find('link:first').attr('href');
            this.description = jQuery(channel).find('subtitle:first').text();
            this.language = jQuery(channel).attr('xml:lang');
            this.updated = jQuery(channel).find('updated:first').text();

            this.items = new Array();

            var feed = this;

            jQuery('entry', xml).each(function () {
                feed.items.push(new Item(jQuery(this)));
            });
        }
    });

    $.fn.getPackageFeed = function (options) {

        options = $.extend({
            url: null,
            data: null,
            cache: true,
            success: null,
            failure: null,
            error: null,
            global: true
        }, options);

        if (options.url) {
            if (jQuery.isFunction(options.failure) && jQuery.type(options.error) === 'null') {
                // Handle legacy failure option
                options.error = function (xhr, msg, e) {
                    options.failure(msg, e);
                };
            } else if (jQuery.type(options.failure) === jQuery.type(options.error) === 'null') {
                // Default error behavior if failure & error both unspecified
                options.error = function (xhr, msg, e) {
                    window.console && console.log('getPackageFeed failed to load feed', xhr, msg, e);
                };
            }

            return $.ajax({
                type: 'GET',
                url: options.url,
                data: options.data,
                cache: options.cache,
                dataType: (jQuery.browser.msie) ? "text" : "xml",
                success: function (xml) {
                    var feed = new AtomFeed(xml);
                    if (jQuery.isFunction(options.success)) {
                        options.success(feed);
                    }
                },
                error: options.error,
                global: options.global
            });
        }
    };

    $.getPackageFeed = $.fn.getPackageFeed;
})(jQuery);