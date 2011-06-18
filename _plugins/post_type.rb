require 'fileutils'
require 'find'

module Jekyll
  # The PostType class creates a single post page for the specified post_type.
  class PostType < Page
    
    # Initialize a new PostType.
    #   +site+ is the Site
    #   +source+ is the String path to the <source>
    #   +dir+ is the relative path from the base directory to the post type folder.
    #   +name+ is the name of the post_type page to process.
    def initialize(site, dir, folder, post_path, post_type)
      slug = post_path.sub(/^#{folder}\/([^\.]+)\..*/, '\1')
      name = post_path.sub(/^#{folder}\//, '\1')
      
      @site = site
      @base = File.join(site.source, folder)
      @dir = File.join(dir, slug)

      self.read_yaml(@base, name)
      self.data['slug'] = slug
      self.data['is' + post_type] = true

      if self.data.has_key?('date')
        # ensure Time via to_s and reparse
        self.date = Time.parse(self.data["date"].to_s)
      end

      if !self.data.has_key?('layout')
        self.data['layout'] = site.config[post_type + '_index_layout'] || post_type + '_index'
      end
      
      # Ignore the post_type page unless it has been marked as published.
      if self.data.has_key?('published') && self.data['published'] == false
        return false
      else
        self.data['published'] = true
      end

      ext = File.extname(name)
      unless ['.textile', '.markdown', '.html'].include?(ext)
        ext = '.textile'
      end

      @name = "index#{ext}"
      self.process(@name)
    end
  end

  class PostTypeList < Page
    def initialize(site,  base, dir, posts, post_type)
      @site = site
      @base = base
      @dir = dir
      @name = 'index.html'

      layout = site.config[post_type + '_list_layout'] || post_type + '_list'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), layout + '.html')
      self.data[post_type + 's'] = posts
      self.data['is_' + post_type] = true
    end
  end

  # Jekyll hook - the generate method is called by jekyll, and generates all the post_type pages.
  class PostTypeGenerator < Generator
    safe true
    priority :low

    def generate(site)
      if site.config.has_key?('post_types') == false
        return true
      end

      site.config['post_types'].each do |post_type|
        post_type_list = []

        folder_key       = post_type + '_folder'
        default_folder   = '_' + post_type + 's'
        dir_key          = post_type + '_dir'

        layout_index = site.config[post_type + '_index_layout'] || post_type + '_index'
        layout_list  = site.config[post_type + '_list_layout'] || post_type + '_list'

        if site.layouts.key? layout_index
          dir = site.config[dir_key] || post_type
          folder = site.config[folder_key] || default_folder
          
          posts = get_files(folder)
          posts.each do |post_path|
            post = write_posttype_index(site, dir, folder, post_path, post_type)
            unless post.nil?
              post_type_list << post
            end
          end
        end
        
        if post_type_list.size > 1 and site.layouts.key? layout_list
          write_posttype_list(site, dir, post_type_list, post_type)
        end
      end
    end
    
    def write_posttype_index(site, dir, folder, post_path, post_type)
      index = PostType.new(site, dir, folder, post_path, post_type)
      if index.data['published']
        index.render(site.layouts, site.site_payload)
        index.write(site.dest)
        site.static_files << index
        return index
      end
      return nil
    end
    
    def write_posttype_list(site, dir, posts, post_type)
      index = PostTypeList.new(site, site.source, dir, posts, post_type)
      index.render(site.layouts, site.site_payload)
      index.write(site.dest)
      site.static_files << index
    end
    
    # Gets a list of files in the _posttype folder with a .markdown or .textile extension.
    #
    # Return Array list of post config files.
    def get_files(folder)
      files = []
      Find.find(folder) do |file|
        if file=~/.markdown$/ or file=~/.textile$/
          files << file
        end
      end
      
      files
    end
  end

end