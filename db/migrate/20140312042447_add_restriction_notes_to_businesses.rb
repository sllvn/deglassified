class AddRestrictionNotesToBusinesses < ActiveRecord::Migration
  def change
    add_column :businesses, :restriction_type, :string, default: 'full'
    add_column :businesses, :notes, :text
  end
end
