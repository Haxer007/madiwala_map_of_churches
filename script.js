// Madiwala coordinates (approximate center)
const MADIWALA_CENTER = [12.926534, 77.608854];

// Sample data for temples, churches, and schools in Madiwala area
const locations = {
    temples: [
        {
            name: "Shri Ganesha Devasthana",
            lat: 12.923067999999999,
            lng: 77.6192799
        },
        {
            name: "Shri Chandramouleshwara Temple",
            lat: 12.9340753,
            lng: 77.6013842
        },
        {
            name: "Alada Mara (Peepal Tree) and Naga Temple",
            lat: 12.920699899999999,
            lng: 77.6118556
        },
        {
            name: "Shri Gundlu Muneshwara Swamy Devasthana",
            lat: 12.9361863,
            lng: 77.6067995
        },
        {
            name: "Shri Ayyappaswamy Devasthana",
            lat: 12.9325877,
            lng: 77.6101983
        },
        {
            name: "Ganapathi Temple",
            lat: 12.9312743,
            lng: 77.60082
        },
        {
            name: "Sri sri Annapoorneswari Devastanam",
            lat: 12.9314053,
            lng: 77.606588
        },
        {
            name: "Shri Annamma Devi Shri Muneshwara Swamy Devasthana",
            lat: 12.9310643,
            lng: 77.6130312
        },
        {
            name: "Annapurneshwari Temple",
            lat: 12.9314096,
            lng: 77.6067619
        },
        {
            name: "Shri Mahaganapati Seva Samithi(regd)",
            lat: 12.929964499999999,
            lng: 77.6023475
        },
        {
            name: "Hindu Temple",
            lat: 12.9293655,
            lng: 77.6094219
        },
        {
            name: "Nallagangamma sollapuramma selam kotte mareeamman ugra kolapuramma temple",
            lat: 12.9286385,
            lng: 77.6093199
        },
        {
            name: "Sri Abhaya anjaneya Swamy Prasanna Devasthana",
            lat: 12.9294659,
            lng: 77.6095753
        },
        {
            name: "Srinsubramanya swamy temple",
            lat: 12.9302253,
            lng: 77.60694649999999
        },
        {
            name: "Shri sallapuramma, Shri mulkatamma,and Shri Venkateswara Swamy temple.",
            lat: 12.9289361,
            lng: 77.60860819999999
        },
        {
            name: "Shiva Temple and Paakathopu Muneshwara Swamy Temple",
            lat: 12.9281708,
            lng: 77.6048064
        },
        {
            name: "Shri Sathyanarayana Swamy Devasthana",
            lat: 12.9266501,
            lng: 77.61117279999999
        },
        {
            name: "ಶ್ರೀ ಗಂಗಮ್ಮ, ಸಲ್ಲಾಪುರಮ್ಮ ದೇವಿ ದೇವಸ್ಥಾನ",
            lat: 12.9286202,
            lng: 77.6087713
        },
        {
            name: "Brahma Kumaris Rajyoga Meditation Centre",
            lat: 12.926869499999999,
            lng: 77.6109704
        },
        {
            name: "SRI MAHA GANAPATHI TEMPLE",
            lat: 12.9273104,
            lng: 77.6073976
        },
        {
            name: "Sri Kodanda Rama Swamy Devasthana",
            lat: 12.925574699999999,
            lng: 77.60554859999999
        },
        {
            name: "Om Sri Muneswara Swamy Devasthana",
            lat: 12.9177736,
            lng: 77.6098067
        },
        {
            name: "Sri Vidya Ganapati temple",
            lat: 12.923689399999999,
            lng: 77.6072891
        },
        {
            name: "Sri Yellamma Muniswara Nagadevatha Temple",
            lat: 12.923915899999999,
            lng: 77.6050293
        },
        {
            name: "Shri Ram Temple",
            lat: 12.9255488,
            lng: 77.6065014
        },
        {
            name: "Sree Ayyappa Temple ಶ್ರೀ ಅಯ್ಯಪ್ಪ ಗುಡಿ",
            lat: 12.9242893,
            lng: 77.6033441
        },
        {
            name: "Prasanna Ganapathi Temple",
            lat: 12.9211444,
            lng: 77.6030505
        },
        {
            name: "Shri Ganesha Devasthana",
            lat: 12.920989599999999,
            lng: 77.6062488
        },
        {
            name: "Muneswara Devastana",
            lat: 12.9165076,
            lng: 77.6045579
        },
        {
            name: "Shri Omkareshwara Swamy Temple (BTM layout)",
            lat: 12.916891399999999,
            lng: 77.6025464
        },
        {
            name: "Sri Shirdi Saibaba Ananda Ashrama",
            lat: 12.9181476,
            lng: 77.60205789999999
        },
        {
            name: "Shri Ganesha Devasthana",
            lat: 12.9212373,
            lng: 77.60305129999999
        },
        {
            name: "Sri Vijaya Vidya Ganapati temple",
            lat: 12.9181815,
            lng: 77.6072804
        },
        {
            name: "Tavarekare sri sheneishchara swamy temple",
            lat: 12.9220816,
            lng: 77.6103582
        },
        {
            name: "Sheneshchara temple",
            lat: 12.9245489,
            lng: 77.61774299999999
        },
        {
            name: "Shri Ganesha Temple",
            lat: 12.926076,
            lng: 77.6138825
        },
        {
            name: "Tavarkere sri muneswara devastana",
            lat: 12.924902099999999,
            lng: 77.609053
        },
        {
            name: "Veeranjaneya swamy temple",
            lat: 12.92662,
            lng: 77.61474869999999
        },
        {
            name: "Shri Srinivasa Swamy Devasthana",
            lat: 12.926547,
            lng: 77.61461489999999
        },
        {
            name: "Tavarekere Shri Ganesha Temple",
            lat: 12.9222191,
            lng: 77.6099665
        },
        {
            name: "Sri Rama Devasthana",
            lat: 12.9242796,
            lng: 77.6143802
        },
        {
            name: "Shri Ayyappa Swami Seva Samiti (Madiwala)",
            lat: 12.9242484,
            lng: 77.6181478
        },
        {
            name: "Shri OM Shakti Temple",
            lat: 12.922673699999999,
            lng: 77.61556139999999
        },
        {
            name: "Mahashakti Madduramma Temple",
            lat: 12.9213101,
            lng: 77.6090356
        },
        {
            name: "Sri Kanneshwara Swamy Temple",
            lat: 12.9213665,
            lng: 77.6090938
        },
        {
            name: "Shri Shanimahathma Swamy Devasthana",
            lat: 12.921007,
            lng: 77.6099144
        },
        {
            name: "Shree Adishakti Katerammana Temple",
            lat: 12.9207219,
            lng: 77.6148529
        },
        {
            name: "Shri Dharmaraya Swamy Temple",
            lat: 12.9215036,
            lng: 77.6090579
        },
        {
            name: "Nagamma Devasthana",
            lat: 12.920010399999999,
            lng: 77.6168806
        },
        {
            name: "Prasanna Veerajanaya Swamy Temple",
            lat: 12.9224842,
            lng: 77.6109051
        },
        {
            name: "Shri Madduramma Thayi Temple",
            lat: 12.9212045,
            lng: 77.60909649999999
        },
        {
            name: "Shri Renukamba Thayi Temple",
            lat: 12.920602299999999,
            lng: 77.6119106
        },
        {
            name: "Shri Balamuri Ganapati Temple",
            lat: 12.9216394,
            lng: 77.61641039999999
        },
        {
            name: "Sri Muneshwara Swamy Devasthana",
            lat: 12.9214174,
            lng: 77.6136921
        },
        {
            name: "Shri Mariamma Devi Temple",
            lat: 12.9200152,
            lng: 77.6120454
        },
        {
            name: "Shri Gundu Muneshwara Swamy Temple",
            lat: 12.9200839,
            lng: 77.6122553
        },
        {
            name: "Shri Anjaneya Swamy Devasthana",
            lat: 12.9223726,
            lng: 77.61934939999999
        },
        {
            name: "Sri Balmuri Vinayaka Temple",
            lat: 12.9196305,
            lng: 77.61837179999999
        },
        {
            name: "Shri Renuka Yellamma Devi Devasthana",
            lat: 12.9190673,
            lng: 77.6178516
        },
        {
            name: "Venkateswara temple",
            lat: 12.918553,
            lng: 77.6178802
        },
        {
            name: "Sheneswara temple",
            lat: 12.9184886,
            lng: 77.6174533
        },
        {
            name: "Shri Prasanna Parvathi Sametha Shri Someshwara Swami Temple",
            lat: 12.9180871,
            lng: 77.6185435
        },
        {
            name: "Sri Adi Parashakthi Yellamma Temple",
            lat: 12.9167597,
            lng: 77.6172165
        },
        {
            name: "Shri Adi Shakthi Marammana Devasthana",
            lat: 12.917369599999999,
            lng: 77.6179884
        }
    ],
    mosque: [
        {
            name: "Masjid Noor Fathima",
            lat: 12.925744199999999,
            lng: 77.604258
        },
        {
            name: "Masjid E Khaif",
            lat: 12.9208853,
            lng: 77.6137947
        },
        {
            name: "Masjid Umar-e-Farooq",
            lat: 12.9193635,
            lng: 77.61343629999999
        },
        {
            name: "Bismillah Masjid",
            lat: 12.927339199999999,
            lng: 77.6024753
        },
        {
            name: "Madrasa Arabia Taleem ul Quran",
            lat: 12.926878799999999,
            lng: 77.60233029999999
        },
        {
            name: "Masjid Noor Fathima",
            lat: 12.9258119,
            lng: 77.6041855
        },
        {
            name: "Madarasa Arabia Babul firdouse",
            lat: 12.923029,
            lng: 77.6048661
        },
        {
            name: "Masjid e Munawara",
            lat: 12.9241443,
            lng: 77.6043664
        },
        {
            name: "Masjid e Rasoolullah (Ahle Sunnat)",
            lat: 12.9249662,
            lng: 77.6054161
        },
        {
            name: "Jamia faizane ghouse azam",
            lat: 12.9233195,
            lng: 77.60179629999999
        },
        {
            name: "Masjid-E- Shabab Ul Islam مسجدِ شباب الاسلام",
            lat: 12.923058399999999,
            lng: 77.60224889999999
        },
        {
            name: "Masjid Abu Bakr Siddique مسجدِ ابو بکر صدیق ؓ",
            lat: 12.922865199999999,
            lng: 77.6060591
        },
        {
            name: "Masjid E Abdus Subhan مسجد عبدالسبحان",
            lat: 12.921765299999999,
            lng: 77.6058152
        },
        {
            name: "Masjid - e- Ar-Rahman",
            lat: 12.922451599999999,
            lng: 77.6048994
        },
        {
            name: "Kerala Salafi Masjid",
            lat: 12.917202,
            lng: 77.60593109999999
        },
        {
            name: "Masjid Mouzzam",
            lat: 12.9181154,
            lng: 77.6061836
        },
        {
            name: "Masjid E Bilal",
            lat: 12.9208199,
            lng: 77.5997447
        },
        {
            name: "Madrasa E Arabia Maariful Quran Masjid E Mina",
            lat: 12.919458899999999,
            lng: 77.6021397
        },
        {
            name: "Masjid-E-Mina",
            lat: 12.919647,
            lng: 77.6021189
        },
        {
            name: "Masjid -e Mukkaram مسجدِ مکرم",
            lat: 12.9201415,
            lng: 77.6044892
        },
        {
            name: "Masjid Salafiyah",
            lat: 12.9210623,
            lng: 77.6019677
        },
        {
            name: "Masjid E Usman Ibne Affan",
            lat: 12.9193973,
            lng: 77.6056424
        },
        {
            name: "Madeena Masjid",
            lat: 12.9205297,
            lng: 77.608704
        },
        {
            name: "Madeena Masjid",
            lat: 12.9203856,
            lng: 77.6087371
        },
        {
            name: "Madrasa Zaheeria Deeniyat",
            lat: 12.922368899999999,
            lng: 77.61849099999999
        }
    ],
    bars_pubs: [
        {
            name: "Brother’s Bar",
            lat: 12.9358072,
            lng: 77.60860699999999
        },
        {
            name: "Avon Bar And Kitchen",
            lat: 12.935865,
            lng: 77.6083967
        },
        {
            name: "Costal waves Bar",
            lat: 12.9357131,
            lng: 77.6086419
        },
        {
            name: "404 by ToF",
            lat: 12.9342265,
            lng: 77.6101434
        },
        {
            name: "Nebula Pub",
            lat: 12.935602099999999,
            lng: 77.60870249999999
        },
        {
            name: "Pushpa spirit junction (MRP   10)",
            lat: 12.9307827,
            lng: 77.6096817
        },
        {
            name: "Vishwas Bar and Restaurant",
            lat: 12.9281771,
            lng: 77.6091975
        },
        {
            name: "R.P.R Bar",
            lat: 12.9238541,
            lng: 77.61843739999999
        },
        {
            name: "Vanilla Spirit Zone",
            lat: 12.9253942,
            lng: 77.6088911
        },
        {
            name: "Invitation Resto -Bar",
            lat: 12.927315499999999,
            lng: 77.6163909
        },
        {
            name: "De Smoke",
            lat: 12.9263122,
            lng: 77.6156304
        },
        {
            name: "King of Beers",
            lat: 12.9231581,
            lng: 77.61458569999999
        },
        {
            name: "Chnadramohan Bar",
            lat: 12.9201895,
            lng: 77.6105366
        },
        {
            name: "New Friends Pub",
            lat: 12.916807799999999,
            lng: 77.6123417
        },
        {
            name: "Gangothri Bar",
            lat: 12.9195043,
            lng: 77.6128299
        },
        {
            name: "R K TONIK",
            lat: 12.9166566,
            lng: 77.6008736
        }
    ],
    hospitals: [
        {
            name: "Government Maternity Hospital Tavarekere",
            lat: 12.9214696,
            lng: 77.609993
        },
        {
            name: "Dental Clinic",
            lat: 12.920336299999999,
            lng: 77.60804619999999
        },
        {
            name: "BTM Diagnostic Centre",
            lat: 12.920887899999999,
            lng: 77.6059329
        },
        {
            name: "Kareem ENT",
            lat: 12.918781599999999,
            lng: 77.6058814
        },
        {
            name: "zam zam multispecialty health care",
            lat: 12.917651,
            lng: 77.60357139999999
        },
        {
            name: "Vedam Ayurveda multi-speciality Hospital",
            lat: 12.9173092,
            lng: 77.6022643
        },
        {
            name: "Sri Sai Dental and ENT Care Center",
            lat: 12.917375499999999,
            lng: 77.6020978
        },
        {
            name: "Jayadeva Hospital Bengaluru",
            lat: 12.9178903,
            lng: 77.59920749999999
        },
        {
            name: "Sri Jayadeva Institute and Hospital",
            lat: 12.9196438,
            lng: 77.5998195
        },
        {
            name: "Shifa Family Clinic",
            lat: 12.917983699999999,
            lng: 77.60720529999999
        },
        {
            name: "Dr. Mudit Kedia | Consult With Best Dentist Doctor Near Me | Bruxism |",
            lat: 12.918481799999999,
            lng: 77.6175533
        }
    ],
    churches: [
        {
            name: "Zion AG Church",
            lat: 12.9255995,
            lng: 77.6154682
        },
        {
            name: "RCM Church, Gracious Church",
            lat: 12.9214101,
            lng: 77.618253
        },
        {
            name: "ECI Gracious Church",
            lat: 12.9212986,
            lng: 77.6157331
        },
        {
            name: "Madiwala Ebenezer Prayer Ministries",
            lat: 12.9190697,
            lng: 77.6147426
        },
        {
            name: "Christ Resurrected Ministries",
            lat: 12.9208405,
            lng: 77.6165715
        },
        {
            name: "Faithcity Church [COG]",
            lat: 12.9220996,
            lng: 77.6018396
        },
        {
            name: "Gilgal Prayer Hall",
            lat: 12.9172704,
            lng: 77.6122098
        },
        {
            name: "Faith City AG church",
            lat: 12.9264978,
            lng: 77.613443
        },
        {
            name: "St Anthony's Friary Church",
            lat: 12.930285233845808,
            lng: 77.6142256963928
        },
        {
            name: "Immanuel Prayer Hall",
            lat: 12.9272115,
            lng: 77.6201177
        },
        {
            name: "Christ City Church",
            lat: 12.9343424,
            lng: 77.6068692
        },
        {
            name: "Emmanuel Prayer House",
            lat: 12.925353272360788,
            lng: 77.6159263104418
        },
        {
            name: "Emmanuel Fellowship Church",
            lat: 12.9226502,
            lng: 77.6148449
        },
        {
            name: "ECI Wesley Church",
            lat: 12.9244961,
            lng: 77.6063955
        },
        {
            name: "Carmel Sharon Church",
            lat: 12.9357142,
            lng: 77.6054563
        },
        {
            name: "Family Renewal Centre",
            lat: 12.9304042,
            lng: 77.6031653
        },
        {
            name: "The Lord is my shepherd I have everything I need church",
            lat: 12.9232384,
            lng: 77.6067523
        }
    ],
    schools_colleges: [
        {
            name: "Indira Convent High School [ ICHS ]",
            lat: 12.922823699999999,
            lng: 77.6096216
        },
        {
            name: "Government High Middle School",
            lat: 12.922032,
            lng: 77.6100648
        },
        {
            name: "TIME KIDS Preschool",
            lat: 12.926273799999999,
            lng: 77.6104873
        },
        {
            name: "Sri Satyanarayan Primary School",
            lat: 12.924345299999999,
            lng: 77.6187257
        },
        {
            name: "Kaveri Convent High School",
            lat: 12.9228325,
            lng: 77.6188798
        },
        {
            name: "Krupanidhi Christ Convet and High School",
            lat: 12.921037799999999,
            lng: 77.61892519999999
        },
        {
            name: "Smart Kids Primary School",
            lat: 12.918609499999999,
            lng: 77.6104009
        },
        {
            name: "WISDOM INTERNATIONAL SCHOOL",
            lat: 12.9215026,
            lng: 77.6056442
        },
        {
            name: "Our Lady of Fatima High School",
            lat: 12.922096499999999,
            lng: 77.6157051
        },
        {
            name: "Mother Land Play Home",
            lat: 12.918031599999999,
            lng: 77.61711489999999
        },
        {
            name: "Alliance University City Campus 2",
            lat: 12.916924,
            lng: 77.6193859
        },
        {
            name: "St Mira's High School",
            lat: 12.916889,
            lng: 77.6198509
        },
        {
            name: "Koala Preschool",
            lat: 12.918339099999999,
            lng: 77.6203579
        },
        {
            name: "Iqra Juniors (South)",
            lat: 12.918379499999999,
            lng: 77.61974529999999
        },
        {
            name: "Podar Jumbo Kids - Preschool BTM Layout",
            lat: 12.918325699999999,
            lng: 77.62012829999999
        },
        {
            name: "Khalsa Public School",
            lat: 12.9233932,
            lng: 77.6187406
        },
        {
            name: "Sunshine pre-school",
            lat: 12.923183799999999,
            lng: 77.61434129999999
        },
        {
            name: "Sri Venkateshwara Educational Institutions",
            lat: 12.9254157,
            lng: 77.6124497
        },
        {
            name: "Brundavana High School Brundavanagar",
            lat: 12.9262664,
            lng: 77.60989169999999
        },
        {
            name: "Vivriti School",
            lat: 12.926318199999999,
            lng: 77.6160404
        },
        {
            name: "Adarsha Education Society",
            lat: 12.9235385,
            lng: 77.6116102
        },
        {
            name: "Kidzee smart kids",
            lat: 12.918608899999999,
            lng: 77.610357
        },
        {
            name: "IQRA International School",
            lat: 12.9176836,
            lng: 77.6143373
        },
        {
            name: "KSD School of Arts",
            lat: 12.9245731,
            lng: 77.6149052
        },
        {
            name: "Padmavathi Public School",
            lat: 12.9245675,
            lng: 77.6150803
        },
        {
            name: "Christ University",
            lat: 12.9362362,
            lng: 77.6061888
        },
        {
            name: "Ghousia College",
            lat: 12.9358448,
            lng: 77.60719619999999
        },
        {
            name: "Helen's E.M High School",
            lat: 12.9336649,
            lng: 77.6096853
        },
        {
            name: "Little Elly - Tavarekere, Bangalore | Nursery | Day Care | Kindergarten",
            lat: 12.9316684,
            lng: 77.6100842
        },
        {
            name: "Government Higher Primary School",
            lat: 12.9306475,
            lng: 77.6083409
        },
        {
            name: "Lily Rose English School",
            lat: 12.926359,
            lng: 77.6035864
        },
        {
            name: "BET Sufia High School",
            lat: 12.926699099999999,
            lng: 77.6018526
        },
        {
            name: "Good Earth High School",
            lat: 12.9261321,
            lng: 77.6057093
        },
        {
            name: "BET Nursery And Upper Primary School",
            lat: 12.9271148,
            lng: 77.6023146
        },
        {
            name: "Excellent English Schools",
            lat: 12.926062199999999,
            lng: 77.6020652
        },
        {
            name: "Holy Mariyam Convent",
            lat: 12.925960199999999,
            lng: 77.6046786
        },
        {
            name: "Mother Land English School",
            lat: 12.922592799999999,
            lng: 77.6046037
        },
        {
            name: "Madarsa Sayyidul Uloom Arabic Medium",
            lat: 12.9246851,
            lng: 77.6051651
        },
        {
            name: "New Excellent School",
            lat: 12.924733499999999,
            lng: 77.6048295
        },
        {
            name: "Kids zone",
            lat: 12.922587,
            lng: 77.602451
        },
        {
            name: "Royal Kidzee",
            lat: 12.921683,
            lng: 77.6027404
        },
        {
            name: "Wisdom International School",
            lat: 12.921327699999999,
            lng: 77.6056167
        },
        {
            name: "Al-Fitrah Islamic (BTM LAYOUT)",
            lat: 12.918665299999999,
            lng: 77.6082495
        },
        {
            name: "Canaan High School",
            lat: 12.917653999999999,
            lng: 77.6042512
        },
        {
            name: "Sri S. Janardhan Govt Kannada",
            lat: 12.9175527,
            lng: 77.60397189999999
        },
        {
            name: "Govt Urdu Lower Primary School",
            lat: 12.919835599999999,
            lng: 77.60213689999999
        },
        {
            name: "Cambridge Modern public School",
            lat: 12.920220899999999,
            lng: 77.6039957
        },
        {
            name: "Jack And Jill Kindergarten",
            lat: 12.920888399999999,
            lng: 77.6036266
        },
        {
            name: "Good Hope School",
            lat: 12.924658299999999,
            lng: 77.6055323
        },
        {
            name: "New Modern Girl's School",
            lat: 12.9182594,
            lng: 77.6057579
        },
        {
            name: "The Land Mark Pre School",
            lat: 12.918473299999999,
            lng: 77.6063064
        },
        {
            name: "Al Qulas Academy",
            lat: 12.9185608,
            lng: 77.6066216
        },
        {
            name: "Tameer E Fikr waqf",
            lat: 12.9180082,
            lng: 77.60663699999999
        },
        {
            name: "New St.Florence Public School",
            lat: 12.920928499999999,
            lng: 77.6100189
        },
        {
            name: "BBMP primary School Thavarekere",
            lat: 12.921828399999999,
            lng: 77.61028449999999
        },
        {
            name: "Kaveri School",
            lat: 12.9208042,
            lng: 77.619873
        },
        {
            name: "Govt Urdu Higher Primary School",
            lat: 12.9198337,
            lng: 77.6087707
        },
        {
            name: "KGN Nursery School",
            lat: 12.9204961,
            lng: 77.6089641
        },
        {
            name: "Sri Venkateshwara First Grade College",
            lat: 12.925257,
            lng: 77.6124232
        }
    ],
    theatre: [
        {
            name: "Srinivasa Theatre 4K 3D",
            lat: 12.931852,
            lng: 77.6074873
        },
        {
            name: "Balaji Theatre",
            lat: 12.925571399999999,
            lng: 77.60788149999999
        },
        {
            name: "Lakshmi Theatre RGB 4K 3D",
            lat: 12.9251943,
            lng: 77.607627
        },
        {
            name: "Sandhya Digital 4K theatre",
            lat: 12.9211326,
            lng: 77.6179276
        }
    ]
};

