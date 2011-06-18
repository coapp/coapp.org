<div id="LeftZone" class="pane w100">
    <div class="C02 container">
        <div class="TL">
            <div class="TR">
                <div class="TM">
                    <div class="c_head">
                        <span class="c_title">
                        <span class="CTitle">Blog Archive</span></span>
                        <div class="clear">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="ML">
            <div class="MR">
                <div class="MM">
                    <div class="containercontent">
                        <li id="text-3" class="widget widget_text">
                        <div class="textwidget">
                            <p>
                            <a href="/atom.xml" rel="alternate" type="application/rss+xml">
                            <img alt="" src="/images/feed-icon32x32.png" style="vertical-align: middle; border: 0"></a>&nbsp;<a href="/atom.xml" rel="alternate" type="application/rss+xml">Subscribe 
                            in a reader</a></p>
                        </div>
                        </li>
                        <hr>
                        <li id="categories-1" class="widget widget_categories">
                        <h3 class="widgettitle">Post Categories</h3>
                        </li>
{% for category in site.categories %}
	<li><a href="/topics/{{ category[0] | replace:' ', '-' | downcase  }}">{{ category[0] }} ({{ category[1] | size }} posts) </a></li>
{% endfor %}
                                
                        <div id="popular-tags" class="section"><br><hr><h3 class="section-title">Tag Cloud</h3>{% tag_cloud %}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="BL">
            <div class="BR">
                <div class="BM">
                </div>
            </div>
        </div>
    </div>
</div>

