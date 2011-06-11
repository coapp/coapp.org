module Jekyll
  class RenderTimeTag < Liquid::Tag
      safe true

    def initialize(tag_name, text, tokens)
      super
      @text = text
    end

    def render(context)
        pg = context["page"]
        site = context["site"]
        title = pg["title"]
        #title2 = pg.title
      "#{@text} #{Time.now} #{title} ... #{site}, #{pg}"
    end
  end
end

Liquid::Template.register_tag('render_time', Jekyll::RenderTimeTag)