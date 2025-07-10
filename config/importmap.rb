# Pin npm packages by running ./bin/importmap

pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin_all_from "app/javascript/controllers", under: "controllers"
pin "cropperjs" # @1.6.2
pin "trix"
pin "@rails/actiontext", to: "actiontext.esm.js"
pin "alpinejs" # @3.14.9
pin "alpine-turbo-drive-adapter" # @2.2.0
pin "@rails/activestorage", to: "@rails--activestorage.js" # @8.0.200
pin "shaka-player", to: "shaka-player.ui.js"
pin "@rails/actioncable", to: "actioncable.esm.js"
pin_all_from "app/javascript/channels", under: "channels"
pin "date-fns", to: "https://ga.jspm.io/npm:date-fns@4.1.0/index.js"
pin "date-fns/", to: "https://ga.jspm.io/npm:date-fns@4.1.0/"