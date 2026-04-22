const TEAM_NAMES = ["IND","NZ","SA","AUS","AFG","PAK","ZIM","BAN","SL","ENG"];

const TEAM_FULL = {
  IND: "India",
  NZ: "New Zealand",
  SA: "South Africa",
  AUS: "Australia",
  AFG: "Afghanistan",
  PAK: "Pakistan",
  ZIM: "Zimbabwe",
  BAN: "Bangladesh",
  SL: "Sri Lanka",
  ENG: "England"
};

const TEAM_FLAGS = {
  IND: "🇮🇳",
  NZ: "🇳🇿",
  SA: "🇿🇦",
  AUS: "🇦🇺",
  AFG: "🇦🇫",
  PAK: "🇵🇰",
  ZIM: "🇿🇼",
  BAN: "🇧🇩",
  SL: "🇱🇰",
  ENG: "🏴"
};

const TEAM_STRENGTH = {
  IND: 94, AUS: 92, ENG: 90, SA: 88, NZ: 86,
  PAK: 84, AFG: 80, SL: 78, BAN: 76, ZIM: 70
};

const SQUADS = {
  IND: [
    makePlayer("Rohit Sharma","batsman","anchor","pace",94),
    makePlayer("Shubman Gill","batsman","anchor","pace",92),
    makePlayer("Virat Kohli","batsman","anchor","pace",95),
    makePlayer("Shreyas Iyer","batsman","aggressor","spin",88),
    makePlayer("KL Rahul","batsman","anchor","pace",87),
    makePlayer("Hardik Pandya","allrounder","aggressor","pace",89),
    makePlayer("Ravindra Jadeja","allrounder","anchor","spin",88),
    makePlayer("Axar Patel","allrounder","anchor","spin",84),
    makePlayer("Jasprit Bumrah","bowler","-","pace",96),
    makePlayer("Mohammed Shami","bowler","-","pace",90),
    makePlayer("Mohammed Siraj","bowler","-","pace",87),
    makePlayer("Kuldeep Yadav","bowler","-","spin",89),
    makePlayer("Ishan Kishan","batsman","aggressor","pace",84),
    makePlayer("Ruturaj Gaikwad","batsman","anchor","pace",82),
    makePlayer("Arshdeep Singh","bowler","-","pace",83)
  ],
  NZ: [
    makePlayer("Kane Williamson","batsman","anchor","pace",93),
    makePlayer("Devon Conway","batsman","anchor","pace",89),
    makePlayer("Daryl Mitchell","allrounder","aggressor","pace",88),
    makePlayer("Tom Latham","batsman","anchor","spin",84),
    makePlayer("Will Young","batsman","anchor","pace",80),
    makePlayer("Glenn Phillips","allrounder","aggressor","spin",86),
    makePlayer("Mitchell Santner","allrounder","anchor","spin",85),
    makePlayer("Rachin Ravindra","allrounder","anchor","spin",88),
    makePlayer("Trent Boult","bowler","-","pace",91),
    makePlayer("Tim Southee","bowler","-","pace",85),
    makePlayer("Lockie Ferguson","bowler","-","pace",87),
    makePlayer("Matt Henry","bowler","-","pace",86),
    makePlayer("Finn Allen","batsman","aggressor","pace",81),
    makePlayer("Mark Chapman","batsman","aggressor","spin",80),
    makePlayer("Ish Sodhi","bowler","-","spin",82)
  ],
  SA: [
    makePlayer("Temba Bavuma","batsman","anchor","pace",82),
    makePlayer("Quinton de Kock","batsman","aggressor","pace",91),
    makePlayer("Aiden Markram","allrounder","anchor","spin",88),
    makePlayer("Rassie van der Dussen","batsman","anchor","pace",87),
    makePlayer("Heinrich Klaasen","batsman","aggressor","spin",90),
    makePlayer("Marco Jansen","allrounder","aggressor","pace",87),
    makePlayer("Wiaan Mulder","allrounder","anchor","pace",80),
    makePlayer("Andile Phehlukwayo","allrounder","aggressor","pace",78),
    makePlayer("Kagiso Rabada","bowler","-","pace",91),
    makePlayer("Anrich Nortje","bowler","-","pace",88),
    makePlayer("Lungi Ngidi","bowler","-","pace",83),
    makePlayer("Keshav Maharaj","bowler","-","spin",84),
    makePlayer("Reeza Hendricks","batsman","anchor","pace",80),
    makePlayer("Tabraiz Shamsi","bowler","-","spin",81),
    makePlayer("Tristan Stubbs","batsman","aggressor","pace",82)
  ],
  AUS: [
    makePlayer("David Warner","batsman","aggressor","pace",90),
    makePlayer("Travis Head","batsman","aggressor","pace",92),
    makePlayer("Steve Smith","batsman","anchor","pace",93),
    makePlayer("Marnus Labuschagne","batsman","anchor","spin",84),
    makePlayer("Alex Carey","batsman","anchor","pace",82),
    makePlayer("Glenn Maxwell","allrounder","aggressor","spin",91),
    makePlayer("Marcus Stoinis","allrounder","aggressor","pace",84),
    makePlayer("Cameron Green","allrounder","anchor","pace",86),
    makePlayer("Pat Cummins","bowler","-","pace",92),
    makePlayer("Mitchell Starc","bowler","-","pace",94),
    makePlayer("Josh Hazlewood","bowler","-","pace",90),
    makePlayer("Adam Zampa","bowler","-","spin",86),
    makePlayer("Josh Inglis","batsman","aggressor","pace",81),
    makePlayer("Ashton Agar","allrounder","anchor","spin",79),
    makePlayer("Sean Abbott","bowler","-","pace",78)
  ],
  AFG: [
    makePlayer("Rahmanullah Gurbaz","batsman","aggressor","pace",86),
    makePlayer("Ibrahim Zadran","batsman","anchor","pace",85),
    makePlayer("Najibullah Zadran","batsman","aggressor","spin",82),
    makePlayer("Hashmatullah Shahidi","batsman","anchor","spin",81),
    makePlayer("Rahmat Shah","batsman","anchor","spin",80),
    makePlayer("Mohammad Nabi","allrounder","anchor","spin",87),
    makePlayer("Azmatullah Omarzai","allrounder","aggressor","pace",86),
    makePlayer("Gulbadin Naib","allrounder","aggressor","pace",78),
    makePlayer("Rashid Khan","bowler","-","spin",93),
    makePlayer("Mujeeb Ur Rahman","bowler","-","spin",88),
    makePlayer("Fazalhaq Farooqi","bowler","-","pace",84),
    makePlayer("Naveen-ul-Haq","bowler","-","pace",82),
    makePlayer("Noor Ahmad","bowler","-","spin",81),
    makePlayer("Karim Janat","allrounder","aggressor","pace",77),
    makePlayer("Ikram Alikhil","batsman","anchor","pace",74)
  ],
  PAK: [
    makePlayer("Babar Azam","batsman","anchor","pace",95),
    makePlayer("Imam-ul-Haq","batsman","anchor","pace",84),
    makePlayer("Fakhar Zaman","batsman","aggressor","pace",87),
    makePlayer("Abdullah Shafique","batsman","anchor","pace",82),
    makePlayer("Mohammad Rizwan","batsman","anchor","pace",92),
    makePlayer("Shadab Khan","allrounder","aggressor","spin",86),
    makePlayer("Mohammad Nawaz","allrounder","anchor","spin",81),
    makePlayer("Iftikhar Ahmed","allrounder","aggressor","spin",80),
    makePlayer("Shaheen Afridi","bowler","-","pace",93),
    makePlayer("Haris Rauf","bowler","-","pace",89),
    makePlayer("Naseem Shah","bowler","-","pace",88),
    makePlayer("Usama Mir","bowler","-","spin",78),
    makePlayer("Saud Shakeel","batsman","anchor","spin",83),
    makePlayer("Salman Agha","allrounder","anchor","spin",82),
    makePlayer("Hasan Ali","bowler","-","pace",77)
  ],
  ZIM: [
    makePlayer("Craig Ervine","batsman","anchor","pace",76),
    makePlayer("Sean Williams","allrounder","anchor","spin",82),
    makePlayer("Sikandar Raza","allrounder","aggressor","spin",88),
    makePlayer("Innocent Kaia","batsman","anchor","pace",72),
    makePlayer("Wesley Madhevere","allrounder","anchor","spin",74),
    makePlayer("Ryan Burl","allrounder","aggressor","spin",78),
    makePlayer("Tony Munyonga","allrounder","anchor","spin",70),
    makePlayer("Tadiwanashe Marumani","batsman","aggressor","pace",73),
    makePlayer("Blessing Muzarabani","bowler","-","pace",84),
    makePlayer("Richard Ngarava","bowler","-","pace",79),
    makePlayer("Tendai Chatara","bowler","-","pace",76),
    makePlayer("Wellington Masakadza","bowler","-","spin",73),
    makePlayer("Luke Jongwe","allrounder","aggressor","pace",72),
    makePlayer("Milton Shumba","batsman","anchor","spin",70),
    makePlayer("Brad Evans","bowler","-","pace",71)
  ],
  BAN: [
    makePlayer("Tamim Iqbal","batsman","anchor","pace",82),
    makePlayer("Litton Das","batsman","aggressor","pace",84),
    makePlayer("Najmul Hossain Shanto","batsman","anchor","pace",82),
    makePlayer("Mushfiqur Rahim","batsman","anchor","spin",84),
    makePlayer("Towhid Hridoy","batsman","aggressor","pace",79),
    makePlayer("Shakib Al Hasan","allrounder","anchor","spin",91),
    makePlayer("Mehidy Hasan Miraz","allrounder","anchor","spin",85),
    makePlayer("Mahmudullah","allrounder","anchor","spin",81),
    makePlayer("Mustafizur Rahman","bowler","-","pace",87),
    makePlayer("Taskin Ahmed","bowler","-","pace",84),
    makePlayer("Shoriful Islam","bowler","-","pace",79),
    makePlayer("Nasum Ahmed","bowler","-","spin",77),
    makePlayer("Afif Hossain","allrounder","aggressor","spin",76),
    makePlayer("Hasan Mahmud","bowler","-","pace",75),
    makePlayer("Ebadot Hossain","bowler","-","pace",78)
  ],
  SL: [
    makePlayer("Pathum Nissanka","batsman","anchor","pace",85),
    makePlayer("Kusal Mendis","batsman","aggressor","pace",85),
    makePlayer("Charith Asalanka","batsman","anchor","spin",83),
    makePlayer("Dhananjaya de Silva","allrounder","anchor","spin",84),
    makePlayer("Sadeera Samarawickrama","batsman","anchor","spin",80),
    makePlayer("Wanindu Hasaranga","allrounder","aggressor","spin",91),
    makePlayer("Dasun Shanaka","allrounder","aggressor","pace",80),
    makePlayer("Chamika Karunaratne","allrounder","aggressor","pace",77),
    makePlayer("Maheesh Theekshana","bowler","-","spin",86),
    makePlayer("Dilshan Madushanka","bowler","-","pace",84),
    makePlayer("Kasun Rajitha","bowler","-","pace",79),
    makePlayer("Dushmantha Chameera","bowler","-","pace",83),
    makePlayer("Avishka Fernando","batsman","aggressor","pace",78),
    makePlayer("Jeffrey Vandersay","bowler","-","spin",74),
    makePlayer("Lahiru Kumara","bowler","-","pace",78)
  ],
  ENG: [
    makePlayer("Jos Buttler","batsman","aggressor","pace",92),
    makePlayer("Jonny Bairstow","batsman","aggressor","pace",88),
    makePlayer("Joe Root","batsman","anchor","pace",93),
    makePlayer("Harry Brook","batsman","aggressor","pace",87),
    makePlayer("Ben Duckett","batsman","anchor","pace",83),
    makePlayer("Ben Stokes","allrounder","aggressor","pace",92),
    makePlayer("Liam Livingstone","allrounder","aggressor","spin",86),
    makePlayer("Moeen Ali","allrounder","anchor","spin",83),
    makePlayer("Jofra Archer","bowler","-","pace",91),
    makePlayer("Mark Wood","bowler","-","pace",89),
    makePlayer("Chris Woakes","allrounder","anchor","pace",84),
    makePlayer("Adil Rashid","bowler","-","spin",85),
    makePlayer("Sam Curran","allrounder","aggressor","pace",83),
    makePlayer("Reece Topley","bowler","-","pace",79),
    makePlayer("Phil Salt","batsman","aggressor","pace",84)
  ]
};

