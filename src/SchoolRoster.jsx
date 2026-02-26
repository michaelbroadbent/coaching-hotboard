import React, { useState, useMemo, useRef, useEffect } from 'react';

// ─── ESPN Logo Mapping ──────────────────────────────────────────────
const TEAM_LOGOS = {
  // FBS Teams
  "air force falcons": "https://a.espncdn.com/i/teamlogos/ncaa/500/2005.png",
  "akron zips": "https://a.espncdn.com/i/teamlogos/ncaa/500/2006.png",
  "alabama crimson tide": "https://a.espncdn.com/i/teamlogos/ncaa/500/333.png",
  "appalachian state mountaineers": "https://a.espncdn.com/i/teamlogos/ncaa/500/2026.png",
  "arizona state sun devils": "https://a.espncdn.com/i/teamlogos/ncaa/500/9.png",
  "arizona wildcats": "https://a.espncdn.com/i/teamlogos/ncaa/500/12.png",
  "arkansas razorbacks": "https://a.espncdn.com/i/teamlogos/ncaa/500/8.png",
  "arkansas state red wolves": "https://a.espncdn.com/i/teamlogos/ncaa/500/2032.png",
  "army black knights": "https://a.espncdn.com/i/teamlogos/ncaa/500/349.png",
  "auburn tigers": "https://a.espncdn.com/i/teamlogos/ncaa/500/2.png",
  "ball state cardinals": "https://a.espncdn.com/i/teamlogos/ncaa/500/2050.png",
  "baylor bears": "https://a.espncdn.com/i/teamlogos/ncaa/500/239.png",
  "boise state broncos": "https://a.espncdn.com/i/teamlogos/ncaa/500/68.png",
  "boston college eagles": "https://a.espncdn.com/i/teamlogos/ncaa/500/103.png",
  "bowling green falcons": "https://a.espncdn.com/i/teamlogos/ncaa/500/189.png",
  "buffalo bulls": "https://a.espncdn.com/i/teamlogos/ncaa/500/2084.png",
  "byu cougars": "https://a.espncdn.com/i/teamlogos/ncaa/500/252.png",
  "cal golden bears": "https://a.espncdn.com/i/teamlogos/ncaa/500/25.png",
  "central michigan chippewas": "https://a.espncdn.com/i/teamlogos/ncaa/500/2117.png",
  "charlotte 49ers": "https://a.espncdn.com/i/teamlogos/ncaa/500/2429.png",
  "cincinnati bearcats": "https://a.espncdn.com/i/teamlogos/ncaa/500/2132.png",
  "clemson tigers": "https://a.espncdn.com/i/teamlogos/ncaa/500/228.png",
  "coastal carolina chanticleers": "https://a.espncdn.com/i/teamlogos/ncaa/500/324.png",
  "colorado buffaloes": "https://a.espncdn.com/i/teamlogos/ncaa/500/38.png",
  "colorado state rams": "https://a.espncdn.com/i/teamlogos/ncaa/500/36.png",
  "connecticut huskies": "https://a.espncdn.com/i/teamlogos/ncaa/500/41.png",
  "duke blue devils": "https://a.espncdn.com/i/teamlogos/ncaa/500/150.png",
  "east carolina pirates": "https://a.espncdn.com/i/teamlogos/ncaa/500/151.png",
  "eastern michigan eagles": "https://a.espncdn.com/i/teamlogos/ncaa/500/2199.png",
  "fiu panthers": "https://a.espncdn.com/i/teamlogos/ncaa/500/2229.png",
  "florida atlantic owls": "https://a.espncdn.com/i/teamlogos/ncaa/500/2226.png",
  "florida gators": "https://a.espncdn.com/i/teamlogos/ncaa/500/57.png",
  "florida state seminoles": "https://a.espncdn.com/i/teamlogos/ncaa/500/52.png",
  "fresno state bulldogs": "https://a.espncdn.com/i/teamlogos/ncaa/500/278.png",
  "georgia bulldogs": "https://a.espncdn.com/i/teamlogos/ncaa/500/61.png",
  "georgia southern eagles": "https://a.espncdn.com/i/teamlogos/ncaa/500/290.png",
  "georgia state panthers": "https://a.espncdn.com/i/teamlogos/ncaa/500/2247.png",
  "georgia tech yellow jackets": "https://a.espncdn.com/i/teamlogos/ncaa/500/59.png",
  "hawaii rainbow warriors": "https://a.espncdn.com/i/teamlogos/ncaa/500/62.png",
  "houston cougars": "https://a.espncdn.com/i/teamlogos/ncaa/500/248.png",
  "illinois fighting illini": "https://a.espncdn.com/i/teamlogos/ncaa/500/356.png",
  "indiana hoosiers": "https://a.espncdn.com/i/teamlogos/ncaa/500/84.png",
  "iowa hawkeyes": "https://a.espncdn.com/i/teamlogos/ncaa/500/2294.png",
  "iowa state cyclones": "https://a.espncdn.com/i/teamlogos/ncaa/500/66.png",
  "jacksonville state gamecocks": "https://a.espncdn.com/i/teamlogos/ncaa/500/55.png",
  "james madison dukes": "https://a.espncdn.com/i/teamlogos/ncaa/500/256.png",
  "kansas jayhawks": "https://a.espncdn.com/i/teamlogos/ncaa/500/2305.png",
  "kansas state wildcats": "https://a.espncdn.com/i/teamlogos/ncaa/500/2306.png",
  "kennesaw state owls": "https://a.espncdn.com/i/teamlogos/ncaa/500/338.png",
  "kent state golden flashes": "https://a.espncdn.com/i/teamlogos/ncaa/500/2309.png",
  "kentucky wildcats": "https://a.espncdn.com/i/teamlogos/ncaa/500/96.png",
  "liberty flames": "https://a.espncdn.com/i/teamlogos/ncaa/500/2335.png",
  "louisiana ragin cajuns": "https://a.espncdn.com/i/teamlogos/ncaa/500/309.png",
  "louisiana tech bulldogs": "https://a.espncdn.com/i/teamlogos/ncaa/500/2348.png",
  "louisiana-monroe warhawks": "https://a.espncdn.com/i/teamlogos/ncaa/500/2433.png",
  "louisville cardinals": "https://a.espncdn.com/i/teamlogos/ncaa/500/97.png",
  "lsu tigers": "https://a.espncdn.com/i/teamlogos/ncaa/500/99.png",
  "marshall thundering herd": "https://a.espncdn.com/i/teamlogos/ncaa/500/276.png",
  "maryland terrapins": "https://a.espncdn.com/i/teamlogos/ncaa/500/120.png",
  "memphis tigers": "https://a.espncdn.com/i/teamlogos/ncaa/500/235.png",
  "miami hurricanes": "https://a.espncdn.com/i/teamlogos/ncaa/500/2390.png",
  "miami oh redhawks": "https://a.espncdn.com/i/teamlogos/ncaa/500/193.png",
  "michigan state spartans": "https://a.espncdn.com/i/teamlogos/ncaa/500/127.png",
  "michigan wolverines": "https://a.espncdn.com/i/teamlogos/ncaa/500/130.png",
  "middle tennessee blue raiders": "https://a.espncdn.com/i/teamlogos/ncaa/500/2393.png",
  "minnesota golden gophers": "https://a.espncdn.com/i/teamlogos/ncaa/500/135.png",
  "mississippi state bulldogs": "https://a.espncdn.com/i/teamlogos/ncaa/500/344.png",
  "missouri state bears": "https://a.espncdn.com/i/teamlogos/ncaa/500/2623.png",
  "missouri tigers": "https://a.espncdn.com/i/teamlogos/ncaa/500/142.png",
  "navy midshipmen": "https://a.espncdn.com/i/teamlogos/ncaa/500/2426.png",
  "nc state wolfpack": "https://a.espncdn.com/i/teamlogos/ncaa/500/152.png",
  "nebraska cornhuskers": "https://a.espncdn.com/i/teamlogos/ncaa/500/158.png",
  "nevada wolf pack": "https://a.espncdn.com/i/teamlogos/ncaa/500/2440.png",
  "new mexico lobos": "https://a.espncdn.com/i/teamlogos/ncaa/500/167.png",
  "new mexico state aggies": "https://a.espncdn.com/i/teamlogos/ncaa/500/166.png",
  "north carolina tar heels": "https://a.espncdn.com/i/teamlogos/ncaa/500/153.png",
  "north texas mean green": "https://a.espncdn.com/i/teamlogos/ncaa/500/249.png",
  "northern illinois huskies": "https://a.espncdn.com/i/teamlogos/ncaa/500/2459.png",
  "northwestern wildcats": "https://a.espncdn.com/i/teamlogos/ncaa/500/77.png",
  "notre dame fighting irish": "https://a.espncdn.com/i/teamlogos/ncaa/500/87.png",
  "ohio bobcats": "https://a.espncdn.com/i/teamlogos/ncaa/500/195.png",
  "ohio state buckeyes": "https://a.espncdn.com/i/teamlogos/ncaa/500/194.png",
  "oklahoma sooners": "https://a.espncdn.com/i/teamlogos/ncaa/500/201.png",
  "oklahoma state cowboys": "https://a.espncdn.com/i/teamlogos/ncaa/500/197.png",
  "old dominion monarchs": "https://a.espncdn.com/i/teamlogos/ncaa/500/295.png",
  "ole miss rebels": "https://a.espncdn.com/i/teamlogos/ncaa/500/145.png",
  "oregon ducks": "https://a.espncdn.com/i/teamlogos/ncaa/500/2483.png",
  "oregon state beavers": "https://a.espncdn.com/i/teamlogos/ncaa/500/204.png",
  "penn state nittany lions": "https://a.espncdn.com/i/teamlogos/ncaa/500/213.png",
  "pittsburgh panthers": "https://a.espncdn.com/i/teamlogos/ncaa/500/221.png",
  "purdue boilermakers": "https://a.espncdn.com/i/teamlogos/ncaa/500/2509.png",
  "rice owls": "https://a.espncdn.com/i/teamlogos/ncaa/500/242.png",
  "rutgers scarlet knights": "https://a.espncdn.com/i/teamlogos/ncaa/500/164.png",
  "sam houston bearkats": "https://a.espncdn.com/i/teamlogos/ncaa/500/2534.png",
  "san diego state aztecs": "https://a.espncdn.com/i/teamlogos/ncaa/500/21.png",
  "san jose state spartans": "https://a.espncdn.com/i/teamlogos/ncaa/500/23.png",
  "smu mustangs": "https://a.espncdn.com/i/teamlogos/ncaa/500/2567.png",
  "south alabama jaguars": "https://a.espncdn.com/i/teamlogos/ncaa/500/6.png",
  "south carolina gamecocks": "https://a.espncdn.com/i/teamlogos/ncaa/500/2579.png",
  "south florida bulls": "https://a.espncdn.com/i/teamlogos/ncaa/500/58.png",
  "southern miss golden eagles": "https://a.espncdn.com/i/teamlogos/ncaa/500/2572.png",
  "stanford cardinal": "https://a.espncdn.com/i/teamlogos/ncaa/500/24.png",
  "syracuse orange": "https://a.espncdn.com/i/teamlogos/ncaa/500/183.png",
  "tcu horned frogs": "https://a.espncdn.com/i/teamlogos/ncaa/500/2628.png",
  "temple owls": "https://a.espncdn.com/i/teamlogos/ncaa/500/218.png",
  "tennessee volunteers": "https://a.espncdn.com/i/teamlogos/ncaa/500/2633.png",
  "texas am aggies": "https://a.espncdn.com/i/teamlogos/ncaa/500/245.png",
  "texas longhorns": "https://a.espncdn.com/i/teamlogos/ncaa/500/251.png",
  "texas state bobcats": "https://a.espncdn.com/i/teamlogos/ncaa/500/326.png",
  "texas tech red raiders": "https://a.espncdn.com/i/teamlogos/ncaa/500/2641.png",
  "toledo rockets": "https://a.espncdn.com/i/teamlogos/ncaa/500/2649.png",
  "troy trojans": "https://a.espncdn.com/i/teamlogos/ncaa/500/2653.png",
  "tulane green wave": "https://a.espncdn.com/i/teamlogos/ncaa/500/2655.png",
  "tulsa golden hurricane": "https://a.espncdn.com/i/teamlogos/ncaa/500/2657.png",
  "uab blazers": "https://a.espncdn.com/i/teamlogos/ncaa/500/5.png",
  "ucf knights": "https://a.espncdn.com/i/teamlogos/ncaa/500/2116.png",
  "ucla bruins": "https://a.espncdn.com/i/teamlogos/ncaa/500/26.png",
  "unlv rebels": "https://a.espncdn.com/i/teamlogos/ncaa/500/2439.png",
  "usc trojans": "https://a.espncdn.com/i/teamlogos/ncaa/500/30.png",
  "utah state aggies": "https://a.espncdn.com/i/teamlogos/ncaa/500/328.png",
  "utah utes": "https://a.espncdn.com/i/teamlogos/ncaa/500/254.png",
  "utep miners": "https://a.espncdn.com/i/teamlogos/ncaa/500/2638.png",
  "utsa roadrunners": "https://a.espncdn.com/i/teamlogos/ncaa/500/2636.png",
  "vanderbilt commodores": "https://a.espncdn.com/i/teamlogos/ncaa/500/238.png",
  "virginia cavaliers": "https://a.espncdn.com/i/teamlogos/ncaa/500/258.png",
  "virginia tech hokies": "https://a.espncdn.com/i/teamlogos/ncaa/500/259.png",
  "wake forest demon deacons": "https://a.espncdn.com/i/teamlogos/ncaa/500/154.png",
  "washington huskies": "https://a.espncdn.com/i/teamlogos/ncaa/500/264.png",
  "washington state cougars": "https://a.espncdn.com/i/teamlogos/ncaa/500/265.png",
  "west virginia mountaineers": "https://a.espncdn.com/i/teamlogos/ncaa/500/277.png",
  "western kentucky hilltoppers": "https://a.espncdn.com/i/teamlogos/ncaa/500/98.png",
  "western michigan broncos": "https://a.espncdn.com/i/teamlogos/ncaa/500/2711.png",
  "wisconsin badgers": "https://a.espncdn.com/i/teamlogos/ncaa/500/275.png",
  "wyoming cowboys": "https://a.espncdn.com/i/teamlogos/ncaa/500/2751.png",
  // NFL Teams
  "arizona cardinals": "https://a.espncdn.com/i/teamlogos/nfl/500/ari.png",
  "atlanta falcons": "https://a.espncdn.com/i/teamlogos/nfl/500/atl.png",
  "baltimore ravens": "https://a.espncdn.com/i/teamlogos/nfl/500/bal.png",
  "buffalo bills": "https://a.espncdn.com/i/teamlogos/nfl/500/buf.png",
  "carolina panthers": "https://a.espncdn.com/i/teamlogos/nfl/500/car.png",
  "chicago bears": "https://a.espncdn.com/i/teamlogos/nfl/500/chi.png",
  "cincinnati bengals": "https://a.espncdn.com/i/teamlogos/nfl/500/cin.png",
  "cleveland browns": "https://a.espncdn.com/i/teamlogos/nfl/500/cle.png",
  "dallas cowboys": "https://a.espncdn.com/i/teamlogos/nfl/500/dal.png",
  "denver broncos": "https://a.espncdn.com/i/teamlogos/nfl/500/den.png",
  "detroit lions": "https://a.espncdn.com/i/teamlogos/nfl/500/det.png",
  "green bay packers": "https://a.espncdn.com/i/teamlogos/nfl/500/gb.png",
  "houston texans": "https://a.espncdn.com/i/teamlogos/nfl/500/hou.png",
  "indianapolis colts": "https://a.espncdn.com/i/teamlogos/nfl/500/ind.png",
  "jacksonville jaguars": "https://a.espncdn.com/i/teamlogos/nfl/500/jax.png",
  "kansas city chiefs": "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png",
  "las vegas raiders": "https://a.espncdn.com/i/teamlogos/nfl/500/lv.png",
  "los angeles chargers": "https://a.espncdn.com/i/teamlogos/nfl/500/lac.png",
  "los angeles rams": "https://a.espncdn.com/i/teamlogos/nfl/500/lar.png",
  "miami dolphins": "https://a.espncdn.com/i/teamlogos/nfl/500/mia.png",
  "minnesota vikings": "https://a.espncdn.com/i/teamlogos/nfl/500/min.png",
  "new england patriots": "https://a.espncdn.com/i/teamlogos/nfl/500/ne.png",
  "new orleans saints": "https://a.espncdn.com/i/teamlogos/nfl/500/no.png",
  "new york giants": "https://a.espncdn.com/i/teamlogos/nfl/500/nyg.png",
  "new york jets": "https://a.espncdn.com/i/teamlogos/nfl/500/nyj.png",
  "philadelphia eagles": "https://a.espncdn.com/i/teamlogos/nfl/500/phi.png",
  "pittsburgh steelers": "https://a.espncdn.com/i/teamlogos/nfl/500/pit.png",
  "san francisco 49ers": "https://a.espncdn.com/i/teamlogos/nfl/500/sf.png",
  "seattle seahawks": "https://a.espncdn.com/i/teamlogos/nfl/500/sea.png",
  "tampa bay buccaneers": "https://a.espncdn.com/i/teamlogos/nfl/500/tb.png",
  "tennessee titans": "https://a.espncdn.com/i/teamlogos/nfl/500/ten.png",
  "washington commanders": "https://a.espncdn.com/i/teamlogos/nfl/500/wsh.png",
  // FCS Teams
  "abilene christian wildcats": "https://a.espncdn.com/i/teamlogos/ncaa/500/2000.png",
  "alabama am bulldogs": "https://a.espncdn.com/i/teamlogos/ncaa/500/2010.png",
  "alabama state hornets": "https://a.espncdn.com/i/teamlogos/ncaa/500/2011.png",
  "albany great danes": "https://a.espncdn.com/i/teamlogos/ncaa/500/399.png",
  "alcorn state braves": "https://a.espncdn.com/i/teamlogos/ncaa/500/2016.png",
  "bethune-cookman wildcats": "https://a.espncdn.com/i/teamlogos/ncaa/500/2065.png",
  "brown bears": "https://a.espncdn.com/i/teamlogos/ncaa/500/225.png",
  "bucknell bison": "https://a.espncdn.com/i/teamlogos/ncaa/500/2083.png",
  "butler bulldogs": "https://a.espncdn.com/i/teamlogos/ncaa/500/2086.png",
  "cal poly mustangs": "https://a.espncdn.com/i/teamlogos/ncaa/500/13.png",
  "campbell fighting camels": "https://a.espncdn.com/i/teamlogos/ncaa/500/2097.png",
  "central arkansas bears": "https://a.espncdn.com/i/teamlogos/ncaa/500/2110.png",
  "central connecticut blue devils": "https://a.espncdn.com/i/teamlogos/ncaa/500/2115.png",
  "charleston southern buccaneers": "https://a.espncdn.com/i/teamlogos/ncaa/500/2127.png",
  "chattanooga mocs": "https://a.espncdn.com/i/teamlogos/ncaa/500/236.png",
  "colgate raiders": "https://a.espncdn.com/i/teamlogos/ncaa/500/2142.png",
  "columbia lions": "https://a.espncdn.com/i/teamlogos/ncaa/500/171.png",
  "cornell big red": "https://a.espncdn.com/i/teamlogos/ncaa/500/172.png",
  "dartmouth big green": "https://a.espncdn.com/i/teamlogos/ncaa/500/159.png",
  "davidson wildcats": "https://a.espncdn.com/i/teamlogos/ncaa/500/2166.png",
  "dayton flyers": "https://a.espncdn.com/i/teamlogos/ncaa/500/2168.png",
  "delaware blue hens": "https://a.espncdn.com/i/teamlogos/ncaa/500/48.png",
  "delaware state hornets": "https://a.espncdn.com/i/teamlogos/ncaa/500/2169.png",
  "drake bulldogs": "https://a.espncdn.com/i/teamlogos/ncaa/500/2181.png",
  "duquesne dukes": "https://a.espncdn.com/i/teamlogos/ncaa/500/2184.png",
  "east tennessee state buccaneers": "https://a.espncdn.com/i/teamlogos/ncaa/500/2198.png",
  "eastern illinois panthers": "https://a.espncdn.com/i/teamlogos/ncaa/500/2197.png",
  "eastern kentucky colonels": "https://a.espncdn.com/i/teamlogos/ncaa/500/2198.png",
  "eastern washington eagles": "https://a.espncdn.com/i/teamlogos/ncaa/500/331.png",
  "elon phoenix": "https://a.espncdn.com/i/teamlogos/ncaa/500/2210.png",
  "florida am rattlers": "https://a.espncdn.com/i/teamlogos/ncaa/500/50.png",
  "fordham rams": "https://a.espncdn.com/i/teamlogos/ncaa/500/2230.png",
  "furman paladins": "https://a.espncdn.com/i/teamlogos/ncaa/500/231.png",
  "georgetown hoyas": "https://a.espncdn.com/i/teamlogos/ncaa/500/46.png",
  "grambling state tigers": "https://a.espncdn.com/i/teamlogos/ncaa/500/2755.png",
  "hampton pirates": "https://a.espncdn.com/i/teamlogos/ncaa/500/2261.png",
  "harvard crimson": "https://a.espncdn.com/i/teamlogos/ncaa/500/108.png",
  "holy cross crusaders": "https://a.espncdn.com/i/teamlogos/ncaa/500/107.png",
  "houston christian huskies": "https://a.espncdn.com/i/teamlogos/ncaa/500/2277.png",
  "howard bison": "https://a.espncdn.com/i/teamlogos/ncaa/500/47.png",
  "idaho state bengals": "https://a.espncdn.com/i/teamlogos/ncaa/500/304.png",
  "idaho vandals": "https://a.espncdn.com/i/teamlogos/ncaa/500/70.png",
  "illinois state redbirds": "https://a.espncdn.com/i/teamlogos/ncaa/500/2287.png",
  "incarnate word cardinals": "https://a.espncdn.com/i/teamlogos/ncaa/500/2916.png",
  "indiana state sycamores": "https://a.espncdn.com/i/teamlogos/ncaa/500/282.png",
  "jackson state tigers": "https://a.espncdn.com/i/teamlogos/ncaa/500/2296.png",
  "lafayette leopards": "https://a.espncdn.com/i/teamlogos/ncaa/500/322.png",
  "lamar cardinals": "https://a.espncdn.com/i/teamlogos/ncaa/500/2320.png",
  "lehigh mountain hawks": "https://a.espncdn.com/i/teamlogos/ncaa/500/2329.png",
  "lindenwood lions": "https://a.espncdn.com/i/teamlogos/ncaa/500/2815.png",
  "maine black bears": "https://a.espncdn.com/i/teamlogos/ncaa/500/311.png",
  "mcneese cowboys": "https://a.espncdn.com/i/teamlogos/ncaa/500/2377.png",
  "mercer bears": "https://a.espncdn.com/i/teamlogos/ncaa/500/2382.png",
  "mississippi valley state delta devils": "https://a.espncdn.com/i/teamlogos/ncaa/500/2400.png",
  "monmouth hawks": "https://a.espncdn.com/i/teamlogos/ncaa/500/2405.png",
  "montana grizzlies": "https://a.espncdn.com/i/teamlogos/ncaa/500/149.png",
  "montana state bobcats": "https://a.espncdn.com/i/teamlogos/ncaa/500/147.png",
  "morehead state eagles": "https://a.espncdn.com/i/teamlogos/ncaa/500/2413.png",
  "morgan state bears": "https://a.espncdn.com/i/teamlogos/ncaa/500/2415.png",
  "murray state racers": "https://a.espncdn.com/i/teamlogos/ncaa/500/93.png",
  "new hampshire wildcats": "https://a.espncdn.com/i/teamlogos/ncaa/500/160.png",
  "nicholls colonels": "https://a.espncdn.com/i/teamlogos/ncaa/500/2447.png",
  "norfolk state spartans": "https://a.espncdn.com/i/teamlogos/ncaa/500/2450.png",
  "north carolina at greensboro spartans": "https://a.espncdn.com/i/teamlogos/ncaa/500/2451.png",
  "north carolina central eagles": "https://a.espncdn.com/i/teamlogos/ncaa/500/2428.png",
  "north dakota fighting hawks": "https://a.espncdn.com/i/teamlogos/ncaa/500/155.png",
  "north dakota state bison": "https://a.espncdn.com/i/teamlogos/ncaa/500/2449.png",
  "northeastern huskies": "https://a.espncdn.com/i/teamlogos/ncaa/500/111.png",
  "northern arizona lumberjacks": "https://a.espncdn.com/i/teamlogos/ncaa/500/2464.png",
  "northern colorado bears": "https://a.espncdn.com/i/teamlogos/ncaa/500/2458.png",
  "northern iowa panthers": "https://a.espncdn.com/i/teamlogos/ncaa/500/2460.png",
  "northwestern state demons": "https://a.espncdn.com/i/teamlogos/ncaa/500/2466.png",
  "penn quakers": "https://a.espncdn.com/i/teamlogos/ncaa/500/219.png",
  "portland state vikings": "https://a.espncdn.com/i/teamlogos/ncaa/500/2501.png",
  "prairie view am panthers": "https://a.espncdn.com/i/teamlogos/ncaa/500/2504.png",
  "presbyterian blue hose": "https://a.espncdn.com/i/teamlogos/ncaa/500/2506.png",
  "princeton tigers": "https://a.espncdn.com/i/teamlogos/ncaa/500/163.png",
  "rhode island rams": "https://a.espncdn.com/i/teamlogos/ncaa/500/227.png",
  "richmond spiders": "https://a.espncdn.com/i/teamlogos/ncaa/500/257.png",
  "robert morris colonials": "https://a.espncdn.com/i/teamlogos/ncaa/500/2523.png",
  "sacramento state hornets": "https://a.espncdn.com/i/teamlogos/ncaa/500/16.png",
  "sacred heart pioneers": "https://a.espncdn.com/i/teamlogos/ncaa/500/2529.png",
  "saint francis red flash": "https://a.espncdn.com/i/teamlogos/ncaa/500/2598.png",
  "samford bulldogs": "https://a.espncdn.com/i/teamlogos/ncaa/500/2535.png",
  "san diego toreros": "https://a.espncdn.com/i/teamlogos/ncaa/500/301.png",
  "south carolina state bulldogs": "https://a.espncdn.com/i/teamlogos/ncaa/500/2569.png",
  "south dakota coyotes": "https://a.espncdn.com/i/teamlogos/ncaa/500/233.png",
  "south dakota state jackrabbits": "https://a.espncdn.com/i/teamlogos/ncaa/500/2571.png",
  "southeast missouri state redhawks": "https://a.espncdn.com/i/teamlogos/ncaa/500/2546.png",
  "southeastern louisiana lions": "https://a.espncdn.com/i/teamlogos/ncaa/500/2545.png",
  "southern illinois salukis": "https://a.espncdn.com/i/teamlogos/ncaa/500/2565.png",
  "southern jaguars": "https://a.espncdn.com/i/teamlogos/ncaa/500/2582.png",
  "southern utah thunderbirds": "https://a.espncdn.com/i/teamlogos/ncaa/500/253.png",
  "st thomas tommies": "https://a.espncdn.com/i/teamlogos/ncaa/500/2900.png",
  "stanford cardinal": "https://a.espncdn.com/i/teamlogos/ncaa/500/24.png",
  "stephen f austin lumberjacks": "https://a.espncdn.com/i/teamlogos/ncaa/500/2617.png",
  "stetson hatters": "https://a.espncdn.com/i/teamlogos/ncaa/500/56.png",
  "stonehill skyhawks": "https://a.espncdn.com/i/teamlogos/ncaa/500/2900.png",
  "stony brook seawolves": "https://a.espncdn.com/i/teamlogos/ncaa/500/2619.png",
  "tarleton state texans": "https://a.espncdn.com/i/teamlogos/ncaa/500/2624.png",
  "tennessee state tigers": "https://a.espncdn.com/i/teamlogos/ncaa/500/2634.png",
  "tennessee tech golden eagles": "https://a.espncdn.com/i/teamlogos/ncaa/500/2635.png",
  "texas am commerce lions": "https://a.espncdn.com/i/teamlogos/ncaa/500/2837.png",
  "texas southern tigers": "https://a.espncdn.com/i/teamlogos/ncaa/500/2640.png",
  "the citadel bulldogs": "https://a.espncdn.com/i/teamlogos/ncaa/500/2643.png",
  "towson tigers": "https://a.espncdn.com/i/teamlogos/ncaa/500/119.png",
  "uc davis aggies": "https://a.espncdn.com/i/teamlogos/ncaa/500/302.png",
  "ut martin skyhawks": "https://a.espncdn.com/i/teamlogos/ncaa/500/2630.png",
  "valparaiso beacons": "https://a.espncdn.com/i/teamlogos/ncaa/500/2674.png",
  "villanova wildcats": "https://a.espncdn.com/i/teamlogos/ncaa/500/222.png",
  "vmi keydets": "https://a.espncdn.com/i/teamlogos/ncaa/500/2678.png",
  "wagner seahawks": "https://a.espncdn.com/i/teamlogos/ncaa/500/2681.png",
  "weber state wildcats": "https://a.espncdn.com/i/teamlogos/ncaa/500/2692.png",
  "western carolina catamounts": "https://a.espncdn.com/i/teamlogos/ncaa/500/2717.png",
  "western illinois leathernecks": "https://a.espncdn.com/i/teamlogos/ncaa/500/2710.png",
  "william mary tribe": "https://a.espncdn.com/i/teamlogos/ncaa/500/2729.png",
  "wofford terriers": "https://a.espncdn.com/i/teamlogos/ncaa/500/2747.png",
  "yale bulldogs": "https://a.espncdn.com/i/teamlogos/ncaa/500/43.png",
  "youngstown state penguins": "https://a.espncdn.com/i/teamlogos/ncaa/500/2754.png",
};

