class Business < ActiveRecord::Base
  # TODO: add acts-as-taggable-on for front-end business filtering (coffee shop, restaurant, bar, etc.)
  belongs_to :location

  def url_slug
    name.downcase.gsub(/\s/, '-')
  end
end