const LEGENDS_BY_TEAM = {
  IND: [
    makeLegend("Sachin Tendulkar","batsman","anchor","pace",99, 1200, 700),
    makeLegend("MS Dhoni","batsman","anchor","spin",96, 1000, 550),
    makeLegend("Yuvraj Singh","allrounder","aggressor","spin",95, 950, 500),
    makeLegend("Sourav Ganguly","batsman","anchor","pace",94, 900, 450),
    makeLegend("Zaheer Khan","bowler","-","pace",92, 850, 420)
  ],
  NZ: [
    makeLegend("Brendon McCullum","batsman","aggressor","pace",96, 1100, 650),
    makeLegend("Ross Taylor","batsman","anchor","pace",95, 980, 540),
    makeLegend("Daniel Vettori","allrounder","anchor","spin",94, 920, 500),
    makeLegend("Stephen Fleming","batsman","anchor","pace",93, 860, 460),
    makeLegend("Shane Bond","bowler","-","pace",95, 1020, 560)
  ],
  SA: [
    makeLegend("AB de Villiers","batsman","aggressor","pace",99, 1300, 750),
    makeLegend("Jacques Kallis","allrounder","anchor","pace",98, 1250, 720),
    makeLegend("Graeme Smith","batsman","anchor","pace",94, 930, 490),
    makeLegend("Dale Steyn","bowler","-","pace",97, 1180, 670),
    makeLegend("Hashim Amla","batsman","anchor","pace",95, 980, 540)
  ],
  AUS: [
    makeLegend("Ricky Ponting","batsman","anchor","pace",98, 1250, 720),
    makeLegend("Adam Gilchrist","batsman","aggressor","pace",97, 1150, 650),
    makeLegend("Shane Warne","bowler","-","spin",98, 1220, 700),
    makeLegend("Brett Lee","bowler","-","pace",95, 980, 560),
    makeLegend("Michael Hussey","batsman","anchor","pace",94, 900, 480)
  ],
  AFG: [
    makeLegend("Mohammad Shahzad","batsman","aggressor","pace",89, 700, 320),
    makeLegend("Asghar Afghan","batsman","anchor","pace",86, 620, 280),
    makeLegend("Samiullah Shinwari","allrounder","aggressor","spin",85, 580, 260),
    makeLegend("Dawlat Zadran","bowler","-","pace",84, 540, 240),
    makeLegend("Shapoor Zadran","bowler","-","pace",83, 500, 220)
  ],
  PAK: [
    makeLegend("Wasim Akram","bowler","-","pace",99, 1300, 760),
    makeLegend("Waqar Younis","bowler","-","pace",97, 1180, 690),
    makeLegend("Saeed Anwar","batsman","anchor","pace",95, 980, 540),
    makeLegend("Inzamam-ul-Haq","batsman","anchor","spin",95, 960, 520),
    makeLegend("Shahid Afridi","allrounder","aggressor","spin",96, 1100, 640)
  ],
  ZIM: [
    makeLegend("Andy Flower","batsman","anchor","pace",94, 900, 450),
    makeLegend("Heath Streak","allrounder","anchor","pace",92, 820, 400),
    makeLegend("Brendan Taylor","batsman","anchor","pace",90, 760, 350),
    makeLegend("Tatenda Taibu","batsman","anchor","spin",87, 620, 280),
    makeLegend("Neil Johnson","allrounder","aggressor","pace",88, 670, 300)
  ],
  BAN: [
    makeLegend("Mashrafe Mortaza","bowler","-","pace",91, 800, 380),
    makeLegend("Habibul Bashar","batsman","anchor","pace",86, 580, 260),
    makeLegend("Tamim Iqbal Prime","batsman","aggressor","pace",92, 860, 420),
    makeLegend("Mohammad Ashraful","batsman","aggressor","spin",88, 640, 300),
    makeLegend("Abdur Razzak","bowler","-","spin",85, 520, 230)
  ],
  SL: [
    makeLegend("Kumar Sangakkara","batsman","anchor","pace",98, 1220, 700),
    makeLegend("Mahela Jayawardene","batsman","anchor","spin",97, 1160, 660),
    makeLegend("Lasith Malinga","bowler","-","pace",97, 1180, 680),
    makeLegend("Sanath Jayasuriya","allrounder","aggressor","pace",96, 1110, 620),
    makeLegend("Muttiah Muralitharan","bowler","-","spin",99, 1320, 780)
  ],
  ENG: [
    makeLegend("Andrew Flintoff","allrounder","aggressor","pace",96, 1090, 620),
    makeLegend("Kevin Pietersen","batsman","aggressor","spin",96, 1080, 610),
    makeLegend("Alastair Cook","batsman","anchor","pace",94, 900, 470),
    makeLegend("Eoin Morgan","batsman","aggressor","spin",93, 860, 430),
    makeLegend("James Anderson","bowler","-","pace",95, 980, 550)
  ]
};

