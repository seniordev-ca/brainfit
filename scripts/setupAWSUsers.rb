#!/usr/bin/env ruby
require 'json'

if ARGV.length < 1 || ARGV.length > 2
  puts "Usage: AWS_PROFILE=[your credential profile] setupAWSUsers.rb [dev|stage|prod] 'comma-separated list of user names'"
  return
end

stage = ARGV[0]

if ARGV[1]
  names = ARGV[1].split(",")
else
  names = []
end

if stage != 'dev'
  # Only deployment user for non-dev environments
  names = []
end

names << stage + '-deployment'

group_data = JSON.parse(%x(aws iam create-group --group-name #{stage}-deployment-group))

permission_output = %x(aws iam attach-group-policy --group-name '#{stage}-deployment-group' --policy-arn arn:aws:iam::aws:policy/AdministratorAccess)


names.each do |username|
  user_payload = JSON.parse(%x(aws iam create-user --user-name '#{username}'))
  user_key_data = JSON.parse(%x(aws iam create-access-key --user-name '#{username}'))

  group_output = %x(aws iam add-user-to-group --user-name '#{username}' --group-name '#{stage}-deployment-group')
  
  access_id = user_key_data["AccessKey"]["AccessKeyId"]
  secret_key = user_key_data["AccessKey"]["SecretAccessKey"]

  output_data = "#{username} Credentials\n\nAccess ID: #{access_id}\n\nSecret: #{secret_key}"

  File.write("#{username.gsub(" ", '_')}_credentials.txt", output_data, mode: 'w')
end
