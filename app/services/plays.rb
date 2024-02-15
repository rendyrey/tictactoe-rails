class Plays
  def initialize(session)
    @session = session
  end

  WIN_COMBINATION = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
  ]

  FIRST_PLAYER = 'X'
  SECOND_PLAYER = 'O'
  BOXES_COUNT = 9

  def new_game(params)
    end_active_game
    new_game = Game.create({
      first_player_name: params[:player1],
      second_player_name: params[:player2],
      winner: '-'
    })

    @session[:game_id] = new_game.id
    @session[:first_player_name] = new_game.first_player_name
    @session[:second_player_name] = new_game.second_player_name

    return  { data: new_game, status_code: 201 }
  end

  def reset_game
    active_game = Game.find_by(id: @session[:game_id])
    active_game.update(status: 'end') if active_game.present?
    @session[:game_id] = nil

    return { data: active_game, status_code: 200 }
  end

  def move(params)
    # check illegal or invalid move
    return  { error: 'Illegal Move', statu_code: 403 } if invalid_move?(params)
    player_name = params[:symbol] == FIRST_PLAYER ? @session[:first_player_name] : @session[:second_player_name]

    new_log = GameLog.create({
      game_id: @session[:game_id],
      player_name: player_name,
      symbol: params[:symbol],
      position: params[:position]
    })

    status, combination = is_end_or_winning?

    if [:win, :draw].include?(status)
      Game.find(@session[:game_id]).update(status: 'end', winner: (status == :win ? player_name : "DRAW"))
      @session[:game_id] = nil
      return { status: status, log: new_log, combination: combination, status_code: 200 }
    end

    return { status: 'play', log: new_log, combination: nil, status_code: 201 }
  end

  private
    def is_end_or_winning?
      WIN_COMBINATION.each do |combination|
        logs = GameLog.where(game_id: @session[:game_id], position: combination)
        if logs.length == 3
          return [:win, combination] if logs.all? { |log| log.symbol == 'X' } || logs.all? { |log| log.symbol == 'O' }
        end
      end

      return [:draw, nil] if GameLog.where(game_id: @session[:game_id]).count == BOXES_COUNT
      return [:end, nil]
    end

    def invalid_move?(params)
      invalid = false
      # prevent move or mark to the used box
      box_used = GameLog.find_by(game_id: @session[:game_id], position: params[:position])
      invalid = true if box_used.present?

      # prevent double move or two times move
      last_move = GameLog.where(game_id: @session[:game_id]).last
      invalid = true if last_move&.symbol == params[:symbol]

      # render json: { error: 'Illegal Move' }, status: 403 if invalid
      invalid
    end

    def end_active_game
      if @session[:game_id].present?
        active_game = Game.find_by_id(@session[:game_id])
        active_game.update(status: 'end') if active_game.present?
      end
    end
end
