class Location < ActiveRecord::Base
  has_many :businesses

  def url_slug
    city.downcase.gsub(/\s/, '-')
  end
end