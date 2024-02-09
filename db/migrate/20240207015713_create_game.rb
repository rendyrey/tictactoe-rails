class CreateGame < ActiveRecord::Migration[7.1]
  def up
    execute <<-SQL
      CREATE TYPE game_status as ENUM('active', 'end')
    SQL

    create_table :games do |t|
      t.string :first_player_name
      t.string :second_player_name
      t.string :winner, null: true
      t.enum :status, enum_type: 'game_status', default: 'active'
      t.timestamps
    end
  end

  def down
    drop_table :games

    execute <<-SQL
      DROP TYPE game_status
    SQL
  end
end
