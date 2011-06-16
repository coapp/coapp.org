<div id="MenuV" class="MenuV01">
  <div class="mi root mi0 first {% if page.subtitle == 'one' %}sel{% endif %}">
      <a class="txt" style="cursor: pointer;" href="{{page.title}}_one.html">One</a>
  </div>
  <div class="mi root mi1 {% if page.subtitle == 'two' %}sel{% endif %}">
    <a class="txt" style="cursor: pointer;" href="{{page.title}}_two.html">Two</a>
  </div>
  <div class="mi root mi2 {% if page.subtitle  == 'three' %}sel{% endif %}">
    <span class="txt" style="cursor: pointer;">Three</span>
  </div>
  <div class="mi root mi3 {% if page.subtitle == 'four' %}sel{% endif %}">
    <span class="txt" style="cursor: pointer;">Four</span>
  </div>
  <div class="mi root mi4 {% if page.subtitle  == 'five' %}sel{% endif %} last">
    <span class="txt" style="cursor: pointer;">Five</span>
  </div>
</div>