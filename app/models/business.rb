class Business < ActiveRecord::Base
  # TODO: add acts-as-taggable-on for front-end business filtering (coffee shop, restaurant, bar, etc.)
  belongs_to :location

  validates_presence_of :name, :lat, :lng

  extend FriendlyId
  friendly_id :name, use: :slugged

  acts_as_mappable default_units: :kms

  def url_slug
    name.downcase.gsub(/\s/, '-')
  end
end
