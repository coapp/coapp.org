module Jekyll

  # Outputs a string with a given attribution as a quote
  #
  #   {% blockquote John Paul Jones %}
  #     Monkeys!
  #   {% endblockquote %}
  #   ...
  #   <blockquote>
  #     Monkeys!
  #     <br />
  #     John Paul Jones
  #   </blockquote>
  #
  class Blockquote < Liquid::Block
    Syntax = /([\w\s]+)/

    def initialize(tag_name, markup, tokens)
      @by = nil
      if markup =~ Syntax
        @by = $1
      end
      super
    end

    def render(context)
      output = super
      if @by.nil?
        '<blockquote>' + output.join + '</blockquote>'
      else
        '<blockquote>' + output.join + '<br />' + @by + '</blockquote>'
      end
    end
  end

  # Outputs a string with a given attribution as a pullquote
  #
  #   {% pullquote John Paul Jones %}
  #     Monkeys!
  #   {% pullquote %}
  #   ...
  #   <blockquote class="pullquote">
  #     Monkeys!
  #     <br />
  #     John Paul Jones
  #   </blockquote>
  #
  class Pullquote < Liquid::Block
    Syntax = /([\w\s]+)/

    def initialize(tag_name, markup, tokens)
      @by = nil
      if markup =~ Syntax
        @by = $1
      end
      super
    end

    def render(context)
      output = super
      if @by.nil?
        '<blockquote class="pullquote">' + output.join + '</blockquote>'
      else
        '<blockquote class="pullquote">' + output.join + '<br />' + @by + '</blockquote>'
      end
    end
  end
end

Liquid::Template.register_tag('blockquote', Jekyll::Blockquote)
Liquid::Template.register_tag('pullquote', Jekyll::Pullquote)