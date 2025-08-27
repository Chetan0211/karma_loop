# Console customization
Rails.application.console do
  # Use awesome_print for better object formatting
  require "awesome_print"
  AwesomePrint.defaults = {
    indent: 2,
    color: {
      hash:       :pale,
      class:      :white,
      bigdecimal: :blue,
      integer:    :blue,
      float:      :blue,
      string:     :yellowish,
      symbol:     :cyanish,
      nilclass:   :redish,
      method:     :purpleish
    }
  }
  
  # Set awesome_print as default formatter
  AwesomePrint.pry!
  
  # Custom prompt with app name and environment
  app_name = Rails.application.class.module_parent_name.underscore
  env_color = case Rails.env
              when 'development' then "\e[32m" # green
              when 'test' then "\e[33m"        # yellow
              when 'production' then "\e[31m"  # red
              else "\e[36m"                    # cyan
              end
  
  reset_color = "\e[0m"
  
  # Configure Pry prompt
  Pry.config.prompt_name = "#{env_color}#{app_name}[#{Rails.env}]#{reset_color}"
  
  # Welcome message
  puts "\n🚀 Welcome to #{app_name.titleize} Console (#{Rails.env})"
  puts "📊 Database: #{ActiveRecord::Base.connection.current_database}"
  puts "🎨 Enhanced with AwesomePrint and Pry"
  puts "💡 Try: ap User.first, User.count, or reload!\n\n"
end