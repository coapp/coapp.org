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
        cms.generateBefore(@config,next);


	# Generate has finished
	generateAfter: ({},next) ->
        cms.generateAfter(@config,next);


	# Cleaning is starting
	cleanBefore: ({},next) ->
        cms.cleanBefore(@config,next);


	# Cleaning has finished
	cleanAfter: ({},next) ->
		cms.cleanAfter(@config,next);


	# Parsing all files is starting
	parseBefore: ({},next) ->
		cms.parseBefore(@config,next);
	
    
	# Parsing all files has finished
	parseAfter: ({},next) ->
		cms.parseAfter(@config,next);


	# Rendering all files has started
	renderBefore: ({templateData},next) ->
        cms.renderBefore(@config,templateData, next);
	
    # Render some content
	render: ({inExtension,outExtension,templateData,file}, next) ->
        cms.render(@config,inExtension,outExtension,templateData,file, next)
		
    
	# Rendering all files has finished
	renderAfter: ({},next) ->
		cms.renderAfter(@config,next)


	# Writing all files is starting
	writeBefore: ({},next) ->
		cms.writeBefore(@config,next)

	# Writing all files has finished
	writeAfter: ({},next) ->
		cms.writeAfter(@config,next)
	
	# Setting up the server is starting
	serverBefore: ({},next) ->
		cms.serverBefore(@config,next)
	
	# Setting up the server has finished
	serverAfter: ({server},next) ->
		cms.serverAfter(@config,next)


# Export Plugin
module.exports = CoAppMarkdownPlugin

