// Team Logo Mapping - ESPN CDN URLs for FBS, FCS, and NFL teams
// Usage: import { getTeamLogo, getTeamLogoUrl } from './teamLogos';

const TEAM_LOGOS = {
  // ═══════════════════════════════════════════
  // ACC
  // ═══════════════════════════════════════════
  'boston college eagles': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/103.png',
  'california golden bears': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/25.png',
  'clemson tigers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/228.png',
  'duke blue devils': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/150.png',
  'florida state seminoles': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/52.png',
  'georgia tech yellow jackets': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/59.png',
  'louisville cardinals': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/97.png',
  'miami hurricanes': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2390.png',
  'nc state wolfpack': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/152.png',
  'north carolina tar heels': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/153.png',
  'pittsburgh panthers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/221.png',
  'smu mustangs': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2567.png',
  'stanford cardinal': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/24.png',
  'syracuse orange': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/183.png',
  'virginia cavaliers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/258.png',
  'virginia tech hokies': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/259.png',
  'wake forest demon deacons': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/154.png',

  // ═══════════════════════════════════════════
  // AAC
  // ═══════════════════════════════════════════
  'army black knights': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/349.png',
  'charlotte 49ers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2429.png',
  'east carolina pirates': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/151.png',
  'florida atlantic owls': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2226.png',
  'memphis tigers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/235.png',
  'navy midshipmen': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2426.png',
  'north texas mean green': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/249.png',
  'rice owls': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/242.png',
  'south florida bulls': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/58.png',
  'temple owls': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/218.png',
  'tulane green wave': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2655.png',
  'tulsa golden hurricane': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/202.png',
  'uab blazers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/5.png',
  'utsa roadrunners': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2636.png',

  // ═══════════════════════════════════════════
  // Big 12
  // ═══════════════════════════════════════════
  'arizona state sun devils': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/9.png',
  'arizona wildcats': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/12.png',
  'byu cougars': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/252.png',
  'baylor bears': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/239.png',
  'cincinnati bearcats': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2132.png',
  'colorado buffaloes': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/38.png',
  'houston cougars': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/248.png',
  'iowa state cyclones': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/66.png',
  'kansas jayhawks': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2305.png',
  'kansas state wildcats': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2306.png',
  'oklahoma state cowboys': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/197.png',
  'tcu horned frogs': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2628.png',
  'texas tech red raiders': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2641.png',
  'ucf knights': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2116.png',
  'utah utes': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/254.png',
  'west virginia mountaineers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/277.png',

  // ═══════════════════════════════════════════
  // Big Ten
  // ═══════════════════════════════════════════
  'illinois fighting illini': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/356.png',
  'indiana hoosiers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/84.png',
  'iowa hawkeyes': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2294.png',
  'maryland terrapins': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/120.png',
  'michigan state spartans': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/127.png',
  'michigan wolverines': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/130.png',
  'minnesota golden gophers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/135.png',
  'nebraska cornhuskers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/158.png',
  'northwestern wildcats': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/77.png',
  'ohio state buckeyes': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/194.png',
  'oregon ducks': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2483.png',
  'penn state nittany lions': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/213.png',
  'purdue boilermakers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2509.png',
  'rutgers scarlet knights': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/164.png',
  'ucla bruins': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/26.png',
  'usc trojans': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/30.png',
  'washington huskies': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/264.png',
  'wisconsin badgers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/275.png',

  // ═══════════════════════════════════════════
  // C-USA / Independents
  // ═══════════════════════════════════════════
  'delaware blue hens': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/48.png',
  'florida international panthers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2229.png',
  'jacksonville state gamecocks': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/55.png',
  'kennesaw state owls': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/338.png',
  'liberty flames': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2335.png',
  'louisiana tech bulldogs': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2348.png',
  'middle tennessee blue raiders': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2393.png',
  'missouri state bears': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2623.png',
  'new mexico state aggies': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/166.png',
  'sam houston bearkats': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2534.png',
  'western kentucky hilltoppers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/98.png',
  'notre dame fighting irish': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/87.png',
  'uconn huskies': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/41.png',

  // ═══════════════════════════════════════════
  // MAC
  // ═══════════════════════════════════════════
  'akron zips': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2006.png',
  'ball state cardinals': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2050.png',
  'bowling green falcons': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/189.png',
  'buffalo bulls': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2084.png',
  'central michigan chippewas': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2117.png',
  'eastern michigan eagles': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2199.png',
  'kent state golden flashes': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2309.png',
  'massachusetts minutemen': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/113.png',
  'miami oh redhawks': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/193.png',
  'ohio bobcats': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/195.png',
  'toledo rockets': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2649.png',
  'western michigan broncos': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2711.png',

  // ═══════════════════════════════════════════
  // Mountain West
  // ═══════════════════════════════════════════
  'air force falcons': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2005.png',
  'hawaii rainbow warriors': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/62.png',
  'nevada wolf pack': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2440.png',
  'new mexico lobos': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/167.png',
  'northern illinois huskies': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2459.png',
  'san jose state spartans': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/23.png',
  'unlv rebels': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2439.png',
  'utep miners': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2638.png',
  'wyoming cowboys': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2751.png',
  'boise state broncos': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/68.png',
  'colorado state rams': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/36.png',
  'fresno state bulldogs': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/278.png',
  'oregon state beavers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/204.png',
  'san diego state aztecs': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/21.png',
  'texas state bobcats': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/326.png',
  'utah state aggies': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/328.png',
  'washington state cougars': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/265.png',

  // ═══════════════════════════════════════════
  // SEC
  // ═══════════════════════════════════════════
  'alabama crimson tide': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/333.png',
  'arkansas razorbacks': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/8.png',
  'auburn tigers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2.png',
  'florida gators': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/57.png',
  'georgia bulldogs': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/61.png',
  'kentucky wildcats': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/96.png',
  'lsu tigers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/99.png',
  'mississippi state bulldogs': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/344.png',
  'missouri tigers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/142.png',
  'oklahoma sooners': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/201.png',
  'ole miss rebels': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/145.png',
  'south carolina gamecocks': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2579.png',
  'tennessee volunteers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2633.png',
  'texas am aggies': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/245.png',
  'texas longhorns': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/251.png',
  'vanderbilt commodores': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/238.png',

  // ═══════════════════════════════════════════
  // Sun Belt
  // ═══════════════════════════════════════════
  'app state mountaineers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2026.png',
  'arkansas state red wolves': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2032.png',
  'coastal carolina chanticleers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/324.png',
  'georgia southern eagles': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/290.png',
  'georgia state panthers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2247.png',
  'james madison dukes': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/256.png',
  'louisiana-lafayette ragin cajuns': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/309.png',
  'marshall thundering herd': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/276.png',
  'old dominion monarchs': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/295.png',
  'south alabama jaguars': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/6.png',
  'southern miss golden eagles': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2572.png',
  'troy trojans': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2653.png',
  'ul-monroe warhawks': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2433.png',

  // ═══════════════════════════════════════════
  // FCS - Big Sky
  // ═══════════════════════════════════════════
  'montana state bobcats': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/147.png',
  'montana grizzlies': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/149.png',
  'uc davis aggies': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/302.png',
  'sacramento state hornets': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/16.png',
  'idaho state bengals': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/304.png',
  'northern arizona lumberjacks': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2464.png',
  'eastern washington eagles': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/331.png',
  'northern colorado bears': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2458.png',
  'cal poly mustangs': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/13.png',
  'idaho vandals': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/70.png',
  'weber state wildcats': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2692.png',
  'portland state vikings': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2502.png',

  // ═══════════════════════════════════════════
  // FCS - CAA
  // ═══════════════════════════════════════════
  'rhode island rams': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/227.png',
  'villanova wildcats': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/222.png',
  'new hampshire wildcats': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/160.png',
  'monmouth hawks': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2405.png',
  'william mary tribe': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2729.png',
  'maine black bears': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/311.png',
  'elon phoenix': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2210.png',
  'stony brook seawolves': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2619.png',
  'towson tigers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/119.png',
  'north carolina at aggies': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2448.png',
  'campbell fighting camels': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2097.png',
  'bryant bulldogs': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2803.png',
  'ualbany great danes': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/399.png',
  'hampton pirates': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2261.png',
  'sacred heart pioneers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2529.png',
  'merrimack warriors': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2771.png',

  // ═══════════════════════════════════════════
  // FCS - Ivy League
  // ═══════════════════════════════════════════
  'yale bulldogs': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/43.png',
  'harvard crimson': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/108.png',
  'pennsylvania quakers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/219.png',
  'dartmouth big green': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/159.png',
  'cornell big red': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/172.png',
  'princeton tigers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/163.png',
  'brown bears': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/225.png',
  'columbia lions': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/171.png',

  // ═══════════════════════════════════════════
  // FCS - MEAC
  // ═══════════════════════════════════════════
  'south carolina state bulldogs': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2569.png',
  'delaware state hornets': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2169.png',
  'north carolina central eagles': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2428.png',
  'howard bison': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/47.png',
  'morgan state bears': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2415.png',
  'norfolk state spartans': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2450.png',

  // ═══════════════════════════════════════════
  // FCS - MVFC
  // ═══════════════════════════════════════════
  'north dakota state bison': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2449.png',
  'south dakota coyotes': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/233.png',
  'north dakota fighting hawks': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/155.png',
  'youngstown state penguins': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2754.png',
  'illinois state redbirds': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2287.png',
  'south dakota state jackrabbits': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2571.png',
  'southern illinois salukis': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/79.png',
  'northern iowa panthers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2460.png',
  'murray state racers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/93.png',
  'indiana state sycamores': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/282.png',

  // ═══════════════════════════════════════════
  // FCS - NEC
  // ═══════════════════════════════════════════
  'central connecticut blue devils': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2115.png',
  'duquesne dukes': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2184.png',
  'mercyhurst lakers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2385.png',
  'long island university sharks': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2341.png',
  'wagner seahawks': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2681.png',
  'stonehill skyhawks': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/284.png',
  'robert morris colonials': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2523.png',
  'new haven chargers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2441.png',
  'st francis red flash': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2598.png',

  // ═══════════════════════════════════════════
  // FCS - OVC / Big South
  // ═══════════════════════════════════════════
  'tennessee tech golden eagles': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2635.png',
  'ut martin skyhawks': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2630.png',
  'gardner webb runnin bulldogs': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2241.png',
  'lindenwood lions': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2815.png',
  'charleston southern buccaneers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2127.png',
  'southeast missouri state redhawks': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2546.png',
  'western illinois leathernecks': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2710.png',
  'eastern illinois panthers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2197.png',
  'tennessee state tigers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2634.png',

  // ═══════════════════════════════════════════
  // FCS - Patriot League
  // ═══════════════════════════════════════════
  'lehigh mountain hawks': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2329.png',
  'lafayette leopards': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/322.png',
  'holy cross crusaders': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/107.png',
  'richmond spiders': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/257.png',
  'georgetown hoyas': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/46.png',
  'colgate raiders': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2142.png',
  'bucknell bison': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2083.png',
  'fordham rams': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2230.png',

  // ═══════════════════════════════════════════
  // FCS - Pioneer / PFL
  // ═══════════════════════════════════════════
  'drake bulldogs': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2181.png',
  'presbyterian blue hose': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2506.png',
  'san diego toreros': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/301.png',
  'dayton flyers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2168.png',
  'st thomas minnesota tommies': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2900.png',
  'morehead state eagles': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2413.png',
  'butler bulldogs': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2086.png',
  'marist red foxes': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2368.png',
  'stetson hatters': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/56.png',
  'davidson wildcats': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2166.png',
  'valparaiso beacons': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2674.png',

  // ═══════════════════════════════════════════
  // FCS - SoCon
  // ═══════════════════════════════════════════
  'mercer bears': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2382.png',
  'western carolina catamounts': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2717.png',
  'east tennessee state buccaneers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2193.png',
  'wofford terriers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2747.png',
  'chattanooga mocs': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/236.png',
  'furman paladins': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/231.png',
  'the citadel bulldogs': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2643.png',
  'samford bulldogs': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2535.png',
  'vmi keydets': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2678.png',

  // ═══════════════════════════════════════════
  // FCS - Southland
  // ═══════════════════════════════════════════
  'stephen f austin lumberjacks': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2617.png',
  'se louisiana lions': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2545.png',
  'lamar cardinals': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2320.png',
  'ut rio grande valley vaqueros': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/292.png',
  'nicholls colonels': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2447.png',
  'mcneese cowboys': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2377.png',
  'east texas am lions': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2837.png',
  'incarnate word cardinals': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2916.png',
  'houston christian huskies': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2277.png',
  'northwestern state demons': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2466.png',

  // ═══════════════════════════════════════════
  // FCS - SWAC
  // ═══════════════════════════════════════════
  'alabama state hornets': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2011.png',
  'jackson state tigers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2296.png',
  'bethune cookman wildcats': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2065.png',
  'florida am rattlers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/50.png',
  'alabama am bulldogs': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2010.png',
  'mississippi valley state delta devils': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2400.png',
  'prairie view am panthers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2504.png',
  'texas southern tigers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2640.png',
  'alcorn state braves': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2016.png',
  'grambling tigers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2755.png',
  'arkansas pine bluff golden lions': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2029.png',
  'southern jaguars': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2582.png',

  // ═══════════════════════════════════════════
  // FCS - UAC / WAC
  // ═══════════════════════════════════════════
  'abilene christian wildcats': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2000.png',
  'tarleton state texans': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2627.png',
  'southern utah thunderbirds': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/253.png',
  'west georgia wolves': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2698.png',
  'austin peay governors': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2046.png',
  'eastern kentucky colonels': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2198.png',
  'central arkansas bears': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2110.png',
  'utah tech trailblazers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/3101.png',
  'north alabama lions': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2453.png',

  // ═══════════════════════════════════════════
  // NFL
  // ═══════════════════════════════════════════
  'new england patriots': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/ne.png',
  'buffalo bills': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/buf.png',
  'miami dolphins': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/mia.png',
  'new york jets': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/nyj.png',
  'pittsburgh steelers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/pit.png',
  'baltimore ravens': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/bal.png',
  'cincinnati bengals': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/cin.png',
  'cleveland browns': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/cle.png',
  'jacksonville jaguars': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/jax.png',
  'houston texans': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/hou.png',
  'indianapolis colts': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/ind.png',
  'tennessee titans': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/ten.png',
  'denver broncos': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/den.png',
  'los angeles chargers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/lac.png',
  'kansas city chiefs': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/kc.png',
  'las vegas raiders': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/lv.png',
  'philadelphia eagles': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/phi.png',
  'dallas cowboys': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/dal.png',
  'washington commanders': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/wsh.png',
  'new york giants': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/nyg.png',
  'chicago bears': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/chi.png',
  'green bay packers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/gb.png',
  'minnesota vikings': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/min.png',
  'detroit lions': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/det.png',
  'carolina panthers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/car.png',
  'tampa bay buccaneers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/tb.png',
  'atlanta falcons': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/atl.png',
  'new orleans saints': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/no.png',
  'seattle seahawks': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/sea.png',
  'los angeles rams': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/lar.png',
  'san francisco 49ers': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/sf.png',
  'arizona cardinals': 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/ari.png',
};

