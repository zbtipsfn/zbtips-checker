const app = document.getElementById("app");
const homeButton = document.getElementById("homeButton");

const state = {
  path: [],
  currentFlow: null,
  currentStepIndex: 0,
  answers: {}
};

const appState = {
  entrySymptom: null,
  answers: {},
  currentResultKey: null
};

const entrySymptoms = [
  {
    id: "aim-assist-unreliable",
    label: "my aim assist feels gone",
    desc: "weak tracking, reticle slips, aim assist feels unreliable"
  },
  {
    id: "no-middle",
    label: "my sensitivity has no middle",
    desc: "one setting feels too slow, the next feels too fast"
  },
  {
    id: "range-breaks",
    label: "my aim breaks at certain ranges",
    desc: "close-range or long-range aiming falls apart"
  },
  {
    id: "ads-wrong",
    label: "ADS feels wrong",
    desc: "ADS feels heavy, too fast, too slow, or disconnected"
  },
  {
    id: "input-delay",
    label: "input delay makes the game feel unplayable",
    desc: "the game feels delayed, muddy, or behind your hands"
  },
  {
    id: "loose-shaky",
    label: "my aim feels loose or shaky",
    desc: "overcorrecting, twitchy aim, deadzone complaints"
  }
];

const glossary = {
  "Look Input Curve": {
    controls: "How your stick responds when you move it.",
    wrong: [
      "Your aim feels too raw or too delayed.",
      "You cannot make small adjustments cleanly.",
      "Your close and long-range feel do not match your playstyle."
    ],
    checkWhen: ["no middle", "close-range aim", "long-range aim", "ADS feels wrong", "loose or shaky aim"],
    confuse: "Do not confuse this with look speed, ADS speed, or deadzone."
  },
  "Look Speed": {
    controls: "Your base turning speed before ADS.",
    wrong: [
      "You swing past targets or cannot turn onto them fast enough.",
      "Close-range fights feel too fast or too slow.",
      "Normal look and ADS feel disconnected."
    ],
    checkWhen: ["no middle", "close-range aim", "ADS mismatch"],
    confuse: "Do not confuse this with ADS speed or boosts."
  },
  "ADS Speed": {
    controls: "How fast your aim moves while aiming down sights.",
    wrong: [
      "ADS feels too heavy or too fast.",
      "Hip fire feels fine but ADS feels cursed.",
      "Long-range tracking feels unstable."
    ],
    checkWhen: ["ADS feels wrong", "long-range aim", "no middle"],
    confuse: "Do not confuse this with scoped multiplier or normal look speed."
  },
  "Turning Boost": {
    controls: "Extra turn speed layered on top of your base sens.",
    wrong: [
      "Aim feels fake, jumpy, or inconsistent.",
      "Close tracking feels wild.",
      "Micro-aim and hard turn feel disconnected."
    ],
    checkWhen: ["close-range aim", "loose or shaky aim"],
    confuse: "Do not confuse this with base look speed."
  },
  "Boost Ramp Time": {
    controls: "How fast boost kicks in.",
    wrong: [
      "Aim feels muddy before it suddenly speeds up.",
      "Close tracking feels delayed.",
      "Boost shows up too late to help."
    ],
    checkWhen: ["close-range aim", "loose or shaky aim"],
    confuse: "Do not confuse this with dampening or deadzone."
  },
  "Scoped Speed Multiplier": {
    controls: "How fast scoped aiming feels compared to the rest of your ADS setup.",
    wrong: [
      "Distant aiming skips past targets.",
      "Scoped aim feels disconnected from the rest of your setup."
    ],
    checkWhen: ["long-range aim"],
    confuse: "Do not confuse this with normal ADS speed."
  },
  "Look Dampening Time": {
    controls: "How much your aim eases into movement instead of responding instantly.",
    wrong: [
      "The stick does not feel immediate.",
      "Your aim feels soft or muddy instead of sharp."
    ],
    checkWhen: ["close-range aim", "ADS mismatch"],
    confuse: "Do not start here. This is usually a later check."
  },
  "Deadzone": {
    controls: "How much stick movement gets ignored before your aim starts moving.",
    wrong: [
      "Your aim feels twitchy or sloppy on small adjustments.",
      "Your reticle moves on its own.",
      "The stick feels too dead near center."
    ],
    checkWhen: ["loose or shaky aim", "aim assist unreliable"],
    confuse: "Do not confuse this with sens or aim assist."
  },
  "Precision Aim Assist Strength": {
    controls: "How strong aim assist feels in more precise aiming situations.",
    wrong: [
      "Your reticle feels like it slips too easily even when the setup is stable."
    ],
    checkWhen: ["aim assist unreliable"],
    confuse: "Check setup first. Then blame assist strength."
  },
  "Tracking Aim Assist Strength": {
    controls: "How much aim assist helps while following moving players.",
    wrong: [
      "Close-range tracking feels dead.",
      "Your crosshair keeps slipping off moving players."
    ],
    checkWhen: ["aim assist unreliable"],
    confuse: "Do not confuse this with input delay or ADS speed."
  }
};

