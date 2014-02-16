class Location < ActiveRecord::Base
  extend FriendlyId
  friendly_id :city, use: :slugged

  has_many :businesses
end
