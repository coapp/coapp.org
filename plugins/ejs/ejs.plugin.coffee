# Requires
DocpadPlugin = require "docpad/lib/plugin.coffee"

ejs = null

# Define Plugin
class EjsPlugin extends DocpadPlugin
	# Plugin name
	name: 'ejs'

	# Plugin priority
	priority: 1750

	# Render some content
	render: ({inExtension,outExtension,templateData,file}, next) ->
			if inExtension is 'ejs'
				ejs = require 'ejs'  unless ejs
				file.content = ejs.render file.content, templateData
				next()
			else
				next()

# Export Plugin
module.exports = EjsPlugin