const controllerRecommendations = [
  {
    name: "GameSir G7 Pro",
    platforms: ["xbox", "pc"],
    fit: "Xbox + PC",
    tag: "best overall",
    note: "Best measured console-plus-PC latency in your list. Strong wired pick.",
    warning: "Use this only after ruling out Wi-Fi, controller connection method, frame drops, and display delay.",
    link: "https://amzn.to/4cUJ3Sa"
  },
  {
    name: "GameSir G7 SE",
    platforms: ["xbox", "pc"],
    fit: "Xbox + PC, budget",
    tag: "best budget",
    note: "Budget wired option. Cheap, stable, and fast.",
    warning: "Wired only, which is part of why it is a strong delay option.",
    link: "https://amzn.to/4mYLjMS"
  },
  {
    name: "Sony DualSense Edge",
    platforms: ["ps5", "pc"],
    fit: "PS5 + PC",
    tag: "best for PS5",
    note: "Best PlayStation-side option in your list.",
    warning: "PC overclock talk is advanced-user territory. Do not push that inside the app.",
    link: "https://amzn.to/4cNmJex"
  },
  {
    name: "Victrix Gambit / Gambit Prime",
    platforms: ["xbox", "pc"],
    fit: "Xbox + PC wired",
    tag: "older fast wired pick",
    note: "Strong reputation for competitive feel and fast response.",
    warning: "Present this below the GameSir picks.",
    link: "https://amzn.to/4cTAcjw"
  },
  {
    name: "Razer Wolverine V3 Pro",
    platforms: ["xbox", "pc"],
    fit: "Xbox + PC, premium buttons/paddles",
    tag: "premium feel",
    note: "Better buy for build, paddles, and feel than for pure lowest delay.",
    warning: "Do not frame this as the fastest. Frame it as premium feel.",
    link: "https://amzn.to/421xqny"
  }
];

const recommendedSettings = {
  aggressive: {
    id: "aggressive",
    title: "Aggressive starting point",
    curve: "Linear",
    lookX: 44,
    lookY: 44,
    adsX: 7,
    adsY: 7,
    why: "This is for players who want faster reactions and cleaner close-range pressure without making the setup uncontrollable.",
    tooFast: {
      lookX: 42,
      lookY: 42,
      adsX: 6,
      adsY: 6
    },
    tooSlow: {
      lookX: 46,
      lookY: 46,
      adsX: 8,
      adsY: 8
    },
    warning: "Don’t jump straight to super-high numbers just because you want aggressive aim."
  },
  balanced: {
    id: "balanced",
    title: "Balanced starting point",
    curve: "Exponential",
    lookX: 40,
    lookY: 40,
    adsX: 8,
    adsY: 8,
    why: "This is for players who want a controlled setup that still feels active and playable in Zero Build fights.",
    tooFast: {
      lookX: 38,
      lookY: 38,
      adsX: 7,
      adsY: 7
    },
    tooSlow: {
      lookX: 42,
      lookY: 42,
      adsX: 9,
      adsY: 9
    },
    warning: "Don’t call your playstyle balanced if you actually want raw, fast linear aim."
  },
  strategic: {
    id: "strategic",
    title: "Strategic starting point",
    curve: "Exponential",
    lookX: 38,
    lookY: 38,
    adsX: 9,
    adsY: 9,
    why: "This is for players who want steadier tracking, cleaner micro-adjustments, and more controlled long-range aim.",
    tooFast: {
      lookX: 37,
      lookY: 37,
      adsX: 8,
      adsY: 8
    },
    tooSlow: {
      lookX: 40,
      lookY: 40,
      adsX: 9,
      adsY: 9
    },
    warning: "Don’t force this if you like fast pressure fights. This is the calmer setup."
  }
};

