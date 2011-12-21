# Requires
Pygments = require './pygments'
DocpadPlugin = require "docpad/lib/plugin.coffee"

# This replaces the markdown plugin (it calls the same github-flavored-markdown) but
# After it passes any source blocks thru pygments.

# Define Plugin
class PygmentsPlugin extends DocpadPlugin
	# Plugin name
	name: 'pygments'

	# Plugin priority
	priority: 25
        
	# Generate is starting
	generateBefore: ({},next) ->
        Pygments.generateBefore(next);


	# Generate has finished
	generateAfter: ({},next) ->
        Pygments.generateAfter(next);


	# Cleaning is starting
	cleanBefore: ({},next) ->
        Pygments.cleanBefore(next);


	# Cleaning has finished
	cleanAfter: ({},next) ->
		Pygments.cleanAfter(next);


	# Parsing all files is starting
	parseBefore: ({},next) ->
		Pygments.parseBefore(next);
	
    
	# Parsing all files has finished
	parseAfter: ({},next) ->
		Pygments.parseAfter(next);


	# Rendering all files has started
	renderBefore: ({templateData},next) ->
        Pygments.renderBefore(templateData, next);
	
    # Render some content
	render: ({inExtension,outExtension,templateData,file}, next) ->
        Pygments.render(inExtension,outExtension,templateData,file, next)
		
    
	# Rendering all files has finished
	renderAfter: ({},next) ->
		Pygments.renderAfter(next)


	# Writing all files is starting
	writeBefore: ({},next) ->
		Pygments.writeBefore(next)

	# Writing all files has finished
	writeAfter: ({},next) ->
		Pygments.writeAfter(@config,next)
	
	# Setting up the server is starting
	serverBefore: ({},next) ->
		Pygments.serverBefore(next)
	
	# Setting up the server has finished
	serverAfter: ({server},next) ->
		Pygments.serverAfter(next)


# Export Plugin
module.exports = PygmentsPlugin

