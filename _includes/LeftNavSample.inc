<div id="MenuV" class="MenuV01">
{% for item in page.children%} 
    <div class="mi root mi0 {% if forloop.first %}first{% endif%} {% if page.subtitle == item %}sel{% endif %} {% if forloop.last %}last{% endif%} ">
        <a class="txt" style="cursor: pointer;" href="/{{page.title}}/{{item}}.html">{{ item }}</a>
    </div>  
{% endfor %} 
</div>