module ChatHelper
  def format_date_separator(date)
    if date == Date.current
      "Today"
    elsif date == Date.yesterday
      "Yesterday"
    else
      date.strftime("%B %d, %Y")
    end
  end
end
