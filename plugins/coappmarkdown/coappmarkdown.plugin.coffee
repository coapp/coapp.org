# Requires
cms = require 'coappcms'
DocpadPlugin = require "docpad/lib/plugin.coffee"

# This replaces the markdown plugin (it calls the same github-flavored-markdown) but
# After it passes any source blocks thru pygments.

# Define Plugin
class CoAppMarkdownPlugin extends DocpadPlugin
	# Plugin name
	name: 'coappmarkdown'

	# Plugin priority
	priority: 25
        
	# Generate is starting
	generateBefore: ({},next) ->
        cms.generateBefore(next);


	# Generate has finished
	generateAfter: ({},next) ->
        cms.generateAfter(next);


	# Cleaning is starting
	cleanBefore: ({},next) ->
        cms.cleanBefore(next);


	# Cleaning has finished
	cleanAfter: ({},next) ->
		cms.cleanAfter(next);


	# Parsing all files is starting
	parseBefore: ({},next) ->
		cms.parseBefore(next);
	
    
	# Parsing all files has finished
	parseAfter: ({},next) ->
		cms.parseAfter(next);


	# Rendering all files has started
	renderBefore: ({templateData},next) ->
        cms.renderBefore(templateData, next);
	
    # Render some content
	render: ({inExtension,outExtension,templateData,file}, next) ->
        cms.render(inExtension,outExtension,templateData,file, next)
		
    
	# Rendering all files has finished
	renderAfter: ({},next) ->
		cms.renderAfter(next)


	# Writing all files is starting
	writeBefore: ({},next) ->
		cms.writeBefore(next)

	# Writing all files has finished
	writeAfter: ({},next) ->
		cms.writeAfter(@config,next)
	
	# Setting up the server is starting
	serverBefore: ({},next) ->
		cms.serverBefore(next)
	
	# Setting up the server has finished
	serverAfter: ({server},next) ->
		cms.serverAfter(next)


# Export Plugin
module.exports = CoAppMarkdownPlugin