function makePlayer(name, role, battingType, preferredAgainst, rating){
  const recentForm = rand(55, 100);
  const base = { name, role, battingType, preferredAgainst, rating, recentForm, isLegend: false };

  if(role === "batsman"){
    return {
      ...base,
      matches: rand(40,150),
      runs: rand(900,6500),
      batAvg: oneDec(randFloat(24,58)),
      strikeRate: oneDec(randFloat(72,108)),
      hundreds: rand(0,22),
      fifties: rand(3,40),
      highestScore: rand(70,190)
    };
  }

  if(role === "bowler"){
    return {
      ...base,
      matches: rand(30,130),
      wickets: rand(35,220),
      bestBowl: `${rand(3,7)}/${rand(12,48)}`
    };
  }

  return {
    ...base,
    matches: rand(35,140),
    runs: rand(500,3500),
    batAvg: oneDec(randFloat(20,42)),
    strikeRate: oneDec(randFloat(78,112)),
    hundreds: rand(0,8),
    fifties: rand(2,24),
    highestScore: rand(45,145),
    wickets: rand(20,140),
    bestBowl: `${rand(2,6)}/${rand(15,52)}`
  };
}

function makeLegend(name, role, battingType, preferredAgainst, rating, unlockCoins, unlockXp){
  const player = makePlayer(name, role, battingType, preferredAgainst, rating);
  return {
    ...player,
    recentForm: 98,
    isLegend: true,
    unlockCoins,
    unlockXp
  };
}

function rand(min,max){ return Math.floor(Math.random() * (max - min + 1)) + min; }
function randFloat(min,max){ return Math.random() * (max - min) + min; }
function oneDec(n){ return Number(n.toFixed(1)); }
