// field = stats key veya gameUtils'teki COMPUTED haritasındaki hesaplanmış alan
// higher_wins: false → düşük değer kazanır
// disabled: true → veri bulunamadı, sonraya bırakıldı (arşiv)
export const QUESTIONS = [
  // ── KARİYER GOL & ASİST ─────────────────────────────────────────────────────
  { id: 'S01',  text: 'Hangi futbolcu kariyerinde daha fazla gol atmıştır?',                              field: 'career_goals_total',          higher_wins: true,  unit: 'gol' },
  { id: 'S02',  text: 'Hangi futbolcu kariyerinde daha fazla asist yapmıştır?',                          field: 'career_assists_total',         higher_wins: true,  unit: 'asist' },
  { id: 'S03',  text: 'Hangi futbolcunun kariyer gol+asist toplamı daha fazladır?',                      field: 'career_goals_assists',         higher_wins: true,  unit: 'katkı' },
  { id: 'S04',  text: 'Hangi futbolcu tek bir sezonda daha fazla gol atmıştır?',                         field: 'best_season_goals',            higher_wins: true,  unit: 'gol' },
  { id: 'S05',  text: 'Hangi futbolcu tek bir maçta daha fazla gol atmıştır?',                           field: 'best_match_goals',             higher_wins: true,  unit: 'gol',    disabled: true },
  { id: 'S06',  text: 'Hangi futbolcu kariyerinde daha fazla hat-trick yapmıştır?',                      field: 'career_hat_tricks',            higher_wins: true,  unit: 'ht' },
  { id: 'S07',  text: 'Hangi futbolcu kariyerinde daha fazla penaltı golu atmıştır?',                    field: 'career_penalties_scored',      higher_wins: true,  unit: 'gol',    disabled: true },
  { id: 'S08',  text: 'Hangi futbolcu kariyerinde daha fazla serbest vuruş golü atmıştır?',              field: 'free_kick_goals',              higher_wins: true,  unit: 'gol',    disabled: true },
  { id: 'S09',  text: 'Hangi futbolcu lig maçlarında daha fazla gol atmıştır?',                          field: 'league_goals',                 higher_wins: true,  unit: 'gol' },
  { id: 'S11',  text: 'Hangi futbolcunun tek sezonda yaptığı en fazla asist sayısı daha yüksektir?',     field: 'best_season_assists',          higher_wins: true,  unit: 'asist',  disabled: true },

  // ── VERİMLİLİK / ORAN ────────────────────────────────────────────────────────
  { id: 'S12',  text: 'Hangi futbolcunun maç başına gol oranı daha yüksektir?',                          field: 'goals_per_game',               higher_wins: true,  unit: 'gol/maç' },
  { id: 'S13',  text: 'Hangi futbolcunun maç başına asist oranı daha yüksektir?',                        field: 'assists_per_game',             higher_wins: true,  unit: 'ast/maç' },
  { id: 'S14',  text: 'Hangi futbolcunun milli maç başına gol oranı daha yüksektir?',                    field: 'intl_goals_per_cap',           higher_wins: true,  unit: 'gol/maç' },
  { id: 'S15',  text: 'Hangi futbolcunun penaltı dönüşüm oranı daha yüksektir?',                         field: 'penalty_conversion_pct',       higher_wins: true,  unit: '%',      disabled: true },
  { id: 'S16',  text: 'Hangi futbolcu sezon başına daha fazla gol atmıştır?',                            field: 'goals_per_season',             higher_wins: true,  unit: 'gol/sezon' },

  // ── MİLLİ TAKIM ──────────────────────────────────────────────────────────────
  { id: 'S17',  text: 'Hangi futbolcu milli takımında daha fazla gol atmıştır?',                          field: 'international_goals',          higher_wins: true,  unit: 'gol' },
  { id: 'S18',  text: 'Hangi futbolcu daha fazla milli maç oynamıştır?',                                  field: 'international_caps',           higher_wins: true,  unit: 'maç' },
  { id: 'S19',  text: 'Hangi futbolcunun milli takımda daha fazla asisti vardır?',                        field: 'international_assists',        higher_wins: true,  unit: 'asist',  disabled: true },
  { id: 'S20',  text: 'Hangi futbolcunun milli takımda gol+asist toplamı daha yüksektir?',               field: 'intl_goals_assists',           higher_wins: true,  unit: 'katkı' },
  { id: 'S21',  text: 'Hangi futbolcu Dünya Kupası\'nda daha fazla gol atmıştır?',                        field: 'world_cup_goals',              higher_wins: true,  unit: 'gol' },
  { id: 'S22',  text: 'Hangi futbolcu Dünya Kupası\'nda daha fazla maç oynamıştır?',                      field: 'world_cup_appearances',        higher_wins: true,  unit: 'maç',    disabled: true },
  { id: 'S23',  text: 'Hangi futbolcu milli takımda daha uzun yıllar aktif kalmıştır?',                   field: 'international_years_active',   higher_wins: true,  unit: 'yıl',   disabled: true },
  { id: 'S24',  text: 'Hangi futbolcunun milli takımda attığı ilk gol daha erken yaşında gerçekleşmiştir?', field: 'intl_first_goal_age',       higher_wins: false, unit: 'yaş',   disabled: true },

  // ── ŞAMPİYONLAR LİGİ & AVRUPA ───────────────────────────────────────────────
  { id: 'S25',  text: 'Hangi futbolcu Şampiyonlar Ligi\'nde daha fazla gol atmıştır?',                    field: 'ucl_goals',                    higher_wins: true,  unit: 'gol' },
  { id: 'S26',  text: 'Hangi futbolcu Şampiyonlar Ligi\'nde daha fazla maç oynamıştır?',                  field: 'ucl_appearances',              higher_wins: true,  unit: 'maç' },
  { id: 'S27',  text: 'Hangi futbolcu Avrupa Ligi\'nde daha fazla gol atmıştır?',                          field: 'europa_league_goals',          higher_wins: true,  unit: 'gol',    disabled: true },
  { id: 'S28',  text: 'Hangi futbolcu Avrupa kupalarında daha fazla gol atmıştır?',                       field: 'european_goals',               higher_wins: true,  unit: 'gol' },
  { id: 'S29',  text: 'Hangi futbolcu daha fazla Şampiyonlar Ligi finaline çıkmıştır?',                   field: 'ucl_final_appearances',        higher_wins: true,  unit: 'final', disabled: true },

  // ── KUPA & ÖDÜL ──────────────────────────────────────────────────────────────
  { id: 'S30',  text: 'Hangi futbolcu daha fazla Ballon d\'Or ödülü kazanmıştır?',                        field: 'ballon_dor_wins',              higher_wins: true,  unit: 'ödül', zero_valid: true },
  { id: 'S31',  text: 'Hangi futbolcunun kazandığı bireysel ödül sayısı daha fazladır?',                   field: 'individual_awards',            higher_wins: true,  unit: 'ödül', disabled: true },
  { id: 'S32',  text: 'Hangi futbolcu kariyerinde toplamda daha fazla kupa kazanmıştır?',                  field: 'trophies_total',               higher_wins: true,  unit: 'kupa' },
  { id: 'S33',  text: 'Hangi futbolcu daha fazla kulüp şampiyonluğu kazanmıştır?',                        field: 'club_titles_total',            higher_wins: true,  unit: 'kupa' },
  { id: 'S34',  text: 'Hangi futbolcu kariyerinde daha fazla lig şampiyonluğu kazanmıştır?',              field: 'league_titles',                higher_wins: true,  unit: 'şampiyonluk', disabled: true },
  { id: 'S35',  text: 'Hangi futbolcu kariyerinde daha fazla Avrupa kupası kazanmıştır? (UCL+EL)',         field: 'european_cups_won',            higher_wins: true,  unit: 'kupa', disabled: true },
  { id: 'S36',  text: 'Hangi futbolcu milli takımıyla daha fazla uluslararası kupa kazanmıştır?',         field: 'national_trophies',            higher_wins: true,  unit: 'kupa', disabled: true },
  { id: 'S37',  text: 'Hangi futbolcu kariyerinde daha fazla yerel kupa kazanmıştır?',                    field: 'domestic_cups_won',            higher_wins: true,  unit: 'kupa', disabled: true },
  { id: 'S38',  text: 'Hangi futbolcu kariyerinde daha fazla Süper Kupa kazanmıştır?',                    field: 'super_cups_won',               higher_wins: true,  unit: 'kupa', disabled: true },

  // ── KARİYER & KULÜP ──────────────────────────────────────────────────────────
  { id: 'S39',  text: 'Hangi futbolcu kariyerinde daha fazla resmi maç oynamıştır?',                      field: 'career_appearances',           higher_wins: true,  unit: 'maç' },
  { id: 'S40',  text: 'Hangi futbolcu kariyerini daha uzun sürdürmüştür?',                                field: 'years_pro',                    higher_wins: true,  unit: 'yıl' },
  { id: 'S41',  text: 'Hangi futbolcu bir kulüpte daha uzun süre oynamıştır?',                            field: 'longest_club_tenure_years',    higher_wins: true,  unit: 'yıl' },
  { id: 'S42',  text: 'Hangi futbolcu daha fazla kulüpte oynamıştır?',                                    field: 'clubs_count',                  higher_wins: true,  unit: 'kulüp' },
  { id: 'S43',  text: 'Hangi futbolcu daha fazla ülkede oynamıştır?',                                     field: 'countries_played_count',       higher_wins: true,  unit: 'ülke' },
  { id: 'S44',  text: 'Hangi futbolcu daha fazla kıtada oynamıştır?',                                     field: 'continents_played',            higher_wins: true,  unit: 'kıta', disabled: true },
  { id: 'S45',  text: 'Hangi futbolcu kariyerinde daha fazla farklı ligde oynamıştır?',                   field: 'leagues_count',                higher_wins: true,  unit: 'lig',  disabled: true },
  { id: 'S47',  text: 'Hangi futbolcu kariyerinde daha fazla kiralık dönem geçirmiştir?',                 field: 'loan_spells',                  higher_wins: true,  unit: 'kez',  disabled: true },

  // ── KART ─────────────────────────────────────────────────────────────────────
  { id: 'S48',  text: 'Hangi futbolcu kariyerinde daha fazla kart görmüştür?',                            field: 'career_cards_total',           higher_wins: true,  unit: 'kart' },
  { id: 'S49',  text: 'Hangi futbolcu kariyerinde daha fazla sarı kart görmüştür?',                       field: 'career_yellow_cards',          higher_wins: true,  unit: 'kart',   disabled: true },
  { id: 'S50',  text: 'Hangi futbolcu kariyerinde daha fazla kırmızı kart görmüştür?',                    field: 'career_red_cards',             higher_wins: true,  unit: 'kart',   disabled: true },
  { id: 'S51',  text: 'Hangi futbolcu maç başına daha az kart görmüştür?',                               field: 'cards_per_game',               higher_wins: false, unit: 'kart/maç' },

  // ── EKONOMİ ──────────────────────────────────────────────────────────────────
  { id: 'S52',  text: 'Hangi futbolcunun en yüksek transfer bedeli daha fazladır?',                       field: 'highest_transfer_fee_m',       higher_wins: true,  unit: 'M€' },
  { id: 'S53',  text: 'Hangi futbolcunun kariyerindeki en yüksek piyasa değeri daha fazladır?',           field: 'peak_market_value_m',          higher_wins: true,  unit: 'M€' },
  { id: 'S54',  text: 'Hangi futbolcunun haftalık maaşı daha yüksektir?',                                 field: 'weekly_wage_k',                higher_wins: true,  unit: 'k€/hf' },
  { id: 'S55',  text: 'Hangi futbolcu kariyerinde toplamda daha fazla para kazanmıştır?',                 field: 'career_earnings_m',            higher_wins: true,  unit: 'M€' },
  { id: 'S56',  text: 'Hangi futbolcunun güncel piyasa değeri daha yüksektir?',                           field: 'current_market_value_m',       higher_wins: true,  unit: 'M€',   disabled: true },

  // ── YAŞ & ZAMANLAMA ──────────────────────────────────────────────────────────
  { id: 'S57',  text: 'Hangi futbolcu daha yaşlıdır?',                                                    field: 'age',                          higher_wins: true,  unit: 'yaş' },
  { id: 'S58',  text: 'Hangi futbolcu daha gençtir?',                                                     field: 'age',                          higher_wins: false, unit: 'yaş' },
  { id: 'S59',  text: 'Hangi futbolcu daha önce doğmuştur?',                                              field: 'birth_year',                   higher_wins: false, unit: 'doğum' },
  { id: 'S60',  text: 'Hangi futbolcu profesyonel kariyerine daha erken başlamıştır?',                    field: 'pro_debut_age',                higher_wins: false, unit: 'yaş' },
  { id: 'S61',  text: 'Hangi futbolcu milli takıma daha erken yaşta çıkmıştır?',                         field: 'intl_debut_age',               higher_wins: false, unit: 'yaş' },

  // ── FİZİKSEL ─────────────────────────────────────────────────────────────────
  { id: 'S64',  text: 'Hangi futbolcu daha uzun boyludur?',                                               field: 'height_cm',                    higher_wins: true,  unit: 'cm' },
  { id: 'S65',  text: 'Hangi futbolcu daha kısa boyludur?',                                               field: 'height_cm',                    higher_wins: false, unit: 'cm' },
  { id: 'S66',  text: 'Hangi futbolcu daha ağırdır?',                                                     field: 'weight_kg',                    higher_wins: true,  unit: 'kg' },

  // ── SOSYAL MEDYA ─────────────────────────────────────────────────────────────
  { id: 'S69',  text: 'Hangi futbolcunun Instagram takipçisi daha fazladır?',                             field: 'instagram_m',                  higher_wins: true,  unit: 'M' },
  { id: 'S70',  text: 'Hangi futbolcunun Twitter/X takipçisi daha fazladır?',                             field: 'twitter_m',                    higher_wins: true,  unit: 'M',    disabled: true },
  { id: 'S71',  text: 'Hangi futbolcunun TikTok takipçisi daha fazladır?',                                field: 'tiktok_m',                     higher_wins: true,  unit: 'M',    disabled: true },
  { id: 'S72',  text: 'Hangi futbolcunun toplam sosyal medya takipçisi daha fazladır?',                   field: 'social_media_total',           higher_wins: true,  unit: 'M' },

  // ── EĞLENCELİ & FARKLI ───────────────────────────────────────────────────────
  { id: 'S73',  text: 'Hangi futbolcunun doğduğu şehrin nüfusu daha fazladır?',                          field: 'birthplace_population',        higher_wins: true,  unit: 'kişi' },
  { id: 'S74',  text: 'Hangi futbolcunun forma numarası daha büyüktür?',                                  field: 'shirt_number',                 higher_wins: true,  unit: 'no' },
  { id: 'S78',  text: 'Hangi futbolcunun ülkesinin FIFA dünya sıralaması daha iyidir?',                   field: 'country_fifa_rank',            higher_wins: false, unit: 'sıra' },
  { id: 'S79',  text: 'Hangi futbolcunun tam adı daha uzundur?',                                          field: 'full_name_length',             higher_wins: true,  unit: 'harf' },
  { id: 'S80',  text: 'Hangi futbolcunun doğduğu ülkenin nüfusu daha fazladır?',                         field: 'home_country_population_m',    higher_wins: true,  unit: 'M kişi' },
  { id: 'S86',  text: 'Hangi futbolcu Puskás Ödülü\'ne daha fazla aday gösterilmiştir?',                 field: 'puskas_nominations',           higher_wins: true,  unit: 'kez',  disabled: true },
  { id: 'S87',  text: 'Hangi futbolcunun doğduğu ülkenin yüzölçümü daha büyüktür?',                      field: 'home_country_area_km2',        higher_wins: true,  unit: 'km²' },

  // ── KARİYER ZİRVESİ & ÖZEL ───────────────────────────────────────────────────
  { id: 'S93',  text: 'Hangi futbolcu kariyerinde daha fazla sezon MVP ödülü almıştır?',                  field: 'season_mvp_awards',            higher_wins: true,  unit: 'ödül', disabled: true },
  { id: 'S94',  text: 'Hangi futbolcu daha fazla Dünya Kupası turnuvasına katılmıştır?',                  field: 'world_cup_tournaments',        higher_wins: true,  unit: 'turnuva', disabled: true },
  { id: 'S97',  text: 'Hangi futbolcu daha fazla kıta kupasında maç oynamıştır? (Euro/Copa/AFCON)',       field: 'continental_cup_appearances',  higher_wins: true,  unit: 'maç',  disabled: true },

  // ── TERS SORULAR ─────────────────────────────────────────────────────────────
  { id: 'S101', text: 'Hangi futbolcunun forma numarası daha küçüktür?',                                  field: 'shirt_number',                 higher_wins: false, unit: 'no' },
  { id: 'S102', text: 'Hangi futbolcu kariyerini daha erken noktalamıştır?',                              field: 'years_pro',                    higher_wins: false, unit: 'yıl' },
  { id: 'S103', text: 'Hangi futbolcu daha az kulüpte oynamıştır? (sadık kariyer)',                       field: 'clubs_count',                  higher_wins: false, unit: 'kulüp' },
  { id: 'S104', text: 'Hangi futbolcu kariyerinde daha az ülkede oynamıştır?',                            field: 'countries_played_count',       higher_wins: false, unit: 'ülke' },
  { id: 'S105', text: 'Hangi futbolcu daha hafiftir?',                                                    field: 'weight_kg',                    higher_wins: false, unit: 'kg' },
  { id: 'S106', text: 'Hangi futbolcunun Instagram takipçisi daha azdır?',                                field: 'instagram_m',                  higher_wins: false, unit: 'M' },
  { id: 'S107', text: 'Hangi futbolcunun kariyerindeki en yüksek piyasa değeri daha düşüktür?',           field: 'peak_market_value_m',          higher_wins: false, unit: 'M€' },
  { id: 'S108', text: 'Hangi futbolcu kariyerinde daha az resmi maç oynamıştır?',                         field: 'career_appearances',           higher_wins: false, unit: 'maç' },
  { id: 'S109', text: 'Hangi futbolcu kariyerinde daha az hat-trick yapmıştır?',                          field: 'career_hat_tricks',            higher_wins: false, unit: 'ht' },
  { id: 'S110', text: 'Hangi futbolcunun doğduğu şehrin nüfusu daha azdır?',                             field: 'birthplace_population',        higher_wins: false, unit: 'kişi' },
  { id: 'S111', text: 'Hangi futbolcu daha az milli maç oynamıştır?',                                     field: 'international_caps',           higher_wins: false, unit: 'maç' },
  { id: 'S112', text: 'Hangi futbolcunun haftalık maaşı daha düşüktür?',                                  field: 'weekly_wage_k',                higher_wins: false, unit: 'k€/hf' },
  { id: 'S113', text: 'Hangi futbolcunun en yüksek transfer bedeli daha düşüktür?',                       field: 'highest_transfer_fee_m',       higher_wins: false, unit: 'M€' },
  { id: 'S114', text: 'Hangi futbolcu daha az gol atmıştır?',                                             field: 'career_goals_total',           higher_wins: false, unit: 'gol' },
  { id: 'S115', text: 'Hangi futbolcu daha az asist yapmıştır?',                                          field: 'career_assists_total',         higher_wins: false, unit: 'asist' },
  { id: 'S117', text: 'Hangi futbolcu kariyere daha geç yaşta başlamıştır?',                              field: 'pro_debut_age',                higher_wins: true,  unit: 'yaş' },
  { id: 'S118', text: 'Hangi futbolcunun tek bir kulüpte geçirdiği en uzun süre daha kısadır?',           field: 'longest_club_tenure_years',    higher_wins: false, unit: 'yıl' },

  // ── HESAPLANMIŞ ORAN SORULARI ────────────────────────────────────────────────
  { id: 'S119', text: 'Hangi futbolcu sezon başına daha fazla kupa kazanmıştır?',                          field: 'titles_per_season',            higher_wins: true,  unit: 'kupa/sn' },
  { id: 'S120', text: 'Hangi futbolcunun kulüp başına gol ortalaması daha yüksektir?',                    field: 'goals_per_club',               higher_wins: true,  unit: 'gol/kulüp' },
  { id: 'S121', text: 'Hangi futbolcu yılda daha sık milli maça çıkmıştır?',                              field: 'caps_per_year',                higher_wins: true,  unit: 'maç/yıl' },
  { id: 'S122', text: 'Hangi futbolcunun attığı gollerin daha büyük bölümü Şampiyonlar Ligi\'nden gelmiştir?', field: 'ucl_goal_ratio',         higher_wins: true,  unit: '%' },
  { id: 'S123', text: 'Hangi futbolcunun maç başına gol+asist katkısı daha yüksektir?',                   field: 'involvement_per_game',         higher_wins: true,  unit: 'katkı/maç' },
  { id: 'S124', text: 'Hangi futbolcunun attığı gollerin daha büyük bölümü milli takımla gelmiştir?',     field: 'intl_goal_ratio',              higher_wins: true,  unit: '%' },
  { id: 'S125', text: 'Hangi futbolcunun vücut kitle endeksi (BMI) daha yüksektir?',                      field: 'bmi',                          higher_wins: true,  unit: 'kg/m²' },
  { id: 'S126', text: 'Hangi futbolcu yılda ortalama daha fazla kulüp değiştirmiştir?',                   field: 'clubs_per_year',               higher_wins: true,  unit: 'kulüp/yıl' },
  { id: 'S127', text: 'Hangi futbolcunun kariyer zirvesindeki piyasa değeri, oynadığı maç başına daha yüksektir?', field: 'value_per_game',          higher_wins: true,  unit: 'k€/maç' },
  { id: 'S128', text: 'Hangi futbolcunun oynadığı maçların daha büyük bölümü milli takımla olmuştur?',    field: 'intl_ratio',                   higher_wins: true,  unit: '%' },
  { id: 'S129', text: 'Hangi futbolcu yılda daha fazla milli gol atmıştır?',                              field: 'intl_goals_per_year',          higher_wins: true,  unit: 'gol/yıl' },
  { id: 'S130', text: 'Hangi futbolcunun Dünya Kupası\'ndaki gol oranı (gol/maç) daha yüksektir?',        field: 'wc_goals_per_game',            higher_wins: true,  unit: 'gol/maç', disabled: true },
];
