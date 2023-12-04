#!/usr/bin/env ruby
require 'json'
require 'csv'

if ARGV.length != 1
  puts "Usage: iconifyMetadataProcessing.rb path-to-icon-set.json"
  return
end

icon_path = ARGV[0]


full_metadata = JSON.parse(File.read(icon_path))

icons_dictionary = {}

icon_metadata = full_metadata["icons"]

icon_keys = icon_metadata.keys

icon_keys.each do |icon_name|
  icons_dictionary[icon_name] = {
    name: icon_name,
    image_url: "=IMAGE(\"https://api.iconify.design/mdi/#{icon_name}.svg\")",
    tags: []
  }
end

alias_metadata = full_metadata["aliases"]

alias_metadata.each do |key, value|
  parent = value['parent']
  icons_dictionary[parent][:tags] << key if icons_dictionary[parent]
end

categories_metadata = full_metadata["categories"]

categories_metadata.each do |key, icons|
  icons.each do |icon_name|
    icons_dictionary[icon_name][:tags] << key if icons_dictionary[icon_name]
  end
end

CSV.open("iconify-output.csv", "w") do |csv|
  csv << ['Name', 'Image', 'Tags & Categories']

  icons_dictionary.each do |key, data|
    csv << [data[:name], data[:image_url], data[:tags].join(' | ')]
  end

end