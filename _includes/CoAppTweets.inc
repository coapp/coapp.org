<h4><u>In the twittersphere...</u></h4>
<p><div class="tweet"></div></p>
<div class="rightButton">
    <br>
    <a class="btn" href="http://search.twitter.com/search?q=&ands=CoApp&phrase=&ors=&nots=CoAppCommits&tag=&lang=all&from=&to=&ref=&near=&within=15&units=mi&since=&until=&rpp=15" >
    Read more</a> <br><br><br></div>

<script type="text/javascript">
$(document).ready(function(){
        $(".tweet").tweet({
            query: "coapp  -CoAppCommits",
            
            avatar_size: 48,
            count: 5,
            
            loading_text: "loading tweets...",
            refresh_interval: 60
        });
    });
</script>