const results = {
  "aim-assist-unreliable": {
    title: "your aim assist probably isn’t gone. your setup feels unstable",
    problem: "This usually means connection, controller, performance, or sensitivity instability. Not that aim assist got deleted.",
    checkFirst: [
      "check whether you’re on Wi-Fi or hardwired",
      "check whether your controller is wired, wireless, or using a dongle",
      "check whether the game feels delayed or inconsistent",
      "if those are clean, check sens, deadzone, and input curve"
    ],
    dontTouchYet: [
      "don’t reinstall the game",
      "don’t buy a new controller first",
      "don’t change every setting at once",
      "don’t assume Epic nerfed aim assist with no real change"
    ],
    fixedFeelsLike: [
      "reticle stops feeling like it slips",
      "crosshair stops outrunning the target",
      "tracking feels more consistent",
      "ADS feels slightly sticky instead of loose or random"
    ],
    reroute: "if the whole game still feels delayed, check input delay. if your aim still feels twitchy, check loose or shaky aim.",
    testingNote: "Rule out system and connection issues before touching sens.",
    glossary: ["Deadzone", "Look Input Curve", "Precision Aim Assist Strength", "Tracking Aim Assist Strength"]
  },
  "no-middle": {
    title: "your setup has no middle because your tuning is fighting itself",
    problem: "This usually means your curve, look sens, ADS sens, or advanced settings setup does not fit how you actually play. Not that the game is broken.",
    checkFirst: [
      "check whether you should be on simple or advanced settings",
      "check your input curve",
      "check look speed",
      "check ADS speed and whether it matches your normal look"
    ],
    dontTouchYet: [
      "don’t keep changing five settings in one session",
      "don’t copy a random pro setup and expect instant balance",
      "don’t blame ping for a tuning problem"
    ],
    fixedFeelsLike: [
      "movement feels balanced instead of jerky",
      "you stop swinging past targets",
      "tracking feels easier to hold",
      "look and ADS finally feel like they belong together"
    ],
    reroute: "if hip fire feels fine but ADS still feels bad, check ADS feels wrong. if your aim only breaks at one range, check aim breaks at certain ranges.",
    testingNote: "Stay on one setup long enough to actually judge it.",
    glossary: ["Look Input Curve", "Look Speed", "ADS Speed"]
  },
  "range-close": {
    title: "your close-range aim is probably breaking because you’re taking the wrong kind of fight",
    problem: "This usually means you’re ADSing too close, or your close-range tuning is too jumpy, too slow, or too delayed. Not that every player in your face is cheating.",
    checkFirst: [
      "check whether you’re ADSing when the player is already in your face",
      "check your input curve",
      "check look speed",
      "check turning boosts and ramp time"
    ],
    dontTouchYet: [
      "don’t start by blaming aim assist",
      "don’t tune long-range ADS first",
      "don’t touch dampening early unless the main fixes fail"
    ],
    fixedFeelsLike: [
      "hip fire feels smooth instead of panicked",
      "you stop losing players when they jump in your face",
      "close tracking feels readable",
      "your aim follows the fight instead of lagging behind it"
    ],
    reroute: "if your aim still feels twitchy or messy, check loose or shaky aim.",
    testingNote: "Test close hip fire separately from ADS.",
    glossary: ["Look Input Curve", "Look Speed", "Turning Boost", "Boost Ramp Time", "Look Dampening Time"]
  },
  "range-long": {
    title: "your long-range aim is probably too raw or too disconnected",
    problem: "This usually means your input curve, ADS speed, or scoped tuning is making distant tracking harder than it should be. Not that every beam is cheating.",
    checkFirst: [
      "check your input curve",
      "check ADS horizontal and vertical speed",
      "check scoped speed multiplier",
      "check whether your ADS actually matches your normal look"
    ],
    dontTouchYet: [
      "don’t start with boosts unless the main tuning is already close",
      "don’t blame ping for every missed long-range shot",
      "don’t judge your setup off one random in-match spray"
    ],
    fixedFeelsLike: [
      "small adjustments stop skipping past the target",
      "ADS feels steadier",
      "distant tracking feels controlled",
      "long-range shots feel deliberate instead of rushed"
    ],
    reroute: "if ADS feels bad at every range, check ADS feels wrong.",
    testingNote: "Test on moving targets at distance, not random live-fight moments only.",
    glossary: ["Look Input Curve", "ADS Speed", "Scoped Speed Multiplier"]
  },
  "ads-wrong": {
    title: "your ADS is fighting your normal aim",
    problem: "This usually means your ADS speed does not match your normal look, or your curve is making ADS feel disconnected. Not that platform or cheaters are the real reason your ADS feels heavy.",
    checkFirst: [
      "check ADS horizontal and vertical speed",
      "check your input curve",
      "check your normal look speed",
      "check whether boosts are making ADS feel disconnected"
    ],
    dontTouchYet: [
      "don’t start with dampening",
      "don’t blame platform first",
      "don’t only test this in real fights"
    ],
    fixedFeelsLike: [
      "ADS feels smooth all the way through",
      "your gun stops feeling like it pulls against you",
      "the handoff from hip fire to ADS feels natural",
      "ADS tracks with the target instead of fighting your hand"
    ],
    reroute: "if only long-range ADS still feels bad, check long-range aim. if the whole setup feels unbalanced, check my sensitivity has no middle.",
    testingNote: "Test hip fire and ADS separately in a training map.",
    glossary: ["ADS Speed", "Look Input Curve", "Look Speed", "Turning Boost", "Look Dampening Time"]
  },
  "input-delay": {
    title: "this feels like delay, not bad sens",
    problem: "This usually means connection, controller method, performance, or display delay. Not that your settings randomly stopped working.",
    checkFirst: [
      "check whether you’re on Wi-Fi or hardwired",
      "check whether your controller is wired, wireless, or on a dongle",
      "check ping stability and frame drops",
      "check whether your display setup is adding delay"
    ],
    dontTouchYet: [
      "don’t start by changing sens",
      "don’t copy a pro setup to fix delay",
      "don’t reinstall the game first",
      "don’t blame aim assist"
    ],
    fixedFeelsLike: [
      "the game feels smooth again",
      "your inputs feel reactive",
      "movement and aim stop feeling behind your hands",
      "what you do on the stick happens when you expect it"
    ],
    reroute: "if the game feels stable but tracking still feels weak, check aim assist unreliable. if the game feels stable but aim still feels messy, check loose or shaky aim.",
    testingNote: "Check your network connection, controller type, and frame stability before changing any in-game settings.",
    glossary: []
  },
  "loose-shaky": {
    title: "your setup looks too jumpy or too unstable",
    problem: "This usually means deadzone, boost, curve, or sens instability. Sometimes panic makes it look worse than it really is.",
    checkFirst: [
      "check deadzones",
      "check turning boosts",
      "check input curve",
      "check sensitivity and controller age"
    ],
    dontTouchYet: [
      "don’t instantly assume you’re just bad",
      "don’t ignore possible drift",
      "don’t keep changing settings without checking clips",
      "don’t blame everything on aim assist"
    ],
    fixedFeelsLike: [
      "you feel in control",
      "small adjustments stop feeling messy",
      "left goes left and right goes right without over-aiming",
      "your reticle stops jumping past the target"
    ],
    reroute: "if the whole game feels delayed, check input delay. if this only happens when fights get chaotic, this may be panic, not settings.",
    testingNote: "Check whether the shaky feel shows up all the time or only when fights get chaotic.",
    glossary: ["Deadzone", "Turning Boost", "Look Input Curve", "Boost Ramp Time"]
  }
};

