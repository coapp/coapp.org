<span>
<!--
    <span class="menu" tabindex="0">
        {% for item in page.topnavnames %} 
        <span class="mi root mi0 {% if forloop.first %}first{% endif%} {% if page.title == item %}sel{% endif %} {% if forloop.last %}last{% endif%} ">
            <a class="txt" style="cursor: pointer;" href="{{ page.topnavlinks[forloop.index0] }}">{{ item }}</a>
        </span>  
        {% endfor %} 
    </span>
-->
    <span class="menu" tabindex="0">
        {% for item in page.topnavigation %} 
        <span class="mi root mi0 {% if forloop.first %}first{% endif%} {% if page.title == item[1] %}sel{% endif %} {% if forloop.last %}last{% endif%} ">
            <a class="txt" style="cursor: pointer;" href="{{ item[0] }}">{{ item[1] }}</a>
        </span>  
        {% endfor %} 
    </span>

</span>