// Global variables
let map;
let markers = {};
let quadrantLines = [];
let quadrantsVisible = false;
let visibleCategories = {};
let legendVisible = true;

// Initialize the map
function initMap() {
    // Create map centered on Madiwala
    map = L.map('map').setView(MADIWALA_CENTER, 15);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Initialize visibility tracking (all categories visible by default)
    Object.keys(locations).forEach(type => {
        visibleCategories[type] = true;
    });

    // Initialize markers
    initMarkers();
    
    // Initialize lists
    populateLists();
    
    // Setup event listeners
    setupEventListeners();
    
    // Create quadrant lines (initially hidden)
    createQuadrants();
}

// Create custom marker icons with appropriate symbols
function createCustomIcon(type) {
    const iconConfig = {
        temples: { color: '#ff6b6b', icon: '🕉️', bgColor: '#fff' },
        mosque: { color: '#4ecdc4', icon: '🕌', bgColor: '#fff' },
        churches: { color: '#45b7d1', icon: '⛪', bgColor: '#fff' },
        schools_colleges: { color: '#28a745', icon: '🎓', bgColor: '#fff' },
        hospitals: { color: '#dc3545', icon: '🏥', bgColor: '#fff' },
        bars_pubs: { color: '#6f42c1', icon: '🍺', bgColor: '#fff' },
        theatre: { color: '#fd7e14', icon: '🎭', bgColor: '#fff' }
    };
    
    const config = iconConfig[type] || { color: '#6c757d', icon: '📍', bgColor: '#fff' };
    
    return L.divIcon({
        className: `custom-marker ${type}-marker`,
        html: `<div style="background-color: ${config.bgColor}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid ${config.color}; box-shadow: 0 3px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 16px;">${config.icon}</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
    });
}

// Initialize markers for all locations
function initMarkers() {
    markers = {};
    
    Object.keys(locations).forEach(type => {
        markers[type] = [];
        
        locations[type].forEach((location, index) => {
            const marker = L.marker([location.lat, location.lng], {
                icon: createCustomIcon(type)
            }).addTo(map);
            
            // Create popup content with better formatting
            const typeDisplay = type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
            const popupContent = `
                <div class="popup-title">${location.name}</div>
                <div class="popup-type">${typeDisplay}</div>
                <div class="popup-description">${location.description || 'A notable location in Madiwala area'}</div>
            `;
            
            marker.bindPopup(popupContent);
            
            // Add hover effects
            marker.on('mouseover', function() {
                this.openPopup();
                highlightListItem(type, index);
            });
            
            marker.on('mouseout', function() {
                this.closePopup();
                removeHighlight(type, index);
            });
            
            markers[type].push(marker);
        });
    });
}

// Populate the sidebar lists
function populateLists() {
    Object.keys(locations).forEach(type => {
        const listElement = document.getElementById(`${type}-list`);
        const countElement = document.getElementById(`${type}-count`);
        
        if (listElement && countElement) {
            listElement.innerHTML = '';
            
            locations[type].forEach((location, index) => {
                const listItem = document.createElement('li');
                listItem.textContent = location.name;
                listItem.className = type;
                listItem.dataset.index = index;
                
                // Add click event to zoom to location
                listItem.addEventListener('click', () => {
                    map.setView([location.lat, location.lng], 17);
                    markers[type][index].openPopup();
                });
                
                // Add hover events
                listItem.addEventListener('mouseenter', () => {
                    markers[type][index].openPopup();
                    listItem.classList.add('highlighted');
                });
                
                listItem.addEventListener('mouseleave', () => {
                    markers[type][index].closePopup();
                    listItem.classList.remove('highlighted');
                });
                
                listElement.appendChild(listItem);
            });
            
            // Update count
            countElement.textContent = `(${locations[type].length})`;
        }
    });
}

// Highlight corresponding list item
function highlightListItem(type, index) {
    const listItem = document.querySelector(`#${type}-list li[data-index="${index}"]`);
    if (listItem) {
        listItem.classList.add('highlighted');
    }
}

// Remove highlight from list item
function removeHighlight(type, index) {
    const listItem = document.querySelector(`#${type}-list li[data-index="${index}"]`);
    if (listItem) {
        listItem.classList.remove('highlighted');
    }
}

// Create quadrant lines
function createQuadrants() {
    const bounds = map.getBounds();
    const center = MADIWALA_CENTER;
    
    // Calculate quadrant boundaries
    const north = center[0] + 0.010;
    const south = center[0] - 0.010;
    const east = center[1] + 0.010;
    const west = center[1] - 0.010;
    
    // Vertical line (North-South)
    const verticalLine = L.polyline([
        [north, center[1]],
        [south, center[1]]
    ], {
        color: '#333',
        weight: 2,
        dashArray: '10, 5',
        opacity: 0.7
    });
    
    // Horizontal line (East-West)
    const horizontalLine = L.polyline([
        [center[0], east],
        [center[0], west]
    ], {
        color: '#333',
        weight: 2,
        dashArray: '10, 5',
        opacity: 0.7
    });
    
    // Quadrant labels
    const quadrantLabels = [
        { pos: [north - 0.001, east - 0.001], text: 'NE' },
        { pos: [north - 0.001, west + 0.001], text: 'NW' },
        { pos: [south + 0.001, east - 0.001], text: 'SE' },
        { pos: [south + 0.001, west + 0.001], text: 'SW' }
    ];
    
    quadrantLines = [verticalLine, horizontalLine];
    
    quadrantLabels.forEach(label => {
        const marker = L.marker(label.pos, {
            icon: L.divIcon({
                className: 'quadrant-label',
                html: label.text,
                iconSize: [30, 20],
                iconAnchor: [15, 10]
            })
        });
        quadrantLines.push(marker);
    });
}

// Toggle quadrants visibility
function toggleQuadrants() {
    quadrantsVisible = !quadrantsVisible;
    
    if (quadrantsVisible) {
        quadrantLines.forEach(line => line.addTo(map));
        document.getElementById('toggle-quadrants').textContent = 'Hide Quadrants';
    } else {
        quadrantLines.forEach(line => map.removeLayer(line));
        document.getElementById('toggle-quadrants').textContent = 'Show Quadrants';
    }
}

// Toggle legend visibility
function toggleLegend() {
    legendVisible = !legendVisible;
    const legendElement = document.getElementById('legend');
    const toggleButton = document.getElementById('toggle-legend');
    
    if (legendVisible) {
        legendElement.style.display = 'block';
        toggleButton.textContent = 'Hide Legend';
    } else {
        legendElement.style.display = 'none';
        toggleButton.textContent = 'Show Legend';
    }
}

// Toggle category visibility
function toggleCategory(categoryType) {
    visibleCategories[categoryType] = !visibleCategories[categoryType];
    
    if (visibleCategories[categoryType]) {
        // Show markers
        markers[categoryType].forEach(marker => {
            marker.addTo(map);
        });
        // Show sidebar section
        const sidebarSection = document.querySelector(`#${categoryType}-list`).closest('.list-section');
        if (sidebarSection) {
            sidebarSection.style.display = 'block';
        }
        // Update legend item appearance
        const legendItem = document.querySelector(`.legend-item .legend-icon.${categoryType}`);
        if (legendItem) {
            legendItem.closest('.legend-item').style.opacity = '1';
        }
    } else {
        // Hide markers
        markers[categoryType].forEach(marker => {
            map.removeLayer(marker);
        });
        // Hide sidebar section
        const sidebarSection = document.querySelector(`#${categoryType}-list`).closest('.list-section');
        if (sidebarSection) {
            sidebarSection.style.display = 'none';
        }
        // Update legend item appearance
        const legendItem = document.querySelector(`.legend-item .legend-icon.${categoryType}`);
        if (legendItem) {
            legendItem.closest('.legend-item').style.opacity = '0.5';
        }
    }
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('toggle-quadrants').addEventListener('click', toggleQuadrants);
    document.getElementById('toggle-legend').addEventListener('click', toggleLegend);
    
    // Add click listeners to legend items
    document.querySelectorAll('.legend-item').forEach(item => {
        item.addEventListener('click', () => {
            const iconElement = item.querySelector('.legend-icon');
            if (iconElement) {
                const categoryType = Array.from(iconElement.classList).find(cls => cls !== 'legend-icon');
                if (categoryType && locations[categoryType]) {
                    toggleCategory(categoryType);
                }
            }
        });
        
        // Add hover effect to indicate clickability
        item.style.cursor = 'pointer';
        item.addEventListener('mouseenter', () => {
            item.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });
        item.addEventListener('mouseleave', () => {
            item.style.backgroundColor = 'transparent';
        });
    });
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initMap();
});

// Add some utility functions for better user experience
function zoomToFitAllMarkers() {
    const group = new L.featureGroup();
    
    Object.keys(markers).forEach(type => {
        markers[type].forEach(marker => {
            group.addLayer(marker);
        });
    });
    
    map.fitBounds(group.getBounds().pad(0.1));
}

// Add search functionality (basic)
function searchLocation(query) {
    const results = [];
    
    Object.keys(locations).forEach(type => {
        locations[type].forEach((location, index) => {
            if (location.name.toLowerCase().includes(query.toLowerCase())) {
                results.push({
                    type: type,
                    index: index,
                    location: location
                });
            }
        });
    });
    
    return results;
}

// Export functions for potential future use
window.mapFunctions = {
    zoomToFitAllMarkers,
    searchLocation,
    toggleQuadrants
};



