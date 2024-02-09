class GameController < ApplicationController
  def index
    if session[:game_id].present?
      @active_game = Game.find_by(id: session[:game_id], status: 'active')
      @game_logs = GameLog.where(game_id: @active_game&.id)
      @active_turn = @game_logs&.last&.symbol == 'X' ? 'O' : 'X'
    end

    @top_ten_games = Game.last(10)
  end
end
