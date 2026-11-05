// Emojis for the chat picker, grouped by category. Each line is the emoji followed by search keywords.
const CATEGORIES = [
  {
    name: "Smileys", icon: "😀", emojis: `
😀 grinning smile happy
😃 smiley happy joy
😄 smile happy laugh
😁 grin beaming
😆 laughing satisfied
😅 sweat smile relief
🤣 rofl rolling laughing
😂 joy tears laughing lol
🙂 slightly smiling
🙃 upside down silly
😉 wink
😊 blush smiling
😇 innocent halo angel
🥰 love hearts adore
😍 heart eyes love crush
🤩 star struck excited
😘 kiss blowing
😗 kissing
😚 kissing closed eyes
😋 yum delicious tongue
😛 tongue
😜 winking tongue crazy
🤪 zany crazy goofy
😝 squinting tongue
🤑 money mouth rich
🤗 hug hugging
🤭 hand over mouth oops giggle
🤫 shush quiet secret
🤔 thinking hmm
🤐 zipper mouth
🤨 raised eyebrow suspicious
😐 neutral
😑 expressionless
😶 no mouth speechless
😏 smirk
😒 unamused meh
🙄 eye roll
😬 grimace awkward
😮‍💨 exhale sigh relief
🤥 lying pinocchio
😌 relieved calm
😔 pensive sad
😪 sleepy
🤤 drooling
😴 sleeping zzz
😷 mask sick
🤒 thermometer sick fever
🤕 bandage hurt
🤢 nauseated sick
🤮 vomit
🥵 hot heat sweating
🥶 cold freezing
🥴 woozy dizzy drunk
😵 dizzy
🤯 mind blown exploding
🤠 cowboy
🥳 party celebrate birthday
🥸 disguise
😎 cool sunglasses
🤓 nerd geek
🧐 monocle curious
😕 confused
😟 worried
🙁 frown
☹️ frowning sad
😮 open mouth wow surprised
😯 hushed
😲 astonished shocked
😳 flushed embarrassed
🥺 pleading puppy eyes please
🥹 holding back tears
😦 frowning open mouth
😧 anguished
😨 fearful scared
😰 anxious sweat
😥 sad relieved
😢 cry tear sad
😭 sob crying loudly
😱 scream fear
😖 confounded
😣 persevere
😞 disappointed
😓 downcast sweat
😩 weary tired
😫 tired
🥱 yawn bored
😤 triumph huff
😡 pouting angry rage
😠 angry mad
🤬 cursing swearing
😈 smiling devil
👿 angry devil
💀 skull dead
💩 poop
🤡 clown
👻 ghost
👽 alien
🤖 robot
😺 smiley cat
😹 cat joy tears
😻 heart eyes cat
🙈 see no evil monkey
🙉 hear no evil monkey
🙊 speak no evil monkey` },
  {
    name: "Gestures", icon: "👋", emojis: `
👋 wave hello hi bye
🤚 raised back of hand
✋ raised hand stop high five
🖖 vulcan salute
👌 ok perfect
🤌 pinched fingers
🤏 pinching small
✌️ victory peace
🤞 crossed fingers luck
🫰 hand with index finger and thumb crossed
🤟 love you gesture
🤘 rock on horns
🤙 call me shaka
👈 point left
👉 point right
👆 point up
👇 point down
☝️ index pointing up
👍 thumbs up like yes good
👎 thumbs down dislike no bad
✊ raised fist
👊 fist bump punch
🤛 left fist bump
🤜 right fist bump
👏 clap applause
🙌 raising hands celebrate hooray
🫶 heart hands love
👐 open hands
🤲 palms up
🤝 handshake deal
🙏 pray please thanks folded hands
✍️ writing
💅 nail polish
🤳 selfie
💪 muscle strong flex
🧠 brain smart
👀 eyes looking
👁️ eye
👄 mouth lips
🫦 biting lip
👶 baby
🧒 child
👦 boy
👧 girl
🧑 person
👨 man
👩 woman
🧓 older person
👴 old man
👵 old woman
🙋 raising hand
🙅 no gesture
🙆 ok gesture
🤷 shrug idk
🤦 facepalm
🙇 bow
💁 tipping hand
🧏 deaf person
🏃 running
🚶 walking
💃 dancing woman
🕺 dancing man
👯 party people` },
  {
    name: "Hearts", icon: "❤️", emojis: `
❤️ red heart love
🧡 orange heart
💛 yellow heart
💚 green heart
💙 blue heart
💜 purple heart
🖤 black heart
🤍 white heart
🤎 brown heart
💔 broken heart
❤️‍🔥 heart on fire
❤️‍🩹 mending heart
❣️ heart exclamation
💕 two hearts
💞 revolving hearts
💓 beating heart
💗 growing heart
💖 sparkling heart
💘 heart arrow cupid
💝 heart ribbon gift
💟 heart decoration
💋 kiss mark
💌 love letter
💯 hundred perfect
💢 anger
💥 boom collision
💫 dizzy star
💦 sweat droplets
💨 dash
🔥 fire lit hot
✨ sparkles
⭐ star
🌟 glowing star
⚡ lightning zap
🎉 party popper tada celebrate
🎊 confetti
🎈 balloon
🎁 gift present
🏆 trophy win
🥇 gold medal first
✅ check done yes
❌ cross no wrong
❗ exclamation
❓ question
⚠️ warning
🚫 prohibited
💤 zzz sleep
🆗 ok button
🆒 cool button
🆕 new` },
  {
    name: "Animals", icon: "🐶", emojis: `
🐶 dog puppy
🐱 cat kitten
🐭 mouse
🐹 hamster
🐰 rabbit bunny
🦊 fox
🐻 bear
🐼 panda
🐨 koala
🐯 tiger
🦁 lion
🐮 cow
🐷 pig
🐸 frog
🐵 monkey
🐔 chicken
🐧 penguin
🐦 bird
🐤 chick
🦆 duck
🦅 eagle
🦉 owl
🦇 bat
🐺 wolf
🐴 horse
🦄 unicorn
🐝 bee
🐛 bug
🦋 butterfly
🐌 snail
🐞 ladybug
🐢 turtle
🐍 snake
🦖 t rex dinosaur
🐙 octopus
🦑 squid
🦀 crab
🐠 tropical fish
🐬 dolphin
🐳 whale
🦈 shark
🐊 crocodile
🐘 elephant
🦒 giraffe
🐕 dog
🐈 cat
🌵 cactus
🌲 tree
🌴 palm tree
🍀 four leaf clover luck
🍁 maple leaf
🌸 cherry blossom flower
🌹 rose flower
🌻 sunflower
🌷 tulip
💐 bouquet flowers
🌞 sun face
🌝 full moon face
🌙 crescent moon night
⭐ star
☀️ sun sunny
⛅ partly cloudy
🌧️ rain
⛈️ storm thunder
❄️ snowflake cold
☃️ snowman
🌈 rainbow
🌊 wave ocean` },
  {
    name: "Food", icon: "🍕", emojis: `
🍏 green apple
🍎 red apple
🍐 pear
🍊 orange tangerine
🍋 lemon
🍌 banana
🍉 watermelon
🍇 grapes
🍓 strawberry
🍒 cherries
🍑 peach
🥭 mango
🍍 pineapple
🥥 coconut
🥝 kiwi
🍅 tomato
🥑 avocado
🌶️ hot pepper chili spicy
🌽 corn
🥕 carrot
🥔 potato
🍞 bread
🥐 croissant
🧀 cheese
🥚 egg
🍳 cooking fried egg
🥞 pancakes
🥓 bacon
🍗 chicken leg
🍖 meat
🌭 hot dog
🍔 burger hamburger
🍟 fries
🍕 pizza
🥪 sandwich
🌮 taco
🌯 burrito
🥗 salad
🍝 spaghetti pasta
🍜 noodles ramen
🍛 curry rice
🍣 sushi
🍱 bento
🥟 dumpling
🍤 fried shrimp
🍚 rice
🍦 ice cream
🍩 donut
🍪 cookie
🎂 birthday cake
🍰 cake slice
🧁 cupcake
🍫 chocolate
🍬 candy
🍭 lollipop
🍿 popcorn
☕ coffee tea hot
🍵 tea
🧋 bubble tea boba
🥤 soft drink
🍺 beer
🍻 cheers beers
🥂 champagne toast cheers
🍷 wine
🍸 cocktail
🍹 tropical drink` },
  {
    name: "Activities", icon: "⚽", emojis: `
⚽ soccer football
🏀 basketball
🏈 american football
⚾ baseball
🎾 tennis
🏐 volleyball
🏉 rugby
🎱 pool 8 ball
🏓 ping pong table tennis
🏸 badminton
🏏 cricket
🥅 goal net
⛳ golf
🏹 bow arrow
🎣 fishing
🥊 boxing
🥋 martial arts
⛸️ ice skate
🎿 ski
🏂 snowboard
🏋️ weight lifting gym
🚴 cycling bike
🏊 swimming
🧘 yoga meditation
🏄 surfing
🏅 medal
🎮 video game controller gaming
🕹️ joystick
🎲 dice game
🧩 puzzle
♟️ chess
🎯 bullseye target
🎳 bowling
🎤 microphone sing karaoke
🎧 headphones music
🎸 guitar
🎹 piano keyboard
🥁 drum
🎺 trumpet
🎻 violin
🎬 movie clapper
🎨 art palette paint
📸 camera photo
🎭 theater
🎪 circus tent
🎟️ ticket` },
  {
    name: "Travel", icon: "✈️", emojis: `
🚗 car
🚕 taxi
🚌 bus
🏎️ race car
🚓 police car
🚑 ambulance
🚒 fire engine
🚚 truck
🚲 bicycle
🛵 scooter
🏍️ motorcycle
🚂 train
🚇 metro subway
✈️ airplane flight travel
🚀 rocket launch
🛸 ufo
🚁 helicopter
⛵ sailboat
🚢 ship
⚓ anchor
🗺️ map
🧭 compass
🏔️ mountain snow
🏕️ camping
🏖️ beach
🏝️ island
🏠 house home
🏢 office building
🏥 hospital
🏫 school
🗽 statue of liberty
🗼 tower
🏰 castle
🎡 ferris wheel
🎢 roller coaster
🌃 night city
🌅 sunrise
🌇 sunset city
🌍 earth globe world
🧳 luggage` },
  {
    name: "Objects", icon: "💡", emojis: `
⌚ watch
📱 phone mobile
💻 laptop computer
⌨️ keyboard
🖥️ desktop computer
🖨️ printer
💾 floppy save
📷 camera
🎥 movie camera
📺 tv television
📞 telephone call
⏰ alarm clock
⏳ hourglass time
🔋 battery
🔌 plug
💡 light bulb idea
🔦 flashlight
🕯️ candle
💸 money flying
💵 dollar cash
💰 money bag
💳 credit card
💎 gem diamond
🔧 wrench tool
🔨 hammer
⚙️ gear settings
🔒 lock
🔑 key
🚪 door
🛏️ bed
🛁 bathtub
🧸 teddy bear
🎀 ribbon
✉️ envelope mail
📦 package box
📝 memo note
📅 calendar
📌 pin
📎 paperclip
✂️ scissors
📚 books
📖 book reading
✏️ pencil
🖊️ pen
🔍 search magnifying glass
🔔 bell notification
📣 megaphone announce
💊 pill medicine
🩺 stethoscope
🧪 test tube science` }
];