const flows = {
  "aim-assist-unreliable": [
    {
      id: "delayedToo",
      title: "Does the whole game feel delayed or off too?",
      choices: [
        { label: "yes", next: "RESULT:input-delay" },
        { label: "no", next: 1 }
      ]
    },
    {
      id: "setup",
      title: "How is your setup connected?",
      choices: [
        { label: "hardwired internet + wired controller", next: 2 },
        { label: "hardwired internet + wireless controller", next: 2 },
        { label: "Wi-Fi + wired controller", next: "RESULT:aim-assist-unreliable" },
        { label: "Wi-Fi + wireless controller", next: "RESULT:aim-assist-unreliable" }
      ]
    },
    {
      id: "feel",
      title: "What sounds closest?",
      choices: [
        { label: "my reticle slips off target", next: "RESULT:aim-assist-unreliable" },
        { label: "close-range tracking feels dead", next: "RESULT:aim-assist-unreliable" },
        { label: "my aim feels random or twitchy", next: "RESULT:loose-shaky" },
        { label: "the whole setup still feels delayed", next: "RESULT:input-delay" }
      ]
    }
  ],
  "no-middle": [
    {
      id: "advanced",
      title: "Are you using advanced options right now?",
      choices: [
        { label: "yes", next: 1 },
        { label: "no", next: 1 },
        { label: "I don’t know", next: 1 }
      ]
    },
    {
      id: "closer",
      title: "Which sounds closest?",
      choices: [
        { label: "one setting feels too slow, the next feels too fast", next: "RESULT:no-middle" },
        { label: "hip fire feels fine but ADS does not", next: "RESULT:ads-wrong" },
        { label: "my aim only breaks up close", next: "RESULT:range-close" },
        { label: "my aim only breaks far away", next: "RESULT:range-long" },
        { label: "nothing feels balanced anywhere", next: 2 }
      ]
    },
    {
      id: "changes",
      title: "Have you been changing settings a lot lately?",
      choices: [
        { label: "yes, constantly", next: "RESULT:no-middle" },
        { label: "a little", next: "RESULT:no-middle" },
        { label: "no", next: "RESULT:no-middle" }
      ]
    }
  ],
  "range-breaks": [
    {
      id: "range",
      title: "Where does your aim break most?",
      choices: [
        { label: "close range", next: 1, meta: { branch: "close" } },
        { label: "long range", next: 10, meta: { branch: "long" } },
        { label: "both", next: 20, meta: { branch: "both" } }
      ]
    },
    {
      id: "close_habit",
      title: "What happens most in close fights?",
      choices: [
        { label: "I ADS when they jump in my face", next: "RESULT:range-close" },
        { label: "I lose players when they strafe or jump", next: 2 },
        { label: "my hip fire feels wild", next: "RESULT:loose-shaky" },
        { label: "I can’t turn onto them fast enough", next: 2 }
      ]
    },
    {
      id: "close_feel",
      title: "How does close-range aim feel?",
      choices: [
        { label: "too jumpy", next: "RESULT:range-close" },
        { label: "too slow", next: "RESULT:range-close" },
        { label: "delayed", next: "RESULT:range-close" },
        { label: "random", next: "RESULT:loose-shaky" }
      ]
    },
    {
      id: "unused-3",
      title: "",
      choices: []
    },
    {
      id: "unused-4",
      title: "",
      choices: []
    },
    {
      id: "unused-5",
      title: "",
      choices: []
    },
    {
      id: "unused-6",
      title: "",
      choices: []
    },
    {
      id: "unused-7",
      title: "",
      choices: []
    },
    {
      id: "unused-8",
      title: "",
      choices: []
    },
    {
      id: "unused-9",
      title: "",
      choices: []
    },
    {
      id: "long_issue",
      title: "What happens most at long range?",
      choices: [
        { label: "I skip past targets", next: "RESULT:range-long" },
        { label: "I can’t make small adjustments", next: "RESULT:range-long" },
        { label: "ADS feels too fast or too slow", next: "RESULT:ads-wrong" },
        { label: "scoped aim feels disconnected", next: "RESULT:range-long" }
      ]
    },
    {
      id: "unused-11",
      title: "",
      choices: []
    },
    {
      id: "unused-12",
      title: "",
      choices: []
    },
    {
      id: "unused-13",
      title: "",
      choices: []
    },
    {
      id: "unused-14",
      title: "",
      choices: []
    },
    {
      id: "unused-15",
      title: "",
      choices: []
    },
    {
      id: "unused-16",
      title: "",
      choices: []
    },
    {
      id: "unused-17",
      title: "",
      choices: []
    },
    {
      id: "unused-18",
      title: "",
      choices: []
    },
    {
      id: "unused-19",
      title: "",
      choices: []
    },
    {
      id: "both_worse",
      title: "Which one is worse?",
      choices: [
        { label: "close", next: "RESULT:range-close" },
        { label: "long", next: "RESULT:range-long" },
        { label: "both equally", next: 21 }
      ]
    },
    {
      id: "both_feel",
      title: "Which sounds closer overall?",
      choices: [
        { label: "nothing feels balanced anywhere", next: "RESULT:no-middle" },
        { label: "my aim feels twitchy and messy", next: "RESULT:loose-shaky" },
        { label: "ADS feels bad at every range", next: "RESULT:ads-wrong" }
      ]
    }
  ],
  "ads-wrong": [
    {
      id: "ads_closest",
      title: "Which sounds closest?",
      choices: [
        { label: "ADS feels too slow", next: 1 },
        { label: "ADS feels too fast", next: 1 },
        { label: "ADS feels heavy", next: 1 },
        { label: "hip fire feels fine but ADS feels off", next: "RESULT:ads-wrong" },
        { label: "I can’t track while ADSing", next: 1 }
      ]
    },
    {
      id: "normalLook",
      title: "Does normal look feel okay?",
      choices: [
        { label: "yes", next: 2 },
        { label: "no", next: "RESULT:no-middle" }
      ]
    },
    {
      id: "range_ads",
      title: "Are you struggling more at:",
      choices: [
        { label: "mid range", next: "RESULT:ads-wrong" },
        { label: "long range", next: "RESULT:range-long" },
        { label: "all ADS ranges", next: "RESULT:ads-wrong" }
      ]
    }
  ],
  "input-delay": [
    {
      id: "internet",
      title: "Are you on Wi-Fi or hardwired?",
      choices: [
        { label: "Wi-Fi", value: "wifi", next: 1 },
        { label: "hardwired", value: "hardwired", next: 1 },
        { label: "I don’t know", value: "unknown", next: 1 }
      ]
    },
    {
      id: "platform",
      title: "What are you playing on?",
      choices: [
        { label: "PS5", value: "ps5", next: 2 },
        { label: "Xbox", value: "xbox", next: 2 },
        { label: "PC with controller", value: "pc", next: 2 }
      ]
    },
    {
      id: "controllerType",
      title: "Is your controller:",
      choices: [
        { label: "wired", value: "wired", next: 3 },
        { label: "wireless", value: "wireless", next: 3 },
        { label: "wireless with dongle", value: "wireless-dongle", next: 3 },
        { label: "I don’t know", value: "unknown", next: 3 }
      ]
    },
    {
      id: "frames",
      title: "Are your frames stable?",
      choices: [
        { label: "yes", value: "yes", next: 4 },
        { label: "no", value: "no", next: "RESULT:input-delay" },
        { label: "I don’t know", value: "unknown", next: "RESULT:input-delay" }
      ]
    },
    {
      id: "display",
      title: "Are you on a TV or monitor?",
      choices: [
        { label: "TV", value: "tv", next: "RESULT:input-delay" },
        { label: "monitor", value: "monitor", next: 5 }
      ]
    },
    {
      id: "delayType",
      title: "What sounds most true?",
      choices: [
        { label: "the whole game feels muddy", value: "whole-game-muddy", next: "RESULT:input-delay" },
        { label: "my aim feels delayed", value: "aim-delayed", next: "RESULT:input-delay" },
        { label: "my movement feels delayed", value: "movement-delayed", next: "RESULT:input-delay" },
        { label: "my controller feels delayed", value: "controller-delayed", next: "RESULT:input-delay" },
        { label: "everything feels behind my hands", value: "behind-hands", next: "RESULT:input-delay" }
      ]
    }
  ],
  "loose-shaky": [
    {
      id: "closest",
      title: "Which sounds closest?",
      choices: [
        { label: "my reticle feels twitchy", next: 1 },
        { label: "I keep overcorrecting", next: 1 },
        { label: "my stick feels too sensitive", next: 1 },
        { label: "my stick feels too stiff", next: 1 },
        { label: "small adjustments feel bad", next: 1 },
        { label: "my aim falls apart under pressure", next: 3 }
      ]
    },
    {
      id: "controllerAge",
      title: "How old is your controller?",
      choices: [
        { label: "pretty new", next: 2 },
        { label: "older", next: "RESULT:loose-shaky" },
        { label: "not sure", next: 2 }
      ]
    },
    {
      id: "drift",
      title: "Do you notice stick drift?",
      choices: [
        { label: "yes", next: "RESULT:loose-shaky" },
        { label: "maybe", next: "RESULT:loose-shaky" },
        { label: "no", next: 3 }
      ]
    },
    {
      id: "panic",
      title: "Does this happen more when fights get chaotic?",
      choices: [
        { label: "yes", next: "RESULT:loose-shaky" },
        { label: "sometimes", next: "RESULT:loose-shaky" },
        { label: "no", next: "RESULT:loose-shaky" }
      ]
    }
  ]
};

