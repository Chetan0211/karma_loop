module PostHelper
  def self.calculate_created_date(date)
    time_diff = (Time.now.utc - date)
    if(time_diff <= 1.minute.to_f)
      return "#{Time.at(time_diff).utc.sec} #{time_diff <= 1.second.to_f ? "second" : "seconds"} ago"
    elsif(time_diff <= 1.hours.to_f)
      return "#{Time.at(time_diff).utc.min} #{time_diff <= 1.minute.to_f ? "minute" : "minutes"} ago"
    elsif(time_diff <= 24.hours.to_f)
      return "#{Time.at(time_diff).utc.hour} #{time_diff <= 1.hour.to_f ? "hour" : "hours"} ago"
    elsif(time_diff <= 7.days.to_f)
      return "#{Time.at(time_diff).utc.day} #{time_diff <= 1.day.to_f ? "day" : "days"} ago"
    elsif(time_diff <= 1.month.to_f)
      weeks = (Time.at(time_diff).utc.day/7).to_i
      return "#{weeks} #{weeks <= 1 ? "week" : "weeks"} ago"
    elsif(time_diff <= 1.year.to_f)
      return "#{Time.at(time_diff).utc.month} #{time_diff <= 1.month.to_f ? "month" : "months"} ago"
    else
      return "#{Time.at(time_diff).utc.year - 1970} #{time_diff <= 1.year.to_f ? "year" : "years"} ago"
    end
  end
end