// Extended aliases for matching database names → logo keys
const TEAM_ALIASES = {
  "alabama": "alabama crimson tide",
  "appalachian state": "appalachian state mountaineers",
  "arizona state": "arizona state sun devils",
  "arizona": "arizona wildcats",
  "arkansas": "arkansas razorbacks",
  "arkansas state": "arkansas state red wolves",
  "army": "army black knights",
  "auburn": "auburn tigers",
  "ball state": "ball state cardinals",
  "baylor": "baylor bears",
  "boise state": "boise state broncos",
  "boston college": "boston college eagles",
  "bowling green": "bowling green falcons",
  "buffalo": "buffalo bulls",
  "byu": "byu cougars",
  "brigham young": "byu cougars",
  "cal": "cal golden bears",
  "california": "cal golden bears",
  "central michigan": "central michigan chippewas",
  "charlotte": "charlotte 49ers",
  "cincinnati": "cincinnati bearcats",
  "clemson": "clemson tigers",
  "coastal carolina": "coastal carolina chanticleers",
  "colorado": "colorado buffaloes",
  "colorado state": "colorado state rams",
  "connecticut": "connecticut huskies",
  "uconn": "connecticut huskies",
  "duke": "duke blue devils",
  "east carolina": "east carolina pirates",
  "eastern michigan": "eastern michigan eagles",
  "fiu": "fiu panthers",
  "florida international": "fiu panthers",
  "florida atlantic": "florida atlantic owls",
  "fau": "florida atlantic owls",
  "florida": "florida gators",
  "florida state": "florida state seminoles",
  "fresno state": "fresno state bulldogs",
  "georgia": "georgia bulldogs",
  "georgia southern": "georgia southern eagles",
  "georgia state": "georgia state panthers",
  "georgia tech": "georgia tech yellow jackets",
  "hawaii": "hawaii rainbow warriors",
  "hawai'i": "hawaii rainbow warriors",
  "houston": "houston cougars",
  "illinois": "illinois fighting illini",
  "indiana": "indiana hoosiers",
  "iowa": "iowa hawkeyes",
  "iowa state": "iowa state cyclones",
  "jacksonville state": "jacksonville state gamecocks",
  "james madison": "james madison dukes",
  "kansas": "kansas jayhawks",
  "kansas state": "kansas state wildcats",
  "kennesaw state": "kennesaw state owls",
  "kent state": "kent state golden flashes",
  "kentucky": "kentucky wildcats",
  "liberty": "liberty flames",
  "louisiana": "louisiana ragin cajuns",
  "louisiana-lafayette": "louisiana ragin cajuns",
  "ul lafayette": "louisiana ragin cajuns",
  "louisiana tech": "louisiana tech bulldogs",
  "louisiana-monroe": "louisiana-monroe warhawks",
  "ulm": "louisiana-monroe warhawks",
  "ul monroe": "louisiana-monroe warhawks",
  "louisville": "louisville cardinals",
  "lsu": "lsu tigers",
  "marshall": "marshall thundering herd",
  "maryland": "maryland terrapins",
  "memphis": "memphis tigers",
  "miami": "miami hurricanes",
  "miami (fl)": "miami hurricanes",
  "miami (oh)": "miami oh redhawks",
  "miami (ohio)": "miami oh redhawks",
  "michigan state": "michigan state spartans",
  "michigan": "michigan wolverines",
  "middle tennessee": "middle tennessee blue raiders",
  "minnesota": "minnesota golden gophers",
  "mississippi state": "mississippi state bulldogs",
  "missouri": "missouri tigers",
  "missouri state": "missouri state bears",
  "navy": "navy midshipmen",
  "nc state": "nc state wolfpack",
  "north carolina state": "nc state wolfpack",
  "nebraska": "nebraska cornhuskers",
  "nevada": "nevada wolf pack",
  "new mexico": "new mexico lobos",
  "new mexico state": "new mexico state aggies",
  "north carolina": "north carolina tar heels",
  "unc": "north carolina tar heels",
  "north texas": "north texas mean green",
  "northern illinois": "northern illinois huskies",
  "niu": "northern illinois huskies",
  "northwestern": "northwestern wildcats",
  "notre dame": "notre dame fighting irish",
  "ohio": "ohio bobcats",
  "ohio state": "ohio state buckeyes",
  "oklahoma": "oklahoma sooners",
  "oklahoma state": "oklahoma state cowboys",
  "old dominion": "old dominion monarchs",
  "ole miss": "ole miss rebels",
  "mississippi": "ole miss rebels",
  "oregon": "oregon ducks",
  "oregon state": "oregon state beavers",
  "penn state": "penn state nittany lions",
  "pittsburgh": "pittsburgh panthers",
  "pitt": "pittsburgh panthers",
  "purdue": "purdue boilermakers",
  "rice": "rice owls",
  "rutgers": "rutgers scarlet knights",
  "sam houston": "sam houston bearkats",
  "sam houston state": "sam houston bearkats",
  "san diego state": "san diego state aztecs",
  "sdsu": "san diego state aztecs",
  "san jose state": "san jose state spartans",
  "sjsu": "san jose state spartans",
  "smu": "smu mustangs",
  "southern methodist": "smu mustangs",
  "south alabama": "south alabama jaguars",
  "south carolina": "south carolina gamecocks",
  "south florida": "south florida bulls",
  "usf": "south florida bulls",
  "southern miss": "southern miss golden eagles",
  "southern mississippi": "southern miss golden eagles",
  "stanford": "stanford cardinal",
  "syracuse": "syracuse orange",
  "tcu": "tcu horned frogs",
  "temple": "temple owls",
  "tennessee": "tennessee volunteers",
  "texas a&m": "texas am aggies",
  "texas a & m": "texas am aggies",
  "texas": "texas longhorns",
  "texas state": "texas state bobcats",
  "texas tech": "texas tech red raiders",
  "toledo": "toledo rockets",
  "troy": "troy trojans",
  "tulane": "tulane green wave",
  "tulsa": "tulsa golden hurricane",
  "uab": "uab blazers",
  "ucf": "ucf knights",
  "central florida": "ucf knights",
  "ucla": "ucla bruins",
  "unlv": "unlv rebels",
  "usc": "usc trojans",
  "southern california": "usc trojans",
  "utah state": "utah state aggies",
  "utah": "utah utes",
  "utep": "utep miners",
  "utsa": "utsa roadrunners",
  "vanderbilt": "vanderbilt commodores",
  "virginia": "virginia cavaliers",
  "virginia tech": "virginia tech hokies",
  "wake forest": "wake forest demon deacons",
  "washington": "washington huskies",
  "washington state": "washington state cougars",
  "west virginia": "west virginia mountaineers",
  "western kentucky": "western kentucky hilltoppers",
  "wku": "western kentucky hilltoppers",
  "western michigan": "western michigan broncos",
  "wisconsin": "wisconsin badgers",
  "wyoming": "wyoming cowboys",
  // NFL aliases
  "cardinals": "arizona cardinals",
  "falcons": "atlanta falcons",
  "ravens": "baltimore ravens",
  "bills": "buffalo bills",
  "panthers": "carolina panthers",
  "bears": "chicago bears",
  "bengals": "cincinnati bengals",
  "browns": "cleveland browns",
  "cowboys": "dallas cowboys",
  "broncos": "denver broncos",
  "lions": "detroit lions",
  "packers": "green bay packers",
  "texans": "houston texans",
  "colts": "indianapolis colts",
  "jaguars": "jacksonville jaguars",
  "chiefs": "kansas city chiefs",
  "raiders": "las vegas raiders",
  "oakland raiders": "las vegas raiders",
  "chargers": "los angeles chargers",
  "san diego chargers": "los angeles chargers",
  "rams": "los angeles rams",
  "st. louis rams": "los angeles rams",
  "dolphins": "miami dolphins",
  "vikings": "minnesota vikings",
  "patriots": "new england patriots",
  "saints": "new orleans saints",
  "giants": "new york giants",
  "jets": "new york jets",
  "eagles": "philadelphia eagles",
  "steelers": "pittsburgh steelers",
  "49ers": "san francisco 49ers",
  "seahawks": "seattle seahawks",
  "buccaneers": "tampa bay buccaneers",
  "bucs": "tampa bay buccaneers",
  "titans": "tennessee titans",
  "commanders": "washington commanders",
  "redskins": "washington commanders",
  "washington football team": "washington commanders",
  // FCS aliases
  "north dakota state": "north dakota state bison",
  "ndsu": "north dakota state bison",
  "south dakota state": "south dakota state jackrabbits",
  "sdsu": "south dakota state jackrabbits",
  "montana": "montana grizzlies",
  "montana state": "montana state bobcats",
  "eastern washington": "eastern washington eagles",
  "northern iowa": "northern iowa panthers",
  "uni": "northern iowa panthers",
  "illinois state": "illinois state redbirds",
  "southern illinois": "southern illinois salukis",
  "siu": "southern illinois salukis",
  "youngstown state": "youngstown state penguins",
  "villanova": "villanova wildcats",
  "richmond": "richmond spiders",
  "william & mary": "william mary tribe",
  "william and mary": "william mary tribe",
  "delaware": "delaware blue hens",
  "towson": "towson tigers",
  "stony brook": "stony brook seawolves",
  "maine": "maine black bears",
  "new hampshire": "new hampshire wildcats",
  "rhode island": "rhode island rams",
  "yale": "yale bulldogs",
  "harvard": "harvard crimson",
  "princeton": "princeton tigers",
  "dartmouth": "dartmouth big green",
  "columbia": "columbia lions",
  "cornell": "cornell big red",
  "penn": "penn quakers",
  "brown": "brown bears",
  "holy cross": "holy cross crusaders",
  "colgate": "colgate raiders",
  "lehigh": "lehigh mountain hawks",
  "lafayette": "lafayette leopards",
  "bucknell": "bucknell bison",
  "fordham": "fordham rams",
  "georgetown": "georgetown hoyas",
  "furman": "furman paladins",
  "chattanooga": "chattanooga mocs",
  "samford": "samford bulldogs",
  "mercer": "mercer bears",
  "wofford": "wofford terriers",
  "western carolina": "western carolina catamounts",
  "the citadel": "the citadel bulldogs",
  "citadel": "the citadel bulldogs",
  "vmi": "vmi keydets",
  "elon": "elon phoenix",
  "jackson state": "jackson state tigers",
  "grambling": "grambling state tigers",
  "grambling state": "grambling state tigers",
  "prairie view a&m": "prairie view am panthers",
  "prairie view": "prairie view am panthers",
  "southern": "southern jaguars",
  "southern university": "southern jaguars",
  "alcorn state": "alcorn state braves",
  "alabama a&m": "alabama am bulldogs",
  "alabama state": "alabama state hornets",
  "florida a&m": "florida am rattlers",
  "famu": "florida am rattlers",
  "bethune-cookman": "bethune-cookman wildcats",
  "norfolk state": "norfolk state spartans",
  "morgan state": "morgan state bears",
  "howard": "howard bison",
  "hampton": "hampton pirates",
  "delaware state": "delaware state hornets",
  "north carolina central": "north carolina central eagles",
  "south carolina state": "south carolina state bulldogs",
  "texas southern": "texas southern tigers",
  "tennessee state": "tennessee state tigers",
  "murray state": "murray state racers",
  "southeast missouri": "southeast missouri state redhawks",
  "southeast missouri state": "southeast missouri state redhawks",
  "semo": "southeast missouri state redhawks",
  "tennessee tech": "tennessee tech golden eagles",
  "eastern kentucky": "eastern kentucky colonels",
  "eku": "eastern kentucky colonels",
  "morehead state": "morehead state eagles",
  "eastern illinois": "eastern illinois panthers",
  "eiu": "eastern illinois panthers",
  "weber state": "weber state wildcats",
  "northern arizona": "northern arizona lumberjacks",
  "nau": "northern arizona lumberjacks",
  "southern utah": "southern utah thunderbirds",
  "suu": "southern utah thunderbirds",
  "idaho state": "idaho state bengals",
  "idaho": "idaho vandals",
  "portland state": "portland state vikings",
  "cal poly": "cal poly mustangs",
  "uc davis": "uc davis aggies",
  "sacramento state": "sacramento state hornets",
  "sac state": "sacramento state hornets",
  "northern colorado": "northern colorado bears",
  "north dakota": "north dakota fighting hawks",
  "und": "north dakota fighting hawks",
  "south dakota": "south dakota coyotes",
  "western illinois": "western illinois leathernecks",
  "indiana state": "indiana state sycamores",
  "nicholls": "nicholls colonels",
  "nicholls state": "nicholls colonels",
  "southeastern louisiana": "southeastern louisiana lions",
  "northwestern state": "northwestern state demons",
  "mcneese": "mcneese cowboys",
  "mcneese state": "mcneese cowboys",
  "lamar": "lamar cardinals",
  "central arkansas": "central arkansas bears",
  "uca": "central arkansas bears",
  "incarnate word": "incarnate word cardinals",
  "uiw": "incarnate word cardinals",
  "stephen f. austin": "stephen f austin lumberjacks",
  "sfa": "stephen f austin lumberjacks",
  "houston christian": "houston christian huskies",
  "abilene christian": "abilene christian wildcats",
  "acu": "abilene christian wildcats",
  "tarleton state": "tarleton state texans",
  "tarleton": "tarleton state texans",
  "texas a&m-commerce": "texas am commerce lions",
  "texas a&m commerce": "texas am commerce lions",
  "ut martin": "ut martin skyhawks",
  "tennessee-martin": "ut martin skyhawks",
  "campbell": "campbell fighting camels",
  "north carolina a&t": "north carolina at greensboro spartans",
  "monmouth": "monmouth hawks",
  "lindenwood": "lindenwood lions",
  "st. thomas": "st thomas tommies",
  "st thomas": "st thomas tommies",
  "stonehill": "stonehill skyhawks",
  "central connecticut": "central connecticut blue devils",
  "central connecticut state": "central connecticut blue devils",
  "sacred heart": "sacred heart pioneers",
  "wagner": "wagner seahawks",
  "robert morris": "robert morris colonials",
  "duquesne": "duquesne dukes",
  "drake": "drake bulldogs",
  "dayton": "dayton flyers",
  "butler": "butler bulldogs",
  "valparaiso": "valparaiso beacons",
  "davidson": "davidson wildcats",
  "presbyterian": "presbyterian blue hose",
  "charleston southern": "charleston southern buccaneers",
  "stetson": "stetson hatters",
  "san diego": "san diego toreros",
  "saint francis": "saint francis red flash",
  "east tennessee state": "east tennessee state buccaneers",
  "etsu": "east tennessee state buccaneers",
  "albany": "albany great danes",
  "northeastern": "northeastern huskies",
  "mississippi valley state": "mississippi valley state delta devils",
  "mvsu": "mississippi valley state delta devils",
};