function resetState() {
  state.path = [];
  state.currentFlow = null;
  state.currentStepIndex = 0;
  state.answers = {};
  appState.entrySymptom = null;
  appState.answers = {};
  appState.currentResultKey = null;
}

function renderHome() {
  resetState();
  const choices = entrySymptoms.map((item) => `
    <button class="choice-button" data-entry="${item.id}">
      <strong>${item.label}</strong>
      <span>${item.desc}</span>
    </button>
  `).join("");

  app.innerHTML = `
    <section class="screen">
      <h2 class="card-title">What feels wrong most?</h2>
      <p class="card-copy">Pick the closest symptom first. The checker sorts the real problem after that.</p>
      <div class="choice-grid">${choices}</div>
      <div class="button-row">
        <button class="primary-button" type="button" id="recommendedSettingsHome">Recommended settings by playstyle</button>
        <button class="secondary-button" type="button" id="openGlossary">Glossary</button>
      </div>
    </section>
  `;

  app.querySelectorAll("[data-entry]").forEach((btn) => {
    btn.addEventListener("click", () => startFlow(btn.dataset.entry));
  });

  document.getElementById("recommendedSettingsHome").addEventListener("click", renderRecommendedSettingsPrompt);
  document.getElementById("openGlossary").addEventListener("click", renderGlossaryScreen);
}

