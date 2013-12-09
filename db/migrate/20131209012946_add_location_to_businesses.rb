class AddLocationToBusinesses < ActiveRecord::Migration
  def change
    add_reference :businesses, :location, index: true
  end
end
