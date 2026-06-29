// field = stats key veya gameUtils'teki COMPUTED haritasındaki hesaplanmış alan
// higher_wins: false → düşük değer kazanır
export const QUESTIONS = [
  // ── KARİYER GOL & ASİST ─────────────────────────────────────────────────────
  { id: 'S01',  text: 'Hangi futbolcu kariyerinde daha fazla gol atmıştır?',                              field: 'career_goals_total',          higher_wins: true,  unit: 'gol' },
  { id: 'S02',  text: 'Hangi futbolcu kariyerinde daha fazla asist yapmıştır?',                          field: 'career_assists_total',         higher_wins: true,  unit: 'asist' },
  { id: 'S03',  text: 'Hangi futbolcunun kariyer gol+asist toplamı daha fazladır?',                      field: 'career_goals_assists',         higher_wins: true,  unit: 'katkı' },
  { id: 'S04',  text: 'Hangi futbolcunun tek sezonda attığı en fazla gol sayısı daha yüksektir?',        field: 'best_season_goals',            higher_wins: true,  unit: 'gol' },
  { id: 'S05',  text: 'Hangi futbolcu tek bir maçta daha fazla gol atmıştır?',                           field: 'best_match_goals',             higher_wins: true,  unit: 'gol' },
  { id: 'S06',  text: 'Hangi futbolcu kariyerinde daha fazla hat-trick yapmıştır?',                      field: 'career_hat_tricks',            higher_wins: true,  unit: 'ht' },
  { id: 'S07',  text: 'Hangi futbolcu kariyerinde daha fazla penaltı golu atmıştır?',                    field: 'career_penalties_scored',      higher_wins: true,  unit: 'gol' },
  { id: 'S08',  text: 'Hangi futbolcu kariyerinde daha fazla serbest vuruş golü atmıştır?',              field: 'free_kick_goals',              higher_wins: true,  unit: 'gol' },
  { id: 'S09',  text: 'Hangi futbolcu kariyerinde yalnızca liglerde daha fazla gol atmıştır?',           field: 'league_goals',                 higher_wins: true,  unit: 'gol' },
  { id: 'S10',  text: 'Hangi futbolcu kariyerinde daha fazla kafa golü atmıştır?',                       field: 'header_goals',                 higher_wins: true,  unit: 'gol' },
  { id: 'S11',  text: 'Hangi futbolcunun tek sezonda yaptığı en fazla asist sayısı daha yüksektir?',     field: 'best_season_assists',          higher_wins: true,  unit: 'asist' },

  // ── VERİMLİLİK / ORAN ────────────────────────────────────────────────────────
  { id: 'S12',  text: 'Hangi futbolcunun kariyer maç başına gol oranı daha yüksektir?',                  field: 'goals_per_game',               higher_wins: true,  unit: 'gol/maç' },
  { id: 'S13',  text: 'Hangi futbolcunun kariyer maç başına asist oranı daha yüksektir?',                field: 'assists_per_game',             higher_wins: true,  unit: 'ast/maç' },
  { id: 'S14',  text: 'Hangi futbolcunun milli maç başına gol oranı daha yüksektir?',                    field: 'intl_goals_per_cap',           higher_wins: true,  unit: 'gol/maç' },
  { id: 'S15',  text: 'Hangi futbolcunun penaltı dönüşüm oranı daha yüksektir?',                         field: 'penalty_conversion_pct',       higher_wins: true,  unit: '%' },
  { id: 'S16',  text: 'Hangi futbolcunun sezon başına ortalama gol sayısı daha fazladır?',               field: 'goals_per_season',             higher_wins: true,  unit: 'gol/sezon' },

  // ── MİLLİ TAKIM ──────────────────────────────────────────────────────────────
  { id: 'S17',  text: 'Hangi futbolcu milli takımında daha fazla gol atmıştır?',                          field: 'international_goals',          higher_wins: true,  unit: 'gol' },
  { id: 'S18',  text: 'Hangi futbolcu daha fazla milli maç oynamıştır?',                                  field: 'international_caps',           higher_wins: true,  unit: 'maç' },
  { id: 'S19',  text: 'Hangi futbolcunun milli takımda daha fazla asisti vardır?',                        field: 'international_assists',        higher_wins: true,  unit: 'asist' },
  { id: 'S20',  text: 'Hangi futbolcunun milli takımda gol+asist toplamı daha yüksektir?',               field: 'intl_goals_assists',           higher_wins: true,  unit: 'katkı' },
  { id: 'S21',  text: 'Hangi futbolcu Dünya Kupası\'nda daha fazla gol atmıştır?',                        field: 'world_cup_goals',              higher_wins: true,  unit: 'gol' },
  { id: 'S22',  text: 'Hangi futbolcu Dünya Kupası\'nda daha fazla maç oynamıştır?',                      field: 'world_cup_appearances',        higher_wins: true,  unit: 'maç' },
  { id: 'S23',  text: 'Hangi futbolcu milli takımda daha uzun yıllar aktif kalmıştır?',                   field: 'international_years_active',   higher_wins: true,  unit: 'yıl' },
  { id: 'S24',  text: 'Hangi futbolcunun milli takımda attığı ilk gol daha erken yaşında gerçekleşmiştir?', field: 'intl_first_goal_age',       higher_wins: false, unit: 'yaş' },

  // ── ŞAMPİYONLAR LİGİ & AVRUPA ───────────────────────────────────────────────
  { id: 'S25',  text: 'Hangi futbolcu Şampiyonlar Ligi\'nde daha fazla gol atmıştır?',                    field: 'ucl_goals',                    higher_wins: true,  unit: 'gol' },
  { id: 'S26',  text: 'Hangi futbolcu Şampiyonlar Ligi\'nde daha fazla maç oynamıştır?',                  field: 'ucl_appearances',              higher_wins: true,  unit: 'maç' },
  { id: 'S27',  text: 'Hangi futbolcu Avrupa Ligi\'nde daha fazla gol atmıştır?',                          field: 'europa_league_goals',          higher_wins: true,  unit: 'gol' },
  { id: 'S28',  text: 'Hangi futbolcunun Avrupa kupalarında attığı toplam gol sayısı daha fazladır?',      field: 'european_goals',               higher_wins: true,  unit: 'gol' },
  { id: 'S29',  text: 'Hangi futbolcu daha fazla Şampiyonlar Ligi finaline çıkmıştır?',                   field: 'ucl_final_appearances',        higher_wins: true,  unit: 'final' },

  // ── KUPA & ÖDÜL ──────────────────────────────────────────────────────────────
  { id: 'S30',  text: 'Hangi futbolcu daha fazla Ballon d\'Or ödülü kazanmıştır?',                        field: 'ballon_dor_wins',              higher_wins: true,  unit: 'ödül' },
  { id: 'S31',  text: 'Hangi futbolcunun kazandığı bireysel ödül sayısı daha fazladır?',                   field: 'individual_awards',            higher_wins: true,  unit: 'ödül' },
  { id: 'S32',  text: 'Hangi futbolcunun kazandığı toplam kupa sayısı daha fazladır?',                     field: 'trophies_total',               higher_wins: true,  unit: 'kupa' },
  { id: 'S33',  text: 'Hangi futbolcu daha fazla kulüp şampiyonluğu kazanmıştır?',                        field: 'club_titles_total',            higher_wins: true,  unit: 'kupa' },
  { id: 'S34',  text: 'Hangi futbolcu kariyerinde daha fazla lig şampiyonluğu kazanmıştır?',              field: 'league_titles',                higher_wins: true,  unit: 'şampiyonluk' },
  { id: 'S35',  text: 'Hangi futbolcu kariyerinde daha fazla Avrupa kupası kazanmıştır? (UCL+EL)',         field: 'european_cups_won',            higher_wins: true,  unit: 'kupa' },
  { id: 'S36',  text: 'Hangi futbolcu milli takımıyla daha fazla uluslararası kupa kazanmıştır?',         field: 'national_trophies',            higher_wins: true,  unit: 'kupa' },
  { id: 'S37',  text: 'Hangi futbolcu kariyerinde daha fazla yerel kupa kazanmıştır?',                    field: 'domestic_cups_won',            higher_wins: true,  unit: 'kupa' },
  { id: 'S38',  text: 'Hangi futbolcu kariyerinde daha fazla Süper Kupa kazanmıştır?',                    field: 'super_cups_won',               higher_wins: true,  unit: 'kupa' },

  // ── KARİYER & KULÜP ──────────────────────────────────────────────────────────
  { id: 'S39',  text: 'Hangi futbolcu kariyerinde daha fazla resmi maç oynamıştır?',                      field: 'career_appearances',           higher_wins: true,  unit: 'maç' },
  { id: 'S40',  text: 'Hangi futbolcu kariyerini daha uzun sürdürmüştür?',                                field: 'years_pro',                    higher_wins: true,  unit: 'yıl' },
  { id: 'S41',  text: 'Hangi futbolcu bir kulüpte daha uzun süre oynamıştır?',                            field: 'longest_club_tenure_years',    higher_wins: true,  unit: 'yıl' },
  { id: 'S42',  text: 'Hangi futbolcu daha fazla kulüpte oynamıştır?',                                    field: 'clubs_count',                  higher_wins: true,  unit: 'kulüp' },
  { id: 'S43',  text: 'Hangi futbolcu daha fazla ülkede oynamıştır?',                                     field: 'countries_played_count',       higher_wins: true,  unit: 'ülke' },
  { id: 'S44',  text: 'Hangi futbolcu daha fazla kıtada oynamıştır?',                                     field: 'continents_played',            higher_wins: true,  unit: 'kıta' },
  { id: 'S45',  text: 'Hangi futbolcu kariyerinde daha fazla farklı ligde oynamıştır?',                   field: 'leagues_count',                higher_wins: true,  unit: 'lig' },
  { id: 'S46',  text: 'Hangi futbolcu kaptan olarak daha fazla maça çıkmıştır?',                          field: 'captain_appearances',          higher_wins: true,  unit: 'maç' },
  { id: 'S47',  text: 'Hangi futbolcu kariyerinde daha fazla kiralık dönem geçirmiştir?',                 field: 'loan_spells',                  higher_wins: true,  unit: 'kez' },

  // ── KART ─────────────────────────────────────────────────────────────────────
  { id: 'S48',  text: 'Hangi futbolcu kariyerinde daha fazla kart görmüştür?',                            field: 'career_cards_total',           higher_wins: true,  unit: 'kart' },
  { id: 'S49',  text: 'Hangi futbolcu kariyerinde daha fazla sarı kart görmüştür?',                       field: 'career_yellow_cards',          higher_wins: true,  unit: 'kart' },
  { id: 'S50',  text: 'Hangi futbolcu kariyerinde daha fazla kırmızı kart görmüştür?',                    field: 'career_red_cards',             higher_wins: true,  unit: 'kart' },
  { id: 'S51',  text: 'Hangi futbolcu daha disiplinli bir kariyer sürdürmüştür? (maç başına az kart)',    field: 'cards_per_game',               higher_wins: false, unit: 'kart/maç' },

  // ── EKONOMİ ──────────────────────────────────────────────────────────────────
  { id: 'S52',  text: 'Hangi futbolcunun kariyerindeki en pahalı transferi daha yüksektir?',              field: 'highest_transfer_fee_m',       higher_wins: true,  unit: 'M€' },
  { id: 'S53',  text: 'Hangi futbolcunun kariyer piyasa değeri zirvesi daha yüksektir?',                  field: 'peak_market_value_m',          higher_wins: true,  unit: 'M€' },
  { id: 'S54',  text: 'Hangi futbolcunun haftalık maaşı daha yüksektir?',                                 field: 'weekly_wage_k',                higher_wins: true,  unit: 'k€/hf' },
  { id: 'S55',  text: 'Hangi futbolcunun tahmini toplam kariyer kazancı daha yüksektir?',                 field: 'career_earnings_m',            higher_wins: true,  unit: 'M€' },
  { id: 'S56',  text: 'Hangi futbolcunun güncel piyasa değeri daha yüksektir?',                           field: 'current_market_value_m',       higher_wins: true,  unit: 'M€' },

  // ── YAŞ & ZAMANLAMA ──────────────────────────────────────────────────────────
  { id: 'S57',  text: 'Hangi futbolcu daha yaşlıdır?',                                                    field: 'age',                          higher_wins: true,  unit: 'yaş' },
  { id: 'S58',  text: 'Hangi futbolcu daha gençtir?',                                                     field: 'age',                          higher_wins: false, unit: 'yaş' },
  { id: 'S59',  text: 'Hangi futbolcu daha önce doğmuştur?',                                              field: 'birth_year',                   higher_wins: false, unit: 'doğum' },
  { id: 'S60',  text: 'Hangi futbolcu daha genç yaşta profesyonel kariyerine başlamıştır?',               field: 'pro_debut_age',                higher_wins: false, unit: 'yaş' },
  { id: 'S61',  text: 'Hangi futbolcu milli takıma daha erken yaşta çıkmıştır?',                         field: 'intl_debut_age',               higher_wins: false, unit: 'yaş' },
  { id: 'S62',  text: 'Hangi futbolcu ilk profesyonel golünü daha erken yaşında atmıştır?',               field: 'first_pro_goal_age',           higher_wins: false, unit: 'yaş' },
  { id: 'S63',  text: 'Hangi futbolcunun kariyerinin zirvesine ulaştığı yaş daha küçüktür?',             field: 'peak_age',                     higher_wins: false, unit: 'yaş' },

  // ── FİZİKSEL ─────────────────────────────────────────────────────────────────
  { id: 'S64',  text: 'Hangi futbolcu daha uzun boyludur?',                                               field: 'height_cm',                    higher_wins: true,  unit: 'cm' },
  { id: 'S65',  text: 'Hangi futbolcu daha kısa boyludur?',                                               field: 'height_cm',                    higher_wins: false, unit: 'cm' },
  { id: 'S66',  text: 'Hangi futbolcu daha ağırdır?',                                                     field: 'weight_kg',                    higher_wins: true,  unit: 'kg' },
  { id: 'S67',  text: 'Hangi futbolcunun sprint hızı daha yüksektir?',                                    field: 'max_sprint_speed_kmh',         higher_wins: true,  unit: 'km/s' },
  { id: 'S68',  text: 'Hangi futbolcunun ayakkabı numarası daha büyüktür?',                               field: 'shoe_size',                    higher_wins: true,  unit: 'no' },

  // ── SOSYAL MEDYA ─────────────────────────────────────────────────────────────
  { id: 'S69',  text: 'Hangi futbolcunun Instagram takipçisi daha fazladır?',                             field: 'instagram_m',                  higher_wins: true,  unit: 'M' },
  { id: 'S70',  text: 'Hangi futbolcunun Twitter/X takipçisi daha fazladır?',                             field: 'twitter_m',                    higher_wins: true,  unit: 'M' },
  { id: 'S71',  text: 'Hangi futbolcunun TikTok takipçisi daha fazladır?',                                field: 'tiktok_m',                     higher_wins: true,  unit: 'M' },
  { id: 'S72',  text: 'Hangi futbolcunun toplam sosyal medya takipçisi daha fazladır?',                   field: 'social_media_total',           higher_wins: true,  unit: 'M' },

  // ── EĞLENCELİ & FARKLI ───────────────────────────────────────────────────────
  { id: 'S73',  text: 'Hangi futbolcunun doğduğu şehrin nüfusu daha fazladır?',                          field: 'birthplace_population',        higher_wins: true,  unit: 'kişi' },
  { id: 'S74',  text: 'Hangi futbolcunun forma numarası daha büyüktür?',                                  field: 'shirt_number',                 higher_wins: true,  unit: 'no' },
  { id: 'S75',  text: 'Hangi futbolcu daha fazla dil konuşmaktadır?',                                     field: 'languages_spoken',             higher_wins: true,  unit: 'dil' },
  { id: 'S76',  text: 'Hangi futbolcunun daha fazla çocuğu vardır?',                                      field: 'children_count',               higher_wins: true,  unit: 'çocuk' },
  { id: 'S77',  text: 'Hangi futbolcunun daha fazla dövmesi vardır?',                                     field: 'tattoo_count',                 higher_wins: true,  unit: 'dövme' },
  { id: 'S78',  text: 'Hangi futbolcunun ülkesinin FIFA dünya sıralaması daha iyidir?',                   field: 'country_fifa_rank',            higher_wins: false, unit: 'sıra' },
  { id: 'S79',  text: 'Hangi futbolcunun tam adı daha uzundur?',                                          field: 'full_name_length',             higher_wins: true,  unit: 'harf' },
  { id: 'S80',  text: 'Hangi futbolcunun doğduğu ülkenin nüfusu daha fazladır?',                         field: 'home_country_population_m',    higher_wins: true,  unit: 'M kişi' },
  { id: 'S81',  text: 'Hangi futbolcunun daha fazla kardeşi vardır?',                                     field: 'siblings_count',               higher_wins: true,  unit: 'kardeş' },
  { id: 'S82',  text: 'Hangi futbolcu daha az sakatlık geçirmiştir?',                                     field: 'injuries_count',               higher_wins: false, unit: 'sakatlık' },
  { id: 'S83',  text: 'Hangi futbolcunun art arda gol attığı en uzun maç serisi daha uzundur?',          field: 'longest_scoring_streak',       higher_wins: true,  unit: 'maç' },
  { id: 'S84',  text: 'Hangi futbolcu kariyerinde daha fazla penaltı kaçırmıştır?',                      field: 'missed_penalties',             higher_wins: true,  unit: 'penaltı' },
  { id: 'S85',  text: 'Hangi futbolcu kendi kalesine daha fazla gol atmıştır?',                          field: 'own_goals',                    higher_wins: true,  unit: 'gol' },
  { id: 'S86',  text: 'Hangi futbolcu Puskás Ödülü\'ne daha fazla aday gösterilmiştir?',                 field: 'puskas_nominations',           higher_wins: true,  unit: 'kez' },
  { id: 'S87',  text: 'Hangi futbolcunun doğduğu ülkenin yüzölçümü daha büyüktür?',                      field: 'home_country_area_km2',        higher_wins: true,  unit: 'km²' },

  // ── SAVUNMA İSTATİSTİKLERİ ───────────────────────────────────────────────────
  { id: 'S88',  text: 'Hangi futbolcu kariyerinde daha fazla müdahale yapmıştır?',                        field: 'career_tackles',               higher_wins: true,  unit: 'müdahale' },
  { id: 'S89',  text: 'Hangi futbolcu kariyerinde daha fazla top çalmıştır?',                             field: 'career_interceptions',         higher_wins: true,  unit: 'top' },
  { id: 'S90',  text: 'Hangi futbolcu kariyerinde daha fazla kafa topu kazanmıştır?',                     field: 'career_aerial_duels_won',      higher_wins: true,  unit: 'kafa' },
  { id: 'S91',  text: 'Hangi futbolcu kariyerinde daha az faul yapmıştır?',                               field: 'career_fouls',                 higher_wins: false, unit: 'faul' },
  { id: 'S92',  text: 'Hangi futbolcu kariyerinde daha fazla uzaklaştırma yapmıştır?',                    field: 'career_clearances',            higher_wins: true,  unit: 'top' },

  // ── KARİYER ZİRVESİ & ÖZEL ───────────────────────────────────────────────────
  { id: 'S93',  text: 'Hangi futbolcu kariyerinde daha fazla sezon MVP ödülü almıştır?',                  field: 'season_mvp_awards',            higher_wins: true,  unit: 'ödül' },
  { id: 'S94',  text: 'Hangi futbolcu daha fazla Dünya Kupası turnuvasına katılmıştır?',                  field: 'world_cup_tournaments',        higher_wins: true,  unit: 'turnuva' },
  { id: 'S95',  text: 'Hangi futbolcu kariyerinde yedek olarak daha fazla sahaya çıkmıştır?',            field: 'substitute_appearances',       higher_wins: true,  unit: 'maç' },
  { id: 'S96',  text: 'Hangi futbolcu kariyerinde daha fazla farklı mevkide oynamıştır?',                field: 'positions_played_count',       higher_wins: true,  unit: 'mevki' },
  { id: 'S97',  text: 'Hangi futbolcu daha fazla kıta kupasında maç oynamıştır? (Euro/Copa/AFCON)',       field: 'continental_cup_appearances',  higher_wins: true,  unit: 'maç' },
  { id: 'S98',  text: 'Hangi futbolcu kariyerinde daha fazla rövaşata golü atmıştır?',                    field: 'bicycle_kick_goals',           higher_wins: true,  unit: 'gol' },
  { id: 'S99',  text: 'Hangi futbolcu kariyerinde daha fazla uzak mesafe golü atmıştır?',                 field: 'long_range_goals',             higher_wins: true,  unit: 'gol' },
  { id: 'S100', text: 'Hangi futbolcunun kariyer boyunca en uzun süredir oynattığı mevki aynıdır?',       field: 'positions_played_count',       higher_wins: false, unit: 'mevki' },
];