function startFlow(flowId) {
  state.currentFlow = flowId;
  state.currentStepIndex = 0;
  state.answers = {};
  state.path = [flowId];
  appState.entrySymptom = flowId;
  appState.answers = state.answers;
  appState.currentResultKey = null;
  renderCurrentStep();
}

function getActiveFlow() {
  return flows[state.currentFlow];
}

function countUsableSteps(flowId) {
  return (flows[flowId] || []).filter(step => step.title && step.choices && step.choices.length).length;
}

function renderCurrentStep() {
  const flow = getActiveFlow();
  const step = flow[state.currentStepIndex];

  if (!step || !step.title || !step.choices?.length) {
    renderHome();
    return;
  }

  const usableSteps = countUsableSteps(state.currentFlow);
  const currentUsableIndex = flow
    .slice(0, state.currentStepIndex + 1)
    .filter(s => s.title && s.choices && s.choices.length).length;
  const pct = Math.max(10, Math.round((currentUsableIndex / usableSteps) * 100));

  app.innerHTML = `
    <section class="screen">
      <div class="progress" aria-hidden="true">
        <div class="progress-bar" style="width:${pct}%"></div>
      </div>
      <div class="meta-row">
        <span class="badge">step ${currentUsableIndex} of ${usableSteps}</span>
        <span class="badge">${entrySymptoms.find(x => x.id === state.currentFlow)?.label || ""}</span>
      </div>
      <h2 class="card-title">${step.title}</h2>
      <div class="choice-grid">
        ${step.choices.map((choice, index) => `
          <button class="choice-button" data-choice="${index}">
            <strong>${choice.label}</strong>
          </button>
        `).join("")}
      </div>
      <div class="button-row">
        <button class="secondary-button" type="button" id="backButton">Back</button>
        <button class="ghost-button" type="button" id="startOverButton">Start over</button>
      </div>
    </section>
  `;

  app.querySelectorAll("[data-choice]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const selected = step.choices[Number(btn.dataset.choice)];
          const answerValue = selected.value ?? selected.label;
          state.answers[step.id] = answerValue;
      handleNext(selected.next);
    });
  });

  document.getElementById("backButton").addEventListener("click", goBack);
  document.getElementById("startOverButton").addEventListener("click", renderHome);
}

function handleNext(next) {
  if (typeof next === "string" && next.startsWith("RESULT:")) {
    const resultId = next.replace("RESULT:", "");
    renderResultByKey(resultId);
    return;
  }

  state.path.push(state.currentStepIndex);
  state.currentStepIndex = next;
  renderCurrentStep();
}

function goBack() {
  if (!state.path.length || state.path.length === 1) {
    renderHome();
    return;
  }

  state.path.pop();
  const prev = state.path[state.path.length - 1];

  if (typeof prev === "string") {
    state.currentStepIndex = 0;
  } else {
    state.currentStepIndex = prev;
  }

  renderCurrentStep();
}

function getFilteredControllers(platform) {
  if (!platform) return controllerRecommendations;

  const matching = controllerRecommendations.filter(controller =>
    controller.platforms.includes(platform)
  );

  const nonMatching = controllerRecommendations.filter(controller =>
    !controller.platforms.includes(platform)
  );

  return [...matching, ...nonMatching];
}

function shouldShowControllerRecommendations(state) {
  if (state.currentFlow !== "input-delay") return false;

  const controllerType = state.answers.controllerType;
  const delayType = state.answers.delayType;

  const controllerRelated =
    controllerType === "wireless" ||
    controllerType === "wireless-dongle" ||
    delayType === "controller-delayed";

  return controllerRelated;
}

