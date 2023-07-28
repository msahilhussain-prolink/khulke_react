const allWordsT = {
  // Townhall
  th: {
    // header
    townhall: "டவுன்ஹால்",

    news: "ANI செய்திகள்",

    timeline: "காலவரிசை",

    meet: "சந்தி",

    snipit: "ஸ்னிப்-இட்",

    // left sidebar
    rt: "ரவுண்டு டேபிள்",

    yapp: "யாப்",

    noti: "அறிவிப்புகள்",
    profile: "சுயவிவரம்",
    post: "இடுகை",

    newpost: "புதிய இடுகை",
    k3: "செய்தி திறக்க",
    bkk: "போல் குல் கே",

    // left sidebar suggestions (<SuggestedToYou/>)
    suggested: {
      sugTitle: "உங்களுக்காக பரிந்துரைக்கப்பட்டது",

      follow: "பின்பற்றவும்",

      error: "ஏதோ தவறு நடந்துவிட்டது! பின்னர் மீண்டும் முயற்சிக்கவும்!",

      noUser: "ஒரே மாதிரியான ஆர்வமுள்ள பயனர்கள் யாரும் இல்லை",

      noResult: "முடிவுகள் எதுவும் இல்லை",

      pre: "பின்தொடர, குல் கேவில் உள்நுழையவும் அல்லது பதிவு செய்யவும்",
    },
    // left bar for anonymous
    loginCTA: "தொடர்புகொள்ள உள்நுழைக",

    loginBtn: "உள்நுழைய",

    // popup menu
    profile: "சுயவிவரம்",

    accSettings: "கணக்கு அமைப்புகள்",

    logout: "வெளியேறு",

    // create post box - new post component
    prelogMessagePost:
      "இடுகையை உருவாக்க, குல் கேவில் உள்நுழையவும் அல்லது பதிவு செய்யவும்",

    placeholder: "ஏதாவது எழுது",

    popupTitle: "புதிய இடுகை",

    // polling

    btnText: "விருப்பத்தைச் சேர்க்கவும்",

    lenTitle: "வாக்கெடுப்பு நீளம்",

    // discard popup

    disTitle: "இடுகையை நிராகரி",

    disText: "இந்த இடுகையை நிராகரிக்க விரும்புகிறீர்களா?",

    disbtnOptionY: "நிராகரி",

    disbtnOptionN: "ரத்துசெய்",

    disbtnOption1: "ஆம், நான் உறுதியாக இருக்கிறேன்",

    disbtnOption2: "இல்லை, வைத்துக்கொள்",

    exitPopupTitle: "நீங்கள் வெளியேற விரும்புகிறீர்களா?",

    // posting image
    imgplcHolder: "தலைப்பைச் சேர்க்கவும்",

    // right panel
    popularHeading: "பிரபலமான நிகழ்ச்சிகள்",

    // search bar
    searPlaceholder: "தேடு",

    //Footer for anonymous <PreLoginFooter/>
    opt1: "அடிக்கடி கேட்கப்படும் கேள்விகள்",

    opt2: "சமூக வழிகாட்டுதல்கள்",

    opt3: "ஆதரவு",

    opt4: "தனியுரிமைக் கொள்கை",

    opt5: "மறுப்புகள்",

    opt6: "விதிமுறைகள் மற்றும் நிபந்தனைகள்",

    opt7: "டேக் டவுன் கொள்கை",
  },
  // ---------------------------------------------------------------------------
  // Roundtable listing page
  rt: {
    rt: "ரவுண்டு டேபிள்",

    rtNewBtn: "புதியது",

    label1: "அனைத்து",

    label2: "நேரலை",

    label3: "வரவிருக்கிறது",

    label4: "என்னுடையது",
    // rt type popup
    popupTitle: "ரவுண்டு டேபிள் வகையைத் தேர்ந்தெடுக்கவும்",

    opt1: "வீடியோ",

    opt2: "ஆடியோ",

    opt3: "பதிவு செய்யப்பட்டது",

    // on click of bell icon -> /roundtable/notifications
    notiTitle: "ரவுண்டு டேபிள் அறிவிப்புகள்",

    // right panel tabs

    live: "நேரலை",

    upcoming: "வரவிருக்கிறது",

    noItem: "காட்ட எதுவும் இல்லை",

    noRt: "காண்பிக்க ரவுண்டு டேபிள் இல்லை",

    scrolledBottom: "இனி ரவுண்டு டேபிள்கள் இல்லை",
    upcomingRtInfoToast:
      "இந்த வட்டமேஜை கூட்டம் இன்னும் தொடங்கவில்லை. வட்டமேசையில் சேரத் தயாரானதும் உங்களுக்குத் தெரிவிப்போம்",
  },
  // path -> /notifications/interaction
  noti: {
    // tabs title
    interaction: "தொடர்பு",

    Net: "நெட்வொர்க்",

    noNoti: "உங்களிடம் புதிய தொடர்புகள் எதுவும் இல்லை!",
  },
  // path => /search (search pages)
  search: {
    post: "இடுகைகள்",

    people: "மக்கள்",

    rt: "ரவுண்டு டேபிள்",
    // fallback under roundtable tab
    noRT: "காட்டுவதற்கு ரவுண்டு டேபிள்கள் இல்லை",
  },
  // login pages
  login: {
    headingleft: "உரையாடல்களுக்கு அதிக முக்கியத்துவம் அளிக்கும் தளம்.",

    // form
    headingOfForm: "உள்நுழைய",

    lineAboveInput: "மின்னஞ்சல் / மொபைல் / பயனர் பெயரை உள்ளிடவும்",

    placeHolder: "abcd@example.com",

    radioTitle: "உள்நுழையவும்",

    opt1: "OTP",

    opt2: "கடவுச்சொல்",

    btn: "தொடரவும்",
    filterCap: "வடிகட்டி",

    linkToSignup: "புதிய பயனரா? கணக்கை உருவாக்கு",

    privacyPolicyLine:
      "தொடர்வதன் மூலம், எங்கள் தனியுரிமைக் கொள்கை மற்றும் சேவை விதிமுறைகளை ஏற்க ஒப்புக்கொள்கிறீர்கள்.",

    formBottomLine: "எந்தவொரு ஆதரவிற்கும், நீங்கள் எங்களை அணுகலாம்",

    // password page
    titleAboveBar: "கடவுச்சொல்லை உள்ளிடவும்",

    passPlaceholder: "உங்கள் கடவுச்சொல் இங்கே",

    forgotpass: "கடவுச்சொல்லை மறந்துவிட்டீர்களா?",

    btnPass: "உள்நுழைய",

    khulkeMail: "support@khulke.com",
  },

  profile: {
    bio: "Bio",
    Enterwbsiteplace: "वेबसाइट यूआरएल लिखें",
    perso4: "Personal Details",
    fallback: "ஏதோ தவறு நடந்துவிட்டது! பின்னர் மீண்டும் முயற்சிக்கவும்.",

    pageTitle: "சுயவிவரம்",

    tabopt1: "இடுகைகள்",

    tabopt2: "ரவுண்டு டேபிள்",

    tabopt3: "ஸ்னிப்-இட்",

    tabopt4: "சேமித்தது",

    // btns
    btnEdit: "சுயவிவரத்தை திருத்தவும்",

    btnFollowers: "பின்பற்றுபவர்கள்",

    btnFollowing: "பின்பற்றுதல்",

    // noData
    noSnips: "நீங்கள் இன்னும் ஸ்னிப்-இட் எதையும் உருவாக்கவில்லை.",

    noSave: "நீங்கள் இதுவரை எந்த இடுகையையும் சேமிக்கவில்லை.",

    noRt: "ரவுண்டு டேபிள் எதுவும் இதுவரை உருவாக்கப்படவில்லை அல்லது கலந்துகொள்ளவில்லை",

    noPost: "இன்னும் இடுகைகள் இல்லை",

    contentCardRight: {
      opt1: "நேரலை",

      opt2: "வரவிருக்கிறது",

      noRT: "காண்பிக்க ரவுண்டு டேபிள்கள்  இல்லை",
    },
    female: "பெண்",
    male: "ஆண்",
    other: "மற்றவை",
  },
  // "/notifications/network"
  notiMain: {
    noInteraction: "உங்களிடம் புதிய தொடர்புகள் எதுவும் இல்லை",

    tab1: "தொடர்பு",

    tab2: "நெட்வொர்க்",
  },

  // accountPages -> AccountLeftSideBar/index
  // leftbar
  leftAccounts: {
    acc: "கணக்கு",

    invite: "நண்பர்களை அழைக்க",

    privacy: "தனியுரிமை",

    pass: "கடவுச்சொல்",

    mutedWord: "முடக்கப்பட்ட வார்த்தைகள்",

    MutedAcc: "முடக்கப்பட்ட கணக்குகள்",

    blocked: "தடுக்கப்பட்ட கணக்குகள்",

    faq: "அடிக்கடி கேட்கப்படும் கேள்விகள்",

    privacyPoli: "தனியுரிமைக் கொள்கை",

    communiGuide: "சமூக வழிகாட்டுதல்கள்",

    disclaim: "மறுப்புகள்",

    support: "ஆதரவு",

    TnC: "விதிமுறைகள் மற்றும் நிபந்தனைகள்",

    logout: "வெளியேறு",

    takeDown: "டேக் டவுன் கொள்கை",
    broadcast: "ஒளிபரப்பு",
  },
  // settings pages
  setting: {
    // "/கணக்கு அமைப்புகள்"

    settingHeader: "அமைப்புகள்",

    usernameLegend: "பயனர் பெயர்",

    EmailLegend: "மின்னஞ்சல்",

    mobileLegend: "அலைபேசி",

    deactivateHeading: "உங்கள் கணக்கை செயலிழக்கச் செய்ய விரும்புகிறீர்களா?",

    deactivateInfo:
      "30 நாட்களுக்குள் உள்நுழைவதன் மூலம் உங்கள் கணக்கை புதுப்பிக்க முடியும். 30 நாட்களுக்குப் பிறகு, அனைத்து இடுகைகள் மற்றும் மீடியாவுடன் கணக்கு நிரந்தரமாக நீக்கப்படும்.",

    deactiveBtn: "கணக்கை செயலிழக்கச் செய்யவும்",
  },

  // create rt -> "/roundtable/create"
  createRT: {
    pgTitle: "ரவுண்டு டேபிள்",

    //steps below found in <RoundTableTImeline/>
    step1: "புதிய ரவுண்டு டேபிள் ",

    step2: "பேச்சாளர்கள்",

    step3: "வகைகள்",

    step4: "அழை",

    create_your_rt: "உங்கள் சொந்த ரவுண்டு டேபிள் உருவாக்கவும்",

    maximum_2_gb: "அதிகபட்ச வீடியோ அளவு 2ஜிபி மட்டுமே இருக்க வேண்டும்",

    type: "ரவுண்டு டேபிள் வகை",

    iBtn: {
      line1: "நீங்கள் ஆடியோ அல்லது வீடியோ ரவுண்டு டேபிள் தேர்ந்தெடுக்கலாம்",

      line2: "ஆடியோ - பேச்சாளரின் குரல் அனைவருக்கும் கிடைக்கும்",

      line3:
        "வீடியோ - பேச்சாளரின் குரல் மற்றும் காட்சிகள் இரண்டும் அனைவருக்கும் கிடைக்கும்",
    },
    videoBtn: "வீடியோ",

    audioBtn: "ஆடியோ",

    // title
    addTitle: "தலைப்பை சேர்க்கவும்",
    pvtRTpopUp:
      "தனிப்பட்ட ரவுண்ட் டேபிளில் சேர, ரவுண்ட் டேபிளின் உரிமையாளருக்கு கோரிக்கையை அனுப்பவும். கோரிக்கையை அனுப்ப விரும்புகிறீர்களா?",
    reqSentAlready: "கோரிக்கை ஏற்கனவே அனுப்பப்பட்டது!!!",

    addTitleIbtn: {
      firstLine: "தலைப்பு பயனர்களுக்கு கவர்ச்சிகரமானதாக இருக்க வேண்டும்.",

      secondLine:
        "இதில் 50 எழுத்துகள் மட்டுமே உள்ளன, எனவே உங்கள் விவாதத் தலைப்பைக் குறிப்பிடவும்.",
    },
    addTitlePlaceholder: "தலைப்பை சேர்க்கவும்",

    // description
    descTitle: "விவரணம்",

    descIBtn: {
      one: "இந்த உரையாடலில் கலந்துகொள்ள பயனர்களுக்கு காட்சிப்படுத்தல் மற்றும் நம்பிக்கைக் காரணிகளை வழங்க, தலைப்புகள் மற்றும் பேச்சாளர்கள் பற்றிய விவரம் இன்னும் விரிவாக இருக்க வேண்டும்.",

      two: "இது 250 வார்த்தைகளின் வரம்பைக் கொண்டுள்ளது, எனவே நீங்கள் சிறு கட்டுரையையும் வைக்கலாம்.",
    },
    // autoRecording
    recTitle: "தானாகப் பதிவு செய்யத் தொடங்கு",

    recIBtn: {
      one: "நடுவர் ரவுண்ட் டேபிளில் இணைந்தவுடன் தானாக பதிவுசெய்தல் உங்கள் ரவுண்ட்டேபிளின் பதிவைத் தானாகவே தொடங்கும்.",

      two: "“ஆன்” தேர்வு– நடுவர் ரவுண்ட் டேபிளில் இணைந்தவுடன் உங்கள் ரவுண்ட் டேபிளின் பதிவை தானாகவே தொடங்கும்",

      three:
        "“ஆஃப்” தேர்வு– ரவுண்ட் டேபிளின் நடுவர்/உரிமையாளர் லைவ் ரவுண்ட் டேபிளில் இருந்து பதிவு செய்யத் தொடங்காத வரை ரவுண்ட் டேபிளின் பதிவு தொடங்காது.",
    },

    natureOfRt: "ரவுண்ட் டேபிள் வகை",

    optPub: "பொது",

    optPriv: "தனிப்பட்ட",

    optConfi: "இரகசியமானது",

    natureIBtn: {
      one: "உங்களுக்காக 3 வகையான ரவுண்டு டேபிள்கள் உள்ளன",

      two: "பொது - இந்த ரவுண்ட் டேபிள் அனைவருக்கும் தெரியும், மேலும் அவர்கள் வட்டமேசையின் போது எப்போது வேண்டுமானாலும் இதில் சேரலாம்.",

      three:
        "“தனிப்பட்ட” – இந்த  ரவுண்ட் டேபிள் அனைவருக்கும் தெரியும், ஆனால் இதில் சேருவதற்கு, உரிமையாளரால் மட்டுமே அங்கீகரிக்கப்படக்கூடிய சேருமாறு அவர்கள் கோர வேண்டும்.",

      four: "ரகசியம் - இந்த ரவுண்ட் டேபிள் அழைப்பாளர்களுக்கு மட்டுமே தெரியும், அவர்கள் மட்டுமே இதில் சேர முடியும்.",
    },

    natureRtBtn: {
      one: "உங்களுக்காக 2 வகையான ரவுண்டு டேபிள்கள் உள்ளன",

      two: "பொது - இந்த ரவுண்ட் டேபிள் அனைவருக்கும் தெரியும், மேலும் அவர்கள் வட்டமேசையின் போது எப்போது வேண்டுமானாலும் இதில் சேரலாம்.",

      three:
        "“தனிப்பட்ட” – இந்த  ரவுண்ட் டேபிள் அனைவருக்கும் தெரியும், ஆனால் இதில் சேருவதற்கு, உரிமையாளரால் மட்டுமே அங்கீகரிக்கப்படக்கூடிய சேருமாறு அவர்கள் கோர வேண்டும்.",
    },

    keepAnonTitle: "என்னை அநாமதேயமாக வைத்திருங்கள்",

    keepAnonI:
      "இது ஒரு ரகசிய ரவுண்ட் டேபிள் ஆகும், இதில் ரவுண்ட் டேபிளின் உரிமையாளர் பெயர் யாருக்கும் தெரியாது",
  },
  // Create RT page 2
  moderatorLabel: "நடுவர்",

  panelistLabel: "குழு உறுப்பினர்",

  transferRights: "உரிமையாளரின் உரிமைகளை மாற்றவும்",

  addPanelistBtn: "குழு உறுப்பினர் சேர்க்கவும்",

  editPanelistBtn: "குழு உறுப்பினர்கள் திருத்தம்!",

  nopanelistError: "குழு உறுப்பினர்கள் சேர்க்கப்படவில்லை!",

  yapp: {
    writeMessageHere: "செய்தியை இங்கே எழுதுங்கள்...",
    createKlub: "கிளப்பை உருவாக்குங்கள்",
    selectMembers: "உறுப்பினர்களைத் தேர்ந்தெடுக்கவும்",
    newKlub: "புதிய கிளப்",
    klubName: "கிளப் பெயர்",
  },
  K3: {
    create: "Create Khabhar",
    description: "Add News description here",
    btnadd: "Add Khabar",
  },
  // bkk page
  bkk: {
    create: "Create Views",
    description: "Add your vailuable views here",
    btnadd: "Add Views",
  },
  //new words below
  snip: {
    btnadd: "சேர்",
    dislike: "பிடிக்காதவை",
    likes: "விருப்பங்கள்",
    interactions: "தொடர்புகள்",
    share: "பகிர்",
    block: "தடு",
  },
  addpanelist: "Add",
  addedalready: "Added",
  editpanelist: "Edit",
  panelist: "Panelist",
  misc: {
    textError: {
      more_than_100: "நீங்கள் 100 வார்த்தைகளுக்கு மேல் தட்டச்சு செய்ய முடியாது",
      more_than_250: "நீங்கள் 250 வார்த்தைகளுக்கு மேல் தட்டச்சு செய்ய முடியாது",
    },
    invite: {
      notModPanInvite:
        "நீங்கள் மதிப்பீட்டாளர் மற்றும் குழு உறுப்பினரை அழைக்க முடியாது",
    },
    timer: {
      selectTime: "நேரத்தைத் தேர்ந்தெடுக்கவும்",
    },
    toastMsg: {
      only4ImageAllowed: "4 படங்கள் மட்டுமே அனுமதி!",
      audioLengthValidation:
        "ஆடியோவிற்கான அதிகபட்ச கால அளவு 2 நிமிடம் 30 வினாடிகள் மட்டுமே.",
      postUploadingWait: "",
      invalidAudioFormat: "Invalid audio file format. Please upload mp3 file.",
      max_video_duration:
        "அதிகபட்சம். கால அளவு 15 வினாடிகள் மட்டுமே இருக்க வேண்டும்.",
      select_video: "வீடியோவைத் தேர்ந்தெடுக்கவும்.",
      less_than_15mb_file: "15mb க்கும் குறைவான கோப்பை பதிவேற்றவும்",
      invalidImgFormat:
        "Invalid image format. Please upload jpg, jpeg. png, gif images.",
      invalidVideoFormat: "Invalid video file format. Please upload mp4 file.",
      invalidVidAudFormat:
        "Invalid video file format. Please upload mp4/mp3 file.",
      multipleLoginError: "You have been joined from some other device",
      sessionExpired: "Session Expired",
      videoLength3min:
        "Your video size is more than 3 min. Kindly trim the video and post it.",
    },
    addPoste: "Add Post",
    savechanges: "SAVE CHANGES",
    updateuname: "UPDATE USERNAME",
    changessaved: "Your changes have been saved!",
    oldview: "Viewers",
    allfollower: "All Followers",
    allfollowing: "All Following",
    minfo1:
      "Moderator is mandatory speaker for the RoundTable. There are few conditions with moderator as",
    minfor2:
      "Till he/she is not accepting the invitation, no one can join the RoundTable",
    minfor3:
      "Till he/she is not joining the RoundTable, RoundTable will be in lock state after start also",
    minfor4:
      "If he/she is not available within 10min after start of RoundTable, RoundTable will get cancelled",
    minfor5: "In one RoundTable, only 1 moderator can be invited",
    minfor6: "Owner can make moderator as co-owner",
    minfor7: "You can add 100 words as description for moderator",
    ttlcantEmpty: "Title can't be empty",
    minago: "min ago",
    owner: "Owner",
    vlist: "View List",
    notifywhenready:
      "This RoundTable is not started yet. We will notify you once this RoundTable is ready to join.",
    maxvidoel:
      " Max. duration for video is 2min 30sec only. Kindly trim the video to 2min 30sec.",
    unsave: "unsave",
    repply: "Reply",
    exploresnip: "Explore in Snip-It",
    watchsnipit: "Watch more in Snip-It",
    explorekhabar: "Explore in Khabri Ke Khabre",
    watchkhabar: "Watch more in Khabri Ke Khabre",
    explorebkk: "Explore in Bol Khul Ke",
    watchbkk: "Watch more in Bol Khul Ke",
    succcopied: "Successfully Copied",
    entersomeval: "Enter some value",
    readmore: "மேலும் படிக்க",
    readless: "குறைவாக படிக்கவும்",
    stoprec: "Stop Recording",
    endrt: "End RoundTable",
    muteda: " Muted Audiences",
    finalr: "Final Result",
    uncirc: "Uncirculate",
    receivenotiq:
      "Would you like to receive a notification when we upload the recording of this RoundTable?",
    greatline: "Great, We will notify you once the recording is available.",
    recrte: "Recorded RoundTable",
    uploddw: "Upload",
    sche1: "There is 2 option to schedule your RoundTable as follows",
    sche2:
      "“Now” – this will start your RoundTable immediately after your RoundTable creation",
    sche3:
      "“Later” – this will provide you facility to select start date and time for your RoundTable at least 15min from current time",
    recording: "Recording",
    recline1: "Recorded video is max. 3hrs",
    recline2: "Ideal ratio for outro video is 16:9 ratio",
    recline3: "It only supports .mp4 and .mp3",
    addwm: " Add as Wildcard Message",
    coowner: "Co-owner",
    nonewnoti: " You have no new notifications!",
    past: "past",
    new: "new",
    prelog: "For creating RoundTable, Login or sign up to Khul Ke",
    avionceconfirm: "Available once RoundTable is confirmed",
    nocategoryinc: "No categories included!",
    notagsinc: "No tags included!",
    selectSche: "Select Schedule",
    uploadl: "Upload logo",
    now: "Now",
    later: "Later",
    dateTime: "Date & Time",
    duration: "Duration",
    addDescplaceholder: "Add Description",
    recOn: "On",
    recOff: "Off",
    restore: "Restore Username",
    update: "Update",
    mob: "Enter Mobile Number",
    user: "Username",
    enterusname: "Enter Username",
    mail: "Email",
    mob: "Mobile",
    share: "Share",
    copy: "Copy Link",
    postit: "Post it",
    attending: "Attending",
    watch: "Watching",
    liste: "Listening",
    views: "Views",
    rtDetails: "RoundTable Details",
    cawaited: "Confirmation Awaited",
    jnow: "Join Now",
    sreminder: "Set Reminder",
    rset: "Reminder Set",
    has: "has",
    hassecond: "has",
    invitedu: "invited you",
    cancel: "Cancelled",
    somethingwrong: "Something went wrong",
    char: "எழுத்துக்கள்",
    words: "வார்த்தைகள்",
    topic: "தலைப்பு",
    done: "முடிந்தது",
    invitation_sent_successfully: "அழைப்பு வெற்றிகரமாக அனுப்பப்பட்டது",
    you_can_edit_rt_manage_your_invitations_anytime:
      "வட்டம் மற்றும் அழைப்புகளை நீங்கள் எப்போதும் திருத்த மற்றும் நிர்வாகிக்க முடியும்.",
    manage_invitations: "அழைக்கும் நிர்வாகம்",
    done_for_now: "தற்போது முடிந்தது",
    intro_video: "அறிமுக வீடியோ",
    outro_video: "அவுட்ரோ வீடியோ",
    invite_audience: "பொழுதுபோக்குகளை அழைக்கவும்",
    invite_your_audience: "உங்கள் பொழுதுபோக்குகளை அழைக்கவும்",
    advance_option: "மேம்பட்ட விருப்பம்",
    advance_option_info:
      "உங்கள் வட்டமேசையை மிகவும் கவர்ச்சிகரமானதாகவும் அணுகக்கூடியதாகவும் மாற்ற இது ஒரு விருப்பமான விளக்கமாகும்.",
    multiple_logos: "பல சின்னங்கள்",
    example_text:
      "எடுத்துக்காட்டு தலைப்பு | பேச்சாளர் பெயர் | உரிமையாளர் பெயர் | ஹேஷ்டேக்குகள்",
    preview: "முன்னோட்ட",
    your_rt_has_update: "உங்கள் வட்டமேசை புதுப்பிக்கப்பட்டது.",
    add_introduction_for_panelist: "பேனல்லிஸ்ட் அறிமுகத்தைச் சேர்",
    add_introduction_for_moderator: "மதிப்பீட்டாளர் அறிமுகத்தைச் சேர்",
    update_your_rt: "உங்கள் வட்டமேசையைப் புதுப்பிக்கவும்",
    join: "சேருங்கள்",
    INVITE_POP_DESC: "தொடர வேண்டுமா அல்லது அனைத்தையும் தவிர்க்க வேண்டுமா?",
    rt_live_time_left:
      "உங்கள் ரவுண்டேபிள் நேரலையில் உள்ளது, இன்னும் நேரம் உள்ளது",
    mod_note_1:
      "குறிப்பு: நீங்கள் அழைப்பை ஏற்கவில்லை என்றால், ரவுண்டேபிள் உருவாக்கப்படாது",
    mod_note_10_1:
      "குறிப்பு: நீங்கள் வட்டமேசையில் கலந்து கொள்ளவில்லை என்றால், ",
    mod_note_10_2: "நிமிடங்களுக்குப் பிறகு ரவுண்டேபிள் ரத்து செய்யப்படும்.",
    rt_about_start_in: "உங்கள் ரவுண்டேபிள் தொடங்க உள்ளது:",
    for_the_rt: "ரவுண்டேபிள்க்கு",
    you_have_been_invited: "",
    you_have_been_invited_1: "நீங்கள் ஒரு",
    you_have_been_invited_2: "ஆக அழைக்கப்பட்டுள்ளீர்கள்",
    your_rt_is_live_with_time_left:
      "உங்கள் ரவுண்டேபிள் நேரலையில் உள்ளது, இன்னும் நேரம் உள்ளது",
    more_inv_1: "ரவுண்டேபிள்க்கு இன்னும்",
    more_inv_2: "அழைப்புகள் உள்ளன",
    see_you_there: "அங்ேக பார்க்கலாம்!",
    continue: "தொடரவும்",
    continue_to_create: "தொடர்ந்து உருவாக்குங்கள்",
    you_have_not_uploaded_image:
      "உங்கள் வட்டமேசைக்கு அதிக பார்வையாளர்களை ஈர்க்கக்கூடிய படத்தை நீங்கள் பதிவேற்றவில்லை",
    skip_all: "அனைத்தையும் தவிர்க்கவும்",
    user_already_added: "பயனர் ஏற்கனவே சேர்க்கப்பட்டுள்ளார் !!!",
    add_more: "மேலும் சேர்க்கவும்",
    remove: "அகற்று",
    thumbnail: "படம்",
    thumbnail_preview: "பட முன்னோட்டம்",
    description_placeholder:
      "ரவுண்ட் டேபிள் தலைப்பைப் பற்றிய விளக்கத்தைச் சேர்த்து, உங்கள் முந்தைய வட்டமேசைகளை இணைக்கவும்",
    // Create RT page 3
    pg3: {
      uplImg: "Upload Image",
      Recommendation: "Recommendation",
      l1: "1. Make a cover image of RoundTable with 16:9 ratio",
      l2: "2. It only supports PNG, JPEG, JPG",
      l3: "3. It has max. limit as 15mb",

      logo: "Upload Logos (Max 3)",
      ll1: "1. You can upload max. 3 logos",
      ll2: "2. Any aspect ratio for logo is allowed",
      ll3: "3. Any aspect ratio for logo is allowed",
      ll4: "4. It has max. limit as 1mb only",

      uplintro: {
        uplintro: "Upload Intro Video",
        uploutro: "Upload Outro Video",

        introl1:
          "1. Intro video is coming on start of RoundTable for max. 15sec",
        introl2: "2. Ideal ratio for intro video is 16:9 ratio",
        introl3: "3. It only supports .mp4",
        introl4: "4. It has max. limit as 100mb",
        uplplace: "Upload Intro Video",
        outro1: "Outro video is coming after end of RoundTable for max. 15sec",
        outro2: "Ideal ratio for outro video is 16:9 ratio",
        outro3: "It only supports .mp4",
        outro4: "It has max. limit as 100mb",
      },
      attachdoc: "Attach Document",
      docplaceholder: "Upload Document",
      docRecommendation: "Recommendation",
      docl1:
        "1. Upload a document for making users more understandable or give them glimpse of conversation",
      docl2: "It only supports doc, xls, ppt, pdf",
      docl3: "It has max. limit as 15mb",

      category: "Categories",
      catergoryplace: "Search and add",
      tags: "Tags",
      addbtn: "Add",
    },
    pg4: {
      invite: "Invite",
      iinvite:
        "You can invite your all followers, your followings, or attendees of previous RoundTables",
      viewer: "Viewers",
      invitemore: "Invite More",
      iinvite:
        "You can invite any user who is present on Khul Ke by searching their name. Also, you can invite users who are not present on Khul Ke by entering their mobile number or email id",
      searchuser: "Search a user",
      addMobile: "Add Mobile or Email ID to invite",
    },
    review: {
      title: "Review RoundTable",
      date: "தேதி",
      Starttm: "Start Time",
      Endttm: "End Time",
      Duration: "Duration",
      invalid: "Invalid date",
      logos: "Logos",
      Attach: "Attachment",
      nodoc: "No documents added!",
      categories: "Categories",
      ppants: "Participants",

      discard: {
        dtitle: "Discard RoundTable",
        text: "Are you sure you want to discard this information?",
        y: "Yes,I'm Sure",
        n: "No, Keep It",
      },
    },
    livert: {
      mMODERATOR: "நடுவர்",
      mPANELIST: "குழு உறுப்பினர்கள்",
      mWIDLCARD: "WIDLCARD",
      Audience: "Audience",
      admin: "நிர்வாகி",
      moderator: "Moderator",
      panelists: "Panelists",
      owner: "Owner",
      audiences: "Audiences",
      interac: "Interactions",
      time: "Time",
      leaveRtDesc: "ரவுண்டு டேபிள் விட்டு வெளியேற விரும்புகிறீர்களா?",
      rtStartSoon: "ரவுண்ட் டேபிள் விரைவில் தொடங்கும்",
      modNotJoined:
        "மதிப்பீட்டாளர் இன்னும் சேரவில்லை, மதிப்பீட்டாளருக்காகக் காத்திருக்கிறது",
      nodNotPres:
        "மதிப்பீட்டாளர் இல்லாததால் இந்த வட்ட மேசை ரத்து செய்யப்பட்டது.",
      Nodata: "No Data Found",
      msgplace: "Your message here",
      send: "SEND",
      follow: "பின்பற்றவும்",
      unfollow: "பின்தொடர வேண்டாம்",
      following: "தொடர்ந்து",
      followers: "பின்பற்றுபவர்கள்",
      recc: "Recommended RoundTable with same moderator",
      comment: "Comment",
      writeplace: "Write your content here...",
      leave: "Leave Rountable",
      dis: "Disclaimer",
      end: "RoundTable is about to end",
      ext: " RoundTable time is extended by",
      extent: "நீட்டிக்கவும்",
      extentTime: "நேரத்தை நீட்டிக்கவும்",
      sureendthis: "Are you sure you want to end the RoundTable ?",
      extendbymin:
        "Kindly select the minutes from below to extend this RoundTable",
      min: "mins",
      tleft: "மீதமுள்ள நேரம்: ",
      over: "This Roundtable is already over.",
      rt: "RoundTable",
      rec: "Recording of roundtable is going on",
      starredPost: "உங்கள் இடுகை மதிப்பீட்டாளரால் நட்சத்திரமிடப்பட்டது.",
      unstarredPost: "உங்கள் இடுகை மதிப்பீட்டாளரால் நட்சத்திரம் நீக்கப்பட்டது.",
      del: "Delete",
      copy: "Copy link to post",
      poll: "poll",
      vote: "Vote",
      fpoll: "First poll",
      Participants: "Participants",
      mod: "Moderator",
      panelist: "Panelist",
      raisehand: "Raise Hand Chat",
      rhp: "Send a message to get the attention of the moderator.",
      wques: "Write your question here...",
      mini: "Minimize Roundtable",
      disclaimer: "மறுப்பு",
      endRt: "ரவுண்டு டேபிள் முடிக்கவும்",
      full: "முழு திரை",
      notifyMe: "தெரியப்படுத்து",
      noopt: "No options",
      intro: "Introduction",
      editp: "Edit panelist",
      padd: "Please add a moderator",
      pro: "PROCEED",
      dis: "DISCARD",
      rtcreated: "You have successfully created your RoundTable.",
      rt_updated: "RoundTable Updated Successfully",
      aw: "Awesome",
      nolog: "No logo added!",
      novid: "No video added!",
      nodoc: "No documents added!",
      invitecount: "Invitees count ",
      c: "Copy link",
      p: "Post it",

      you: "நீங்கள்",
      circ: "பரப்பு",
      circed: "இயக்கப்பட்டது",
      quote: "மேற்கோள்",
      srec: "Start Recording",
      endrec: "End Recording",
      muted: "Muted Audience",
      nomuted: "There are no muted participants!",
      pchat: "Panelist Chat",
      am: "AM",
      pm: "PM",
      addopt: "Add Option",
      option: "விருப்பங்கள்",
      polldur: "கருத்து கணிப்பு கால அளவு",
      d: "Days",
      h: "Hours",
      m: "Mins",
      fewago: "few secs ago",
      view: "view",
      wm: "Wildcard Message",
      wildc: "Wildcard",
      writqu: "Write what you feel about this...",
      reply: "replying to",
      repliedto: "replied to",
      past: "past",
      nothingToShow: "Nothing to show",
      userAlreadyAdded: "இந்த பயனர் ஏற்கனவே சேர்க்கப்பட்டுள்ளார்!",
      uploadRecRT: "பதிவுசெய்யப்பட்ட வட்டமேசையைப் பதிவேற்றவும்",
      enterValidTitle: "தயவு செய்து சரியான தலைப்பை உள்ளிடவும்.",
      enterRecordedRT: "பதிவு செய்யப்பட்ட ஆடியோ/வீடியோ கோப்பை பதிவேற்றவும்.",
      startRT:
        "இந்த ரவுண்டு டேபிளில் சேரத் தயாரானதும் அறிவிப்பைப் பெற விரும்புகிறீர்களா?",
    },
    reqacc: "Request Access",
    skip: "தவிர்க்கவும்",
    next: "அடுத்தது",
    created_post: "உங்கள் இடுகை உருவாக்கப்பட்டது",
    created_post_success: "உங்கள் இடுகை வெற்றிகரமாக பதியப்பட்டது.",
    created_snip_success: "உங்கள் ஸ்னிப்-இட் வெற்றிகரமாக இடுகையிடப்பட்டது.",
    created_khabar_success: "Your Khabar is posted successfully.",
    created_bol_success: "Your View is posted successfully.",
    deleted_post: "This post has been deleted",
    deleted_post_success: "இடுகை வெற்றிகரமாக நீக்கப்பட்டது",
    deleted_snip_success: "ஸ்னிப்-இட் வெற்றிகரமாக நீக்கப்பட்டது",
    deleted_khabar_success: "Khabar has been deleted successfully.",
    deleted_Bol_success: "View has been deleted successfully.",
    deleted_rountable_success: "ரவுண்ட் டேபிள் வெற்றிகரமாக நீக்கப்பட்டது",
    raised_hand: "Raised Hand",
    liked_post: "liked your post",
    disliked_post: "disliked your post",
    circulated_post: "circulated your post",
    quoted_post: "quoted your post",
    commented_post: "commented your post",
    mention_post: "mentioned you",
    replied_post: "replied on your post",
    write: "write",
    create: "உருவாக்கு",
    close: "மூடு",
    file: "File",
    rmfromwild: "Remove from wildcard",
    btn_cancel: "Cancel",
    allow: "Allow",
    reject: "Reject",
    text_wilduser: "Add as a wildcard panelist",
    DOB: "DOB",
    website: "website",
    difficulty: "We are facing some difficulty, please try again",
    for_any_support_you_can_reach_us_at: "For any support, you can reach us at",
    add: "Add",
    goback: "Go back",
    backlisting: "Back To Listing",
    yes: "YES",
    no: "NO",
    bycont: "By continuing, I accept",
    termsof: "Terms of Use",
    privacy: "Privacy Policy",
    upload: "Upload Now",
    reqs: "Request Sent",
    sht: "Share on Townhall",
    rsh: "Recent Search",
    avionceconfirm: "Available once RoundTable is confirmed",
    nomoreinvitee: "No More Invitees to show, you reached bottom",
    norest: "No results found",
    beawp: "Be a Wildcard Panelist",
    bewp2:
      "Be a Wildcard Panelist. Moderator wants you to be a wildcard panelist",
    ipr: "முந்தைய ரவுண்டு டேபிள் மூலம் அழை",
    rtNameDate: "ரவுண்டு டேபிள் பெயர் மற்றும் தேதி",
    attendees: "பங்கேற்பாளர்கள்",
    searchByRt: "வட்டமேசை பெயர் மூலம் தேடவும்",
    searchByMod: "மதிப்பீட்டாளர் பெயர் மூலம் தேடவும்",
    searchByPan: "பேனல் பெயர் மூலம் தேடவும்",
    searchByCategory: "வகை மூலம் தேடுங்கள்",
    searchByTags: "குறிச்சொற்கள் மூலம் தேடுங்கள்",
    nopast: "கடந்த வட்டமேசைகள் எதுவும் இல்லை",
    advanceSearch: "மேம்பட்ட தேடல்",
    wsomethin: "Write something...",
    save: "save",
    rotate: "Rotate image",
    maintainar: "Maintain Aspect Ratio",
    customar: "Custom Aspect Ratio",
    ays: "நிச்சயமா?",
    yas: "Yes, I'm sure",
    news: "News",
    showallrep: "Show all replies",
    recom: "Recommended RoundTable with same",
    recomOwn: "Recommended RoundTable with same Owner",
    recomMod: "Recommended RoundTable with same Moderator",
    confDel: "Confirm roundtable deletion",
    proceed: "PROCEED",
    conf: "Are you sure you want to delete this roundtable?",
    confdiscard: "Are you sure you want to discard this RoundTable",
    stover: "Start time is already done.",
    kindlywait: " Kindly update the start time.",
    edit: "Edit",
    leaveQ: "YES, LEAVE QUIETLY",
    nostay: "NO, I WILL STAY",
    inviteFollow: "Invite your Followers",

    yhs: " You have selected the",
    oyc: "Once you confirm, you cannot undo this selection.",
    wyltr:
      " Would you like to receive a notification when we upload the recording of this RoundTable ?",
    cont: "Congratulations!",
    ycanytomerestore: "You can anytime restore previous username  Within this",
    days: "days",
    savedraft: "Save to draft",
    editaudio: "Edit Audio",
    cancel: "Cancel",
    cancelled: "Cancelled",
    sendforRaisehand: "Send a message to get the attention of the moderator.",
    viewm: "View Messages",
    dismiss: "Dismiss",
    nouserRaised: "No users has raised hands yet",
    raisehanWmessage: "User has only raised hand without any message",
    removeuser:
      "Are you sure you want to remove this user from raise Hand list?",
    star: "Mark as star",
    unstar: "Mark as unstar",
    showthispoll: "Show this poll",
    joinreq: "Join Request",
    youdonthavemsg: "You dont have a message selected.",
    accept: "Accept",
    reject: "Reject",
    nonoti: "No new notifications!",
    youarenotflw: "You are not following anyone",
    youhavenofollowers: "You have no followers",
    listofRT: "List Of Your RoundTables",
    pindiscussion: "  Participate in Live RoundTable Discussions",
    comingrt: '"Coming Soon" - Exciting Upcoming RoundTables',
    sevenday: "7 days",
    thirtyday: "30 days",
    continueonBrowser: "Continue on browser or redirect on app!",
    openinApp: "Open in app",
    stayinbroweser: " Stay on browser",
    email: "Email",
    update: "Update",
    mob: "Mobile",

    deactiveModal: {
      desuccess: "Your account has been deactivated successfully.",
      areyousure: " Are you sure you want to deactivate your account?",
      yes: "ஆம்",
      no: "No",
      note: " Note before deactivating your account",
      p1: "You can revive your account by logging in within 30 days.After 30  days, the account will be permanently deleted along with all theposts, and media.",
      p2: "Some more information",
      p3: "You can restore your Khul Ke account if it was accidentally or wrongfully deactivated for up to 30 days after deactivation.",
      p4: " Some account information may still be available in search engines, such as Google or Bing.",
      p5: "Learn more",
      p6: "  If you just want to change your username , you don't need to deactivate your account — edit it in your",
      p7: "If you just want to change your <b>profile name</b>, you don't need to deactivate your account — edit it in your",
      p8: " If you just want to change your profile image, you don't need to deactivate your account — edit it in your",
      p9: "profile image",
      p10: "  If you just want to change your password, you don't need to deactivate your account — edit it in your",
      p11: "If you want to download your Khul Ke data, you'll need to complete both the request and download process before deactivating your account.Links to download your data cannot be sent to deactivated accounts.",
    },

    pages: {
      mute: "Mute",
      beaw: "Be a Wildcard Panelist",
      beawild:
        "Be a Wildcard Panelist.Moderator wants you to be a wildcard panelist",
      removeme: "Remove me from wildcard",
      removewild: " Remove Wildcard",
      unmute: "Unmute",
      belowhavehands: "Below users have raised hand",
      addwild: "Add Wildcard",
      waitingforscreen: "Waiting for Shared Screen",
      screenshared: "Your Screen is being Shared",
      loading: "Loading...",
      facingDiffi: "We are facing some difficulty. Please try again.",
      consentsent: "Wildcard consent is already sent.",
      cantaddw: "User is offline, can not add as wildcard.",
      fivespeaker:
        "There are already 5 panelist. So you cannot add any wildcard panelist",
      logintoview: "To view profile , Login or sign up to Khul Ke",
      camerataken:
        "Your camera is currently being used by another application. Turn off your camera access and close the other app to use camera for Khul Ke",
      cantgetcam: "Can not get your camera and mic track",
      distitle: "disclaimer",
      disclaimer:
        'The information, views, opinions, and arguments (collectively "Views") showcased and presented by the panellists, or the interviewees solely belong to the individual who has expressed it and Loktantra Mediatech Private Limited("Company") does not agree, condone, endorse, or subscribe to the views expressed in the duration of the interview and makes no representation of any kind, express or implied, regarding the accuracy,adequacy, validity, reliability, availability or completeness of any view or opinion expressed by any panellist or the interviewee.The content showcased here is for informative purposes only and should not be construed for anything other than this.Any malice or hurting of sentiments is unintentional.Under no circumstance shall the Company have any liability for the Views of any panellist or interviewee, nor shall the Company have any liability for any loss or damage of any kind incurred because of Views expressed by the panellists.Your use of this platform is solely at your own risk.',

      blocked: {
        Unblock: "Unblock",
        nouserblock: "No users blocked!",
      },
      pagenotfound: "404 Page Not Found!",
      gotohome: "Go Back to Home",
      nomute: "No users muted!",
      other: "others",
      page: "Page",
      of: "Of",
      gender: "Gender",
      male: "ஆண்",
      female: "பெண்",
      other: "மற்றவை",
      interest: "Interest",
      selectprivateinfo:
        "Select the information that will be visible on your Account Info page.",
      acc: "Account",
      dob: "Date of Birth",
      loc: "Location",
      int: "Interest",
      lang: "Language",
      site: "Website",
      usernotfound:
        "User with username not found! Please try another username.",
      makecoowner: "Make Co-owner",
      l1: "Panelists are the speakers for the RoundTable.",
      l2: "Minimum zero and max. 5 panelist can be added in single RoundTable.",
      l3: "You can add 100 words as description for each panelist",
      back2rt: "BACK TO ROUNDTABLE",
      thread: "Thread",
      prelog: "This will be available only for registered users.",
      redir: "Redirecting",
      dis: "Discard",
      proupdated: "Your profile is updated",
      // forgot password page
      fortitle: "Forgot Password?",
      for1: "Enter the phone number or email associated with",
      for2: "your Khul Ke account",
      rempass: "Remember Password?",
      login: {
        loginl: "Login To Your Account",
        logintitleleft: "Enter the world of conversations",
        login: "Login",
        newuser: " New User?",
        cra: "Create an account",
        infotext: " For any support, you can reach us at",
        intro: "Khul Ke - Social Networking Platform",
        bycont: "By continuing, you agree to accept our",
        pp21: "A platform where conversations matter.",
        pp22: "Enter OTP",
        pp23: "OTP sent to",
        pp24: "Resend OTP",
        pp25: "Didn't receive the OTP?Resend in",
        pp26: "sec",
        pp27: "Enter Password",
        pp28: "Go back",
        restpass: "Reset your password",
        enternewpass: "Enter New Password",
        retypepass: "Retype your password.",
        conto: "Continue To",
      },
      signup: {
        siuptitle: "Sign Up on Khul Ke - Social Networking Platform",
        sup: "Sign Up",
        enteradd: "Enter Email Address",
        usephone: "Use phone instead",
        ph1: "Enter Phone No.",
        usemail: "Use email Id instead",
        pg2: "A platform where conversations matter.",
        enterotp: "Enter OTP",
        resend: "Resend OTP",
        alreadya: "Already have an account?",
      },
      prelogin: {
        til1: "Only 2 steps sign up process",
        til2: "Enter mobile number or email id",
        til3: "OTP verification",
        til4: "Enter Email/ Mobile/ Username",
        pleaseadd: "Please enter a valid no.",
        validem: "Please enter a valid Email Id.",
        mtext: "Log in or sign up to interact.",
        entero:
          "Enter the phone number or email associated with your Khul Ke account",
      },
    },
  },
  walkthrough: {
    walkthrough_dailog_question: "இதை மீண்டும் பார்க்க வேண்டுமா?",
    step_1_1: "குல்கேக்கு வரவேற்கிறோம்,",
    step_1_2: "பயன்பாட்டை ஆராய விரும்புகிறீர்களா?",
    step_2:
      "<span>டவுன்ஹாலில் உள்ள இடுகைகள் மற்றும் நெட்வொர்க்கைப் பார்க்கவும்</span>",
    step_3:
      "<span>விரும்பு, பரப்பு, பகிர் மற்றும் கருத்து விருப்பங்களைப் பயன்படுத்தி இடுகைகளுடன் தொடர்புகொள்ளவும்.</span>",
    step_4:
      "<span>நேரம் இல்லாமல் குறுங்காட்சி வீடியோக்களைப் பார்க்கவும்</span>",
    step_5:
      '<span style="color:#66b984; font-weight: bold">உருவாக்கு </span>இடுகைகள்',
    step_6:
      "உங்கள் எழுத்து, படங்கள், ஆவணங்கள், வீடியோக்கள், ஒருங்கிணைக்கைகள் உருவாக்க முடியும்.",
    step_7: "உரையாடலை நடத்தி, சூடான தலைப்புகளை ஆராயுங்கள்",
    step_8:
      "உங்கள் ரவுண்டு டேபிள்களின் கடந்த கால, வரவிருக்கும், நேரலையை இங்கே கண்டறியவும்",
    step_9: "உங்கள் சொந்த ரவுண்டு டேபிள் உருவாக்கவும்",
    step_10:
      "உங்கள் நண்பர்கள் மற்றும் பின்தொடர்பவர்களுடன் தனித்தனியாக பேசுங்கள்",
    step_11: "உங்கள் சுயவிவரத்தைப் பார்த்து தனிப்பயனாக்கவும்",
  },
  dateTime: {
    months: {
      jan: "Jan",
      feb: "Feb",
      mar: "Mar",
      apr: "Apr",
      may: "May",
      jun: "Jun",
      jul: "Jul",
      aug: "Aug",
      sep: "Sep",
      oct: "Oct",
      nov: "Nov",
      dec: "Dec",
    },
    validation: {
      dobValidation:
        "நீங்கள் உண்மையான பிறந்த தேதியைப் பயன்படுத்துகிறீர்கள் என்பதை உறுதிப்படுத்தவும்.",
    },
  },
  welcomePop: {
    welcome: "நல்வரவு",
    createUsername: "புதிய கணக்கை உருவாக்கு",
    updateUsername: "Update your username",
    addDP: "உங்கள் சுயவிவர படம், பெயர்",
    selectLang: "மற்றும் மொழியை தேர்ந்தெடுக்கவும்",
    interested: " கடவுச்சொல் உள்நுழைவில் நீங்கள் ஆர்வமாக இருந்தால்,",
    kindly: "தயவுசெய்து",
    setPass: "உங்கள் கடவுச்சொல்லை அமைக்கவும்",
  },
  post: {
    pollCreate: "உங்கள் கருத்துக்கணிப்பு உருவாக்கப்பட்டது.",
  },
  rtList: {
    owner: "Roundtables where you were Owner",
    moderator: "RoundTables where you were a Moderator",
    panalist: "Roundtables where you were a Panelist",
    audiance: "Roundtables where you were an Audience",
  },
};

export default allWordsT;
