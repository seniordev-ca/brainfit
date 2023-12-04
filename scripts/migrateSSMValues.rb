#!/usr/bin/env ruby
require 'json'

if ARGV.length != 3
  puts "Usage: migrateSSMValues.rb 'source AWS profile' 'destination AWS profile' 'SSM path prefix'"
  return
end

source_profile = ARGV[0]
destination_profile = ARGV[1]
path = ARGV[2]


previous_values = JSON.parse(%x(AWS_PROFILE=#{source_profile} aws ssm get-parameters-by-path --with-decryption --path '#{path}' --recursive --region ca-central-1))

values_array = previous_values["Parameters"]

values_array.each do |value_data|
  output = %x(AWS_PROFILE=#{destination_profile} aws ssm put-parameter --name "#{value_data["Name"]}" --value "#{value_data["Value"]}" --type "#{value_data["Type"]}"  --region ca-central-1)
end