function getTeamLogo(teamName) {
  if (!teamName) return null;
  const normalized = teamName.toLowerCase().trim();
  // Direct match
  if (TEAM_LOGOS[normalized]) return TEAM_LOGOS[normalized];
  // Alias match
  const aliasKey = TEAM_ALIASES[normalized];
  if (aliasKey && TEAM_LOGOS[aliasKey]) return TEAM_LOGOS[aliasKey];
  return null;
}

function TeamLogo({ team, size = 24 }) {
  const logo = getTeamLogo(team);
  if (!logo) return null;
  return (
    <img
      src={logo}
      alt={team}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        flexShrink: 0
      }}
      onError={(e) => { e.target.style.display = 'none'; }}
    />
  );
}

// ─── School Name Matching ──────────────────────────────────────────
function schoolsMatch(school1, school2) {
  if (!school1 || !school2) return false;
  const s1 = school1.toLowerCase().trim();
  const s2 = school2.toLowerCase().trim();
  if (s1 === s2) return true;
  // Strip University/College suffixes
  const strip = (s) => s.replace(/\s+university$/i, '').replace(/\s+college$/i, '').trim();
  const s1s = strip(s1);
  const s2s = strip(s2);
  if (s1s === s2s && s1s.length >= 5) return true;
  // Check if one starts with the other at a word boundary
  const shorter = s1.length < s2.length ? s1 : s2;
  const longer = s1.length < s2.length ? s2 : s1;
  if (shorter.length < 6 || shorter.length / longer.length < 0.7) return false;
  if (longer.startsWith(shorter) && (longer.length === shorter.length || longer[shorter.length] === ' ')) return true;
  return false;
}