// ═══════════════════════════════════════════════
// Alias mapping: common database variations → canonical logo key
// ═══════════════════════════════════════════════
const TEAM_ALIASES = {
  // School name variations (what the DB might store → logo key)
  'boston college': 'boston college eagles',
  'california': 'california golden bears',
  'cal': 'california golden bears',
  'clemson': 'clemson tigers',
  'duke': 'duke blue devils',
  'florida state': 'florida state seminoles',
  'fsu': 'florida state seminoles',
  'georgia tech': 'georgia tech yellow jackets',
  'louisville': 'louisville cardinals',
  'miami': 'miami hurricanes',
  'miami (fl)': 'miami hurricanes',
  'miami (florida)': 'miami hurricanes',
  'miami fl': 'miami hurricanes',
  'nc state': 'nc state wolfpack',
  'north carolina state': 'nc state wolfpack',
  'north carolina': 'north carolina tar heels',
  'unc': 'north carolina tar heels',
  'pittsburgh': 'pittsburgh panthers',
  'pitt': 'pittsburgh panthers',
  'smu': 'smu mustangs',
  'southern methodist': 'smu mustangs',
  'stanford': 'stanford cardinal',
  'syracuse': 'syracuse orange',
  'virginia': 'virginia cavaliers',
  'uva': 'virginia cavaliers',
  'virginia tech': 'virginia tech hokies',
  'wake forest': 'wake forest demon deacons',
  'army': 'army black knights',
  'charlotte': 'charlotte 49ers',
  'east carolina': 'east carolina pirates',
  'ecu': 'east carolina pirates',
  'florida atlantic': 'florida atlantic owls',
  'fau': 'florida atlantic owls',
  'memphis': 'memphis tigers',
  'navy': 'navy midshipmen',
  'north texas': 'north texas mean green',
  'unt': 'north texas mean green',
  'rice': 'rice owls',
  'south florida': 'south florida bulls',
  'usf': 'south florida bulls',
  'temple': 'temple owls',
  'tulane': 'tulane green wave',
  'tulsa': 'tulsa golden hurricane',
  'uab': 'uab blazers',
  'utsa': 'utsa roadrunners',
  'arizona state': 'arizona state sun devils',
  'asu': 'arizona state sun devils',
  'arizona': 'arizona wildcats',
  'byu': 'byu cougars',
  'brigham young': 'byu cougars',
  'baylor': 'baylor bears',
  'cincinnati': 'cincinnati bearcats',
  'colorado': 'colorado buffaloes',
  'houston': 'houston cougars',
  'iowa state': 'iowa state cyclones',
  'kansas': 'kansas jayhawks',
  'kansas state': 'kansas state wildcats',
  'oklahoma state': 'oklahoma state cowboys',
  'tcu': 'tcu horned frogs',
  'texas christian': 'tcu horned frogs',
  'texas tech': 'texas tech red raiders',
  'ucf': 'ucf knights',
  'central florida': 'ucf knights',
  'utah': 'utah utes',
  'west virginia': 'west virginia mountaineers',
  'wvu': 'west virginia mountaineers',
  'illinois': 'illinois fighting illini',
  'indiana': 'indiana hoosiers',
  'iowa': 'iowa hawkeyes',
  'maryland': 'maryland terrapins',
  'michigan state': 'michigan state spartans',
  'michigan': 'michigan wolverines',
  'minnesota': 'minnesota golden gophers',
  'nebraska': 'nebraska cornhuskers',
  'northwestern': 'northwestern wildcats',
  'ohio state': 'ohio state buckeyes',
  'osu': 'ohio state buckeyes',
  'oregon': 'oregon ducks',
  'penn state': 'penn state nittany lions',
  'purdue': 'purdue boilermakers',
  'rutgers': 'rutgers scarlet knights',
  'ucla': 'ucla bruins',
  'usc': 'usc trojans',
  'southern california': 'usc trojans',
  'washington': 'washington huskies',
  'wisconsin': 'wisconsin badgers',
  'delaware': 'delaware blue hens',
  'florida international': 'florida international panthers',
  'fiu': 'florida international panthers',
  'jacksonville state': 'jacksonville state gamecocks',
  'kennesaw state': 'kennesaw state owls',
  'liberty': 'liberty flames',
  'louisiana tech': 'louisiana tech bulldogs',
  'middle tennessee': 'middle tennessee blue raiders',
  'mtsu': 'middle tennessee blue raiders',
  'middle tennessee state': 'middle tennessee blue raiders',
  'missouri state': 'missouri state bears',
  'new mexico state': 'new mexico state aggies',
  'nmsu': 'new mexico state aggies',
  'sam houston': 'sam houston bearkats',
  'sam houston state': 'sam houston bearkats',
  'western kentucky': 'western kentucky hilltoppers',
  'wku': 'western kentucky hilltoppers',
  'notre dame': 'notre dame fighting irish',
  'uconn': 'uconn huskies',
  'connecticut': 'uconn huskies',
  'akron': 'akron zips',
  'ball state': 'ball state cardinals',
  'bowling green': 'bowling green falcons',
  'buffalo': 'buffalo bulls',
  'central michigan': 'central michigan chippewas',
  'eastern michigan': 'eastern michigan eagles',
  'kent state': 'kent state golden flashes',
  'massachusetts': 'massachusetts minutemen',
  'umass': 'massachusetts minutemen',
  'miami (oh)': 'miami oh redhawks',
  'miami (ohio)': 'miami oh redhawks',
  'miami oh': 'miami oh redhawks',
  'miami ohio': 'miami oh redhawks',
  'ohio': 'ohio bobcats',
  'toledo': 'toledo rockets',
  'western michigan': 'western michigan broncos',
  'air force': 'air force falcons',
  'hawaii': 'hawaii rainbow warriors',
  "hawai'i": 'hawaii rainbow warriors',
  'nevada': 'nevada wolf pack',
  'new mexico': 'new mexico lobos',
  'northern illinois': 'northern illinois huskies',
  'niu': 'northern illinois huskies',
  'san jose state': 'san jose state spartans',
  'sjsu': 'san jose state spartans',
  'unlv': 'unlv rebels',
  'utep': 'utep miners',
  'wyoming': 'wyoming cowboys',
  'boise state': 'boise state broncos',
  'colorado state': 'colorado state rams',
  'fresno state': 'fresno state bulldogs',
  'oregon state': 'oregon state beavers',
  'san diego state': 'san diego state aztecs',
  'sdsu': 'san diego state aztecs',
  'texas state': 'texas state bobcats',
  'utah state': 'utah state aggies',
  'washington state': 'washington state cougars',
  'wsu': 'washington state cougars',
  'wazzu': 'washington state cougars',
  'alabama': 'alabama crimson tide',
  'arkansas': 'arkansas razorbacks',
  'auburn': 'auburn tigers',
  'florida': 'florida gators',
  'georgia': 'georgia bulldogs',
  'uga': 'georgia bulldogs',
  'kentucky': 'kentucky wildcats',
  'lsu': 'lsu tigers',
  'mississippi state': 'mississippi state bulldogs',
  'missouri': 'missouri tigers',
  'mizzou': 'missouri tigers',
  'oklahoma': 'oklahoma sooners',
  'ole miss': 'ole miss rebels',
  'mississippi': 'ole miss rebels',
  'south carolina': 'south carolina gamecocks',
  'tennessee': 'tennessee volunteers',
  'texas a&m': 'texas am aggies',
  'texas a & m': 'texas am aggies',
  'texas am': 'texas am aggies',
  'texas': 'texas longhorns',
  'vanderbilt': 'vanderbilt commodores',
  'appalachian state': 'app state mountaineers',
  'app state': 'app state mountaineers',
  'arkansas state': 'arkansas state red wolves',
  'coastal carolina': 'coastal carolina chanticleers',
  'georgia southern': 'georgia southern eagles',
  'georgia state': 'georgia state panthers',
  'james madison': 'james madison dukes',
  'jmu': 'james madison dukes',
  'louisiana': 'louisiana-lafayette ragin cajuns',
  'louisiana-lafayette': 'louisiana-lafayette ragin cajuns',
  'ul lafayette': 'louisiana-lafayette ragin cajuns',
  'louisiana lafayette': 'louisiana-lafayette ragin cajuns',
  'marshall': 'marshall thundering herd',
  'old dominion': 'old dominion monarchs',
  'odu': 'old dominion monarchs',
  'south alabama': 'south alabama jaguars',
  'southern miss': 'southern miss golden eagles',
  'southern mississippi': 'southern miss golden eagles',
  'troy': 'troy trojans',
  'louisiana-monroe': 'ul-monroe warhawks',
  'ul-monroe': 'ul-monroe warhawks',
  'ul monroe': 'ul-monroe warhawks',
  'louisiana monroe': 'ul-monroe warhawks',
  'ulm': 'ul-monroe warhawks',

  // FCS aliases
  'montana state': 'montana state bobcats',
  'montana': 'montana grizzlies',
  'uc davis': 'uc davis aggies',
  'sacramento state': 'sacramento state hornets',
  'idaho state': 'idaho state bengals',
  'northern arizona': 'northern arizona lumberjacks',
  'nau': 'northern arizona lumberjacks',
  'eastern washington': 'eastern washington eagles',
  'ewu': 'eastern washington eagles',
  'northern colorado': 'northern colorado bears',
  'cal poly': 'cal poly mustangs',
  'idaho': 'idaho vandals',
  'weber state': 'weber state wildcats',
  'portland state': 'portland state vikings',
  'rhode island': 'rhode island rams',
  'villanova': 'villanova wildcats',
  'new hampshire': 'new hampshire wildcats',
  'monmouth': 'monmouth hawks',
  'william & mary': 'william mary tribe',
  'william and mary': 'william mary tribe',
  'maine': 'maine black bears',
  'elon': 'elon phoenix',
  'stony brook': 'stony brook seawolves',
  'towson': 'towson tigers',
  'north carolina a&t': 'north carolina at aggies',
  'nc a&t': 'north carolina at aggies',
  'campbell': 'campbell fighting camels',
  'bryant': 'bryant bulldogs',
  'albany': 'ualbany great danes',
  'ualbany': 'ualbany great danes',
  'hampton': 'hampton pirates',
  'sacred heart': 'sacred heart pioneers',
  'merrimack': 'merrimack warriors',
  'yale': 'yale bulldogs',
  'harvard': 'harvard crimson',
  'pennsylvania': 'pennsylvania quakers',
  'penn': 'pennsylvania quakers',
  'dartmouth': 'dartmouth big green',
  'cornell': 'cornell big red',
  'princeton': 'princeton tigers',
  'brown': 'brown bears',
  'columbia': 'columbia lions',
  'south carolina state': 'south carolina state bulldogs',
  'delaware state': 'delaware state hornets',
  'north carolina central': 'north carolina central eagles',
  'nccu': 'north carolina central eagles',
  'howard': 'howard bison',
  'morgan state': 'morgan state bears',
  'norfolk state': 'norfolk state spartans',
  'north dakota state': 'north dakota state bison',
  'ndsu': 'north dakota state bison',
  'south dakota': 'south dakota coyotes',
  'north dakota': 'north dakota fighting hawks',
  'und': 'north dakota fighting hawks',
  'youngstown state': 'youngstown state penguins',
  'illinois state': 'illinois state redbirds',
  'south dakota state': 'south dakota state jackrabbits',
  'sdsu fcs': 'south dakota state jackrabbits',
  'southern illinois': 'southern illinois salukis',
  'siu': 'southern illinois salukis',
  'northern iowa': 'northern iowa panthers',
  'uni': 'northern iowa panthers',
  'murray state': 'murray state racers',
  'indiana state': 'indiana state sycamores',
  'central connecticut': 'central connecticut blue devils',
  'central connecticut state': 'central connecticut blue devils',
  'ccsu': 'central connecticut blue devils',
  'duquesne': 'duquesne dukes',
  'mercyhurst': 'mercyhurst lakers',
  'long island': 'long island university sharks',
  'liu': 'long island university sharks',
  'wagner': 'wagner seahawks',
  'stonehill': 'stonehill skyhawks',
  'robert morris': 'robert morris colonials',
  'new haven': 'new haven chargers',
  'st. francis': 'st francis red flash',
  'saint francis': 'st francis red flash',
  'tennessee tech': 'tennessee tech golden eagles',
  'ut martin': 'ut martin skyhawks',
  'tennessee-martin': 'ut martin skyhawks',
  'gardner-webb': 'gardner webb runnin bulldogs',
  'gardner webb': 'gardner webb runnin bulldogs',
  'lindenwood': 'lindenwood lions',
  'charleston southern': 'charleston southern buccaneers',
  'southeast missouri': 'southeast missouri state redhawks',
  'southeast missouri state': 'southeast missouri state redhawks',
  'semo': 'southeast missouri state redhawks',
  'western illinois': 'western illinois leathernecks',
  'eastern illinois': 'eastern illinois panthers',
  'eiu': 'eastern illinois panthers',
  'tennessee state': 'tennessee state tigers',
  'lehigh': 'lehigh mountain hawks',
  'lafayette': 'lafayette leopards',
  'holy cross': 'holy cross crusaders',
  'richmond': 'richmond spiders',
  'georgetown': 'georgetown hoyas',
  'colgate': 'colgate raiders',
  'bucknell': 'bucknell bison',
  'fordham': 'fordham rams',
  'drake': 'drake bulldogs',
  'presbyterian': 'presbyterian blue hose',
  'san diego': 'san diego toreros',
  'dayton': 'dayton flyers',
  'st. thomas': 'st thomas minnesota tommies',
  'st thomas': 'st thomas minnesota tommies',
  'saint thomas': 'st thomas minnesota tommies',
  'morehead state': 'morehead state eagles',
  'butler': 'butler bulldogs',
  'marist': 'marist red foxes',
  'stetson': 'stetson hatters',
  'davidson': 'davidson wildcats',
  'valparaiso': 'valparaiso beacons',
  'mercer': 'mercer bears',
  'western carolina': 'western carolina catamounts',
  'east tennessee state': 'east tennessee state buccaneers',
  'etsu': 'east tennessee state buccaneers',
  'wofford': 'wofford terriers',
  'chattanooga': 'chattanooga mocs',
  'furman': 'furman paladins',
  'the citadel': 'the citadel bulldogs',
  'citadel': 'the citadel bulldogs',
  'samford': 'samford bulldogs',
  'vmi': 'vmi keydets',
  'stephen f. austin': 'stephen f austin lumberjacks',
  'stephen f austin': 'stephen f austin lumberjacks',
  'sfa': 'stephen f austin lumberjacks',
  'southeastern louisiana': 'se louisiana lions',
  'se louisiana': 'se louisiana lions',
  'lamar': 'lamar cardinals',
  'ut rio grande valley': 'ut rio grande valley vaqueros',
  'utrgv': 'ut rio grande valley vaqueros',
  'nicholls': 'nicholls colonels',
  'nicholls state': 'nicholls colonels',
  'mcneese': 'mcneese cowboys',
  'mcneese state': 'mcneese cowboys',
  'east texas a&m': 'east texas am lions',
  'east texas am': 'east texas am lions',
  'incarnate word': 'incarnate word cardinals',
  'uiw': 'incarnate word cardinals',
  'houston christian': 'houston christian huskies',
  'houston baptist': 'houston christian huskies',
  'northwestern state': 'northwestern state demons',
  'alabama state': 'alabama state hornets',
  'jackson state': 'jackson state tigers',
  'bethune-cookman': 'bethune cookman wildcats',
  'bethune cookman': 'bethune cookman wildcats',
  'florida a&m': 'florida am rattlers',
  'florida am': 'florida am rattlers',
  'famu': 'florida am rattlers',
  'alabama a&m': 'alabama am bulldogs',
  'alabama am': 'alabama am bulldogs',
  'mississippi valley state': 'mississippi valley state delta devils',
  'mvsu': 'mississippi valley state delta devils',
  'prairie view a&m': 'prairie view am panthers',
  'prairie view': 'prairie view am panthers',
  'prairie view am': 'prairie view am panthers',
  'texas southern': 'texas southern tigers',
  'alcorn state': 'alcorn state braves',
  'alcorn': 'alcorn state braves',
  'grambling': 'grambling tigers',
  'grambling state': 'grambling tigers',
  'arkansas-pine bluff': 'arkansas pine bluff golden lions',
  'arkansas pine bluff': 'arkansas pine bluff golden lions',
  'uapb': 'arkansas pine bluff golden lions',
  'southern': 'southern jaguars',
  'southern university': 'southern jaguars',
  'abilene christian': 'abilene christian wildcats',
  'acu': 'abilene christian wildcats',
  'tarleton state': 'tarleton state texans',
  'tarleton': 'tarleton state texans',
  'southern utah': 'southern utah thunderbirds',
  'suu': 'southern utah thunderbirds',
  'west georgia': 'west georgia wolves',
  'uwg': 'west georgia wolves',
  'austin peay': 'austin peay governors',
  'apsu': 'austin peay governors',
  'eastern kentucky': 'eastern kentucky colonels',
  'eku': 'eastern kentucky colonels',
  'central arkansas': 'central arkansas bears',
  'uca': 'central arkansas bears',
  'utah tech': 'utah tech trailblazers',
  'north alabama': 'north alabama lions',
  'una': 'north alabama lions',

  // NFL aliases
  'new england': 'new england patriots',
  'patriots': 'new england patriots',
  'pats': 'new england patriots',
  'bills': 'buffalo bills',
  'dolphins': 'miami dolphins',
  'jets': 'new york jets',
  'steelers': 'pittsburgh steelers',
  'ravens': 'baltimore ravens',
  'bengals': 'cincinnati bengals',
  'browns': 'cleveland browns',
  'jaguars': 'jacksonville jaguars',
  'jags': 'jacksonville jaguars',
  'texans': 'houston texans',
  'colts': 'indianapolis colts',
  'titans': 'tennessee titans',
  'broncos': 'denver broncos',
  'chargers': 'los angeles chargers',
  'chiefs': 'kansas city chiefs',
  'raiders': 'las vegas raiders',
  'eagles': 'philadelphia eagles',
  'cowboys': 'dallas cowboys',
  'commanders': 'washington commanders',
  'redskins': 'washington commanders',
  'giants': 'new york giants',
  'bears': 'chicago bears',
  'packers': 'green bay packers',
  'vikings': 'minnesota vikings',
  'lions': 'detroit lions',
  'panthers': 'carolina panthers',
  'buccaneers': 'tampa bay buccaneers',
  'bucs': 'tampa bay buccaneers',
  'falcons': 'atlanta falcons',
  'saints': 'new orleans saints',
  'seahawks': 'seattle seahawks',
  'rams': 'los angeles rams',
  '49ers': 'san francisco 49ers',
  'cardinals': 'arizona cardinals',
};

