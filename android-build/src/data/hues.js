/* -------------------------------------------------------------------------- */
/* 1. DATA & CONFIG                                                          */
/* -------------------------------------------------------------------------- */

export const COLOR_DOMAINS = [
  { 
    id: 'purple', 
    name: 'Politics', 
    colors: ['#c084fc', '#a855f7'], 
    accent: '#7e22ce', 
    textColor: 'text-white',
    description: "Politics shapes safety, resources, and daily stress, even when we are not thinking about it. Checking in here can help you notice how the larger world is landing in your body and mood.",
    questions: [ 
      "What headlines are lingering in me today?", "Do I feel hopeful or drained?", "Where do I feel anger or worry?", "Do I feel like I have any power?", "What would help me feel a bit safer?", "Whose voice am I hearing most loudly right now?", "Is there a boundary I need to set with the news?", "How is the state of the world affecting my breathing?", "What is one small action that aligns with my values?", "Do I feel connected to a community or isolated?"
    ],
    responses: {
      1: "Politics feels mostly in the background, which can give your system a bit of breathing room today.",
      2: "Politics is lightly present, you notice it without it taking over your day.",
      3: "The Political is noticeable and may be quietly shaping your mood or focus.",
      4: "Politics feels very present and could be taking real space in your thoughts and energy.",
      5: "Politics is strongly alive for you right now, it might help to notice which issue or story stands out most."
    }
  },
  { 
    id: 'blue', 
    name: 'Body', 
    colors: ['#3b82f6', '#2563eb'], 
    accent: '#1d4ed8',
    textColor: 'text-white',
    description: "Your body often knows how you are before your mind catches up. Tuning in can show early signs of stress, burnout, or need for rest.",
    questions: [ 
      "What sensations do I notice first?", "Am I tired, wired, or steady?", "How is my breathing right now?", "Do I need food, water, or rest?", "Where does my body feel most at ease?", "Is there tension in my jaw or shoulders?", "What is my energy level on a scale of 1-10?", "How does the ground feel beneath my feet?", "If my body could speak one word, what would it be?", "What kind of movement does my body crave?"
    ],
    responses: {
      1: "Your body feels mostly in the background, this can be neutral or a sign that you are a bit disconnected.",
      2: "Your body is lightly on your radar, you may sense mild comfort or mild discomfort.",
      3: "Your body is speaking up a bit, certain sensations or needs are easier to notice.",
      4: "Your body is asking clearly for attention, rest, movement, or care.",
      5: "Body sensations are very intense today, it may help to move gently, breathe slowly, or tend to one specific need."
    }
  },
  { 
    id: 'green', 
    name: 'Growth', 
    colors: ['#4ade80', '#22c55e'], 
    accent: '#15803d',
    textColor: 'text-stone-900',
    description: "Growth is not just big achievements, it is also tiny shifts in how you respond to life. Checking in here supports a sense of direction and purpose.",
    questions: [ 
      "Where have I stretched lately?", "What am I learning about myself?", "Do I feel stuck or moving forward?", "What small risk am I ready for?", "What am I proud of this week?", "Is there a habit I am trying to build?", "What feels hard right now because it is new?", "Who is inspiring me to grow?", "Am I being patient with my own process?", "What is one seed I am planting today?"
    ],
    responses: {
      1: "Growth is not a big focus right now, which can be a needed pause or plateau.",
      2: "You sense small shifts, even if they are subtle or quiet.",
      3: "Growth is on your mind, you can see ways you are changing or want to change.",
      4: "You feel actively in a stretch zone, learning or challenging yourself in real ways.",
      5: "Growth feels very alive, which can be exciting or tiring, you are in a real season of change."
    }
  },
  { 
    id: 'jasmine', 
    name: 'Joy', 
    colors: ['#fde047', '#facc15'], 
    accent: '#a16207', 
    textColor: 'text-stone-900',
    description: "Jasmine (Joy) refuels resilience. Noticing even small sparks of joy can balance a focus on problems and remind you that pleasure and play are allowed.",
    questions: [ 
      "What felt good today, even briefly?", "When did I last laugh or smile?", "Do I feel light or heavy right now?", "What tiny joy is available today?", "Who or what brings me delight?", "Is there a song that lifts my spirits?", "Can I pause to appreciate something beautiful?", "What does 'play' look like for me today?", "Who makes me feel lighter?", "Am I allowing myself to feel good?"
    ],
    responses: {
      1: "Joy feels hard to find or quite dim today, that is a very human state.",
      2: "There are small threads of joy, even if they are easy to miss.",
      3: "You can name a few clear moments or sources of joy around you.",
      4: "Joy is a solid presence today, it is helping carry you a bit.",
      5: "Joy feels bright and vivid, this is a good moment to really savor what feels good."
    }
  },
  { 
    id: 'red', 
    name: 'Relationships', 
    colors: ['#f87171', '#ef4444'], 
    accent: '#b91c1c',
    textColor: 'text-stone-900',
    description: "Relationships deeply affect nervous systems, self worth, and daily stress. Checking in helps you notice where you feel nourished and where you feel drained.",
    questions: [ 
      "Who feels close to me today?", "Where do I feel misunderstood or unseen?", "Do I feel more connected or isolated?", "What boundary might I need right now?", "Who do I feel safe being myself with?", "Is there a conversation I am avoiding?", "Who have I been thinking about?", "Do I have the energy to socialize?", "What do I need from my friends right now?", "Am I feeling resentful or appreciative?"
    ],
    responses: {
      1: "Relationships feel quiet or distant right now, either by choice or circumstance.",
      2: "Connection is present in a gentle way, not demanding much from you.",
      3: "Relationships are on your mind, you are aware of certain people or dynamics today.",
      4: "Relationships are strongly affecting your emotions, for comfort, tension, or both.",
      5: "Your relational world feels very intense or tender, it may help to name one bond or conflict that is most alive."
    }
  },
  { 
    id: 'orange', 
    name: 'Occupation', 
    colors: ['#fb923c', '#f97316'], 
    accent: '#c2410c',
    textColor: 'text-stone-900',
    description: "Your main daily role shapes structure, identity, and stress. Noticing how you feel about it can guide healthier choices and limits.",
    questions: [ 
      "How do I feel about my work today?", "Am I energized, bored, or overwhelmed?", "Does my work feel meaningful right now?", "What part of my role drains me most?", "What support would help this feel lighter?", "Is my workload sustainable?", "Do I feel appreciated for what I do?", "Am I able to switch off when I stop working?", "What is one win I had recently?", "Is my identity tied too tightly to my productivity?"
    ],
    responses: {
      1: "Work or your main role is not very central today, this might be a day of distance or rest.",
      2: "Work is lightly present, you are aware of it without feeling strongly pulled.",
      3: "Your tasks and responsibilities are clearly on your mind.",
      4: "Work or your main role is a major source of focus, stress, or engagement right now.",
      5: "Occupation feels all consuming, it may help to notice one boundary or support that would ease the load."
    }
  },
  { 
    id: 'white', 
    name: 'Wonder', 
    colors: ['#f3f4f6', '#d1d5db'], 
    accent: '#374151', 
    textColor: 'text-stone-900',
    description: "Wonder and spirituality can offer meaning, comfort, and perspective beyond daily tasks. Checking in can reconnect you with what feels sacred or bigger than you.",
    questions: [ 
      "What gives my life a sense of meaning?", "Do I feel connected to anything bigger?", "When did I last feel awe or amazement?", "What practices help me feel grounded?", "Where do I feel most spiritually at home?", "Is there a mystery I am pondering?", "Do I feel a sense of gratitude today?", "How does nature look to me right now?", "What feels sacred in my daily life?", "Am I listening to my intuition?"
    ],
    responses: {
      1: "A sense of meaning or wonder feels muted today, and that is okay.",
      2: "There is a quiet sense of something bigger, even if it is not very clear.",
      3: "Wonder is noticeable, you feel some curiosity or connection beyond daily tasks.",
      4: "You feel strongly connected to something larger, through nature, ritual, art, or belief.",
      5: "Wonder and spirituality feel very alive, this may be a moment of deep meaning or insight."
    }
  },
  { 
    id: 'black', 
    name: 'Brainstorm', 
    colors: ['#334155', '#0f172a'], 
    accent: '#0f172a',
    textColor: 'text-white', 
    description: "Creativity is not only art, it is how you solve problems and imagine new possibilities. Checking in here supports play, innovation, and self expression.",
    questions: [ 
      "Do I feel curious or shut down today?", "What ideas have been tugging at me?", "Where do I feel a creative itch?", "What small thing could I make or try?", "What helps my ideas flow more freely?", "Am I judging my ideas before they form?", "What problem am I trying to solve?", "Is there a project I am excited about?", "How can I add a touch of beauty to my day?", "Do I have space to dream?"
    ],
    responses: {
      1: "Creative energy feels low or quiet, ideas may be resting for now.",
      2: "There are small sparks of ideas, even if they have not fully formed.",
      3: "Creativity is noticeable, you feel some pull to tinker, imagine, or make.",
      4: "Creative energy is strong, ideas and possibilities are actively showing up.",
      5: "Creativity feels vivid and alive, this could be a powerful time to capture or play with your ideas."
    }
  },
  { 
    id: 'teal', 
    name: 'Togetherness', 
    colors: ['#2dd4bf', '#14b8a6'], 
    accent: '#0f766e',
    textColor: 'text-white',
    description: "Spaces and communities shape nervous system safety. Noticing how your surroundings feel can reveal needs for change, comfort, or protection.",
    questions: [ 
      "Do I feel like I belong where I am?", "Does my physical space feel safe today?", "What in my environment soothes me?", "What in my environment stresses me?", "What small change would help me settle?", "Do I feel welcome in my community?", "Is my home a sanctuary right now?", "Who considers me 'one of them'?", "Do I feel like an outsider today?", "Where do I go to feel accepted?"
    ],
    responses: {
      1: "Togetherness is not very present in your awareness, or you may feel somewhat apart from things today.",
      2: "You feel mildly okay in your spaces and circles, even if not fully at home.",
      3: "Togetherness is noticeable, you are aware of where you fit and where you do not.",
      4: "Your sense of belonging or not belonging is strongly affecting how settled you feel.",
      5: "Togetherness feels very intense, you may feel deeply held or deeply out of place, both deserve care and attention."
    }
  },
  { 
    id: 'pink', 
    name: 'Passion', 
    colors: ['#f9a8d4', '#f472b6'], 
    accent: '#be185d',
    textColor: 'text-stone-900',
    description: "Passion includes romantic love, erotic energy, and deep aliveness. Checking in can show where you feel awake, connected, or shut down.",
    questions: [ 
      "Where do I feel most alive right now?", "Do I feel desired, cherished, or ignored?", "Am I connected to my own desire today?", "What kind of closeness do I crave?", "What would help me feel more loved?", "Is there a fire in my belly about something?", "Do I feel attractive today?", "What am I deeply enthusiastic about?", "Is there romance in my life?", "How am I expressing my love?"
    ],
    responses: {
      1: "Passion and romantic energy feel low or in the background, which can be a season of rest.",
      2: "There is a gentle sense of affection or desire, even if it is not very active.",
      3: "Love and passion are noticeable, you are aware of who or what lights you up.",
      4: "Passion is strong, and it may be pulling you toward connection, intimacy, or creative expression.",
      5: "Passion feels vivid and powerful, this is a lot of energy and can be both beautiful and vulnerable."
    }
  },
  { 
    id: 'brown', 
    name: 'Base', 
    colors: ['#a16207', '#78350f'], 
    accent: '#78350f', 
    textColor: 'text-white',
    description: "Stability is your sense of foundation, such as housing, money, routines, and inner steadiness. Checking in here can show what is needed for you to feel secure enough to grow.",
    questions: [ 
      "Do I feel basically safe today?", "How secure do home and money feel?", "Is my routine supporting or draining me?", "What feels most solid in my life now?", "What is one small way to add stability?", "Am I worried about the future?", "Do I have enough resources for today?", "Is my foundation shaky or firm?", "What anchors me when things get chaotic?", "How are my basic needs (food, sleep) being met?"
    ],
    responses: {
      1: "Your base feels shaky, like the ground is a bit uneven under your feet.",
      2: "There is some footing under you, even if it still feels a little thin or uncertain.",
      3: "You can feel a few solid roots, certain people, places, or routines help you stay grounded.",
      4: "Your base feels steady, like you have enough shelter, support, and rhythm to hold you.",
      5: "Stability feels rich and rooted, your foundations are holding well and giving you room to grow."
    }
  },
  { 
    id: 'gray', 
    name: 'Grief', 
    colors: ['#9ca3af', '#6b7280'], 
    accent: '#1f2937',
    textColor: 'text-stone-900',
    description: "Grief is not only about death, it is any response to loss or big change. Naming grief makes room for healing, rather than pushing it underground.",
    questions: [ 
      "What losses are close to the surface today?", "Where in my body do I feel my grief?", "Do I feel more numb or more tender?", "What do I wish I could say or do?", "What would feel comforting to my grieving self?", "Is there an old sadness visiting me?", "Am I allowing myself to cry if I need to?", "What memories are coming up today?", "Is my grief loud or quiet right now?", "How can I be gentle with my heart?"
    ],
    responses: {
      1: "Grief feels a bit further away today, which can offer a gentle rest, even if the loss still matters.",
      2: "Grief is present in a soft way, a quiet ache rather than a sharp wave.",
      3: "Grief is noticeable, close enough to touch your day even if you are functioning.",
      4: "Grief feels strong and may be shaping your thoughts, energy, or body in clear ways.",
      5: "Grief is vivid and intense right now, this is a lot to carry and you deserve tenderness and support with it."
    }
  }
];