function renderControllerRecommendations(platform) {
  const filteredControllers = getFilteredControllers(platform);

  const platformLabelMap = {
    ps5: "PS5",
    xbox: "Xbox",
    pc: "PC"
  };

  const platformLabel = platformLabelMap[platform] || "your platform";

  return `
    <div class="result-section">
      <h3>Still think it’s the controller?</h3>
      <p>Only check this after ruling out Wi-Fi, controller connection method, frame drops, and display delay.</p>
      <p>Best matches for ${platformLabel} show first.</p>
      <div class="controller-list">
        ${filteredControllers.map(controller => `
          <div class="controller-card">
            <h4>${controller.name}</h4>
            <p><strong>Best for:</strong> ${controller.fit}</p>
            <p><strong>${controller.tag}</strong></p>
            <p>${controller.note}</p>
            <p class="warning"><strong>Note:</strong> ${controller.warning}</p>
            <a href="${controller.link}" target="_blank" rel="noopener noreferrer sponsored">View controller</a>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderGlossaryItems(items) {
  if (!items.length) {
    return `<p class="small-note">No glossary links needed for this result.</p>`;
  }

  return `
    <div class="glossary-list">
      ${items.map((name, idx) => {
        const item = glossary[name];
        if (!item) return "";
        return `
          <div class="glossary-item" data-glossary="${idx}">
            <button class="glossary-toggle" type="button">${name}</button>
            <div class="glossary-content">
              <p><strong>What it controls:</strong> ${item.controls}</p>
              <p><strong>What it feels like when it’s wrong:</strong></p>
              <ul>${item.wrong.map(line => `<li>${line}</li>`).join("")}</ul>
              <p><strong>Check this when:</strong> ${item.checkWhen.join(", ")}</p>
              <p><strong>Don’t confuse it with:</strong> ${item.confuse}</p>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderResult(data, resultKey) {
  appState.currentResultKey = resultKey;
  const resultData = data || results[resultKey];
  if (!resultData) {
    renderHome();
    return;
  }

  app.innerHTML = `
    <section class="screen">
      <div class="meta-row">
        <span class="badge">result</span>
        <span class="badge">${entrySymptoms.find(x => x.id === state.currentFlow)?.label || "symptom checker"}</span>
      </div>
      <h2 class="result-title">${resultData.title}</h2>
      <p class="result-problem">${resultData.problem}</p>

      <div class="result-grid">
        <section class="result-section">
          <h3>Check these first</h3>
          <ul>${resultData.checkFirst.map(item => `<li>${item}</li>`).join("")}</ul>
        </section>

        <section class="result-section danger">
          <h3>Don’t touch this yet</h3>
          <ul>${resultData.dontTouchYet.map(item => `<li>${item}</li>`).join("")}</ul>
        </section>

        <section class="result-section success">
          <h3>What fixed should feel like</h3>
          <ul>${resultData.fixedFeelsLike.map(item => `<li>${item}</li>`).join("")}</ul>
        </section>

        ${shouldShowControllerRecommendations(appState) ? renderControllerRecommendations(appState.answers.platform) : ""}

        ${shouldOfferRecommendedSettings(resultKey) ? `
        <section class="result-section">
          <h3>Suggested playstyle</h3>
          <p>${getPlaystyleNote(resultKey)}</p>
        </section>
        ` : ""}

        <section class="result-section alert">
          <h3>Still not fixed?</h3>
          <p class="route-note">${resultData.reroute || resultData.nextStep || ""}</p>
        </section>

        <section class="result-section">
          <h3>Test note</h3>
          <p>${resultData.testingNote}</p>
        </section>

        <section class="result-section">
          <h3>Setting glossary</h3>
          ${renderGlossaryItems(resultData.glossary)}
        </section>
      </div>

      <div class="result-actions">
        ${shouldOfferRecommendedSettings(resultKey) ? `<button class="primary-button" type="button" id="recommendedSettings">Apply these settings</button>` : ""}
        <button class="${shouldOfferRecommendedSettings(resultKey) ? "secondary-button" : "primary-button"}" type="button" id="restartResult">Start over</button>
        <button class="ghost-button" type="button" id="glossaryOnly">Glossary</button>
      </div>
    </section>
  `;

  if (shouldOfferRecommendedSettings(resultKey)) {
    document.getElementById("recommendedSettings").addEventListener("click", renderRecommendedSettingsPrompt);
  }

  document.getElementById("restartResult").addEventListener("click", renderHome);
  document.getElementById("glossaryOnly").addEventListener("click", renderGlossaryScreen);

  app.querySelectorAll(".glossary-item").forEach((item) => {
    item.querySelector(".glossary-toggle").addEventListener("click", () => {
      item.classList.toggle("open");
    });
  });
}

function shouldOfferRecommendedSettings(resultKey) {
  const allowed = [
    "no-middle",
    "ads-wrong",
    "loose-shaky",
    "range-close",
    "range-long"
  ];
  return allowed.includes(resultKey);
}

function getPlaystyleNote(resultKey) {
  const notes = {
    "no-middle": "Try the balanced playstyle first. It's designed to find the middle ground without forcing you into extreme settings.",
    "ads-wrong": "Try the balanced or strategic playstyle. Balanced pairs close and long-range together smoothly. Strategic gives ADS more weight if you lean into scoped fights.",
    "loose-shaky": "Try the strategic playstyle first. It uses lower numbers and smoother curves to reduce erratic aim. If that feels too slow, try balanced.",
    "range-close": "Try the aggressive playstyle. It's built for close fights where raw reaction speed matters. You can dial it down if it feels too jumpy.",
    "range-long": "Try the strategic playstyle. It prioritizes steady long-range tracking over close-range speed. If it feels too slow, try balanced."
  };
  return notes[resultKey] || "";
}

function renderResultByKey(resultKey) {
  renderResult(results[resultKey], resultKey);
}

function renderRecommendedSettingsPrompt() {
  app.innerHTML = `
    <section class="screen">
      <h2 class="card-title">Recommended settings by playstyle</h2>
      <p class="card-copy">These are starting points, not magic settings. Pick the one that matches how you actually fight.</p>

      <div class="choice-grid">
        <button class="choice-button" id="chooseAggressive">
          <strong>Aggressive</strong>
          <span>Fast reactions and close-range pressure</span>
        </button>
        <button class="choice-button" id="chooseBalanced">
          <strong>Balanced</strong>
          <span>Active and playable at all ranges</span>
        </button>
        <button class="choice-button" id="chooseStrategic">
          <strong>Strategic</strong>
          <span>Steady tracking and long-range control</span>
        </button>
      </div>

      <div class="button-row">
        <button class="secondary-button" type="button" id="backFromSettingsPrompt">Back</button>
      </div>
    </section>
  `;

  document.getElementById("chooseAggressive").addEventListener("click", () => renderRecommendedSettingsResult("aggressive"));
  document.getElementById("chooseBalanced").addEventListener("click", () => renderRecommendedSettingsResult("balanced"));
  document.getElementById("chooseStrategic").addEventListener("click", () => renderRecommendedSettingsResult("strategic"));
  document.getElementById("backFromSettingsPrompt").addEventListener("click", () => appState.currentResultKey ? renderResult(results[appState.currentResultKey], appState.currentResultKey) : renderHome());
}

function renderRecommendedSettingsResult(playstyle) {
  const preset = recommendedSettings[playstyle];

  app.innerHTML = `
    <section class="screen">
      <div class="result-section">
        <h3>${preset.title}</h3>
        <p>${preset.why}</p>
      </div>

      <div class="result-section">
        <h3>Curve</h3>
        <p>${preset.curve}</p>
      </div>

      <div class="result-section">
        <h3>Look</h3>
        <p>${preset.lookX} / ${preset.lookY}</p>
      </div>

      <div class="result-section">
        <h3>ADS</h3>
        <p>${preset.adsX} / ${preset.adsY}</p>
      </div>

      <div class="result-section">
        <h3>If this feels too fast</h3>
        <p>Look: ${preset.tooFast.lookX} / ${preset.tooFast.lookY}</p>
        <p>ADS: ${preset.tooFast.adsX} / ${preset.tooFast.adsY}</p>
      </div>

      <div class="result-section">
        <h3>If this feels too slow</h3>
        <p>Look: ${preset.tooSlow.lookX} / ${preset.tooSlow.lookY}</p>
        <p>ADS: ${preset.tooSlow.adsX} / ${preset.tooSlow.adsY}</p>
      </div>

      <div class="result-section">
        <h3>Do not do this</h3>
        <p>${preset.warning}</p>
      </div>

      <div class="result-section">
        <h3>Important</h3>
        <p>Use this as a starting point. Do not copy numbers blindly and then keep changing everything every five minutes.</p>
      </div>

      <div class="button-row">
        <button class="secondary-button" type="button" id="tryAnother">Try another</button>
        <button class="ghost-button" type="button" id="backFromSettings">Back</button>
        <button class="primary-button" type="button" id="startOverFinal">Start over</button>
      </div>
    </section>
  `;

  document.getElementById("tryAnother").addEventListener("click", renderRecommendedSettingsPrompt);
  document.getElementById("backFromSettings").addEventListener("click", () => appState.currentResultKey ? renderResult(results[appState.currentResultKey], appState.currentResultKey) : renderRecommendedSettingsPrompt());
  document.getElementById("startOverFinal").addEventListener("click", renderHome);
}

function renderGlossaryScreen() {
  const items = Object.keys(glossary).map((name, idx) => {
    const item = glossary[name];
    return `
      <div class="glossary-item" data-glossary-full="${idx}">
        <button class="glossary-toggle" type="button">${name}</button>
        <div class="glossary-content">
          <p><strong>What it controls:</strong> ${item.controls}</p>
          <p><strong>What it feels like when it’s wrong:</strong></p>
          <ul>${item.wrong.map(line => `<li>${line}</li>`).join("")}</ul>
          <p><strong>Check this when:</strong> ${item.checkWhen.join(", ")}</p>
          <p><strong>Don’t confuse it with:</strong> ${item.confuse}</p>
        </div>
      </div>
    `;
  }).join("");

  app.innerHTML = `
    <section class="screen">
      <h2 class="card-title">Settings glossary</h2>
      <p class="card-copy">Use this when a result tells you to check a setting and you want the fast version of what it actually does.</p>
      <div class="glossary-list">${items}</div>
      <div class="button-row">
        <button class="secondary-button" type="button" id="backHome">Back</button>
      </div>
    </section>
  `;

  document.querySelectorAll("[data-glossary-full]").forEach((item) => {
    item.querySelector(".glossary-toggle").addEventListener("click", () => {
      item.classList.toggle("open");
    });
  });

  document.getElementById("backHome").addEventListener("click", () => appState.currentResultKey ? renderResult(results[appState.currentResultKey], appState.currentResultKey) : renderHome());
}

homeButton.addEventListener("click", renderHome);

renderHome();