// Build a reverse lookup cache for fast access
const _lookupCache = new Map();

/**
 * Get the logo URL for a team name.
 * Handles fuzzy matching via aliases, normalized names, and suffix stripping.
 * @param {string} teamName - The team name to look up
 * @returns {string|null} - The logo URL or null if not found
 */
export const getTeamLogoUrl = (teamName) => {
  if (!teamName) return null;
  
  const key = teamName.toLowerCase().trim();
  
  // Check cache first
  if (_lookupCache.has(key)) return _lookupCache.get(key);
  
  let url = null;
  
  // 1. Direct match in TEAM_LOGOS
  if (TEAM_LOGOS[key]) {
    url = TEAM_LOGOS[key];
  }
  
  // 2. Check aliases
  if (!url && TEAM_ALIASES[key]) {
    url = TEAM_LOGOS[TEAM_ALIASES[key]];
  }
  
  // 3. Try stripping "University", "College" suffixes
  if (!url) {
    const stripped = key
      .replace(/\s+university$/i, '')
      .replace(/\s+college$/i, '')
      .trim();
    if (TEAM_LOGOS[stripped]) url = TEAM_LOGOS[stripped];
    if (!url && TEAM_ALIASES[stripped]) url = TEAM_LOGOS[TEAM_ALIASES[stripped]];
  }
  
  // Cache the result (even null, to avoid repeated lookups)
  _lookupCache.set(key, url);
  return url;
};

