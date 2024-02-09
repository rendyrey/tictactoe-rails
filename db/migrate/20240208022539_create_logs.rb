class CreateLogs < ActiveRecord::Migration[7.1]
  def up
    execute <<-SQL
      CREATE TYPE symbol as ENUM('X', 'O')
    SQL

    create_table :logs do |t|
      t.references :game, foreign_key: true
      t.string :player_name
      t.enum :symbol, enum_type: 'symbol'
      t.integer :position
      t.timestamps
    end
  end

  def down
    drop_table :logs

    execute <<-SQL
      DROP TYPE symbol
    SQL
  end
end
