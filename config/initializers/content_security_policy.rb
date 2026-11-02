# Be sure to restart your server when you modify this file.

# Define an application-wide content security policy.
# See the Securing Rails Applications Guide for more information:
# https://guides.rubyonrails.org/security.html#content-security-policy-header

Rails.application.configure do
  config.content_security_policy do |policy|
    policy.default_src     :self
    policy.base_uri        :self
    policy.form_action     :self
    policy.frame_ancestors :none
    policy.object_src      :none
    policy.font_src        :self, :https, :data
    policy.img_src         :self, :https, :data, :blob
    policy.media_src       :self, :https, :blob
    policy.worker_src      :self, :blob
    # Alpine.js evaluates its directives with Function(), so it needs unsafe-eval
    policy.script_src      :self, :unsafe_eval
    policy.style_src       :self, :unsafe_inline
    if Rails.env.development?
      policy.connect_src :self, :https, :wss, "ws://localhost:*", "ws://127.0.0.1:*"
    else
      policy.connect_src :self, :https, :wss
    end
  end

  # Generate session nonces for permitted importmap and inline scripts.
  config.content_security_policy_nonce_generator = ->(request) { request.session.id.to_s }
  config.content_security_policy_nonce_directives = %w(script-src)

  # Report violations without enforcing the policy.
  # config.content_security_policy_report_only = true
end
