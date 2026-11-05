# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

[
  "Technology", "Gaming", "Science", "Lifestyle", "Health & Fitness", "Food", "Travel",
  "Fashion", "Finance", "Business", "Entertainment", "Movies & TV", "Music", "Sports",
  "Art & Design", "Photography", "Education", "News", "Humor", "Others"
].each do |category_name|
  ContentCategory.find_or_create_by!(category: category_name)
end