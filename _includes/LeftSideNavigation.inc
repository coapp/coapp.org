<div id="MenuV" class="MenuV01">
{% for item in page.subnavigation %} 
    <div class="mi root mi0 {% if forloop.first %}first{% endif%} {% if page.subtitle == item[1] %}sel{% endif %} {% if forloop.last %}last{% endif%} ">
        <a class="txt" style="cursor: pointer;" href="/{{page.title}}/{{item[0]}}">{{ item[1] }}</a>
    </div>  
{% endfor %} 
</div>