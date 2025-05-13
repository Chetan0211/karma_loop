module IconViewHelper
  def like_icon(options={})
    classes = options.fetch(:class,"")
    tag.i(class: "fa-solid fa-arrow-up #{classes.strip}",**options.except(:class))
  end

  def dislike_icon(options={})
    classes = options.fetch(:class,"")
    tag.i(class: "fa-solid fa-arrow-down #{classes.strip}",**options.except(:class))
  end

  def comment_icon(options={})
    classes = options.fetch(:class,"")
    tag.i(class: "fa-regular fa-comment #{classes.strip}",**options.except(:class))
  end

  def share_icon(options={})
    classes = options.fetch(:class,"")
    tag.i(class: "fa-solid fa-share #{classes.strip}",**options.except(:class))
  end

  def save_icon(options={})
    classes = options.fetch(:class,"")
    tag.i(class: "fa-regular fa-bookmark #{classes.strip}",**options.except(:class))
  end

  def ellipsis_icon(options={})
    classes = options.fetch(:class,"")
    tag.i(class: "fa-solid fa-ellipsis #{classes.strip}",**options.except(:class))
  end

  def search_icon(options={})
    classes = options.fetch(:class,"")
    tag.i(class: "fa-solid fa-magnifying-glass #{classes.strip}",**options.except(:class))
  end

  def plus_icon(options={})
    classes = options.fetch(:class,"")
    tag.i(class: "fa-solid fa-plus #{classes.strip}",**options.except(:class))
  end

  def bell_icon(options={})
    classes = options.fetch(:class,"")
    tag.i(class: "fa-solid fa-bell #{classes.strip}",**options.except(:class))
  end

  def hamburger_icon(options={})
    classes = options.fetch(:class,"")
    tag.i(class: "fa-solid fa-bars #{classes.strip}",**options.except(:class))
  end

  def close_icon(options={})
    classes = options.fetch(:class,"")
    tag.i(class: "fa-solid fa-xmark #{classes.strip}",**options.except(:class))
  end

  def user_icon(options={})
    classes = options.fetch(:class,"")
    tag.i(class: "fa-solid fa-user #{classes.strip}",**options.except(:class))
  end

  def regular_user_icon(options={})
    classes = options.fetch(:class,"")
    tag.i(class: "fa-regular fa-user #{classes.strip}",**options.except(:class))
  end

  def circle_exclamation_icon(options={})
    classes = options.fetch(:class,"")
    tag.i(class: "fa-solid fa-circle-exclamation #{classes.strip}",**options.except(:class))
  end

  def triangle_exclamation_icon(options={})
    classes = options.fetch(:class,"")
    tag.i(class: "fa-solid fa-triangle-exclamation #{classes.strip}",**options.except(:class))
  end

  def cricle_check_icon(options={})
    classes = options.fetch(:class,"")
    tag.i(class: "fa-solid fa-circle-check #{classes.strip}",**options.except(:class))
  end

  def pen_to_square_icon(options={})
    classes = options.fetch(:class,"")
    tag.i(class: "fa-solid fa-pen-to-square #{classes.strip}",**options.except(:class))
  end

  def cake_candles_icon(options={})
    classes = options.fetch(:class,"")
    tag.i(class: "fa-solid fa-cake-candles #{classes.strip}",**options.except(:class))
  end

  def gear_icon(options={})
    classes = options.fetch(:class,"")
    tag.i(class: "fa-solid fa-gear #{classes.strip}",**options.except(:class))
  end

  def sliders_icon(options={})
    classes = options.fetch(:class,"")
    tag.i(class: "fa-solid fa-sliders #{classes.strip}",**options.except(:class))
  end

  def arrow_right_from_bracket_icon(options={})
    classes = options.fetch(:class,"")
    tag.i(class: "fa-solid fa-arrow-right-from-bracket #{classes.strip}",**options.except(:class))
  end

  def paper_plane_icon(options={})
    classes = options.fetch(:class,"")
    tag.i(class: "fa-solid fa-paper-plane #{classes.strip}",**options.except(:class))
  end

  def circle_info_icon(options={})
    classes = options.fetch(:class,"")
    tag.i(class: "fa-solid fa-circle-info #{classes.strip}",**options.except(:class))
  end

  def icon(icon:, options:{})
    result = nil
    begin
      if respond_to?(icon)
        result = public_send(icon, options)
      else
        raise "icon not found: #{icon}"
      end
      result
    rescue => error
      puts (error)
    end
  end
end