/**
 * TeamLogo inline component - renders a small logo image next to team name
 * Returns null if no logo found (graceful fallback)
 */
export const TeamLogo = ({ team, size = 20, style = {} }) => {
  const url = getTeamLogoUrl(team);
  if (!url) return null;
  
  return (
    <img
      src={url}
      alt=""
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'contain',
        verticalAlign: 'middle',
        flexShrink: 0,
        ...style
      }}
      loading="lazy"
      onError={(e) => { e.target.style.display = 'none'; }}
    />
  );
};

/**
 * TeamWithLogo - renders logo + team name together as an inline-flex span
 * Designed for drop-in replacement wherever {teamName} appears
 */
export const TeamWithLogo = ({ team, size = 18, style = {}, nameStyle = {}, logoStyle = {}, gap = '0.4rem' }) => {
  if (!team) return null;
  const url = getTeamLogoUrl(team);
  
  return (
    <span style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap,
      ...style 
    }}>
      {url && (
        <img
          src={url}
          alt=""
          style={{
            width: `${size}px`,
            height: `${size}px`,
            objectFit: 'contain',
            flexShrink: 0,
            ...logoStyle
          }}
          loading="lazy"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}
      <span style={nameStyle}>{team}</span>
    </span>
  );
};

export default TEAM_LOGOS;