let parsed = null;

// [{ name, icon, emojis: [{ char, keywords }] }]
export function emojiCategories() {
  if (!parsed) {
    parsed = CATEGORIES.map(category => ({
      name: category.name,
      icon: category.icon,
      emojis: category.emojis.trim().split("\n").map(line => {
        const [char, ...keywords] = line.trim().split(" ");
        return { char: char, keywords: keywords.join(" ") };
      })
    }));
  }
  return parsed;
}

export function searchEmojis(query) {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (words.length == 0) return [];

  const seen = new Set();
  const results = [];
  for (const category of emojiCategories()) {
    for (const emoji of category.emojis) {
      if (seen.has(emoji.char)) continue;
      if (words.every(word => emoji.keywords.includes(word))) {
        seen.add(emoji.char);
        results.push(emoji);
      }
    }
  }
  return results;
}

const RECENT_EMOJIS_KEY = "chat_recent_emojis";
const RECENT_EMOJIS_LIMIT = 24;

// Recently used emojis are only a convenience, so they live in this browser
export function recentEmojis() {
  try {
    const recent = JSON.parse(localStorage.getItem(RECENT_EMOJIS_KEY) || "[]");
    return Array.isArray(recent) ? recent.filter(emoji => typeof emoji?.char == "string") : [];
  } catch (error) {
    return [];
  }
}

export function rememberEmoji(emoji) {
  const recent = [emoji, ...recentEmojis().filter(item => item.char != emoji.char)].slice(0, RECENT_EMOJIS_LIMIT);
  try {
    localStorage.setItem(RECENT_EMOJIS_KEY, JSON.stringify(recent));
  } catch (error) {}
}

// emojiCategories() with a "Recent" category first when there is one
export function emojiCategoriesWithRecent() {
  const recent = recentEmojis();
  const categories = emojiCategories();
  return recent.length > 0 ? [{ name: "Recent", icon: "🕘", emojis: recent }, ...categories] : categories;
}
