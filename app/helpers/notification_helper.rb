module NotificationHelper
  def noticed_turbo_stream(partial:, locals:, target:, action:)
    content_html = ApplicationController.render(
      partial: partial,
      locals: locals,
      formats: [:html]
    )

    <<~HTML
      <turbo-stream action=#{action} target="#{target}">
        <template>
          #{content_html}
        </template>
      </turbo-stream>
    HTML
  end

  def noticed_multiple_turbo_stream(streams:)
    streams.map do |option|
      noticed_turbo_stream(
        partial: option[:partial],
        locals: option[:locals],
        target: option[:target],
        action: option[:action]
      )
    end.join("\n")
  end
end