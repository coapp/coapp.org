module Jekyll

  class IncludeSetTag < Liquid::Tag
    def initialize(tag_name, files, tokens)
      super
      @files = files.strip
    end

    def render(context)
      includes_dir = File.join(context.registers[:site].source, '_includes')
        pg = context["page"]
        filenames = pg[@files]
        if ! filenames 
            return ""
        end
        if File.symlink?(includes_dir)
          return "Includes directory '#{includes_dir}' cannot be a symlink"
        end

        #if filename !~ /^[a-zA-Z0-9_\/\.-]+$/ || filename =~ /\.\// || filename =~ /\/\./
        #  return "Include file '#{filename}' contains invalid characters or sequences"
        #end
        source = ""
        partial = ""

        Dir.chdir(includes_dir) do
          choices = Dir['**/*'].reject { |x| File.symlink?(x) }
          for filename in filenames
            if choices.include?(filename)
              source = source + File.read(filename)
            end
          end
        end 
        partial = Liquid::Template.parse(source)
        context.stack do
          partial.render(context)
        end
      end
    end
end

Liquid::Template.register_tag('includeset', Jekyll::IncludeSetTag)
