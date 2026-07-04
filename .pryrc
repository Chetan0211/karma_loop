# Pry configuration for enhanced Rails console

# Load awesome_print
begin
  require 'awesome_print'
  AwesomePrint.pry!
rescue LoadError
  puts "awesome_print not available"
end

# Custom commands
Pry::Commands.create_command "sql", "Show the SQL for the last ActiveRecord call" do
  def process
    puts ActiveRecord::Base.connection.last_query
  end
end

Pry::Commands.create_command "routes", "Show Rails routes" do
  def process
    Rails.application.routes.routes.each do |route|
      puts "#{route.verb.ljust(10)} #{route.path.spec}"
    end
  end
end

# Aliases for common Rails console tasks
Pry::Commands.create_command "models", "List all models" do
  def process
    Rails.application.eager_load!
    models = ActiveRecord::Base.descendants.map(&:name).sort
    ap models
  end
end

# Custom prompt with timestamp
Pry.config.prompt = Pry::Prompt.new(
  "custom",
  "Custom prompt with timestamp",
  [
    proc { |obj, nest_level, _| "#{Time.now.strftime('%H:%M:%S')} [#{nest_level}] #{obj}> " },
    proc { |obj, nest_level, _| "#{Time.now.strftime('%H:%M:%S')} [#{nest_level}] #{obj}* " }
  ]
)

# History settings
Pry.config.history_save = true
Pry.config.history_load = true

# Editor settings (use your preferred editor)
Pry.config.editor = 'code' # or 'vim', 'nano', etc.

puts "🎨 Pry configuration loaded!"