#!/usr/bin/env ruby
require 'json'
require 'csv'

if ARGV.length != 1
  puts "Usage: iconifyConvertToJSON.rb path-to-data.csv"
  return
end

file_path = ARGV[0]

data = []

CSV.read(file_path).each_with_index do |row, index|
  next if index == 0

  name = row[0]

  tags = ''
  tags = row[2].gsub(/[|+-\/]/, '').downcase if row[2]
  tags += row[3].gsub(/[|+-\/]/, '').downcase if row[3]

  data << { 'name': name, 'tags': tags}
end

File.write('iconify-data.json', JSON.dump(data))