// ─── Position Helpers ──────────────────────────────────────────────
function getPositionType(position) {
  if (!position) return 'other';
  const p = position.toLowerCase();
  if (p.includes('head coach') && !p.includes('assistant')) return 'hc';
  if (p.includes('offensive coordinator') || p.includes('co-offensive coordinator')) return 'oc';
  if (p.includes('defensive coordinator') || p.includes('co-defensive coordinator')) return 'dc';
  // Handle abbreviated forms: "OC", "OC/QB", "co-OC", "co-OC/QB", etc.
  if (/(?:^|co-)oc(?:\/|$)/i.test(p)) return 'oc';
  if (/(?:^|co-)dc(?:\/|$)/i.test(p)) return 'dc';
  if (p.includes('coordinator')) return 'coord';
  if (p.includes('assistant head')) return 'ahc';
  return 'other';
}

function getPositionColor(type) {
  switch (type) {
    case 'hc': return { bg: 'rgba(255,107,53,0.15)', border: 'rgba(255,107,53,0.4)', text: '#ff6b35' };
    case 'oc': return { bg: 'rgba(74,222,128,0.12)', border: 'rgba(74,222,128,0.35)', text: '#4ade80' };
    case 'dc': return { bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.35)', text: '#60a5fa' };
    case 'coord': return { bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.35)', text: '#a78bfa' };
    case 'ahc': return { bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.35)', text: '#fbbf24' };
    default: return { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', text: '#8892b0' };
  }
}

function positionSortOrder(position) {
  const type = getPositionType(position);
  const order = { hc: 0, ahc: 1, oc: 2, dc: 3, coord: 4, other: 5 };
  return order[type] ?? 5;
}

// ─── Main Component ──────────────────────────────────────────────
export default function SchoolRoster({ coachesData, onSelectCoach }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [positionFilter, setPositionFilter] = useState('all');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Build list of all unique schools from coaching_career
  const allSchools = useMemo(() => {
    const schools = new Set();
    (coachesData || []).forEach(coach => {
      (coach.coaching_career || []).forEach(entry => {
        if (entry.school) schools.add(entry.school);
      });
    });
    return Array.from(schools).sort();
  }, [coachesData]);

  // Filter schools by search term
  const filteredSchools = useMemo(() => {
    if (!searchTerm) return [];
    const term = searchTerm.toLowerCase();
    return allSchools.filter(s => s.toLowerCase().includes(term)).slice(0, 50);
  }, [allSchools, searchTerm]);

  // Get all coaches who were at the selected school, with their details
  const schoolCoaches = useMemo(() => {
    if (!selectedSchool) return [];

    const results = [];
    const normalizedSchool = selectedSchool.toLowerCase();

    (coachesData || []).forEach(coach => {
      // Find all stints at this school
      const stints = (coach.coaching_career || []).filter(entry =>
        entry.school && entry.school.toLowerCase() === normalizedSchool
      );

      if (stints.length === 0) return;

      // Get the most recent year at this school (for sorting)
      const maxEnd = Math.max(...stints.map(s => s.years?.end || 2026));
      const minStart = Math.min(...stints.map(s => s.years?.start || 9999));

      // A coach is "current" at this school only if their currentTeam matches
      const isCurrent = coach.currentTeam && 
        schoolsMatch(coach.currentTeam, selectedSchool);

      // Get the current/most recent position at this school (for sorting)
      const mostRecentStint = [...stints].sort((a, b) => (b.years?.start || 0) - (a.years?.start || 0))[0];
      const currentPositionOrder = positionSortOrder(mostRecentStint?.position);

      results.push({
        name: coach.name,
        url: coach.url,
        currentTeam: coach.currentTeam || '',
        currentPosition: coach.currentPosition || '',
        birthdate: coach.birthdate,
        alma_mater: coach.alma_mater,
        stints,
        maxEnd,
        minStart,
        isCurrent,
        currentPositionOrder,
        coach // keep full reference for onSelectCoach
      });
    });

    // Sort: current first (by position hierarchy), then former (by recency)
    results.sort((a, b) => {
      // Current coaches first
      if (a.isCurrent !== b.isCurrent) return a.isCurrent ? -1 : 1;
      // Current coaches: sort by position hierarchy (HC → OC/DC → others)
      if (a.isCurrent && b.isCurrent) {
        if (a.currentPositionOrder !== b.currentPositionOrder) return a.currentPositionOrder - b.currentPositionOrder;
        return a.name.localeCompare(b.name);
      }
      // Former coaches: sort by most recent end year
      if (b.maxEnd !== a.maxEnd) return b.maxEnd - a.maxEnd;
      return b.minStart - a.minStart;
    });

    return results;
  }, [coachesData, selectedSchool]);

  // Apply position filter
  const filteredCoaches = useMemo(() => {
    if (positionFilter === 'all') return schoolCoaches;
    return schoolCoaches.filter(c =>
      c.stints.some(s => {
        const type = getPositionType(s.position);
        if (positionFilter === 'hc') return type === 'hc';
        if (positionFilter === 'oc') return type === 'oc' || s.position?.toLowerCase().includes('offensive');
        if (positionFilter === 'dc') return type === 'dc' || s.position?.toLowerCase().includes('defensive');
        if (positionFilter === 'coord') return ['oc', 'dc', 'coord'].includes(type);
        return true;
      })
    );
  }, [schoolCoaches, positionFilter]);

  // Stats summary
  const stats = useMemo(() => {
    const current = schoolCoaches.filter(c => c.isCurrent).length;
    const headCoaches = schoolCoaches.filter(c =>
      c.stints.some(s => getPositionType(s.position) === 'hc')
    ).length;
    const total = schoolCoaches.length;
    return { current, headCoaches, total };
  }, [schoolCoaches]);

  const formatYears = (stint) => {
    const start = stint.years?.start;
    const end = stint.years?.end;
    const isPresent = stint.raw_years?.includes('present');
    if (isPresent) return `${start}–present`;
    if (start === end) return `${start}`;
    return `${start}–${end}`;
  };

  const calculateAge = (birthdate) => {
    if (!birthdate) return null;
    const birth = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  return (
    <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
      {/* School Search */}
      <div ref={searchRef} style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          color: '#8892b0',
          fontSize: '0.75rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase'
        }}>
          Search for a School
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
              if (!e.target.value) setSelectedSchool('');
            }}
            placeholder="Type a school name..."
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              paddingLeft: selectedSchool ? '2.75rem' : '1rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(232,121,249,0.2)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '1rem',
              outline: 'none',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(232,121,249,0.6)';
              if (searchTerm) setShowDropdown(true);
            }}
            onBlur={(e) => e.target.style.borderColor = 'rgba(232,121,249,0.2)'}
          />
          {selectedSchool && (
            <div style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center'
            }}>
              <TeamLogo team={selectedSchool} size={22} />
            </div>
          )}
        </div>

        {/* Dropdown */}
        {showDropdown && searchTerm && filteredSchools.length > 0 && !selectedSchool && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#1a1a2e',
            border: '1px solid rgba(232,121,249,0.3)',
            borderRadius: '8px',
            marginTop: '4px',
            maxHeight: '300px',
            overflowY: 'auto',
            zIndex: 100
          }}>
            {filteredSchools.map(school => (
              <div
                key={school}
                onClick={() => {
                  setSelectedSchool(school);
                  setSearchTerm(school);
                  setShowDropdown(false);
                  setPositionFilter('all');
                }}
                style={{
                  padding: '0.65rem 1rem',
                  cursor: 'pointer',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(232,121,249,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <TeamLogo team={school} size={20} />
                <span style={{ color: '#ccd6f6', fontSize: '0.9rem' }}>{school}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      {selectedSchool && (
        <>
          {/* Header with school name + logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid rgba(255,255,255,0.08)'
          }}>
            <TeamLogo team={selectedSchool} size={36} />
            <div>
              <h2 style={{
                color: '#e6f1ff',
                fontSize: '1.3rem',
                fontWeight: 700,
                margin: 0
              }}>{selectedSchool}</h2>
              <div style={{
                display: 'flex',
                gap: '0.75rem',
                marginTop: '0.25rem',
                fontSize: '0.75rem',
                color: '#8892b0',
                flexWrap: 'wrap'
              }}>
                <span><strong style={{ color: '#e879f9' }}>{stats.total}</strong> coaches in database</span>
                <span><strong style={{ color: '#4ade80' }}>{stats.current}</strong> currently there</span>
                <span><strong style={{ color: '#ff6b35' }}>{stats.headCoaches}</strong> head coaches</span>
              </div>
            </div>
          </div>

          {/* Position Filter Pills */}
          <div style={{
            display: 'flex',
            gap: '0.4rem',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            {[
              { key: 'all', label: 'All' },
              { key: 'hc', label: 'Head Coaches' },
              { key: 'coord', label: 'Coordinators' },
              { key: 'oc', label: 'Offense' },
              { key: 'dc', label: 'Defense' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setPositionFilter(f.key)}
                style={{
                  padding: '0.35rem 0.75rem',
                  background: positionFilter === f.key ? 'rgba(232,121,249,0.2)' : 'rgba(255,255,255,0.04)',
                  border: positionFilter === f.key ? '1px solid rgba(232,121,249,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '20px',
                  color: positionFilter === f.key ? '#e879f9' : '#8892b0',
                  cursor: 'pointer',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  transition: 'all 0.2s ease'
                }}
              >
                {f.label}
              </button>
            ))}
            <span style={{
              marginLeft: 'auto',
              color: '#555',
              fontSize: '0.8rem',
              alignSelf: 'center'
            }}>
              {filteredCoaches.length} result{filteredCoaches.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Coach List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {filteredCoaches.map((c, idx) => {
              const age = calculateAge(c.birthdate);
              return (
                <div
                  key={`${c.name}-${idx}`}
                  onClick={() => onSelectCoach && onSelectCoach(c.coach)}
                  style={{
                    background: c.isCurrent ? 'rgba(74,222,128,0.06)' : 'rgba(255,255,255,0.03)',
                    border: c.isCurrent ? '1px solid rgba(74,222,128,0.15)' : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '8px',
                    padding: '0.85rem 1rem',
                    cursor: onSelectCoach ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = c.isCurrent ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.borderColor = 'rgba(232,121,249,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = c.isCurrent ? 'rgba(74,222,128,0.06)' : 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.borderColor = c.isCurrent ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.06)';
                  }}
                >
                  {/* Top row: name + current team */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem',
                    flexWrap: 'wrap',
                    gap: '0.25rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        color: '#e6f1ff',
                        fontWeight: 700,
                        fontSize: '0.95rem'
                      }}>{c.name}</span>
                      {age && (
                        <span style={{ color: '#555', fontSize: '0.8rem' }}>
                          ({age})
                        </span>
                      )}
                      {c.isCurrent && (
                        <span style={{
                          background: 'rgba(74,222,128,0.2)',
                          color: '#4ade80',
                          padding: '0.1rem 0.45rem',
                          borderRadius: '4px',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em'
                        }}>Current</span>
                      )}
                    </div>

                    {/* Current team */}
                    {c.currentTeam && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        color: '#8892b0',
                        fontSize: '0.75rem',
                        flexShrink: 0
                      }}>
                        <TeamLogo team={c.currentTeam} size={18} />
                        <span>{c.currentTeam}</span>
                        {c.currentPosition && (
                          <span style={{ color: '#555' }}>· {c.currentPosition}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Stints at this school */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.35rem'
                  }}>
                    {c.stints
                      .sort((a, b) => (b.years?.start || 0) - (a.years?.start || 0))
                      .map((stint, si) => {
                        const type = getPositionType(stint.position);
                        const colors = getPositionColor(type);
                        return (
                          <span
                            key={si}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              background: colors.bg,
                              border: `1px solid ${colors.border}`,
                              borderRadius: '5px',
                              padding: '0.2rem 0.55rem',
                              fontSize: '0.75rem',
                              color: colors.text,
                              fontWeight: 500
                            }}
                          >
                            <span style={{ fontWeight: 600 }}>{stint.position || 'Staff'}</span>
                            <span style={{ opacity: 0.7 }}>({formatYears(stint)})</span>
                          </span>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCoaches.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: '#555',
              fontSize: '0.9rem'
            }}>
              No coaches match the current filter for {selectedSchool}
            </div>
          )}
        </>
      )}

      {/* Empty state */}
      {!selectedSchool && (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          color: '#555'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏫</div>
          <div style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#8892b0' }}>
            Search for any school or program
          </div>
          <div style={{ fontSize: '0.85rem' }}>
            View every coach in the database who has ever coached there, ordered by most recent
          </div>
        </div>
      )}
    </div>
  );
}
